<template>
  <v-tooltip open-delay="500" location="bottom">
    <template #activator="{props}">
      <v-card :color="selected ? 'accent' : ''" class="pa-2" v-bind="{...$attrs, ...props}" :variant="selected ? 'flat' : 'text'" :ripple="false">
        <div class="thumbnail text-center">
          <v-icon v-if="entry.type === 'd'" size="x-large" icon="mdi-folder" />
          <v-icon v-else size="x-large" icon="mdi-file-outline" />
        </div>
        <div class="entry-name text-center">{{ entry.name }}</div>
      </v-card>
    </template>
    <div>
      <div class="font-weight-bold">{{ entry.name }}</div>
      <div>{{ formattedSizeBytes }}</div>
    </div>
  </v-tooltip>
</template>

<script lang="ts" setup>
  import {usePrettyBytes} from '~/lib/usePrettyBytes'

  const props = withDefaults(
    defineProps<{
      entry: KopiaDirectoryEntry,
      selected?: boolean,
    }>(),
    {
      selected: false,
    }
  )

  const {entry} = toRefs(props)
  const formattedSizeBytes = usePrettyBytes(entry.value.size ?? entry.value.summ?.size ?? 0, true)
</script>

<style lang="scss" scoped>
  .entry-name {
    user-select: none;

    @supports (-webkit-line-clamp: 3) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
</style>