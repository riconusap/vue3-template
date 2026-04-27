import apiClient from '@/services/http'

export interface MenuApiItem {
  id?: number | string
  label?: string
  name?: string
  title?: string
  route?: string
  path?: string
  url?: string
  icon?: string
  order?: number
  sort_order?: number
  required_permissions?: string[]
  permissions?: Array<{ name?: string } | string> | string[]
  permission?: string
  required_roles?: string[]
  roles?: Array<{ name?: string } | string> | string[]
  role?: string
  children?: MenuApiItem[]
  parent_id?: number | string | null
}

interface MenuEnvelope {
  data?: MenuApiItem[]
  menus?: MenuApiItem[]
  items?: MenuApiItem[]
}

const resolveMenuList = (payload: unknown): MenuApiItem[] => {
  if (Array.isArray(payload)) {
    return payload as MenuApiItem[]
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const directPayload = payload as MenuEnvelope
  if (Array.isArray(directPayload.data)) {
    return directPayload.data
  }
  if (Array.isArray(directPayload.menus)) {
    return directPayload.menus
  }
  if (Array.isArray(directPayload.items)) {
    return directPayload.items
  }

  if (directPayload.data && typeof directPayload.data === 'object') {
    const nestedData = directPayload.data as MenuEnvelope
    if (Array.isArray(nestedData.data)) {
      return nestedData.data
    }
    if (Array.isArray(nestedData.menus)) {
      return nestedData.menus
    }
    if (Array.isArray(nestedData.items)) {
      return nestedData.items
    }
  }

  return []
}

export const fetchMenuList = async (): Promise<MenuApiItem[]> => {
  const response = await apiClient.get('/menus')
  return resolveMenuList(response.data)
}
