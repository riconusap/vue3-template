<template>
  <el-menu
    :default-active="activePath"
    :collapse="isCollapsed"
    class="app-sidebar-menu"
    :class="{ 'is-collapsed': isCollapsed }"
    router
    background-color="#162E93"
    text-color="#E8EAFE"
    active-text-color="#FFFFFF"
  >
    <template v-for="menu in menuItems" :key="menu.index">
      <el-sub-menu v-if="menu.children" :index="menu.index">
        <template #title>
          <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
          <span>{{ menu.label }}</span>
        </template>
        <el-menu-item v-for="child in menu.children" :key="child.index" :index="child.index">
          {{ child.label }}
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item v-else :index="menu.index">
        <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
        <template #title>{{ menu.label }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { House, Setting } from '@element-plus/icons-vue'

interface SidebarMenuItem {
  index: string
  label: string
  icon?: unknown
  children?: Array<{
    index: string
    label: string
  }>
}

export default defineComponent({
  name: 'AppSidebar',
  components: {
    House,
    Setting,
  },
  props: {
    isCollapsed: {
      type: Boolean,
      required: true,
    },
    activePath: {
      type: String,
      required: true,
    },
  },
  setup() {
    const menuItems: SidebarMenuItem[] = [
      {
        index: '/dashboard',
        label: 'Dashboard',
        icon: House,
      },
      {
        index: 'management-root',
        label: 'Management',
        icon: Setting,
        children: [
          { index: '/users', label: 'Users' },
          { index: '/menus', label: 'Menus' },
          { index: '/roles', label: 'Roles' },
        ],
      },
    ]

    return {
      menuItems,
    }
  },
})
</script>

<style scoped>
.app-sidebar-menu {
  border-right: none;
  height: 100%;
}

.app-sidebar-menu :deep(.el-menu-item),
.app-sidebar-menu :deep(.el-sub-menu__title) {
  transition: padding-left 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.app-sidebar-menu :deep(.el-menu-item span),
.app-sidebar-menu :deep(.el-sub-menu__title span) {
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: left center;
}

.app-sidebar-menu.is-collapsed :deep(.el-menu-item span),
.app-sidebar-menu.is-collapsed :deep(.el-sub-menu__title span) {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
