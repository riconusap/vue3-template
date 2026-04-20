import { defineStore } from 'pinia'

export interface UserSession {
  id: number
  name: string
  email: string
  role: string
  token: string
}

interface AuthState {
  session: UserSession | null
}

interface SignInPayload {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    session: {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'Super Admin',
      token: 'mock-token-12345',
    },
  }),
  getters: {
    isAuthenticated: (state): boolean => Boolean(state.session?.token),
  },
  actions: {
    signIn(payload: SignInPayload): void {
      this.session = {
        id: 1,
        name: 'Admin User',
        email: payload.email,
        role: 'Super Admin',
        token: 'mock-token-12345',
      }
    },
    signOut(): void {
      this.session = null
    },
  },
})
