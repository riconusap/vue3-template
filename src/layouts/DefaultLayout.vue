<template>
  <el-container class="default-layout">
    <el-aside
      :width="sidebarWidth"
      class="app-aside"
      :class="{
        'is-collapsed': appStore.isSidebarCollapsed && !isMobileView,
        'is-mobile-open': isMobileView && isMobileSidebarOpen,
      }"
    >
      <div class="brand">
        <span class="brand-full">Admin Dashboard</span>
        <span class="brand-short">AD</span>
      </div>
      <AppSidebar
        :is-collapsed="isMobileView ? false : appStore.isSidebarCollapsed"
        :active-path="activePath"
      />
    </el-aside>

    <transition name="fade-slide">
      <div
        v-if="isMobileView && isMobileSidebarOpen"
        class="mobile-sidebar-backdrop"
        @click="closeMobileSidebar"
      />
    </transition>

    <el-container class="main-shell">
      <AppHeader
        :breadcrumbs="breadcrumbs"
        :user-name="userName"
        :user-role="userRole"
        :user-email="userEmail"
        :is-dark-mode="isDarkMode"
        @toggle-sidebar="toggleSidebar"
        @toggle-theme="toggleTheme"
        @sign-out="signOut"
      />

      <el-main class="app-main">
        <el-scrollbar>
          <router-view />
          <!-- <transition name="fade-slide" mode="out-in">
          </transition> -->
        </el-scrollbar>
      </el-main>

      <el-footer class="app-footer">
        <span>2026 Admin Dashboard. Built with Vue 3 + Element Plus.</span>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, type RouteLocationMatched } from 'vue-router'
import AppHeader, { type BreadcrumbItem } from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

interface RouteMeta {
  title?: string
  breadcrumbs?: BreadcrumbItem[]
}

export default defineComponent({
  name: 'DefaultLayout',
  components: {
    AppHeader,
    AppSidebar,
  },
  setup() {
    const appStore = useAppStore()
    const authStore = useAuthStore()
    const route = useRoute()
    const router = useRouter()
    const viewportWidth = ref(window.innerWidth)
    const isMobileSidebarOpen = ref(false)

    const handleResize = (): void => {
      viewportWidth.value = window.innerWidth
    }

    const isMobileView = computed((): boolean => viewportWidth.value <= 992)

    const sidebarWidth = computed((): string => {
      if (isMobileView.value) {
        return '260px'
      }

      return appStore.isSidebarCollapsed ? '64px' : '250px'
    })

    const activePath = computed((): string => route.path)

    const breadcrumbs = computed((): BreadcrumbItem[] => {
      const currentRoute = route.matched[route.matched.length - 1] as
        | (RouteLocationMatched & { meta: RouteMeta })
        | undefined
      return currentRoute?.meta?.breadcrumbs ?? [{ label: 'Dashboard' }]
    })

    const userName = computed((): string => authStore.session?.name ?? 'Guest')
    const userRole = computed((): string => authStore.session?.role ?? 'User')
    const userEmail = computed((): string => authStore.session?.email ?? '-')
    const isDarkMode = computed((): boolean => appStore.theme === 'dark')

    const closeMobileSidebar = (): void => {
      isMobileSidebarOpen.value = false
    }

    const toggleSidebar = (): void => {
      if (isMobileView.value) {
        isMobileSidebarOpen.value = !isMobileSidebarOpen.value
        return
      }

      appStore.toggleSidebar()
    }

    const signOut = (): void => {
      closeMobileSidebar()
      void authStore.signOut().finally(() => {
        void router.push('/auth/sign-in')
      })
    }

    const toggleTheme = (): void => {
      appStore.toggleTheme()
    }

    watch(
      () => route.path,
      () => {
        closeMobileSidebar()
      },
    )

    watch(isMobileView, (isMobile) => {
      if (!isMobile) {
        isMobileSidebarOpen.value = false
      }
    })

    onMounted(() => {
      appStore.initializeTheme()
      window.addEventListener('resize', handleResize)
      handleResize()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
    })

    return {
      appStore,
      authStore,
      viewportWidth,
      isMobileSidebarOpen,
      isMobileView,
      sidebarWidth,
      activePath,
      breadcrumbs,
      userName,
      userRole,
      userEmail,
      isDarkMode,
      handleResize,
      toggleSidebar,
      toggleTheme,
      closeMobileSidebar,
      signOut,
    }
  },
})
</script>

<style scoped>
.default-layout {
  min-height: 100dvh;
  align-items: flex-start;
}

.main-shell {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100dvh;
  max-height: 100dvh;
  overflow: hidden;
}

.app-aside {
  position: sticky;
  top: 12px;
  background: linear-gradient(180deg, #162e93 0%, #1f3699 100%);
  transition: width 0.32s cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
  will-change: width;
  border-radius: 18px;
  margin: 12px 12px 12px 12px;
  height: calc(100dvh - 24px);
  box-shadow: 0 14px 28px rgba(22, 46, 147, 0.24);
  align-self: flex-start;
}

.mobile-sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 60, 0.42);
  backdrop-filter: blur(2px);
  z-index: 35;
}

.brand {
  position: relative;
  height: 64px;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.brand-full,
.brand-short {
  position: absolute;
  white-space: nowrap;
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.brand-full {
  opacity: 1;
  transform: translateY(0);
}

.brand-short {
  opacity: 0;
  transform: translateY(4px);
}

.app-aside.is-collapsed .brand-full {
  opacity: 0;
  transform: translateY(-4px);
}

.app-aside.is-collapsed .brand-short {
  opacity: 1;
  transform: translateY(0);
}

.app-main {
  padding: 20px;
  margin: 0 12px 0 0;
  background: var(--app-bg);
  border: 1px solid var(--app-border);
  border-radius: 18px;
  box-shadow: var(--app-shadow-soft);
  overflow: auto;
  display: flex;
  flex: 1;
  min-height: 0;
  height: auto;
}

.app-main :deep(.el-scrollbar) {
  width: 100%;
  height: 100%;
}

.app-main :deep(.el-scrollbar__wrap),
.app-main :deep(.el-scrollbar__view) {
  background: transparent;
}

.app-main :deep(.el-scrollbar__view) {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.app-footer {
  height: 56px;
  margin: 0 12px 12px 0;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 18px;
  box-shadow: var(--app-shadow-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  flex-shrink: 0;
}

@media (max-width: 992px) {
  .app-aside {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 40;
    width: min(86vw, 280px) !important;
    margin: 8px;
    height: calc(100dvh - 16px);
    min-height: 0;
    border-radius: 14px;
    transform: translateX(calc(-100% - 20px));
    opacity: 0;
    pointer-events: none;
    transition:
      transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.2s ease;
  }

  .app-aside.is-mobile-open {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
  }

  .brand-short {
    display: none;
  }

  .app-aside.is-collapsed .brand-full {
    opacity: 1;
    transform: translateY(0);
  }

  .app-aside.is-collapsed .brand-short {
    opacity: 0;
    transform: translateY(4px);
  }

  .main-shell {
    min-width: 0;
    height: 100dvh;
    max-height: 100dvh;
  }

  .app-footer {
    margin: 8px;
    border-radius: 14px;
    text-align: center;
    padding: 0 12px;
  }

  .app-main {
    margin: 0 8px 8px;
    padding: 14px;
    border-radius: 14px;
  }
}

@media (max-width: 640px) {
  .app-main {
    padding: 10px;
  }

  .app-footer {
    font-size: 12px;
    min-height: 48px;
    height: auto;
  }
}
</style>
