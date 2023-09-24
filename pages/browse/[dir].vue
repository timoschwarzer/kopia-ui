<template>
  <v-container fluid>
    <v-progress-linear indeterminate :active="entriesPending" />
    <kopia-object-browser :entries="entries" @open-entry="onOpenEntry" @drag-entry="onDragEntry" />
  </v-container>
</template>

<script lang="ts" setup>
  import {useKopiaFetch} from '~/lib/useKopiaFetch'
  import {useConnectionSettingsStore} from '~/stores/connectionSettingsStore'
  import streamSaver from 'streamsaver'

  const route = useRoute()
  const router = useRouter()

  const directoryId = computed(() => String(route.params.dir))
  const objectUrl = computed(() => `objects/${directoryId.value}`)
  const connectionSettingsStore = useConnectionSettingsStore()

  const {data: entriesResponse, refresh: refreshEntries, pending: entriesPending} = await useKopiaFetch<KopiaDirectoryManifest>(objectUrl)
  const entries = computed(() => entriesResponse.value?.entries ?? [])

  function getEntryUrl(entry: KopiaDirectoryEntry) {
    const url = new URL(`objects/${entry.obj}`, connectionSettingsStore.sanitizedApiBaseUrl)
    url.searchParams.set('fname', entry.name)
    return url
  }

  function onOpenEntry(entry: KopiaDirectoryEntry) {
    if (entry.type === 'd') {
      router.push({
        name: 'browse-dir',
        params: {
          dir: entry.obj,
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

    event.dataTransfer?.setData('DownloadURL', `application/octet-stream:${entry.name}:${url.toString()}`)
  }
</script>

<style lang="scss" scoped>

</style>