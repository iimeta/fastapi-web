<template>
  <div class="data-board">
    <FilterBar @filter-change="handleFilterChange" />

    <div class="board-section">
      <OverviewCards :params="filterParams" />
    </div>

    <div class="board-section">
      <TrendChart :params="filterParams" />
    </div>

    <div class="board-section">
      <ModelPieChart :params="filterParams" />
    </div>

    <div class="board-section">
      <ModelSpendChart :params="filterParams" />
    </div>

    <div class="board-section">
      <ModelTrendChart :params="filterParams" />
    </div>

    <div class="board-section">
      <AbnormalChart :params="filterParams" />
    </div>

    <div class="board-section">
      <LatencyTrendChart :params="filterParams" />
    </div>

    <div class="board-section">
      <TopRanking :params="filterParams" />
    </div>

    <div class="board-section">
      <DimensionAnalysis :params="filterParams" />
    </div>

    <div class="board-section">
      <TaskStatusChart :params="filterParams" />
    </div>

    <div v-if="userStore.role === 'admin'" class="board-section">
      <AgentStatusChart :params="filterParams" />
    </div>

    <div v-if="userStore.role === 'admin'" class="board-section">
      <KeyStatusChart :params="filterParams" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { useUserStore } from '@/store';
  import FilterBar from './components/filter-bar.vue';
  import OverviewCards from './components/overview-cards.vue';
  import TrendChart from './components/trend-chart.vue';
  import ModelPieChart from './components/model-pie-chart.vue';
  import ModelSpendChart from './components/model-spend-chart.vue';
  import ModelTrendChart from './components/model-trend-chart.vue';
  import AbnormalChart from './components/abnormal-chart.vue';
  import TopRanking from './components/top-ranking.vue';
  import TaskStatusChart from './components/task-status-chart.vue';
  import AgentStatusChart from './components/agent-status-chart.vue';
  import KeyStatusChart from './components/key-status-chart.vue';
  import LatencyTrendChart from './components/latency-trend-chart.vue';
  import DimensionAnalysis from './components/dimension-analysis.vue';

  const userStore = useUserStore();

  const filterParams = reactive({
    rid: 0,
    user_id: 0,
    app_id: 0,
    app_key: '',
    provider: '',
    models: undefined as string[] | undefined,
  });

  const handleFilterChange = (params: any) => {
    Object.assign(filterParams, params);
  };
</script>

<script lang="ts">
  export default { name: 'DataBoard' };
</script>

<style lang="less" scoped>
  @import './style/statistics-board-shared.less';
</style>
