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
        @toggle-sidebar="toggleSidebar"
        @sign-out="signOut"
      />

      <el-main class="app-main">
        <el-scrollbar>
          <transition name="fade-slide" mode="out-in">
            <router-view />
          </transition>
        </el-scrollbar>
      </el-main>

      <el-footer class="app-footer">
        <span>2026 Admin Dashboard. Built with Vue 3 + Element Plus.</span>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { RouteLocationMatched } from 'vue-router'
import AppHeader, { type BreadcrumbItem } from '../components/AppHeader.vue'
import AppSidebar from '../components/AppSidebar.vue'
import { useAppStore } from '../stores/app'
import { useAuthStore } from '../stores/auth'

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
  data() {
    const appStore = useAppStore()
    const authStore = useAuthStore()

    return {
      appStore,
      authStore,
      viewportWidth: window.innerWidth,
      isMobileSidebarOpen: false,
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    isMobileView(): boolean {
      return this.viewportWidth <= 992
    },
    sidebarWidth(): string {
      if (this.isMobileView) {
        return '260px'
      }
      return this.appStore.isSidebarCollapsed ? '64px' : '250px'
    },
    activePath(): string {
      return this.$route.path
    },
    breadcrumbs(): BreadcrumbItem[] {
      const currentRoute = this.$route.matched[this.$route.matched.length - 1] as
        | (RouteLocationMatched & { meta: RouteMeta })
        | undefined
      return currentRoute?.meta?.breadcrumbs ?? [{ label: 'Dashboard' }]
    },
    userName(): string {
      return this.authStore.session?.name ?? 'Guest'
    },
    userRole(): string {
      return this.authStore.session?.role ?? 'User'
    },
  },
  watch: {
    '$route.path'() {
      this.closeMobileSidebar()
    },
    isMobileView(isMobile) {
      if (!isMobile) {
        this.isMobileSidebarOpen = false
      }
    },
  },
  methods: {
    handleResize(): void {
      this.viewportWidth = window.innerWidth
    },
    toggleSidebar(): void {
      if (this.isMobileView) {
        this.isMobileSidebarOpen = !this.isMobileSidebarOpen
        return
      }
      this.appStore.toggleSidebar()
    },
    closeMobileSidebar(): void {
      this.isMobileSidebarOpen = false
    },
    signOut(): void {
      this.closeMobileSidebar()
      this.authStore.signOut()
      void this.$router.push('/auth/sign-in')
    },
  },
})
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
}

.main-shell {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.app-aside {
  background: linear-gradient(180deg, #162e93 0%, #1f3699 100%);
  transition: width 0.32s cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
  will-change: width;
  border-radius: 18px;
  margin: 12px 12px 12px 12px;
  height: calc(100vh - 24px);
  box-shadow: 0 14px 28px rgba(22, 46, 147, 0.24);
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
  margin: 12px 12px 12px 0;
  background: #f5f7ff;
  border: 1px solid #e8ebf3;
  border-radius: 18px;
  box-shadow: 0 10px 20px rgba(22, 46, 147, 0.08);
  overflow: hidden;
  display: flex;
  flex: 1;
  min-height: 0;
}

.app-main :deep(.el-scrollbar) {
  width: 100%;
  height: 100%;
}

.app-footer {
  height: 56px;
  margin: 0 12px 12px 0;
  background: #ffffff;
  border: 1px solid #e8ebf3;
  border-radius: 18px;
  box-shadow: 0 10px 20px rgba(22, 46, 147, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6f778a;
  font-size: 14px;
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
  }

  .app-footer {
    margin: 8px;
    border-radius: 14px;
    text-align: center;
    padding: 0 12px;
  }

  .app-main {
    margin: 8px;
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
