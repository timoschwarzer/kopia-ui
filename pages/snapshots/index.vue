<template>
  <v-container fluid>
    <kopia-sources-list :sources="sources" />
  </v-container>
</template>

<script lang="ts" setup>
  import {useRepositoryStore} from '~/stores/repositoryStore'
  import {storeToRefs} from 'pinia'

  const repositoryStore = useRepositoryStore()
  const {sources} = storeToRefs(repositoryStore)

  useTimeoutPoll(repositoryStore.refreshSources, 1000, {immediate: true})
</script>

<style lang="scss" scoped>

</style>