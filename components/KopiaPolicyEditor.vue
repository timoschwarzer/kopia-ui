<template>
  <div class="policy-editor-columns">
    <div/>
    <div class="defined-effective-banner text-center">
      <v-tooltip location="bottom" open-delay="500">
        <template #activator="{props}">
          <h2 v-bind="props">Defined Settings</h2>
        </template>
        <span>Settings defined by this Policy</span>
      </v-tooltip>
      <v-tooltip location="bottom" open-delay="500">
        <template #activator="{props}">
          <h2 v-bind="props">Effective Settings</h2>
        </template>
        <span>Effective Settings when executing this policy while taking parent policies into account</span>
      </v-tooltip>
    </div>

    <v-list color="accent" nav rounded density="compact" mandatory v-model:selected="selectedSections">
      <v-list-item value="scheduling" title="Scheduling" prepend-icon="mdi-clock-outline"/>
      <v-list-item value="retention" title="Retention" prepend-icon="mdi-list-status"/>
      <v-list-item value="files" title="Files" prepend-icon="mdi-file-multiple-outline"/>
      <v-list-item value="error_handling" title="Error Handling" prepend-icon="mdi-alert-circle-outline"/>
      <v-list-item value="compression" title="Compression" prepend-icon="mdi-zip-box-outline"/>
      <v-list-item value="performance" title="Performance" prepend-icon="mdi-speedometer"/>
      <v-list-item value="actions" title="Actions" prepend-icon="mdi-play-outline"/>
      <v-list-item value="logging" title="Logging" prepend-icon="mdi-text-long"/>
      <v-list-item value="miscellaneous" title="Miscellaneous" prepend-icon="mdi-dots-horizontal"/>
    </v-list>

    <div>
      <v-scroll-x-transition mode="out-in">
        <div v-if="currentSection === 'scheduling'">
          <kopia-policy-editor-section-scheduling v-model="policy"/>
        </div>
        <div v-else-if="currentSection === 'retention'">
          <kopia-policy-editor-section-retention v-model="policy"/>
        </div>
        <div v-else-if="currentSection === 'files'">
          <kopia-policy-editor-section-files v-model="policy"/>
        </div>
        <div v-else-if="currentSection === 'error_handling'">
          <kopia-policy-editor-section-error-handling v-model="policy"/>
        </div>
        <div v-else-if="currentSection === 'compression'">
          <kopia-policy-editor-section-compression v-model="policy"/>
        </div>
        <div v-else-if="currentSection === 'performance'">
          <kopia-policy-editor-section-performance v-model="policy"/>
        </div>
        <div v-else-if="currentSection === 'actions'">
          <kopia-policy-editor-section-actions v-model="policy"/>
        </div>
        <div v-else-if="currentSection === 'logging'">
          <kopia-policy-editor-section-logging v-model="policy"/>
        </div>
        <div v-else-if="currentSection === 'miscellaneous'">
          <kopia-policy-editor-section-miscellaneous v-model="policy"/>
        </div>
      </v-scroll-x-transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
  type PolicySection =
    'scheduling'
    | 'retention'
    | 'files'
    | 'error_handling'
    | 'compression'
    | 'performance'
    | 'actions'
    | 'logging'
    | 'miscellaneous'

  // We don't support multiple selected sections but v-list only gives an array of selections
  const selectedSections = ref<PolicySection[]>(['scheduling'])
  const policy = ref<KopiaPolicy>({})

  const currentSection = computed<PolicySection | null>(() => selectedSections.value[0] ?? null)
</script>

<style lang="scss" scoped>
  .policy-editor-columns {
    position: relative;
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-column-gap: 1.5em;
    grid-row-gap: 0.5em;
  }

  .defined-effective-banner {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-column-gap: 1em;
  }
</style>