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
    <el-menu-item index="/dashboard">
      <el-icon><House /></el-icon>
      <template #title>Dashboard</template>
    </el-menu-item>

    <el-sub-menu index="management-root">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>Management</span>
      </template>
      <el-menu-item index="/users">Users</el-menu-item>
      <el-menu-item index="/menus">Menus</el-menu-item>
      <el-menu-item index="/roles">Roles</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { House, Setting } from '@element-plus/icons-vue'

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
    return {}
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
