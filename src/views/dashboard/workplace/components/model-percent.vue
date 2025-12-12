<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ padding: '15px 20px 8px 20px' }"
      :body-style="{
        padding: '20px',
      }"
      :bordered="false"
    >
      <template #title>
        {{ $t('workplace.modelPercent') }}
      </template>
      <template #extra>
        <a-radio-group
          v-model:model-value="dateRange"
          type="button"
          @change="handleDateRangeChange"
        >
          <a-radio :value="1">
            {{ $t('workplace.dateRange1') }}
          </a-radio>
          <a-radio :value="7">
            {{ $t('workplace.dateRange7') }}
          </a-radio>
          <a-radio :value="15">
            {{ $t('workplace.dateRange15') }}
          </a-radio>
          <a-radio :value="30">
            {{ $t('workplace.dateRange30') }}
          </a-radio>
        </a-radio-group>
      </template>
      <Chart height="496px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import { ModelPercentRes, queryModelPercent } from '@/api/dashboard';

  const { loading, setLoading } = useLoading(true);
  const dateRange = ref(15);

  const statisticsData = ref<ModelPercentRes>({
    models: [],
    items: [],
  });

  const { chartOption } = useChartOption((isDark) => {
    // echarts support https://echarts.apache.org/zh/theme-builder.html
    // It's not used here
    return {
      legend: {
        left: 'center',
        data: statisticsData.value.models,
        bottom: -5,
        icon: 'circle',
        itemStyle: {
          borderWidth: 0,
        },
        textStyle: {
          color: '#4E5969',
        },
      },
      tooltip: {
        show: true,
        trigger: 'item',
      },
      series: [
        {
          type: 'pie',
          radius: '60%',
          label: {
            formatter: '{d}%',
            fontSize: 14,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: '#D9F6FF',
          },
          data: statisticsData.value.items,
        },
      ],
    };
  });

  const fetchData = async (days: number) => {
    setLoading(true);
    try {
      const { data } = await queryModelPercent(days);
      statisticsData.value = data;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 切换日期范围
   *
   * @param days 日期数
   */
  const handleDateRangeChange = (days: number) => {
    fetchData(days);
  };

  fetchData(15);
</script>

<script lang="ts">
  export default {
    name: 'ModelPercent', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style scoped lang="less">
  .arco-card {
    position: relative;
    background: var(--color-bg-2);
    border-radius: 4px;
    transition: box-shadow 0.2s cubic-bezier(0, 0, 1, 1);
  }
</style>
