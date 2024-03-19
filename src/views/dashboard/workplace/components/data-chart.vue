<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ padding: '20px 20px 8px 20px' }"
      :body-style="{
        padding: '20px',
      }"
      :title="$t('workplace.callData')"
      :bordered="false"
    >
      <template #extra>
        <a-radio-group
          v-model:model-value="dateRange"
          type="button"
          @change="handleDateRangeChange as any"
        >
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
      <Chart height="380px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { queryCallData, CallData } from '@/api/dashboard';
  import useChartOption from '@/hooks/chart-option';
  import { ToolTipFormatterParams } from '@/types/echarts';

  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map(
        (el) => `<div class="content-panel">
        <p>
          <span style="background-color: ${
            el.color
          }" class="tooltip-item-icon"></span>
          <span>${el.seriesName}</span>
        </p>
        <span class="tooltip-value">
        ${el.value.toLocaleString()}
        </span>
      </div>`
      )
      .join('');
  };

  const { loading, setLoading } = useLoading(true);
  const dateRange = ref(15);
  const xAxis = ref<string[]>([]);
  const countStatisticsData = ref<number[]>([]);
  const tokensStatisticsData = ref<number[]>([]);
  const userStatisticsData = ref<number[]>([]);
  const appStatisticsData = ref<number[]>([]);
  const { chartOption } = useChartOption((isDark) => {
    return {
      grid: {
        left: '38',
        right: '0',
        top: '10',
        bottom: '50',
      },
      legend: {
        bottom: -3,
        icon: 'circle',
        textStyle: {
          color: '#4E5969',
        },
      },
      xAxis: {
        type: 'category',
        offset: 2,
        data: xAxis.value,
        boundaryGap: false,
        axisLabel: {
          color: '#4E5969',
          formatter(value: number, idx: number) {
            if (idx === 0) return '';
            if (idx === xAxis.value.length - 1) return '';
            return `${value}`;
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          interval: (idx: number) => {
            if (idx === 0) return false;
            return idx !== xAxis.value.length - 1;
          },
          lineStyle: {
            color: isDark ? '#3F3F3F' : '#E5E8EF',
          },
        },
        axisPointer: {
          show: true,
          lineStyle: {
            color: '#23ADFF',
            width: 2,
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter(value: any, idx: number) {
            if (idx === 0) {
              return value;
            }

            if (value >= 10000) {
              return `${value / 10000}w`;
            }

            if (value >= 1000) {
              return `${value / 1000}k`;
            }

            return `${value}`;
          },
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: isDark ? '#3F3F3F' : '#E5E8EF',
          },
        },
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter(params) {
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
          </div>`;
        },
        className: 'echarts-tooltip-diy',
      },
      series: [
        {
          name: '调用数',
          data: countStatisticsData.value,
          type: 'line',
          smooth: true,
          showSymbol: false,
          color: isDark ? '#3D72F6' : '#246EFF',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E0E3FF',
            },
          },
        },
        {
          name: '令牌数',
          data: tokensStatisticsData.value,
          type: 'line',
          smooth: true,
          showSymbol: false,
          color: isDark ? '#A079DC' : '#00B2FF',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E2F2FF',
            },
          },
        },
        {
          name: '用户数',
          data: userStatisticsData.value,
          type: 'line',
          smooth: true,
          showSymbol: false,
          color: isDark ? '#A079DC' : '#00B2FF',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E2F2FF',
            },
          },
        },
        {
          name: '应用数',
          data: appStatisticsData.value,
          type: 'line',
          smooth: true,
          showSymbol: false,
          color: isDark ? '#A079DC' : '#00B2FF',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E2F2FF',
            },
          },
        },
      ],
    };
  });

  const fetchData = async (days: number) => {
    setLoading(true);
    try {
      xAxis.value = [];
      countStatisticsData.value = [];
      tokensStatisticsData.value = [];
      userStatisticsData.value = [];
      appStatisticsData.value = [];
      const { data: chartData } = await queryCallData(days);
      chartData.items.forEach((el: CallData) => {
        xAxis.value.push(el.date);
        countStatisticsData.value.unshift(el.count);
        tokensStatisticsData.value.unshift(el.tokens);
        userStatisticsData.value.unshift(el.user);
        appStatisticsData.value.unshift(el.app);
      });
    } catch (err) {
      // you can report use errorHandler or other
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

<style scoped lang="less"></style>
