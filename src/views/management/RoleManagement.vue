<template>
  <section class="section-content">
    <el-card class="floating-card">
      <template #header>
        <div class="section-header">
          <h3>Roles</h3>
          <el-button type="primary">Add Role</el-button>
        </div>
      </template>

      <el-table class="floating-table" :data="pagedRoles" stripe>
        <el-table-column prop="name" label="Role Name" min-width="180" />
        <el-table-column prop="permissions" label="Permissions" min-width="260" />
        <el-table-column prop="users" label="Users" min-width="100" />
        <el-table-column label="Actions" width="170" fixed="right">
          <template #default>
            <el-space>
              <el-button type="primary" link>
                <font-awesome-icon :icon="['fas', 'eye']" />
              </el-button>
              <el-button type="primary" link>
                <font-awesome-icon :icon="['fas', 'pen-to-square']" />
              </el-button>
              <el-button type="danger" link>
                <font-awesome-icon :icon="['fas', 'trash']" />
              </el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="roles.length"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

interface RoleRecord {
  id: number
  name: string
  permissions: string
  users: number
}

export default defineComponent({
  name: 'RoleManagement',
  setup() {
    const roles = ref<RoleRecord[]>([
      { id: 1, name: 'Super Admin', permissions: 'All Permissions', users: 2 },
      { id: 2, name: 'Admin', permissions: 'User, Menu, Role Management', users: 6 },
      { id: 3, name: 'Editor', permissions: 'Content Management', users: 10 },
      { id: 4, name: 'Viewer', permissions: 'Read-only Access', users: 21 },
    ])
    const currentPage = ref(1)
    const pageSize = ref(5)

    const pagedRoles = computed<RoleRecord[]>(() => {
      const start = (currentPage.value - 1) * pageSize.value
      return roles.value.slice(start, start + pageSize.value)
    })

    const handlePageChange = (page: number): void => {
      currentPage.value = page
    }

    return {
      roles,
      currentPage,
      pageSize,
      pagedRoles,
      handlePageChange,
    }
  },
})
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  margin: 0;
}

.pagination-wrap {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}
</style>
