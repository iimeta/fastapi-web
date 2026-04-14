<template>
  <div class="chart-card">
    <div class="chart-title">{{ title }}</div>
    <Chart height="240px" :option="chartOption" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import useChartOption from '@/hooks/chart-option';
  import Chart from '@/components/chart/index.vue';

  const props = defineProps<{
    title: string;
    metrics: string[];
    timeLabels: string[];
    seriesNames: string[];
    seriesMap: Record<string, number[]>;
  }>();

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
    '#E84855',
    '#86909C',
  ];

  const timeMetrics = [
    'avg_total_time',
    'avg_conn_time',
    'avg_duration',
    'avg_internal_time',
  ];
  const pctMetrics = ['success_rate'];

  const yAxisLabel = computed(() => {
    const m = props.metrics;
    if (m.length === 1) {
      if (timeMetrics.includes(m[0])) return 'ms';
      if (pctMetrics.includes(m[0])) return '%';
    }
    return '';
  });

  const { chartOption } = useChartOption((isDark) => ({
    color: colors,
    grid: { left: 50, right: 16, top: 30, bottom: 24 },
    legend: {
      top: 0,
      right: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 3,
      textStyle: { color: isDark ? '#ccc' : '#4E5969', fontSize: 10 },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#333' : '#fff',
      borderColor: isDark ? '#555' : '#e5e5e5',
      textStyle: { color: isDark ? '#ddd' : '#333', fontSize: 11 },
    },
    xAxis: {
      type: 'category',
      data: props.timeLabels,
      boundaryGap: false,
      axisLabel: { color: isDark ? '#aaa' : '#86909c', fontSize: 10 },
      axisLine: { lineStyle: { color: isDark ? '#444' : '#e5e8ef' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: isDark ? '#aaa' : '#86909c',
        fontSize: 10,
        formatter: (v: number) => {
          const unit = yAxisLabel.value;
          if (unit === '%') return `${v}%`;
          if (unit === 'ms') return `${v}ms`;
          if (v >= 1e6) return `${v / 1e6}M`;
          if (v >= 1e4) return `${v / 1e4}w`;
          if (v >= 1e3) return `${v / 1e3}k`;
          return `${v}`;
        },
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: isDark ? '#333' : '#f0f0f0',
        },
      },
    },
    series: props.seriesNames.map((name) => ({
      name,
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2 },
      data: props.seriesMap[name] || [],
      emphasis: { focus: 'series' },
    })),
  }));
</script>

<script lang="ts">
  export default { name: 'MonitorChart' };
</script>
