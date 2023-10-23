<template>
  <kopia-policy-editor-row title="Snapshot Frequency">
    <template #description>
      How frequently to create snapshots in KopiaUI or Kopia server (has no effect outside of the server mode)
    </template>
    <template #left>
      <v-select
        v-model="schedulingFrequency"
        density="compact"
        :items="[
          {title: 'None', value: null},
          {title: 'Every 10 minutes', value: 60 * 10},
          {title: 'Every 15 minutes', value: 60 * 15},
          {title: 'Every 20 minutes', value: 60 * 20},
          {title: 'Every 30 minutes', value: 60 * 30},
          {title: 'Every hour', value: 60 * 60},
          {title: 'Every 2 hours', value: 60 * 60 * 2},
          {title: 'Every 3 hours', value: 60 * 60 * 3},
          {title: 'Every 6 hours', value: 60 * 60 * 6},
          {title: 'Every 12 hours', value: 60 * 60 * 12},
        ]"
      />
    </template>
    <template #right>

    </template>
  </kopia-policy-editor-row>
  <kopia-policy-editor-row title="Times of day">
    <template #description>
      Create snapshots at the specified times of day (24hr format)
    </template>
    <template #left>
      <v-textarea v-model="timesOfDay" auto-grow/>
    </template>
    <template #right>

    </template>
  </kopia-policy-editor-row>
</template>

<script lang="ts" setup>
  import {useVModel} from '@vueuse/core'
  import {isFalsy, isNullOrUndefined, useOptionalObjectValue} from '~/lib/useOptionalObjectValue'

  const props = defineProps<{
    modelValue: KopiaPolicy,
  }>()

  const emit = defineEmits(['update:modelValue'])

  const policy = useVModel(props, 'modelValue', emit)
  const schedulingFrequency = useOptionalObjectValue(policy, isNullOrUndefined, 'scheduling', 'intervalSeconds')
  const timesOfDay = useOptionalObjectValue(policy, isFalsy, 'scheduling', 'timesOfDay')

</script>

<style lang="scss" scoped>

</style>