<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title">{{
        $t('statistics.databoard.latencyTrend.title')
      }}</div>
      <DateShortcut :show-all="false" @change="handleDateChange" />
    </div>
    <Chart height="320px" :option="chartOption" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import dayjs from 'dayjs';
  import useChartOption from '@/hooks/chart-option';
  import {
    queryLatencyTrend,
    StatisticsLatencyTrendRes,
  } from '@/api/statistics';
  import Chart from '@/components/chart/index.vue';
  import DateShortcut from './date-shortcut.vue';

  const props = defineProps<{ params: any }>();
  const dateRange = ref({
    stat_start_time: dayjs().subtract(14, 'day').startOf('day').valueOf(),
    stat_end_time: dayjs().endOf('day').valueOf(),
  });

  const colors = [
    '#3469FF',
    '#EA8D24',
    '#F53F3F',
    '#23C343',
    '#A079DC',
    '#00B2FF',
    '#F8BB20',
    '#0FC6C2',
    '#FF7D00',
    '#7B61FF',
  ];

  const trendData = ref<StatisticsLatencyTrendRes>({
    models: [],
    dates: [],
    series: {},
  });

  const { chartOption } = useChartOption((isDark) => ({
    color: colors,
    grid: { left: 60, right: 20, top: 40, bottom: 36 },
    legend: {
      top: 0,
      right: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 3,
      textStyle: { color: isDark ? '#ccc' : '#4E5969', fontSize: 11 },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#333' : '#fff',
      borderColor: isDark ? '#555' : '#e5e5e5',
      textStyle: { color: isDark ? '#ddd' : '#333', fontSize: 12 },
      valueFormatter: (v: any) => `${Number(v).toLocaleString()}ms`,
    },
    xAxis: {
      type: 'category',
      data: trendData.value.dates,
      boundaryGap: false,
      axisLabel: { color: isDark ? '#aaa' : '#86909c', fontSize: 11 },
      axisLine: { lineStyle: { color: isDark ? '#444' : '#e5e8ef' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: isDark ? '#aaa' : '#86909c',
        fontSize: 11,
        formatter: (v: number) => {
          if (v >= 1000) return `${(v / 1000).toFixed(1)}s`;
          return `${v}ms`;
        },
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: isDark ? '#333' : '#f0f0f0',
        },
      },
    },
    series: trendData.value.models.map((m) => ({
      name: m,
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2 },
      data: trendData.value.series[m]?.avg_total_time || [],
      emphasis: { focus: 'series' },
    })),
  }));

  function handleDateChange(range: any) {
    dateRange.value = range;
    fetchData();
  }

  const fetchData = async () => {
    try {
      const { data } = await queryLatencyTrend({
        ...props.params,
        ...dateRange.value,
      });
      trendData.value = data;
    } catch {
      /* empty */
    }
  };

  watch(() => props.params, fetchData, { deep: true, immediate: true });
</script>

<script lang="ts">
  export default { name: 'LatencyTrendChart' };
</script>
