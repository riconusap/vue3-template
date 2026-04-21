import { defineStore } from 'pinia'

interface AppState {
  isSidebarCollapsed: boolean
  theme: 'light' | 'dark'
}

const APP_THEME_KEY = 'app-theme'

const getPreferredTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const resolveStoredTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = window.localStorage.getItem(APP_THEME_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return getPreferredTheme()
}

const applyThemeToDocument = (theme: 'light' | 'dark'): void => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute('data-theme', theme)
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    isSidebarCollapsed: false,
    theme: resolveStoredTheme(),
  }),
  actions: {
    toggleSidebar(): void {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },
    setSidebarCollapsed(value: boolean): void {
      this.isSidebarCollapsed = value
    },
    initializeTheme(): void {
      this.theme = resolveStoredTheme()
      applyThemeToDocument(this.theme)
    },
    setTheme(theme: 'light' | 'dark'): void {
      this.theme = theme
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(APP_THEME_KEY, theme)
      }
      applyThemeToDocument(theme)
    },
    toggleTheme(): void {
      const nextTheme = this.theme === 'dark' ? 'light' : 'dark'
      this.setTheme(nextTheme)
    },
  },
})
