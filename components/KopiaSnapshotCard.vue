<template>
  <v-card class="d-flex flex-column pa-4" hover v-bind="$attrs">
    <div class="font-weight-bold line-height-1">{{ snapshotDateRelative }}</div>
    <div class="text-caption">{{ snapshotDateFormatted }}</div>
    <div v-if="snapshot.description">{{ snapshot.description }}</div>
    <div class="d-flex flex-wrap mt-2 tags">
      <kopia-tag v-for="retentionTag in snapshot.retention" :tag="retentionTag" :key="retentionTag" />
      <kopia-tag v-for="pinTag in snapshot.pins" pin :tag="pinTag" :key="pinTag" />
    </div>
    <v-spacer />
    <div class="d-flex flex-wrap mt-4 summary text-grey">
      <div>
        <v-icon size="18" icon="mdi-harddisk" />
        {{ prettySummarySize }}
      </div>
      <div>
        <v-icon size="18" icon="mdi-file-multiple-outline" />
        {{ snapshot.summary.files }}
      </div>
      <div>
        <v-icon size="18" icon="mdi-folder-multiple-outline" />
        {{ snapshot.summary.dirs }}
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
  import {usePrettyBytes} from '~/lib/usePrettyBytes'
  import {useToDate} from '~/lib/useToDate'
  import {useFormatDate} from '~/lib/useFormatDate'

  const props = defineProps<{
    snapshot: KopiaSnapshot,
  }>()

  const {snapshot} = toRefs(props)

  const prettySummarySize = usePrettyBytes(snapshot.value.summary.size)
  const snapshotDate = useToDate(snapshot.value.startTime)
  const snapshotDateFormatted = useFormatDate(snapshotDate, "PPPp")
  const snapshotDateRelative = useTimeAgo(snapshotDate)
</script>

<style lang="scss" scoped>
  .tags {
    gap: 0.3em;
  }

  .summary {
    gap: 0.6em;
    font-size: 0.8em;
  }

  .line-height-1 {
    line-height: 1;
  }
</style>