<template>
  <div class="data-board">
    <FilterBar @filter-change="handleFilterChange" />

    <div class="board-section">
      <OverviewCards :key="`overview-${refreshKey}`" :params="filterParams" />
    </div>

    <div class="board-section">
      <TrendChart :key="`trend-${refreshKey}`" :params="filterParams" />
    </div>

    <div class="board-section">
      <ModelPieChart :key="`model-pie-${refreshKey}`" :params="filterParams" />
    </div>

    <div class="board-section">
      <ModelSpendChart
        :key="`model-spend-${refreshKey}`"
        :params="filterParams"
      />
    </div>

    <div class="board-section">
      <ModelTrendChart
        :key="`model-trend-${refreshKey}`"
        :params="filterParams"
      />
    </div>

    <div class="board-section">
      <AbnormalChart :key="`abnormal-${refreshKey}`" :params="filterParams" />
    </div>

    <div class="board-section">
      <LatencyTrendChart
        :key="`latency-${refreshKey}`"
        :params="filterParams"
      />
    </div>

    <div class="board-section">
      <TopRanking :key="`top-${refreshKey}`" :params="filterParams" />
    </div>

    <div class="board-section">
      <DimensionAnalysis
        :key="`dimension-${refreshKey}`"
        :params="filterParams"
      />
    </div>

    <div class="board-section">
      <TaskStatusChart :key="`task-${refreshKey}`" :params="filterParams" />
    </div>

    <div v-if="userStore.role === 'admin'" class="board-section">
      <AgentStatusChart :key="`agent-${refreshKey}`" :params="filterParams" />
    </div>

    <div v-if="userStore.role === 'admin'" class="board-section">
      <KeyStatusChart :key="`key-${refreshKey}`" :params="filterParams" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
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
    key: '',
    provider: '',
    models: undefined as string[] | undefined,
  });

  const refreshKey = ref(0);

  const handleFilterChange = (params: any) => {
    Object.assign(filterParams, params);
    refreshKey.value += 1;
  };
</script>

<script lang="ts">
  export default { name: 'DataBoard' };
</script>

<style lang="less" scoped>
  @import './style/statistics-board-shared.less';
</style>
