<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title">{{
        $t('statistics.databoard.taskStatus.title')
      }}</div>
      <DateShortcut :show-all="false" @change="handleDateChange" />
    </div>
    <a-grid :cols="24" :col-gap="12" :row-gap="0">
      <a-grid-item :span="8">
        <div class="task-sub-title">{{ $t('task.menu.video') }}</div>
        <Chart height="280px" :option="videoOption" />
      </a-grid-item>
      <a-grid-item :span="8">
        <div class="task-sub-title">{{ $t('task.menu.file') }}</div>
        <Chart height="280px" :option="fileOption" />
      </a-grid-item>
      <a-grid-item :span="8">
        <div class="task-sub-title">{{ $t('task.menu.batch') }}</div>
        <Chart height="280px" :option="batchOption" />
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import dayjs from 'dayjs';
  import useChartOption from '@/hooks/chart-option';
  import { queryTaskStatus, TaskStatusItem } from '@/api/statistics';
  import Chart from '@/components/chart/index.vue';
  import DateShortcut from './date-shortcut.vue';

  const props = defineProps<{ params: any }>();
  const { t } = useI18n();

  const dateRange = ref({
    stat_start_time: dayjs().subtract(14, 'day').startOf('day').valueOf(),
    stat_end_time: dayjs().endOf('day').valueOf(),
  });

  function handleDateChange(range: any) {
    dateRange.value = range;
    fetchData();
  }

  const statusColors: Record<string, string> = {
    completed: '#00B42A',
    processed: '#00B42A',
    finalizing: '#00B42A',
    uploaded: '#165DFF',
    in_progress: '#FF7D00',
    validating: '#165DFF',
    processing: '#165DFF',
    queued: '#165DFF',
    failed: '#F53F3F',
    error: '#F53F3F',
    cancelled: '#C9CDD4',
    cancelling: '#C9CDD4',
    expired: '#C9CDD4',
    deleted: '#86909C',
  };

  function statusLabel(status: string): string {
    const key = `task.dict.status.${status}`;
    const label = t(key);
    return label !== key ? label : status;
  }

  // 各任务类型的所有状态
  const batchStatuses = [
    'queued',
    'in_progress',
    'validating',
    'finalizing',
    'completed',
    'failed',
    'expired',
    'cancelling',
    'cancelled',
  ];
  const fileStatuses = [
    'uploaded',
    'processing',
    'processed',
    'error',
    'expired',
  ];
  const videoStatuses = [
    'queued',
    'in_progress',
    'completed',
    'failed',
    'expired',
  ];

  function buildPieData(items: TaskStatusItem[], allStatuses: string[]) {
    const countMap: Record<string, number> = {};
    items.forEach((i) => {
      countMap[i.status] = (countMap[i.status] || 0) + i.count;
    });
    return allStatuses.map((status) => ({
      name: statusLabel(status),
      value: countMap[status] || 0,
      itemStyle: { color: statusColors[status] || '#86909C' },
    }));
  }

  const batchData = ref<any[]>(buildPieData([], batchStatuses));
  const fileData = ref<any[]>(buildPieData([], fileStatuses));
  const videoData = ref<any[]>(buildPieData([], videoStatuses));

  function makePieOption(isDark: boolean, data: any[]) {
    return {
      tooltip: {
        trigger: 'item' as const,
        formatter: '{b}: {c} ({d}%)',
        backgroundColor: isDark ? '#333' : '#fff',
        textStyle: { color: isDark ? '#ddd' : '#333' },
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { color: isDark ? '#ccc' : '#4E5969', fontSize: 10 },
      },
      series: [
        {
          type: 'pie' as const,
          radius: ['40%', '65%'],
          center: ['50%', '45%'],
          itemStyle: {
            borderRadius: 4,
            borderColor: isDark ? '#1d1d1d' : '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c}',
            fontSize: 10,
            color: isDark ? '#ccc' : '#4E5969',
          },
          labelLine: {
            show: true,
            length: 8,
            length2: 6,
          },
          data,
        },
      ],
    };
  }

  const { chartOption: batchOption } = useChartOption((isDark) =>
    makePieOption(isDark, batchData.value)
  );
  const { chartOption: fileOption } = useChartOption((isDark) =>
    makePieOption(isDark, fileData.value)
  );
  const { chartOption: videoOption } = useChartOption((isDark) =>
    makePieOption(isDark, videoData.value)
  );

  const fetchData = async () => {
    try {
      const { data } = await queryTaskStatus({
        ...dateRange.value,
        rid: props.params.rid,
        user_id: props.params.user_id,
        app_id: props.params.app_id,
        app_key: props.params.app_key,
        key: props.params.key,
        models: props.params.models,
        provider: props.params.provider,
      });
      batchData.value = buildPieData(data.batch || [], batchStatuses);
      fileData.value = buildPieData(data.file || [], fileStatuses);
      videoData.value = buildPieData(data.video || [], videoStatuses);
    } catch {
      /* empty */
    }
  };

  watch(() => props.params, fetchData, { deep: true, immediate: true });
</script>

<script lang="ts">
  export default { name: 'TaskStatusChart' };
</script>

<style lang="less" scoped>
  .task-sub-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-1);
    text-align: center;
    margin-bottom: 4px;
  }
</style>
