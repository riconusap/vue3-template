<template>
  <header class="app-header">
    <div class="app-header-left">
      <el-button circle @click="$emit('toggle-sidebar')">
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
            <el-dropdown-item @click="$emit('sign-out')">Sign Out</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export default defineComponent({
  name: 'AppHeader',
  emits: ['toggle-sidebar', 'sign-out'],
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
  },
})
</script>

<style scoped>
.app-header {
  height: 64px;
  padding: 0 20px;
  margin: 12px 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #e8ebf3;
  border-radius: 18px;
  box-shadow: 0 10px 20px rgba(22, 46, 147, 0.1);
}

@media (max-width: 992px) {
  .app-header {
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
  color: #162e93;
}

.profile-name,
.profile-role {
  margin: 0;
  line-height: 1.2;
}

.profile-name {
  font-weight: 700;
  color: #1f2a44;
}

.profile-role {
  font-size: 12px;
  color: #6f778a;
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
