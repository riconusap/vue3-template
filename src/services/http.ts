import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '@/stores/auth'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApiError {
  status: number
  message: string
  details?: unknown
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authStore = useAuthStore()
    if (authStore.session?.token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${authStore.session.token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError<{ message?: string; details?: unknown }>) => {
    const normalizedError: ApiError = {
      status: error.response?.status ?? 500,
      message: error.response?.data?.message ?? error.message ?? 'Unknown error',
      details: error.response?.data?.details,
    }

    if (normalizedError.status === 401) {
      const authStore = useAuthStore()
      authStore.signOut()
    }

    return Promise.reject(normalizedError)
  },
)

export default apiClient
