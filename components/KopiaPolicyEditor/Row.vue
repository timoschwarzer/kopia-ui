<template>
  <div class="policy-editor-row">
    <div class="row-title">
      <h3>{{ title }}</h3>
      <slot name="description" />
    </div>
    <div class="row-left">
      <slot name="left" />
    </div>
    <div class="row-right">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    title: string,
  }>()
</script>

<style lang="scss" scoped>
  .policy-editor-row {
    display: grid;
    grid-column-gap: 1em;
    grid-row-gap: 0.5em;
    grid-template-columns: 50% 50%;
    grid-template-areas: "title title"
                         "left right";

    .row-title {
      grid-area: title;
    }

    .row-left {
      grid-area: left;
    }

    .row-right {
      grid-area: right;
    }
  }
</style>