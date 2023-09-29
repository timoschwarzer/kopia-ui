<template>
  <v-container fluid>
    <div class="overflow-x">
      <v-breadcrumbs :items="breadcrumbs">
        <template #divider>
          <v-icon icon="mdi-chevron-right"></v-icon>
        </template>
        <template #title="{item, index}">
          <span :ref="el => breadcrumbsElements[index] = el">{{ item.title }}</span>
        </template>
      </v-breadcrumbs>
    </div>

    <kopia-object-browser :entries="entries" :disabled="entriesPending" @open-entry="onOpenEntry" @drag-entry="onDragEntry" />
  </v-container>
</template>

<script lang="ts" setup>
  import {useKopiaFetch} from '~/lib/useKopiaFetch'
  import {useConnectionSettingsStore} from '~/stores/connectionSettingsStore'
  import streamSaver from 'streamsaver'

  const PATH_SEPARATOR = '/'  // Only for UI, doesn't need to match any OS but should not be allowed in file names

  type HierarchyEntry = {
    name: string,
    objectId: string | null,
  }

  const route = useRoute()
  const router = useRouter()

  const connectionSettingsStore = useConnectionSettingsStore()
  const rootPath = computed(() => String(route.query.rootPath))
  const path = computed(() => String(route.query.path))
  const pathSegments = computed<string[]>(() => {
    return path.value.split(PATH_SEPARATOR).filter(p => p !== '')
  })
  const rootObjectId = computed(() => String(route.query.root))
  const objectId = computed(() => String(route.query.object))
  const objectUrl = computed(() => getObjectApiUrl(objectId.value))
  const resolvingHierarchy = ref(false)
  const breadcrumbsElements = ref<HTMLElement[]>([])

  const {data: entriesResponse, refresh: refreshEntries, pending: entriesPending} = await useKopiaFetch<KopiaDirectoryManifest>(objectUrl)
  const entries = computed(() => entriesResponse.value?.entries ?? [])
  const hierarchy = ref<HierarchyEntry[]>([])

  const breadcrumbs = computed(() => {
    const breadcrumbs = []

    breadcrumbs.push({
      title: rootPath.value,
      disabled: !rootObjectId.value,
      to: {
        name: 'browse',
        query: {
          path: '',
          object: rootObjectId.value,
          root: rootObjectId.value,
          rootPath: rootPath.value,
        }
      },
    })

    const pathSegments = []
    for (const hierarchyEntry of hierarchy.value) {
      pathSegments.push(hierarchyEntry.name)

      breadcrumbs.push({
        title: hierarchyEntry.name,
        disabled: !hierarchyEntry.objectId,
        to: {
          name: 'browse',
          query: {
            path: pathSegments.join(PATH_SEPARATOR),
            object: hierarchyEntry.objectId,
            root: rootObjectId.value,
            rootPath: rootPath.value,
          }
        },
      })
    }

    return breadcrumbs
  })

  watch(pathSegments, (segments: string[]) => {
    hierarchy.value.length = Math.min(hierarchy.value.length, segments.length)

    for (let i = 0; i < hierarchy.value.length; i++) {
      const hierarchyEntry = hierarchy.value[i]
      const pathSegment = segments[i]

      if (hierarchyEntry.name !== pathSegment) {
        hierarchyEntry.name = pathSegment
        hierarchyEntry.objectId = null  // Mark as dirty
      }
    }

    for (let i = hierarchy.value.length; i < segments.length; i++) {
      hierarchy.value.push({
        name: segments[i],
        objectId: null,
      })
    }

    updateMissingHierarchyObjects()
  }, {deep: true, immediate: true})

  watch(breadcrumbs, () => {
    breadcrumbsElements.value[breadcrumbsElements.value.length - 1]?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'end',
    })
  }, {flush: 'post'})

  function getObjectApiUrl(objectId: string) {
    return `objects/${objectId}`
  }

  async function updateMissingHierarchyObjects() {
    if (!rootObjectId.value) {
      console.warn('Could not resolve hierarchy, no root object ID given')
      return
    }

    resolvingHierarchy.value = true

    let parentEntryObjectId: string | null = rootObjectId.value ?? null
    for (const hierarchyEntry of hierarchy.value) {
      if (!hierarchyEntry.objectId) {
        if (!parentEntryObjectId) {
          console.warn(`Could not resolve hierarchy, parent entry object ID of '${hierarchyEntry.name}' could not be resolved`)
          break
        }

        const parentEntryObjectIdCopyToMakeTypescriptHappy: string = parentEntryObjectId
        const {data: parentEntries} = await useKopiaFetch<KopiaDirectoryManifest>(getObjectApiUrl(parentEntryObjectIdCopyToMakeTypescriptHappy), {
          key: `updateMissingHierarchyObjects-${parentEntryObjectIdCopyToMakeTypescriptHappy}`
        })
        const resolvedEntry = parentEntries.value?.entries.find(e => e.name === hierarchyEntry.name)

        hierarchyEntry.objectId = resolvedEntry?.obj ?? null
      }

      parentEntryObjectId = hierarchyEntry.objectId
    }

    resolvingHierarchy.value = false
  }

  function getEntryUrl(entry: KopiaDirectoryEntry) {
    const url = new URL(getObjectApiUrl(entry.obj), connectionSettingsStore.sanitizedApiBaseUrl)
    url.searchParams.set('fname', entry.name)
    return url
  }

  function onOpenEntry(entry: KopiaDirectoryEntry) {
    if (entry.type === 'd') {
      hierarchy.value.push({
        name: entry.name,
        objectId: entry.obj,
      })

      router.push({
        name: 'browse',
        query: {
          path: (path.value ? `${path.value}${PATH_SEPARATOR}` : '') + entry.name,
          object: entry.obj,
          root: rootObjectId.value,
          rootPath: rootPath.value,
        }
      })
    } else {
      const url = getEntryUrl(entry)
      const fileStream = streamSaver.createWriteStream(entry.name, {
        size: entry.size ?? undefined,
      })

      fetch(url, {
        headers: connectionSettingsStore.authenticationHeaders
      }).then(res => {
        const readableStream = res.body

        if (!readableStream) {
          return
        }

        // Use WritableStream if available
        if (window.WritableStream && readableStream?.pipeTo) {
          return readableStream.pipeTo(fileStream)
            .then(() => console.log('done writing'))
        }

        const writer = fileStream.getWriter()

        const reader = readableStream.getReader()
        const pump = (): void => {
          reader.read()
            .then(res => res.done
              ? writer.close()
              : writer.write(res.value).then(pump))
        }

        pump()
      })
    }
  }

  function onDragEntry(event: DragEvent, entry: KopiaDirectoryEntry) {
    // Drag & Drop files on Chrome. Only works if API and UI are on the same origin.
    const url = getEntryUrl(entry)
    event.dataTransfer?.setData('DownloadURL', `application/octet-stream:${entry.name}:${url.toString()}`)
  }
</script>

<style lang="scss" scoped>
  .overflow-x {
    white-space: nowrap;
    overflow-x: auto;
  }
</style>