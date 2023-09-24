<template>
  <div class="entries-grid">
    <kopia-entry-grid-item
      v-for="(entry, index) in sortedTruncatedEntries"
      :key="index"
      :entry="entry"
      :selected="isEntrySelected(entry)"
      :disabled="disabled"
      draggable="true"
      @click="event => onItemClicked(event, entry, index)"
      @dblclick.prevent="onItemDoubleClicked(entry)"
      @dragstart="event => onItemDragStart(event, entry)"
    />
  </div>

  <template v-if="sortedTruncatedEntries.length === 0">
    <div class="text-center empty-view py-12">
      <v-icon icon="mdi-folder-open-outline" size="72"/>
      <div class="text-overline">Nothing to show</div>
    </div>
  </template>

  <v-btn v-if="entries.length > maxEntryCount" color="warning" variant="tonal" block @click="maxEntryCount += 1000">
    Showing {{ maxEntryCount }} of {{ entries.length }} items. Click to show more
  </v-btn>
</template>

<script lang="ts" setup>
  import {useUiSettingsStore} from '~/stores/uiSettingsStore'
  import {storeToRefs} from 'pinia'

  const props = withDefaults(
    defineProps<{
      entries: KopiaDirectoryEntry[],
      disabled?: boolean,
    }>(),
    {
      disabled: false,
    }
  )

  const emit = defineEmits<{
    (e: 'open-entry', entry: KopiaDirectoryEntry): void,
    (e: 'drag-entry', event: DragEvent, entry: KopiaDirectoryEntry): void,
  }>()

  const uiSettingsStore = useUiSettingsStore()
  const {objectBrowserSettings} = storeToRefs(uiSettingsStore)
  const {entries} = toRefs(props)
  const selectedObjectIds = ref(new Set<string>)
  const maxEntryCount = ref(1000)
  const lastClickedIndex = ref<null | number>(null)

  const sortedEntries = computed(() => {
    const entriesCopy = [...entries.value]
    entriesCopy.sort((a: KopiaDirectoryEntry, b: KopiaDirectoryEntry) => {
      if (objectBrowserSettings.value.sortDirectoriesBeforeFiles && a.type !== b.type) {
        return a.type === 'd' ? -1 : 1
      }

      return a.name.localeCompare(b.name)
    })
    return entriesCopy
  })

  const sortedTruncatedEntries = computed(() => sortedEntries.value.slice(0, maxEntryCount.value))

  function isEntrySelected(entry: KopiaDirectoryEntry) {
    return selectedObjectIds.value.has(entry.name)
  }

  function selectEntry(entry: KopiaDirectoryEntry) {
    selectedObjectIds.value.add(entry.name)
  }

  function unselectEntry(entry: KopiaDirectoryEntry) {
    selectedObjectIds.value.delete(entry.name)
  }

  function unselectEverything() {
    selectedObjectIds.value.clear()
  }

  function toggleEntrySelected(entry: KopiaDirectoryEntry) {
    if (isEntrySelected(entry)) {
      unselectEntry(entry)
    } else {
      selectEntry(entry)
    }
  }

  function onItemClicked(event: MouseEvent, entry: KopiaDirectoryEntry, index: number) {
    if (event.ctrlKey) {
      toggleEntrySelected(entry)
    } else if (event.shiftKey && lastClickedIndex.value !== null && lastClickedIndex.value !== index) {
      const minIndex = Math.min(lastClickedIndex.value, index)
      const maxIndex = Math.max(lastClickedIndex.value, index)
      for (let i = minIndex; i <= maxIndex; i++) {
        selectEntry(sortedEntries.value[i])
      }
    } else {
      unselectEverything()
      selectEntry(entry)
    }

    lastClickedIndex.value = index
  }

  function onItemDoubleClicked(entry: KopiaDirectoryEntry) {
    selectEntry(entry)
    emit('open-entry', entry)
  }

  function onItemDragStart(event: DragEvent, entry: KopiaDirectoryEntry) {
    emit('drag-entry', event, entry)
  }
</script>

<style lang="scss" scoped>
  .entries-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.4em;
    align-items: start;
  }

  .empty-view {
    opacity: 0.5;
  }
</style>