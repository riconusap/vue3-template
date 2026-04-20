<template>
  <section>
    <el-card>
      <template #header>
        <div class="section-header">
          <h3>Users</h3>
          <el-button type="primary">Add User</el-button>
        </div>
      </template>

      <el-table :data="pagedUsers" stripe>
        <el-table-column prop="name" label="Name" min-width="180" />
        <el-table-column prop="email" label="Email" min-width="220" />
        <el-table-column prop="role" label="Role" min-width="140" />
        <el-table-column prop="status" label="Status" min-width="120" />
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
          :total="users.length"
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

interface UserRecord {
  id: number
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive'
}

export default defineComponent({
  name: 'UserManagement',
  setup() {
    const users = ref<UserRecord[]>([
      { id: 1, name: 'Nadia Putri', email: 'nadia@company.com', role: 'Admin', status: 'Active' },
      { id: 2, name: 'Rafi Akbar', email: 'rafi@company.com', role: 'Editor', status: 'Active' },
      { id: 3, name: 'Sinta K.', email: 'sinta@company.com', role: 'Viewer', status: 'Inactive' },
      { id: 4, name: 'Kevin Hartono', email: 'kevin@company.com', role: 'Editor', status: 'Active' },
      { id: 5, name: 'Rina Adelia', email: 'rina@company.com', role: 'Admin', status: 'Active' },
      { id: 6, name: 'Dimas Yoga', email: 'dimas@company.com', role: 'Viewer', status: 'Inactive' },
    ])
    const currentPage = ref(1)
    const pageSize = ref(5)

    const pagedUsers = computed<UserRecord[]>(() => {
      const start = (currentPage.value - 1) * pageSize.value
      return users.value.slice(start, start + pageSize.value)
    })

    const handlePageChange = (page: number): void => {
      currentPage.value = page
    }

    return {
      users,
      currentPage,
      pageSize,
      pagedUsers,
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
