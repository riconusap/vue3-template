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
import { computed, defineComponent, ref } from 'vue'

interface MenuRecord {
  id: number
  label: string
  route: string
  icon: string
  order: number
}

export default defineComponent({
  name: 'MenuManagement',
  setup() {
    const menus = ref<MenuRecord[]>([
      { id: 1, label: 'Dashboard', route: '/dashboard', icon: 'house', order: 1 },
      { id: 2, label: 'Users', route: '/users', icon: 'users', order: 2 },
      { id: 3, label: 'Roles', route: '/roles', icon: 'user-shield', order: 3 },
      { id: 4, label: 'Reports', route: '/reports', icon: 'chart-line', order: 4 },
    ])
    const currentPage = ref(1)
    const pageSize = ref(5)

    const pagedMenus = computed<MenuRecord[]>(() => {
      const start = (currentPage.value - 1) * pageSize.value
      return menus.value.slice(start, start + pageSize.value)
    })

    const handlePageChange = (page: number): void => {
      currentPage.value = page
    }

    return {
      menus,
      currentPage,
      pageSize,
      pagedMenus,
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
