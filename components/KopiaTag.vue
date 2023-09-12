<template>
  <v-chip :color="tagColor" label density="comfortable">
    <template v-if="pin" #prepend>
      <v-icon size="16" icon="mdi-pin-outline" class="pin-icon mr-1" />
    </template>
    {{ tag }}
  </v-chip>
</template>

<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      tag: string,
      pin: boolean,
    }>(), {
      pin: false,
    }
  )

  const {tag} = toRefs(props)

  const tagColor = computed(() => {
    if (tag.value.startsWith('latest-')) {
      return 'green'
    }
    if (tag.value.startsWith('hourly-')) {
      return 'blue darken-2'
    }
    if (tag.value.startsWith('daily-')) {
      return 'blue'
    }
    if (tag.value.startsWith('weekly-')) {
      return 'red'
    }
    if (tag.value.startsWith('monthly-')) {
      return 'pink'
    }
    if (tag.value.startsWith('annual-')) {
      return 'orange'
    }
    return ''
  })
</script>

<style lang="scss" scoped>
  .pin-icon {
    margin-left: -0.3em;
  }
</style>