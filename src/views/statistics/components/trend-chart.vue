<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title">{{
        $t('statistics.databoard.trend.title')
      }}</div>
      <DateShortcut :show-all="false" @change="handleDateChange" />
    </div>
    <Chart height="320px" :option="chartOption" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import dayjs from 'dayjs';
  import { useAppStore, useUserStore } from '@/store';
  import useChartOption from '@/hooks/chart-option';
  import { queryTrend, StatisticsTrendItem } from '@/api/statistics';
  import Chart from '@/components/chart/index.vue';
  import DateShortcut from './date-shortcut.vue';

  const props = defineProps<{ params: any }>();
  const { t } = useI18n();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const cs = computed(() => appStore.getCurrencySymbol || '$');
  const isResellerOrAdmin = computed(
    () => userStore.role === 'admin' || userStore.role === 'reseller'
  );

  const xAxis = ref<string[]>([]);
  const spendData = ref<number[]>([]);
  const callsData = ref<number[]>([]);
  const userData = ref<number[]>([]);
  const appData = ref<number[]>([]);
  const abnormalData = ref<number[]>([]);

  const { chartOption } = useChartOption((isDark) => ({
    grid: { left: 60, right: 60, top: 30, bottom: 36 },
    legend: {
      top: 0,
      right: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 3,
      textStyle: { color: isDark ? '#ddd' : '#4E5969', fontSize: 12 },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#333' : '#fff',
      borderColor: isDark ? '#555' : '#e5e5e5',
      textStyle: { color: isDark ? '#ddd' : '#333' },
      axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
    },
    xAxis: {
      type: 'category',
      data: xAxis.value,
      boundaryGap: false,
      axisLabel: { color: isDark ? '#aaa' : '#86909c', fontSize: 11 },
      axisLine: { lineStyle: { color: isDark ? '#444' : '#e5e8ef' } },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: isDark ? '#aaa' : '#86909c',
          fontSize: 11,
          formatter: (v: number) => {
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
      {
        type: 'value',
        axisLabel: { color: isDark ? '#aaa' : '#86909c', fontSize: 11 },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: t('common.total.spend'),
        data: spendData.value,
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: '#EA8D24' },
        itemStyle: { color: '#EA8D24' },
        tooltip: {
          valueFormatter: (v: any) =>
            `${cs.value}\u2009${Number(v).toFixed(6)}`,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(234,141,36,0.15)' },
              { offset: 1, color: 'rgba(234,141,36,0.01)' },
            ],
          },
        },
      },
      {
        name: t('common.call'),
        data: callsData.value,
        type: 'bar',
        yAxisIndex: 0,
        barMaxWidth: 16,
        itemStyle: { borderRadius: [3, 3, 0, 0], color: '#3469FF' },
      },
      {
        name: isResellerOrAdmin.value
          ? t('statistics.databoard.chart.activeUsers')
          : t('statistics.databoard.chart.activeApps'),
        data: isResellerOrAdmin.value ? userData.value : appData.value,
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: '#A079DC' },
        itemStyle: { color: '#A079DC' },
      },
      {
        name: t('common.abnormal'),
        data: abnormalData.value,
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, type: 'dashed', color: '#F8BB20' },
        itemStyle: { color: '#F8BB20' },
      },
    ],
  }));

  const dateRange = ref({
    stat_start_time: dayjs().subtract(14, 'day').startOf('day').valueOf(),
    stat_end_time: dayjs().endOf('day').valueOf(),
  });

  function handleDateChange(range: any) {
    dateRange.value = range;
    fetchData();
  }

  const fetchData = async () => {
    try {
      xAxis.value = [];
      spendData.value = [];
      callsData.value = [];
      userData.value = [];
      appData.value = [];
      abnormalData.value = [];
      const { data } = await queryTrend({
        ...props.params,
        ...dateRange.value,
      });
      data.items.forEach((el: StatisticsTrendItem) => {
        xAxis.value.push(el.date);
        spendData.value.push(el.tokens || 0);
        callsData.value.push(el.total || 0);
        userData.value.push(el.active_users || 0);
        appData.value.push(el.active_apps || 0);
        abnormalData.value.push(el.abnormal || 0);
      });
    } catch {
      /* empty */
    }
  };

  watch(() => props.params, fetchData, { deep: true, immediate: true });
</script>

<script lang="ts">
  export default { name: 'TrendChart' };
</script>
