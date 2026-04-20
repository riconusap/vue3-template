<template>
  <section class="dashboard-view">
    <el-row :gutter="16" class="summary-grid">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" v-for="item in summaryCards" :key="item.title">
        <el-card shadow="hover" class="summary-card">
          <p class="summary-label">{{ item.title }}</p>
          <h3 class="summary-value">{{ item.value }}</h3>
          <p class="summary-growth">{{ item.growth }}</p>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="chart-card">
      <template #header>
        <div class="chart-title">Traffic Overview</div>
      </template>
      <apexchart type="area" height="360" :options="chartOptions" :series="chartSeries" />
    </el-card>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { ApexAxisChartSeries, ApexOptions } from 'apexcharts'

interface SummaryCard {
  title: string
  value: string
  growth: string
}

interface DashboardState {
  chartOptions: ApexOptions
  chartSeries: ApexAxisChartSeries
  summaryCards: SummaryCard[]
}

export default defineComponent({
  name: 'Dashboard',
  data(): DashboardState {
    return {
      summaryCards: [
        { title: 'Total Users', value: '1,284', growth: '+8.2% this month' },
        { title: 'Active Sessions', value: '392', growth: '+3.6% today' },
        { title: 'Revenue', value: '$24,300', growth: '+12.5% this month' },
      ],
      chartSeries: [
        {
          name: 'Visits',
          data: [120, 140, 110, 180, 165, 210, 230],
        },
      ],
      chartOptions: {
        chart: {
          toolbar: { show: false },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
          width: 3,
        },
        colors: ['#2F2FE4'],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.08,
            stops: [0, 90, 100],
          },
        },
        grid: {
          borderColor: '#E9ECF8',
        },
        xaxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      },
    }
  },
})
</script>

<style scoped>
.dashboard-view {
  display: grid;
  gap: 18px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: hidden;
  overflow-y: hidden;
}

.summary-grid {
  width: 100%;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.summary-grid :deep(.el-col) {
  min-width: 0;
}

.summary-card {
  border-radius: 12px;
}

.summary-label {
  margin: 0;
  color: #6f778a;
  font-size: 14px;
}

.summary-value {
  margin: 8px 0;
  color: #172c91;
  font-size: 28px;
}

.summary-growth {
  margin: 0;
  color: #2f8f46;
  font-size: 13px;
}

.chart-card {
  border-radius: 12px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.chart-card :deep(.apexcharts-canvas),
.chart-card :deep(.apexcharts-svg) {
  max-width: 100% !important;
}

.chart-title {
  font-weight: 700;
  color: #1f2a44;
}
</style>
