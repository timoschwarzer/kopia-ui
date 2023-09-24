import {defineStore} from 'pinia'

type SortItem = {
  key: string,
  order: 'asc' | 'desc',
}

type UiSettingsState = {
  listViewSettings: {
    sourcesList: {
      page: number,
      sortBy: [SortItem],
      itemsPerPage: number,
    }
  },
  objectBrowserSettings: {
    sortDirectoriesBeforeFiles: boolean,
  },
}

export const useUiSettingsStore = defineStore('ui-settings', {
  state: (): UiSettingsState => ({
    listViewSettings: {
      sourcesList: {
        page: 0,
        sortBy: [{
          key: '__display.nextSnapshotDate',
          order: 'asc',
        }],
        itemsPerPage: -1,
      }
    },
    objectBrowserSettings: {
      sortDirectoriesBeforeFiles: true,
    }
  }),
  persist: {
    storage: localStorage,
  },
})