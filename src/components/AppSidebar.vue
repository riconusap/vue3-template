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
    <el-menu-item v-if="isMenuLoading" index="menu-loading" disabled>
      Loading menus...
    </el-menu-item>

    <template v-for="menu in visibleMenuItems" :key="menu.index">
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
import { computed, defineComponent, onMounted, ref } from 'vue'
import { House, Setting } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { fetchMenuList, type MenuApiItem } from '@/services/menus'

interface SidebarMenuItem {
  index: string
  label: string
  icon?: unknown
  iconName?: string
  requiredRoles?: string[]
  requiredPermissions?: string[]
  children?: Array<{
    index: string
    label: string
    iconName?: string
    requiredRoles?: string[]
    requiredPermissions?: string[]
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
    const authStore = useAuthStore()
    const isMenuLoading = ref(false)
    const dynamicMenus = ref<SidebarMenuItem[]>([])

    const fallbackMenuItems: SidebarMenuItem[] = [
      {
        index: '/dashboard',
        label: 'Dashboard',
        icon: House,
        iconName: 'house',
      },
      {
        index: 'management-root',
        label: 'Management',
        icon: Setting,
        iconName: 'setting',
        children: [
          {
            index: '/users',
            label: 'Users',
            iconName: 'users',
            requiredPermissions: ['users.view', 'users.index', 'view users', 'view_users', 'manage users'],
          },
          {
            index: '/menus',
            label: 'Menus',
            iconName: 'menus',
            requiredPermissions: ['menus.view', 'menus.index', 'view menus', 'view_menus', 'manage menus'],
          },
          {
            index: '/roles',
            label: 'Roles',
            iconName: 'roles',
            requiredPermissions: ['roles.view', 'roles.index', 'view roles', 'view_roles', 'manage roles'],
          },
        ],
      },
    ]

    const normalizeAccessNames = (
      items: Array<{ name?: string } | string> | string[] | undefined,
      singleValue?: string,
    ): string[] => {
      const fromItems = (items ?? [])
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

      const merged = [...fromItems]
      if (typeof singleValue === 'string' && singleValue.trim()) {
        merged.push(singleValue.trim())
      }

      return Array.from(new Set(merged))
    }

    const normalizeMenuItem = (menu: MenuApiItem, level: number): SidebarMenuItem | null => {
      const label = menu.label ?? menu.name ?? menu.title ?? ''
      if (!label.trim()) {
        return null
      }

      const routeIndex = menu.route ?? menu.path ?? menu.url ?? ''
      const children = Array.isArray(menu.children)
        ? menu.children
            .map((child) => normalizeMenuItem(child, level + 1))
            .filter((child): child is SidebarMenuItem => Boolean(child))
        : []

      const idValue = typeof menu.id === 'number' || typeof menu.id === 'string' ? String(menu.id) : label
      const fallbackIndex = level === 0 ? `group-${idValue}` : `item-${idValue}`

      const normalizedItem: SidebarMenuItem = {
        index: routeIndex.trim() ? routeIndex : fallbackIndex,
        label,
        iconName: menu.icon,
        requiredPermissions: normalizeAccessNames(menu.permissions, menu.permission),
        requiredRoles: normalizeAccessNames(menu.roles, menu.role),
      }

      if (children.length > 0) {
        normalizedItem.children = children
      }

      return normalizedItem
    }

    const normalizeDynamicMenus = (menus: MenuApiItem[]): SidebarMenuItem[] => {
      const topLevelMenus = menus
        .filter((menu) => menu.parent_id == null)
        .sort((a, b) => (a.order ?? a.sort_order ?? 0) - (b.order ?? b.sort_order ?? 0))

      return topLevelMenus
        .map((menu) => normalizeMenuItem(menu, 0))
        .filter((menu): menu is SidebarMenuItem => Boolean(menu))
    }

    const loadDynamicMenus = async (): Promise<void> => {
      isMenuLoading.value = true
      try {
        const remoteMenus = await fetchMenuList()
        const normalizedMenus = normalizeDynamicMenus(remoteMenus)
        dynamicMenus.value = normalizedMenus.length > 0 ? normalizedMenus : fallbackMenuItems
      } catch {
        dynamicMenus.value = fallbackMenuItems
      } finally {
        isMenuLoading.value = false
      }
    }

    onMounted(() => {
      void loadDynamicMenus()
    })

    const effectiveMenuItems = computed<SidebarMenuItem[]>(() => {
      return dynamicMenus.value.length > 0 ? dynamicMenus.value : fallbackMenuItems
    })

    const hasAccess = (roles?: string[], permissions?: string[]): boolean => {
      return authStore.canAccess({
        roles,
        permissions,
      })
    }

    const visibleMenuItems = computed<SidebarMenuItem[]>(() => {
      return effectiveMenuItems.value.reduce<SidebarMenuItem[]>((items, menu) => {
        if (menu.children?.length) {
          const visibleChildren = menu.children.filter((child) =>
            hasAccess(child.requiredRoles, child.requiredPermissions),
          )

          if (visibleChildren.length > 0) {
            items.push({
              ...menu,
              children: visibleChildren,
            })
          }

          return items
        }

        if (hasAccess(menu.requiredRoles, menu.requiredPermissions)) {
          items.push(menu)
        }

        return items
      }, [])
    })

    return {
      isMenuLoading,
      visibleMenuItems,
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
