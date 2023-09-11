<template>
  <v-data-table density="compact" :items="displayedSources" :headers="headers" v-model:items-per-page="itemsPerPage">
    <template #item.__display.lastSnapshotDate="{item}">
      <template v-if="!!item.raw.upload">
        <v-progress-circular class="mr-1" size="16" color="accent" width="3" indeterminate />
        in progress
      </template>
      <template v-else>
        {{ item.columns['__display.lastSnapshotDate'] }}
      </template>
    </template>
    <template #item.__display.nextSnapshotDate="{item}">
      <v-tooltip :disabled="!item.raw.__display.snapshotOverdue" location="left">
        <template #activator="{props}">
          <div v-bind="props">
            <v-icon v-if="item.raw.__display.snapshotOverdue" icon="mdi-alert-circle-outline" color="warning" />
            {{ item.columns['__display.nextSnapshotDate'] }}
          </div>
        </template>
        <span>Overdue</span>
      </v-tooltip>
    </template>
    <template #item.__display.status="{item}">
      <kopia-upload-status v-if="!!item.raw.upload" :counters="item.raw.upload" />
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
  import {VDataTable} from 'vuetify/labs/VDataTable'
  import {usePrettyBytes} from '~/lib/usePrettyBytes'
  import {useToDate} from '~/lib/useToDate'

  const props = defineProps<{
    sources: KopiaSourceStatus[],
  }>()

  const now = useNow()

  // TODO: Currently broken, https://github.com/vuetifyjs/vuetify/issues/17588
  //       Wait for this to be fixed and use the custom sort function on `headers`
  const displayedSources = computed(() => props.sources.map(source => ({
    ...source,

    // Add some properties that are only used for display/presentation purposes
    __display: {
      size: source.lastSnapshot?.stats?.totalSize ?? 0,
      lastSnapshotDate: useToDate(source.lastSnapshot?.endTime),
      nextSnapshotDate: useToDate(source.nextSnapshotTime),
      get snapshotOverdue() {
        const nextSnapshotDate = unref(this.nextSnapshotDate)
        return !!nextSnapshotDate && !source.upload && useNow({interval: 100}).value > nextSnapshotDate
      }
    }
  })))

  const itemsPerPage = ref(-1)

  const headers = [
    {
      title: 'Path',
      key: 'source.path'
    },
    {
      title: 'User',
      key: 'source.userName'
    },
    {
      title: 'Host',
      key: 'source.host'
    },
    {
      title: 'Size',
      key: '__display.size',
      value: (source: KopiaSourceStatus) => usePrettyBytes(source.lastSnapshot?.stats?.totalSize),
    },
    {
      title: 'Last Snapshot',
      key: '__display.lastSnapshotDate',
      value: (source: KopiaSourceStatus) => source.lastSnapshot?.endTime ? useTimeAgo(source.lastSnapshot.endTime) : '-',
    },
    {
      title: 'Next Snapshot',
      key: '__display.nextSnapshotDate',
      value: (source: KopiaSourceStatus) => source.nextSnapshotTime ? useTimeAgo(source.nextSnapshotTime) : '-',
    },
    {
      title: 'Status',
      key: '__display.status',
      sortable: false,
      width: 250,
    }
  ]
</script>

<style lang="scss" scoped>

</style>