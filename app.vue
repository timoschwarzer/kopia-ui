<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title>
        {{ repositoryStore.status?.description ?? 'Kopia' }}
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn v-if="isLoggedIn" @click="logout">
          <v-icon start icon="mdi-logout" />
          Log out
        </v-btn>
      </v-toolbar-items>
      <template v-if="isLoggedIn" v-slot:extension>
        <v-tabs class="mx-auto">
          <v-tab :to="{name: 'index'}">Snapshots</v-tab>
          <v-tab :to="{name: 'policies'}">Policies</v-tab>
          <v-tab :to="{name: 'tasks'}">Tasks</v-tab>
          <v-tab :to="{name: 'repository'}">Repository</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-main>
      <nuxt-page v-if="isLoggedIn" />
      <div v-else-if="initialLoadComplete" class="ma-6 d-flex justify-center">
        <login-form />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import {useRepositoryStore} from '~/stores/repositoryStore'
  import {storeToRefs} from 'pinia'
  import LoginForm from '~/components/LoginForm.vue'
  import {useConnectionSettingsStore} from '~/stores/connectionSettingsStore'

  const repositoryStore = useRepositoryStore()
  const connectionSettingsStore = useConnectionSettingsStore()
  const {isLoggedIn} = storeToRefs(repositoryStore)
  const initialLoadComplete = ref(false)

  onMounted(async () => {
    await repositoryStore.refreshStatus()
    initialLoadComplete.value = true
  })

  function logout() {
    connectionSettingsStore.password = ''
    connectionSettingsStore.$persist()
    repositoryStore.status = null
  }
</script>