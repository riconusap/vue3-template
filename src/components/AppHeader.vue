<template>
  <header class="app-header">
    <div class="app-header-left">
      <el-button circle @click="handleToggleSidebar">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </el-button>
      <el-breadcrumb separator=">" class="header-breadcrumb">
        <el-breadcrumb-item
          v-for="item in breadcrumbs"
          :key="item.label"
          :to="item.to"
        >
          {{ item.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="app-header-right">
      <el-tooltip :content="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'" placement="bottom">
        <el-button circle class="theme-toggle" @click="handleToggleTheme">
          <el-icon>
            <Sunny v-if="isDarkMode" />
            <Moon v-else />
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-dropdown>
        <div class="profile-trigger">
          <font-awesome-icon :icon="['fas', 'user-circle']" size="lg" />
          <div>
            <p class="profile-name">{{ userName }}</p>
            <p class="profile-role">{{ userRole }}</p>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleSignOut">Sign Out</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export default defineComponent({
  name: 'AppHeader',
  components: {
    Moon,
    Sunny,
  },
  emits: ['toggle-sidebar', 'toggle-theme', 'sign-out'],
  props: {
    breadcrumbs: {
      type: Array as PropType<BreadcrumbItem[]>,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    isDarkMode: {
      type: Boolean,
      required: true,
    },
  },
  setup(_props, { emit }) {
    const handleToggleSidebar = (): void => {
      emit('toggle-sidebar')
    }

    const handleSignOut = (): void => {
      emit('sign-out')
    }

    const handleToggleTheme = (): void => {
      emit('toggle-theme')
    }

    return {
      handleToggleSidebar,
      handleToggleTheme,
      handleSignOut,
    }
  },
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 12px;
  z-index: 25;
  height: 64px;
  padding: 0 20px;
  margin: 12px 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: color-mix(in srgb, var(--app-surface) 90%, transparent);
  border: 1px solid var(--app-border);
  border-radius: 18px;
  box-shadow: var(--app-shadow-soft);
  backdrop-filter: blur(10px);
}

.app-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.theme-toggle {
  border-color: var(--app-border);
  background: var(--app-surface);
  color: var(--el-text-color-primary);
}

@media (max-width: 992px) {
  .app-header {
    top: 8px;
    margin: 8px 8px 0;
    padding: 0 12px;
    border-radius: 14px;
  }

  .app-header-left {
    min-width: 0;
    gap: 10px;
  }
}

.app-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: var(--el-color-primary);
}

.profile-name,
.profile-role {
  margin: 0;
  line-height: 1.2;
}

.profile-name {
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.profile-role {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

@media (max-width: 768px) {
  .header-breadcrumb {
    max-width: 48vw;
    overflow: hidden;
  }

  .app-header :deep(.el-breadcrumb__inner) {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    max-width: 120px;
    vertical-align: bottom;
  }
}

@media (max-width: 640px) {
  .header-breadcrumb {
    display: none;
  }

  .profile-name {
    display: none;
  }

  .app-header-right {
    margin-left: 8px;
  }
}
</style>
