import { defineStore } from 'pinia'

interface AppState {
  isSidebarCollapsed: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    isSidebarCollapsed: false,
  }),
  actions: {
    toggleSidebar(): void {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },
    setSidebarCollapsed(value: boolean): void {
      this.isSidebarCollapsed = value
    },
  },
})
