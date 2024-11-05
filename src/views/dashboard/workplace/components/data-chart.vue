<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ padding: '15px 20px 8px 20px' }"
      :body-style="{
        padding: '10px 20px',
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
      <Chart height="372px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { queryCallData, CallData } from '@/api/dashboard';
  import useChartOption from '@/hooks/chart-option';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import { AnyObject } from '@/types/global';

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

  function graphicFactory(side: AnyObject) {
    return {
      type: 'text',
      bottom: '28',
      ...side,
      style: {
        text: '',
        textAlign: 'center',
        fill: '#4E5969',
        fontSize: 12,
      },
    };
  }

  const userRole = localStorage.getItem('userRole');

  const { loading, setLoading } = useLoading(true);
  const dateRange = ref(15);
  const xAxis = ref<string[]>([]);
  const countStatisticsData = ref<number[]>([]);
  const spendStatisticsData = ref<number[]>([]);
  const tokensStatisticsData = ref<number[]>([]);
  const userStatisticsData = ref<number[]>([]);
  const appStatisticsData = ref<number[]>([]);
  const abnormalStatisticsData = ref<number[]>([]);
  const graphicElements = ref([
    graphicFactory({ left: '52' }),
    graphicFactory({ right: 8 }),
  ]);

  const { chartOption } = useChartOption((isDark) => {
    return {
      grid: {
        left: '52',
        right: '8',
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
            if (idx === 0 || idx === 28) return '';
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

            if (value >= 1000000000) {
              return `${value / 1000000000}b`;
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
      graphic: {
        elements: graphicElements.value,
      },
      series: [
        {
          name: '花费($)',
          data: spendStatisticsData.value,
          type: 'line',
          smooth: true,
          showSymbol: false,
          color: isDark ? '#EA8D24' : '#EA8D24',
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
          name: '调用数',
          data: countStatisticsData.value,
          type: 'line',
          smooth: true,
          showSymbol: false,
          color: isDark ? '#3D72F6' : '#00B2FF',
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
        // {
        //   name: '令牌数',
        //   data: tokensStatisticsData.value,
        //   type: 'line',
        //   smooth: true,
        //   showSymbol: false,
        //   color: isDark ? '#A079DC' : '#246EFF',
        //   symbol: 'circle',
        //   symbolSize: 10,
        //   emphasis: {
        //     focus: 'series',
        //     itemStyle: {
        //       borderWidth: 2,
        //       borderColor: '#E2F2FF',
        //     },
        //   },
        // },
        {
          name: userRole === 'admin' ? '用户数' : '应用数',
          data:
            userRole === 'admin'
              ? userStatisticsData.value
              : appStatisticsData.value,
          type: 'line',
          smooth: true,
          showSymbol: false,
          color: isDark ? '#A079DC' : '#A079DC',
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
          name: '异常数',
          data: abnormalStatisticsData.value,
          type: 'line',
          smooth: true,
          showSymbol: false,
          color: isDark ? '#F8BB20' : '#F8BB20',
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
      spendStatisticsData.value = [];
      tokensStatisticsData.value = [];
      userStatisticsData.value = [];
      appStatisticsData.value = [];
      abnormalStatisticsData.value = [];
      const { data: chartData } = await queryCallData(days);
      chartData.items.forEach((el: CallData, idx: number) => {
        xAxis.value.push(el.date);
        countStatisticsData.value.push(el.call);
        spendStatisticsData.value.push(el.spend);
        tokensStatisticsData.value.push(el.tokens);
        userStatisticsData.value.push(el.user);
        appStatisticsData.value.push(el.app);
        abnormalStatisticsData.value.push(el.abnormal);
        if (idx === 0) {
          graphicElements.value[0].style.text = el.date;
        }
        if (idx === chartData.items.length - 1) {
          graphicElements.value[1].style.text = el.date;
        }
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
