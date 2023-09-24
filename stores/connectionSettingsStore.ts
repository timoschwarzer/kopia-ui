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
  getters: {
    sanitizedApiBaseUrl(): string {
      return this.apiBaseUrl + (!this.apiBaseUrl.endsWith('/') ? '/' : '')
    },
    authenticationHeaders(): {[header: string]: string} {
      return this.username
        ? {Authorization: `Basic ${window.btoa(`${this.username}:${this.password}`)}`}
        : {}
    }
  },
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