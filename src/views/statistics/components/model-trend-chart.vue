<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title">{{
        $t('statistics.databoard.modelTrend.title')
      }}</div>
      <a-space :size="12">
        <a-radio-group
          v-model:model-value="metric"
          type="button"
          @change="handleMetricChange"
        >
          <a-radio value="calls">{{ $t('common.call') }}</a-radio>
          <a-radio value="tokens">{{ $t('common.spend') }}</a-radio>
        </a-radio-group>
        <DateShortcut :show-all="false" @change="handleDateChange" />
      </a-space>
    </div>
    <Chart height="320px" :option="chartOption" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import dayjs from 'dayjs';
  import { useAppStore } from '@/store';
  import useChartOption from '@/hooks/chart-option';
  import { queryModelTrend, StatisticsModelTrendRes } from '@/api/statistics';
  import Chart from '@/components/chart/index.vue';
  import DateShortcut from './date-shortcut.vue';

  const props = defineProps<{ params: any }>();
  const appStore = useAppStore();
  const cs = computed(() => appStore.getCurrencySymbol || '$');
  const metric = ref<'calls' | 'tokens'>('calls');
  const dateRange = ref({
    stat_start_time: dayjs().subtract(14, 'day').startOf('day').valueOf(),
    stat_end_time: dayjs().endOf('day').valueOf(),
  });

  function handleDateChange(range: any) {
    dateRange.value = range;
    fetchData();
  }

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

  const trendData = ref<StatisticsModelTrendRes>({
    models: [],
    dates: [],
    series: {},
  });

  function getSeriesData(model: string) {
    const s = trendData.value.series[model];
    if (!s) return [];
    return metric.value === 'tokens' ? s.tokens : s.calls;
  }

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
      valueFormatter: (v: any) =>
        metric.value === 'tokens'
          ? `${cs.value}\u2009${Number(v).toFixed(6)}`
          : Number(v).toLocaleString(),
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
          if (metric.value === 'tokens') return `${v}`;
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
    series: trendData.value.models.map((m) => ({
      name: m,
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2 },
      data: getSeriesData(m),
      emphasis: { focus: 'series' },
    })),
  }));

  function handleMetricChange() {
    // chartOption is computed, will auto-update
  }

  const fetchData = async () => {
    try {
      const { data } = await queryModelTrend({
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
  export default { name: 'ModelTrendChart' };
</script>
