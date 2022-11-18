import axios, { AxiosInstance } from 'axios'
const key = ref()
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT?.toString(),
  headers: {
    'Content-type': 'application/json',
  },
})

if (typeof window !== 'undefined') {
  key.value = localStorage.getItem('userToken')
}

apiClient.defaults.headers.get.Authorization = key.value
apiClient.defaults.headers.post.Authorization = key.value

export default apiClient