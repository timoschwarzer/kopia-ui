<template>
  <v-card min-width="400">
    <v-card-title>Connect to server</v-card-title>
    <v-card-text>
      <v-text-field v-model="connectionSettingsStore.apiBaseUrl" :disabled="loading" label="API URL" placeholder="https://my-kopia-server/api/v1" />
      <v-text-field v-model="connectionSettingsStore.username" :disabled="loading" label="User name" />
      <v-text-field v-model="connectionSettingsStore.password" :disabled="loading" label="Password" type="password" />

      <div class="d-flex justify-end">
        <v-btn :loading="loading" color="primary" elevation="0" @click="login">Connect</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import {useConnectionSettingsStore} from '~/stores/connectionSettingsStore'
  import {useRepositoryStore} from '~/stores/repositoryStore'

  const connectionSettingsStore = useConnectionSettingsStore()
  const repositoryStore = useRepositoryStore()
  const loading = ref(false)

  async function login() {
    loading.value = true

    await repositoryStore.refreshStatus()

    loading.value = false
  }
</script>

<style lang="scss" scoped>

</style>