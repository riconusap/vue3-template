<template>
  <section>
    <el-card>
      <template #header>
        <div class="section-header">
          <h3>Roles</h3>
          <el-button type="primary">Add Role</el-button>
        </div>
      </template>

      <el-table :data="pagedRoles" stripe>
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
import { defineComponent } from 'vue'

interface RoleRecord {
  id: number
  name: string
  permissions: string
  users: number
}

interface ViewState {
  roles: RoleRecord[]
  currentPage: number
  pageSize: number
}

export default defineComponent({
  name: 'RoleManagement',
  data(): ViewState {
    return {
      roles: [
        { id: 1, name: 'Super Admin', permissions: 'All Permissions', users: 2 },
        { id: 2, name: 'Admin', permissions: 'User, Menu, Role Management', users: 6 },
        { id: 3, name: 'Editor', permissions: 'Content Management', users: 10 },
        { id: 4, name: 'Viewer', permissions: 'Read-only Access', users: 21 },
      ],
      currentPage: 1,
      pageSize: 5,
    }
  },
  computed: {
    pagedRoles(): RoleRecord[] {
      const start = (this.currentPage - 1) * this.pageSize
      return this.roles.slice(start, start + this.pageSize)
    },
  },
  methods: {
    handlePageChange(page: number): void {
      this.currentPage = page
    },
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
