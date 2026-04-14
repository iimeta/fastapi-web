<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title">{{
        $t('statistics.databoard.modelPercent.title')
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
    queryModelPercent,
    StatisticsModelPercentItem,
  } from '@/api/statistics';
  import Chart from '@/components/chart/index.vue';
  import DateShortcut from './date-shortcut.vue';

  const props = defineProps<{ params: any }>();
  const barData = ref<StatisticsModelPercentItem[]>([]);
  const dateRange = ref({
    stat_start_time: dayjs().subtract(14, 'day').startOf('day').valueOf(),
    stat_end_time: dayjs().endOf('day').valueOf(),
  });

  const colors = [
    '#3469FF',
    '#00B2FF',
    '#EA8D24',
    '#F8BB20',
    '#A079DC',
    '#23C343',
    '#F53F3F',
    '#0FC6C2',
    '#FF7D00',
    '#7B61FF',
  ];

  const { chartOption } = useChartOption((isDark) => {
    const items = [...barData.value].sort((a, b) => a.value - b.value);
    const total = items.reduce((s, i) => s + i.value, 0);

    return {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter(params: any) {
          const p = params[0];
          const pct = total > 0 ? ((p.value / total) * 100).toFixed(1) : '0';
          return `${p.name}: ${p.value} (${pct}%)`;
        },
      },
      grid: {
        left: 16,
        right: 60,
        top: 8,
        bottom: 8,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: { color: isDark ? '#ccc' : '#86909C' },
        splitLine: {
          lineStyle: { color: isDark ? '#333' : '#E5E8EF' },
        },
      },
      yAxis: {
        type: 'category',
        data: items.map((i) => i.name),
        axisLabel: {
          color: isDark ? '#ccc' : '#4E5969',
          fontSize: 12,
          width: 120,
          overflow: 'truncate',
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: items.map((item, idx) => ({
            value: item.value,
            itemStyle: { color: colors[idx % colors.length] },
          })),
          barMaxWidth: 24,
          label: {
            show: true,
            position: 'right',
            formatter(p: any) {
              const pct =
                total > 0 ? ((p.value / total) * 100).toFixed(1) : '0';
              return `${p.value} (${pct}%)`;
            },
            fontSize: 11,
            color: isDark ? '#ccc' : '#4E5969',
          },
        },
      ],
    };
  });

  function handleDateChange(range: any) {
    dateRange.value = range;
    fetchData();
  }

  const fetchData = async () => {
    try {
      const { data } = await queryModelPercent({
        ...props.params,
        ...dateRange.value,
      });
      barData.value = data.items || [];
    } catch {
      /* empty */
    }
  };

  watch(() => props.params, fetchData, { deep: true, immediate: true });
</script>

<script lang="ts">
  export default { name: 'ModelPieChart' };
</script>
