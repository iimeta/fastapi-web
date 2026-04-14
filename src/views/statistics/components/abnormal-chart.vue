<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title">{{
        $t('statistics.databoard.abnormal.title')
      }}</div>
      <DateShortcut :show-all="false" @change="handleDateChange" />
    </div>
    <Chart height="320px" :option="chartOption" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import dayjs from 'dayjs';
  import useChartOption from '@/hooks/chart-option';
  import {
    queryTrend,
    StatisticsTrendItem,
    queryModelTrend,
    StatisticsModelTrendRes,
  } from '@/api/statistics';
  import Chart from '@/components/chart/index.vue';
  import DateShortcut from './date-shortcut.vue';

  const props = defineProps<{ params: any }>();
  const { t } = useI18n();
  const dateRange = ref({
    stat_start_time: dayjs().subtract(14, 'day').startOf('day').valueOf(),
    stat_end_time: dayjs().endOf('day').valueOf(),
  });

  const colors = [
    '#F53F3F',
    '#FF7D00',
    '#F7BA1E',
    '#FADC19',
    '#9FDB1D',
    '#00B42A',
    '#14C9C9',
    '#3491FA',
    '#722ED1',
    '#F759AB',
  ];

  const xAxis = ref<string[]>([]);
  const rateData = ref<number[]>([]);
  const modelNames = ref<string[]>([]);
  const modelAbnormalMap = ref<Record<string, number[]>>({});

  const { chartOption } = useChartOption((isDark) => {
    const barSeries = modelNames.value.map((name, idx) => ({
      name,
      data: modelAbnormalMap.value[name] || [],
      type: 'bar' as const,
      stack: 'abnormal',
      yAxisIndex: 0,
      barMaxWidth: 16,
      itemStyle: {
        color: colors[idx % colors.length],
      },
    }));

    return {
      grid: { left: 50, right: 50, top: 30, bottom: 36 },
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
        backgroundColor: isDark ? '#333' : '#fff',
        borderColor: isDark ? '#555' : '#e5e5e5',
        textStyle: { color: isDark ? '#ddd' : '#333' },
      },
      xAxis: {
        type: 'category',
        data: xAxis.value,
        boundaryGap: true,
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
            formatter: '{value}%',
          },
          splitLine: { show: false },
        },
      ],
      series: [
        ...barSeries,
        {
          name: t('common.abnormal_rate'),
          data: rateData.value,
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: '#14C9C9' },
          itemStyle: { color: '#14C9C9' },
          tooltip: {
            valueFormatter: (v: any) => `${Number(v).toFixed(2)}%`,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(20,201,201,0.25)' },
                { offset: 1, color: 'rgba(20,201,201,0.01)' },
              ],
            },
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
      xAxis.value = [];
      rateData.value = [];
      modelNames.value = [];
      modelAbnormalMap.value = {};

      const mergedParams = { ...props.params, ...dateRange.value };

      const [trendRes, modelRes] = await Promise.all([
        queryTrend(mergedParams),
        queryModelTrend(mergedParams),
      ]);

      // 异常率曲线
      trendRes.data.items.forEach((el: StatisticsTrendItem) => {
        xAxis.value.push(el.date);
        rateData.value.push(el.abnormal_rate || 0);
      });

      // 按模型堆叠异常数
      const mData = modelRes.data as StatisticsModelTrendRes;
      if (mData.models && mData.series) {
        // 按总异常数降序排列模型
        const ranked = mData.models
          .map((m) => ({
            name: m,
            total: (mData.series[m]?.abnormal || []).reduce(
              (s: number, v: number) => s + v,
              0
            ),
          }))
          .filter((m) => m.total > 0)
          .sort((a, b) => b.total - a.total);

        modelNames.value = ranked.map((m) => m.name);
        ranked.forEach((m) => {
          modelAbnormalMap.value[m.name] = mData.series[m.name]?.abnormal || [];
        });
      }
    } catch {
      /* empty */
    }
  };

  watch(() => props.params, fetchData, { deep: true, immediate: true });
</script>

<script lang="ts">
  export default { name: 'AbnormalChart' };
</script>
