<template>
  <v-container fluid>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>

    <kopia-object-browser :entries="entries" :disabled="entriesPending" @open-entry="onOpenEntry" @drag-entry="onDragEntry" />
  </v-container>
</template>

<script lang="ts" setup>
  import {useKopiaFetch} from '~/lib/useKopiaFetch'
  import {useConnectionSettingsStore} from '~/stores/connectionSettingsStore'
  import streamSaver from 'streamsaver'

  type HierarchyEntry = {
    name: string,
    objectId: string,
  }

  const route = useRoute()
  const router = useRouter()

  const connectionSettingsStore = useConnectionSettingsStore()
  const objectId = computed(() => String(route.query.object))
  const objectUrl = computed(() => `objects/${objectId.value}`)

  const {data: entriesResponse, refresh: refreshEntries, pending: entriesPending} = await useKopiaFetch<KopiaDirectoryManifest>(objectUrl)
  const entries = computed(() => entriesResponse.value?.entries ?? [])
  const hierarchy = ref<HierarchyEntry[]>([])
  const breadcrumbs = computed(() => hierarchy.value.map(h => ({
    title: h.name,
    to: {
      name: 'browse',
      query: {
        object: h.objectId,
      }
    }
  })))

  watch(objectId, objectId => {
    const index = hierarchy.value.findIndex(h => h.objectId === objectId)
    if (index !== -1) {
      hierarchy.value.splice(index + 1)
    }
  })

  watch(() => route.query.name, (name, oldName) => {
    if (name !== oldName) {
      hierarchy.value.push({
        name: String(name),
        objectId: objectId.value,
      })
    }
  }, {deep: true, immediate: true})

  function getEntryUrl(entry: KopiaDirectoryEntry) {
    const url = new URL(`objects/${entry.obj}`, connectionSettingsStore.sanitizedApiBaseUrl)
    url.searchParams.set('fname', entry.name)
    return url
  }

  function onOpenEntry(entry: KopiaDirectoryEntry) {
    if (entry.type === 'd') {
      router.push({
        name: 'browse',
        query: {
          name: entry.name,
          object: entry.obj,
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

</style>