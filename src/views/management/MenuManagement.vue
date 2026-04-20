<template>
  <section>
    <el-card>
      <template #header>
        <div class="section-header">
          <h3>Menus</h3>
          <el-button type="primary">Add Menu</el-button>
        </div>
      </template>

      <el-table :data="pagedMenus" stripe>
        <el-table-column prop="label" label="Label" min-width="180" />
        <el-table-column prop="route" label="Route" min-width="180" />
        <el-table-column prop="icon" label="Icon" min-width="120" />
        <el-table-column prop="order" label="Order" min-width="90" />
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
          :total="menus.length"
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

interface MenuRecord {
  id: number
  label: string
  route: string
  icon: string
  order: number
}

interface ViewState {
  menus: MenuRecord[]
  currentPage: number
  pageSize: number
}

export default defineComponent({
  name: 'MenuManagement',
  data(): ViewState {
    return {
      menus: [
        { id: 1, label: 'Dashboard', route: '/dashboard', icon: 'house', order: 1 },
        { id: 2, label: 'Users', route: '/users', icon: 'users', order: 2 },
        { id: 3, label: 'Roles', route: '/roles', icon: 'user-shield', order: 3 },
        { id: 4, label: 'Reports', route: '/reports', icon: 'chart-line', order: 4 },
      ],
      currentPage: 1,
      pageSize: 5,
    }
  },
  computed: {
    pagedMenus(): MenuRecord[] {
      const start = (this.currentPage - 1) * this.pageSize
      return this.menus.slice(start, start + this.pageSize)
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
