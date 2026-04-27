import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import MenuManagement from '@/views/management/MenuManagement.vue'
import RoleManagement from '@/views/management/RoleManagement.vue'
import UserManagement from '@/views/management/UserManagement.vue'
import SignIn from '@/views/auth/SignIn.vue'
import SignUp from '@/views/auth/SignUp.vue'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface RouteMeta {
  title: string
  breadcrumbs: BreadcrumbItem[]
  requiresAuth?: boolean
  guestOnly?: boolean
  requiredRoles?: string[]
  requiredPermissions?: string[]
}

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        redirect: '/auth/sign-in',
      },
      {
        path: 'sign-in',
        name: 'SignIn',
        component: SignIn,
        meta: {
          title: 'Sign In',
          breadcrumbs: [{ label: 'Auth' }, { label: 'Sign In' }],
          guestOnly: true,
        } satisfies RouteMeta,
      },
      {
        path: 'sign-up',
        name: 'SignUp',
        component: SignUp,
        meta: {
          title: 'Sign Up',
          breadcrumbs: [{ label: 'Auth' }, { label: 'Sign Up' }],
          guestOnly: true,
        } satisfies RouteMeta,
      },
    ],
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: 'Dashboard',
          breadcrumbs: [{ label: 'Dashboard' }],
          requiresAuth: true,
        } satisfies RouteMeta,
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement,
        meta: {
          title: 'User Management',
          breadcrumbs: [{ label: 'Management' }, { label: 'Users' }],
          requiresAuth: true,
          requiredPermissions: ['users.view', 'users.index', 'view users', 'view_users', 'manage users'],
        } satisfies RouteMeta,
      },
      {
        path: 'menus',
        name: 'MenuManagement',
        component: MenuManagement,
        meta: {
          title: 'Menu Management',
          breadcrumbs: [{ label: 'Management' }, { label: 'Menus' }],
          requiresAuth: true,
          requiredPermissions: ['menus.view', 'menus.index', 'view menus', 'view_menus', 'manage menus'],
        } satisfies RouteMeta,
      },
      {
        path: 'roles',
        name: 'RoleManagement',
        component: RoleManagement,
        meta: {
          title: 'Role Management',
          breadcrumbs: [{ label: 'Management' }, { label: 'Roles' }],
          requiresAuth: true,
          requiredPermissions: ['roles.view', 'roles.index', 'view roles', 'view_roles', 'manage roles'],
        } satisfies RouteMeta,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const requiresAuth = Boolean(to.meta.requiresAuth)
  const guestOnly = Boolean(to.meta.guestOnly)
  const requiredRoles = Array.isArray(to.meta.requiredRoles)
    ? (to.meta.requiredRoles as string[])
    : []
  const requiredPermissions = Array.isArray(to.meta.requiredPermissions)
    ? (to.meta.requiredPermissions as string[])
    : []

  if (requiresAuth && !authStore.isAuthenticated) {
    return {
      path: '/auth/sign-in',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (guestOnly && authStore.isAuthenticated) {
    return {
      path: '/dashboard',
    }
  }

  if (requiresAuth && !authStore.canAccess({ roles: requiredRoles, permissions: requiredPermissions })) {
    return {
      path: '/dashboard',
    }
  }
})

export default router
