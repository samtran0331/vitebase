import { acceptHMRUpdate, defineStore } from 'pinia'

export const useGlobalStore = defineStore('appGlobal', () => {
  const connToken = ref('')
  const apiURL = import.meta.env.VITE_API_ENDPOINT
  function setToken(token: string) {
    if (connToken.value === '') {
      connToken.value = token
    }
  }
  return {
    connToken,
    apiURL,
    setToken,
  }
})
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot))
