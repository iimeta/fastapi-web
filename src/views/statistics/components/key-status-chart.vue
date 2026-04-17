<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title">{{
        $t('statistics.databoard.keyStatus.title')
      }}</div>
      <DateShortcut :show-all="false" @change="handleDateChange" />
    </div>
    <a-grid :cols="24" :col-gap="12">
      <a-grid-item :span="10">
        <Chart height="280px" :option="pieOption" />
      </a-grid-item>
      <a-grid-item :span="14">
        <Chart height="280px" :option="barOption" />
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import dayjs from 'dayjs';
  import { useAppStore } from '@/store';
  import useChartOption from '@/hooks/chart-option';
  import { queryKeyStatus, StatisticsKeyStatusRes } from '@/api/statistics';
  import Chart from '@/components/chart/index.vue';
  import DateShortcut from './date-shortcut.vue';

  const props = defineProps<{ params: any }>();
  const { t } = useI18n();
  const appStore = useAppStore();
  const cs = computed(() => appStore.getCurrencySymbol || '$');

  const dateRange = ref({
    stat_start_time: dayjs().subtract(14, 'day').startOf('day').valueOf(),
    stat_end_time: dayjs().endOf('day').valueOf(),
  });

  function handleDateChange(range: any) {
    dateRange.value = range;
    fetchData();
  }

  const d = ref<StatisticsKeyStatusRes>({
    total: 0,
    active: 0,
    disabled: 0,
    auto_disabled: 0,
    by_key: [],
  });

  const { chartOption: pieOption } = useChartOption((isDark) => ({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: isDark ? '#333' : '#fff',
      textStyle: { color: isDark ? '#ddd' : '#333' },
    },
    legend: {
      bottom: 0,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: isDark ? '#ccc' : '#4E5969', fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '45%'],
        itemStyle: {
          borderRadius: 4,
          borderColor: isDark ? '#1d1d1d' : '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}\n{c}',
          fontSize: 11,
          color: isDark ? '#ccc' : '#4E5969',
        },
        data: [
          {
            name: t('dict.status.1'),
            value: d.value.active,
            itemStyle: { color: '#23C343' },
          },
          {
            name: t('dict.status.2'),
            value: d.value.disabled,
            itemStyle: { color: '#F53F3F' },
          },
          {
            name: t('statistics.databoard.keyStatus.autoDisabled'),
            value: d.value.auto_disabled,
            itemStyle: { color: '#F8BB20' },
          },
        ],
      },
    ],
  }));

  const statusColorMap: Record<number, string> = {
    1: '#23C343',
    2: '#F53F3F',
  };

  const { chartOption: barOption } = useChartOption((isDark) => ({
    grid: { left: 60, right: 20, top: 10, bottom: 20 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? '#333' : '#fff',
      textStyle: { color: isDark ? '#ddd' : '#333' },
      valueFormatter: (v: any) => `${cs.value}\u2009${Number(v).toFixed(6)}`,
    },
    xAxis: {
      type: 'category',
      data: d.value.by_key.map((k) => k.key),
      axisLabel: {
        color: isDark ? '#ccc' : '#4E5969',
        fontSize: 11,
      },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: isDark ? '#444' : '#e5e8ef' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: isDark ? '#aaa' : '#86909c', fontSize: 11 },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: isDark ? '#333' : '#f0f0f0',
        },
      },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 14,
        data: d.value.by_key.map((k) => ({
          value: k.used_quota,
          itemStyle: { color: statusColorMap[k.status] || '#86909C' },
        })),
      },
    ],
  }));

  const fetchData = async () => {
    try {
      const { data } = await queryKeyStatus({
        ...dateRange.value,
        app_key: props.params.app_key,
        key: props.params.key,
        models: props.params.models,
        provider: props.params.provider,
      });
      d.value = data;
    } catch {
      /* empty */
    }
  };

  watch(() => props.params, fetchData, { deep: true, immediate: true });
</script>

<script lang="ts">
  export default { name: 'KeyStatusChart' };
</script>
