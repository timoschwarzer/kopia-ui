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
    async refreshSources(query?: {user?: string, host?: string, path?: string}) {
      const {data} = await useKopiaFetch<{sources: KopiaSourceStatus[]}>('sources', {
        query: query,
      })

      if (data.value) {
        if (query?.host ?? query?.user ?? query?.path) {
          // Delete all cached sources that match the query
          this.sources = this.sources.filter(s => {
            return !((query.host === undefined || s.source.host === query.host) &&
              (query.user === undefined || s.source.userName === query.user) &&
              (query.path === undefined || s.source.path === query.path))
          })

          this.sources.push(...data.value.sources)
        } else {
          this.sources = data.value.sources
        }
      }
    },
  },
})