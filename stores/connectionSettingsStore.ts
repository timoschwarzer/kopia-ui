import { defineStore } from 'pinia'

type ConnectionSettingsState = {
  apiBaseUrl: string,
  username: string,
  password: string,
}

export const useConnectionSettingsStore = defineStore('connection-settings', {
  state: (): ConnectionSettingsState => ({
    apiBaseUrl: '/api/v1',
    username: '',
    password: '',
  }),
  persist: [
    {
      paths: ['apiBaseUrl', 'username'],
      storage: localStorage,
    },
    {
      paths: ['password'],
      storage: sessionStorage,
    },
  ]
})