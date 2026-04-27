import { defineStore } from 'pinia'
import { isAxiosError } from 'axios'
import {
  extractLoginToken,
  getProfileRequest,
  loginRequest,
  logoutRequest,
  type AuthProfile,
  type LoginPayload,
} from '@/services/auth'

export interface UserSession {
  id: number
  name: string
  email: string
  role: string
  roles: string[]
  permissions: string[]
  token: string
}

interface AuthState {
  session: UserSession | null
}

const STORAGE_KEY = 'nusaapp-auth-session'
const PRIVILEGED_ROLES = ['super admin', 'super-admin', 'superadmin']

const hasWindow = (): boolean => typeof window !== 'undefined'

const readStoredSession = (): UserSession | null => {
  if (!hasWindow()) {
    return null
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY) ?? window.sessionStorage.getItem(STORAGE_KEY)
  if (!storedValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<UserSession>
    if (
      typeof parsedValue.id === 'number' &&
      typeof parsedValue.name === 'string' &&
      typeof parsedValue.email === 'string' &&
      typeof parsedValue.role === 'string' &&
      Array.isArray(parsedValue.roles) &&
      Array.isArray(parsedValue.permissions) &&
      typeof parsedValue.token === 'string'
    ) {
      return parsedValue as UserSession
    }
  } catch {
    return null
  }

  return null
}

const persistSession = (session: UserSession, rememberMe: boolean): void => {
  if (!hasWindow()) {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
  window.sessionStorage.removeItem(STORAGE_KEY)

  const targetStorage = rememberMe ? window.localStorage : window.sessionStorage
  targetStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

const clearStoredSession = (): void => {
  if (!hasWindow()) {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
  window.sessionStorage.removeItem(STORAGE_KEY)
}

const resolveRoleName = (profile: AuthProfile | null, fallbackRole: string): string => {
  const directRole = profile?.role?.trim()
  if (directRole) {
    return directRole
  }

  const firstRole = profile?.roles?.[0]
  if (typeof firstRole === 'string' && firstRole.trim()) {
    return firstRole
  }

  if (firstRole && typeof firstRole === 'object' && typeof firstRole.name === 'string' && firstRole.name.trim()) {
    return firstRole.name
  }

  return fallbackRole
}

const normalizeAccessNames = (items: AuthProfile['roles'] | AuthProfile['permissions']): string[] => {
  if (!Array.isArray(items)) {
    return []
  }

  const names = items
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim()
      }
      if (item && typeof item === 'object' && typeof item.name === 'string') {
        return item.name.trim()
      }
      return ''
    })
    .filter((name) => Boolean(name))

  return Array.from(new Set(names))
}

const resolveProfile = (
  token: string,
  loginProfile: AuthProfile | null,
  profile: AuthProfile | null,
  fallbackEmail: string,
): UserSession => {
  const sourceProfile = profile ?? loginProfile
  const resolvedName = sourceProfile?.name?.trim() || fallbackEmail
  const resolvedEmail = sourceProfile?.email?.trim() || fallbackEmail

  return {
    id: sourceProfile?.id ?? 0,
    name: resolvedName,
    email: resolvedEmail,
    role: resolveRoleName(sourceProfile, 'User'),
    roles: normalizeAccessNames(sourceProfile?.roles),
    permissions: normalizeAccessNames(sourceProfile?.permissions),
    token,
  }
}

const resolveSignInErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const responseMessage = (error.response?.data as { message?: string } | undefined)?.message
    if (typeof responseMessage === 'string' && responseMessage.trim()) {
      return responseMessage
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return 'Login failed. Please try again.'
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    session: readStoredSession(),
  }),
  getters: {
    isAuthenticated: (state): boolean => Boolean(state.session?.token),
    normalizedRoleNames: (state): string[] =>
      [state.session?.role ?? '', ...(state.session?.roles ?? [])]
        .map((role) => role.trim().toLowerCase())
        .filter((role) => Boolean(role)),
    normalizedPermissionNames: (state): string[] =>
      (state.session?.permissions ?? [])
        .map((permission) => permission.trim().toLowerCase())
        .filter((permission) => Boolean(permission)),
    isPrivilegedRole(): boolean {
      return this.normalizedRoleNames.some((role) => PRIVILEGED_ROLES.includes(role))
    },
    hasRole(): (roles: string[]) => boolean {
      return (roles: string[]): boolean => {
        if (roles.length === 0) {
          return true
        }

        return roles.some((role) => this.normalizedRoleNames.includes(role.trim().toLowerCase()))
      }
    },
    hasPermission(): (permissions: string[]) => boolean {
      return (permissions: string[]): boolean => {
        if (permissions.length === 0) {
          return true
        }

        return permissions.some((permission) =>
          this.normalizedPermissionNames.includes(permission.trim().toLowerCase()),
        )
      }
    },
    canAccess(): (options: { roles?: string[]; permissions?: string[] }) => boolean {
      return (options: { roles?: string[]; permissions?: string[] }): boolean => {
        const roles = options.roles ?? []
        const permissions = options.permissions ?? []

        if (!this.isAuthenticated) {
          return false
        }

        if (this.isPrivilegedRole) {
          return true
        }

        const rolesAllowed = roles.length === 0 || this.hasRole(roles)
        const permissionsAllowed = permissions.length === 0 || this.hasPermission(permissions)

        return rolesAllowed && permissionsAllowed
      }
    },
  },
  actions: {
    async signIn(payload: LoginPayload): Promise<UserSession> {
      try {
        const loginResponse = await loginRequest(payload)
        const loginBody = loginResponse.data
        const token =
          ('data' in loginBody && loginBody.data ? extractLoginToken(loginResponse) : null) ??
          ('token' in loginBody ? loginBody.token ?? null : null)

        if (!token) {
          throw new Error('Login token was not returned by the API.')
        }

        let loginProfile: AuthProfile | null = null
        if (
          'data' in loginBody &&
          loginBody.data &&
          typeof loginBody.data === 'object' &&
          'user' in loginBody.data
        ) {
          loginProfile = loginBody.data.user ?? null
        }

        let profile: AuthProfile | null = loginProfile
        try {
          const profileResponse = await getProfileRequest(token)
          const profileBody = profileResponse.data
          if ('data' in profileBody && profileBody.data && typeof profileBody.data === 'object') {
            profile = profileBody.data as AuthProfile
          } else if (!('data' in profileBody)) {
            profile = profileBody as AuthProfile
          }
        } catch {
          profile = loginProfile
        }

        const session = resolveProfile(token, loginProfile, profile, payload.email)
        this.session = session
        persistSession(session, Boolean(payload.rememberMe))

        return session
      } catch (error) {
        throw new Error(resolveSignInErrorMessage(error))
      }
    },
    async signOut(): Promise<void> {
      const token = this.session?.token
      this.session = null
      clearStoredSession()

      if (!token) {
        return
      }

      try {
        await logoutRequest(token)
      } catch {
        // Ignore logout transport or auth failures after the local session is cleared.
      }
    },
  },
})
