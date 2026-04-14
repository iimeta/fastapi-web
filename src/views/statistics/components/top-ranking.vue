<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title">{{ $t('statistics.databoard.top.title') }}</div>
      <a-space :size="12">
        <a-radio-group
          v-model:model-value="dataType"
          type="button"
          @change="fetchData"
        >
          <a-radio v-if="userStore.role !== 'user'" value="user">
            {{ $t('common.user') }}
          </a-radio>
          <a-radio value="app">{{ $t('common.app') }}</a-radio>
          <a-radio value="app_key">{{ $t('common.key') }}</a-radio>
          <a-radio value="model">{{ $t('common.model') }}</a-radio>
          <a-radio value="provider"> {{ $t('common.provider') }} </a-radio>
        </a-radio-group>
        <DateShortcut :show-all="false" @change="handleDateChange" />
      </a-space>
    </div>
    <Chart height="380px" :option="chartOption" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import dayjs from 'dayjs';
  import { useUserStore, useAppStore } from '@/store';
  import useChartOption from '@/hooks/chart-option';
  import { queryTop, StatisticsTopItem } from '@/api/statistics';
  import Chart from '@/components/chart/index.vue';
  import DateShortcut from './date-shortcut.vue';

  const props = defineProps<{ params: any }>();
  const { t } = useI18n();
  const userStore = useUserStore();
  const appStore = useAppStore();
  const cs = computed(() => appStore.getCurrencySymbol || '$');
  const dataType = ref(userStore.role === 'user' ? 'app' : 'user');
  const dateRange = ref({
    stat_start_time: dayjs().subtract(14, 'day').startOf('day').valueOf(),
    stat_end_time: dayjs().endOf('day').valueOf(),
  });

  function handleDateChange(range: any) {
    dateRange.value = range;
    fetchData();
  }

  const labels = ref<string[]>([]);
  const callsValues = ref<number[]>([]);
  const tokensValues = ref<number[]>([]);

  const { chartOption } = useChartOption((isDark) => ({
    grid: { left: 40, right: 40, top: 30, bottom: 60 },
    legend: {
      top: 0,
      right: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 3,
      textStyle: { color: isDark ? '#ccc' : '#4E5969', fontSize: 12 },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? '#333' : '#fff',
      borderColor: isDark ? '#555' : '#e5e5e5',
      textStyle: { color: isDark ? '#ddd' : '#333' },
    },
    xAxis: {
      type: 'category',
      data: labels.value,
      axisLabel: {
        color: isDark ? '#ccc' : '#4E5969',
        fontSize: 10,
        rotate: 35,
        width: 60,
        overflow: 'truncate',
      },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: isDark ? '#444' : '#e5e8ef' } },
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
        axisLabel: {
          color: isDark ? '#aaa' : '#86909c',
          fontSize: 11,
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: t('common.call'),
        type: 'bar',
        yAxisIndex: 0,
        data: callsValues.value,
        barMaxWidth: 18,
        itemStyle: {
          borderRadius: [3, 3, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#3469FF' },
              { offset: 1, color: '#6AA0FF' },
            ],
          },
        },
      },
      {
        name: t('common.spend'),
        type: 'bar',
        yAxisIndex: 1,
        data: tokensValues.value,
        barMaxWidth: 18,
        tooltip: {
          valueFormatter: (v: any) =>
            `${cs.value}\u2009${Number(v).toFixed(6)}`,
        },
        itemStyle: {
          borderRadius: [3, 3, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#EA8D24' },
              { offset: 1, color: '#F5C77E' },
            ],
          },
        },
      },
    ],
  }));

  function getLabel(item: StatisticsTopItem): string {
    switch (dataType.value) {
      case 'user':
        return `${item.user_id}`;
      case 'app':
        return `${item.app_id}`;
      case 'app_key': {
        if (!item.app_key) return '-';
        if (item.app_key.length > 5) return item.app_key.slice(-5);
        return item.app_key;
      }
      case 'model':
        return item.model || '-';
      case 'provider':
        return item.provider || '-';
      default:
        return '-';
    }
  }

  const fetchData = async () => {
    try {
      labels.value = [];
      callsValues.value = [];
      tokensValues.value = [];
      const { data } = await queryTop({
        ...props.params,
        ...dateRange.value,
        data_type: dataType.value,
        limit: 20,
      });
      (data.items || []).forEach((item) => {
        labels.value.push(getLabel(item));
        callsValues.value.push(item.call || 0);
        tokensValues.value.push(item.tokens || 0);
      });
    } catch {
      /* empty */
    }
  };

  watch(() => props.params, fetchData, { deep: true, immediate: true });
</script>

<script lang="ts">
  export default { name: 'TopRanking' };
</script>
