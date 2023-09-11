import { defineStore } from 'pinia'
import {useKopiaFetch} from '~/lib/useKopiaFetch'

type RepositoryState = {
  status: KopiaStatus | null,
  sources: KopiaSourceStatus[],
}

export const useRepositoryStore = defineStore('repository', {
  state: (): RepositoryState => ({
    status: null,
    sources: [],
  }),
  getters: {
    isLoggedIn(): boolean {
      // We check for hostname specifically to make sure we didn't just get any
      // random response from some random server
      return !!this.status?.hostname
    },
  },
  actions: {
    async refreshStatus() {
      const {data} = await useKopiaFetch<KopiaStatus>('repo/status')
      this.status = data.value
    },
    async refreshSources() {
      const {data} = await useKopiaFetch<{sources: KopiaSourceStatus[]}>('sources')

      if (data.value) {
        this.sources = data.value.sources
      }
    },
  },
})