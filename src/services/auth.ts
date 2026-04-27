import axios, { type AxiosInstance, type AxiosResponse } from 'axios'

export interface AuthApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthProfile {
  id?: number
  name?: string
  email?: string
  role?: string
  roles?: Array<{ name?: string } | string> | string[]
  permissions?: Array<{ name?: string } | string> | string[]
}

export interface LoginResponseData {
  token?: string
  user?: AuthProfile
}

const authClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

const normalizeToken = (response: AxiosResponse<AuthApiEnvelope<LoginResponseData> | LoginResponseData>): string | null => {
  const payload = response.data
  if ('data' in payload && payload.data && typeof payload.data === 'object') {
    return payload.data.token ?? null
  }

  if ('token' in payload) {
    return payload.token ?? null
  }

  return null
}

export const loginRequest = async (payload: LoginPayload): Promise<AxiosResponse<AuthApiEnvelope<LoginResponseData> | LoginResponseData>> => {
  return authClient.post<AuthApiEnvelope<LoginResponseData> | LoginResponseData>('/auth/login', {
    email: payload.email,
    password: payload.password,
  })
}

export const getProfileRequest = async (token: string): Promise<AxiosResponse<AuthApiEnvelope<AuthProfile> | AuthProfile>> => {
  return authClient.get<AuthApiEnvelope<AuthProfile> | AuthProfile>('/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const logoutRequest = async (token: string): Promise<void> => {
  await authClient.post('/auth/logout', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const extractLoginToken = normalizeToken
