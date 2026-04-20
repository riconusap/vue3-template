import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import MenuManagement from '../views/management/MenuManagement.vue'
import RoleManagement from '../views/management/RoleManagement.vue'
import UserManagement from '../views/management/UserManagement.vue'
import SignIn from '../views/auth/SignIn.vue'
import SignUp from '../views/auth/SignUp.vue'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface RouteMeta {
  title: string
  breadcrumbs: BreadcrumbItem[]
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
        } satisfies RouteMeta,
      },
      {
        path: 'sign-up',
        name: 'SignUp',
        component: SignUp,
        meta: {
          title: 'Sign Up',
          breadcrumbs: [{ label: 'Auth' }, { label: 'Sign Up' }],
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
        } satisfies RouteMeta,
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement,
        meta: {
          title: 'User Management',
          breadcrumbs: [{ label: 'Management' }, { label: 'Users' }],
        } satisfies RouteMeta,
      },
      {
        path: 'menus',
        name: 'MenuManagement',
        component: MenuManagement,
        meta: {
          title: 'Menu Management',
          breadcrumbs: [{ label: 'Management' }, { label: 'Menus' }],
        } satisfies RouteMeta,
      },
      {
        path: 'roles',
        name: 'RoleManagement',
        component: RoleManagement,
        meta: {
          title: 'Role Management',
          breadcrumbs: [{ label: 'Management' }, { label: 'Roles' }],
        } satisfies RouteMeta,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
