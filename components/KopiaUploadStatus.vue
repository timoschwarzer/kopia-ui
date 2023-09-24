<template>
  <div>
    <div>
      {{ prettyProcessedBytes }}
      <span v-if="processedBytes <= counters.estimatedBytes">/ {{ prettyEstimatedBytes }}</span>
    </div>
    <v-progress-linear location="left" :model-value="progressPercentage" :indeterminate="processedBytes > counters.estimatedBytes" rounded />
  </div>
</template>

<script lang="ts" setup>
  import {usePrettyBytes} from '~/lib/usePrettyBytes'

  const props = defineProps<{
    counters: KopiaUploadCounters,
  }>()

  const {counters} = toRefs(props)

  const processedBytes = computed(() => counters.value.cachedBytes + counters.value.hashedBytes)
  const prettyProcessedBytes = usePrettyBytes(processedBytes)
  const prettyEstimatedBytes = usePrettyBytes(counters.value.estimatedBytes)
  const progressPercentage = computed(() => processedBytes.value / counters.value.estimatedBytes * 100)
</script>

<style lang="scss" scoped>

</style>