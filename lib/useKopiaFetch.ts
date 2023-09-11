import {useConnectionSettingsStore} from '~/stores/connectionSettingsStore'

export const useKopiaFetch: typeof useFetch = (url: string, options = {}) => {
  const connectionSettings = useConnectionSettingsStore()

  return useFetch(url, {
    baseURL: connectionSettings.apiBaseUrl,
    server: false,

    // set user token if connected
    headers: connectionSettings.username
      ? {Authorization: `Basic ${window.btoa(`${connectionSettings.username}:${connectionSettings.password}`)}`}
      : {},
    ...options,
  })
}
