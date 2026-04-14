<template>
  <div class="overview-section">
    <div class="ov-header">
      <div class="ov-title">{{
        $t('statistics.databoard.overview.title')
      }}</div>
      <DateShortcut @change="handleDateChange" />
    </div>
    <div class="ov-row">
      <div class="ov-card ov-card--calls">
        <div class="ov-label">{{ $t('common.call') }}</div>
        <div class="ov-val ov-val--calls">{{ n(s.total) }}</div>
        <div
          v-if="callsChange !== null"
          class="ov-change"
          :class="callsChange >= 0 ? 'ov-change--up' : 'ov-change--down'"
        >
          <icon-arrow-rise v-if="callsChange >= 0" />
          <icon-arrow-fall v-else />
          {{ Math.abs(callsChange).toFixed(1) }}%
        </div>
      </div>
      <div class="ov-card ov-card--spend">
        <div class="ov-label">{{ $t('common.total.spend') }}</div>
        <div class="ov-val ov-val--spend">{{ dollar(s.tokens) }}</div>
        <div
          v-if="tokensChange !== null"
          class="ov-change"
          :class="tokensChange >= 0 ? 'ov-change--up' : 'ov-change--down'"
        >
          <icon-arrow-rise v-if="tokensChange >= 0" />
          <icon-arrow-fall v-else />
          {{ Math.abs(tokensChange).toFixed(1) }}%
        </div>
      </div>
      <div class="ov-card ov-card--abnormal">
        <div class="ov-label">
          {{ $t('common.abnormal') }}
        </div>
        <div class="ov-val ov-val--abnormal">{{ n(s.abnormal) }}</div>
        <div
          v-if="abnormalChange !== null"
          class="ov-change"
          :class="abnormalChange >= 0 ? 'ov-change--up' : 'ov-change--down'"
        >
          <icon-arrow-rise v-if="abnormalChange >= 0" />
          <icon-arrow-fall v-else />
          {{ Math.abs(abnormalChange).toFixed(1) }}%
        </div>
      </div>
      <div class="ov-card ov-card--abnormal-rate">
        <div class="ov-label">{{ $t('common.abnormal_rate') }}</div>
        <div class="ov-val ov-val--abnormal-rate">
          {{ pct(s.abnormal_rate) }}
        </div>
        <div
          v-if="abnormalRateChange !== null"
          class="ov-change"
          :class="abnormalRateChange >= 0 ? 'ov-change--up' : 'ov-change--down'"
        >
          <icon-arrow-rise v-if="abnormalRateChange >= 0" />
          <icon-arrow-fall v-else />
          {{ Math.abs(abnormalRateChange).toFixed(1) }}%
        </div>
      </div>
    </div>
    <div class="ov-row ov-row-sm">
      <div
        v-for="item in resourceItems"
        :key="item.key"
        class="ov-card-sm"
        :style="{ borderLeft: `3px solid ${item.color}` }"
      >
        <div class="ov-label-sm">{{ item.label }}</div>
        <div class="ov-val-sm" :style="{ color: item.color }">
          {{ n(item.value) }}
          <span v-if="item.incr && item.incr > 0" class="ov-incr">
            +{{ item.incr }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import dayjs from 'dayjs';
  import { useUserStore, useAppStore } from '@/store';
  import {
    queryOverview,
    StatisticsOverviewRes,
    querySummary,
    StatisticsSummaryRes,
  } from '@/api/statistics';
  import { fmtTokens } from '@/utils/common';
  import DateShortcut from './date-shortcut.vue';

  const props = defineProps<{ params: any }>();
  const { t } = useI18n();
  const userStore = useUserStore();
  const appStore = useAppStore();
  const currencySymbol = computed(() => appStore.getCurrencySymbol || '$');
  const isAdmin = computed(() => userStore.role === 'admin');
  const isResellerOrAdmin = computed(
    () => userStore.role === 'admin' || userStore.role === 'reseller'
  );

  const dateRange = ref({
    stat_start_time: dayjs().subtract(14, 'day').startOf('day').valueOf(),
    stat_end_time: dayjs().endOf('day').valueOf(),
  });

  const d = ref<StatisticsOverviewRes>({
    total_calls: 0,
    total_tokens: 0,
    total_abnormal: 0,
    abnormal_rate: 0,
    total_users: 0,
    total_apps: 0,
    total_app_keys: 0,
    total_models: 0,
    total_model_keys: 0,
    total_agents: 0,
    total_providers: 0,
    total_groups: 0,
    today_calls: 0,
    today_tokens: 0,
    today_abnormal: 0,
    today_users: 0,
    today_apps: 0,
    total_batch_tasks: 0,
    total_file_tasks: 0,
    total_video_tasks: 0,
  });

  const s = ref<StatisticsSummaryRes>({
    total: 0,
    tokens: 0,
    abnormal: 0,
    abnormal_rate: 0,
    active_users: 0,
    active_apps: 0,
    prev_total: 0,
    prev_tokens: 0,
    prev_abnormal: 0,
    prev_abnormal_rate: 0,
  });

  const n = (v: number) => (v || 0).toLocaleString();
  const dollar = (v: number) => `${currencySymbol.value}\u2009${fmtTokens(v)}`;
  const pct = (v: number) => `${(v || 0).toFixed(2)}%`;

  function calcChange(current: number, prev: number): number | null {
    if (!prev) return null;
    return ((current - prev) / prev) * 100;
  }

  const callsChange = computed(() =>
    calcChange(s.value.total, s.value.prev_total)
  );
  const tokensChange = computed(() =>
    calcChange(s.value.tokens, s.value.prev_tokens)
  );
  const abnormalChange = computed(() =>
    calcChange(s.value.abnormal, s.value.prev_abnormal)
  );
  const abnormalRateChange = computed(() =>
    calcChange(s.value.abnormal_rate, s.value.prev_abnormal_rate)
  );

  interface ResourceItem {
    key: string;
    label: string;
    value: number;
    color: string;
    incr?: number;
  }

  const resourceItems = computed<ResourceItem[]>(() => {
    const items: ResourceItem[] = [];
    if (isResellerOrAdmin.value) {
      items.push({
        key: 'users',
        label: t('common.user'),
        value: d.value.total_users,
        color: '#3469ff',
        incr: d.value.today_users,
      });
    }
    items.push({
      key: 'apps',
      label: t('common.app'),
      value: d.value.total_apps,
      color: '#0fc6c2',
      incr: isResellerOrAdmin.value ? d.value.today_apps : 0,
    });
    items.push({
      key: 'keys',
      label: t('common.key'),
      value: d.value.total_app_keys,
      color: '#d48806',
    });
    items.push({
      key: 'groups',
      label: t('common.group'),
      value: d.value.total_groups,
      color: '#faad14',
    });
    if (isAdmin.value) {
      items.push(
        {
          key: 'models',
          label: t('common.model'),
          value: d.value.total_models,
          color: '#7b61ff',
        },
        {
          key: 'modelKeys',
          label: t('statistics.databoard.overview.modelKeys'),
          value: d.value.total_model_keys,
          color: '#23c343',
        },
        {
          key: 'agents',
          label: t('common.model_agents'),
          value: d.value.total_agents,
          color: '#ff7d00',
        },
        {
          key: 'providers',
          label: t('common.provider'),
          value: d.value.total_providers,
          color: '#eb2f96',
        },
        {
          key: 'video',
          label: t('task.menu.video'),
          value: d.value.total_video_tasks,
          color: '#00b2ff',
        },
        {
          key: 'file',
          label: t('task.menu.file'),
          value: d.value.total_file_tasks,
          color: '#722ed1',
        },
        {
          key: 'batch',
          label: t('task.menu.batch'),
          value: d.value.total_batch_tasks,
          color: '#52c41a',
        }
      );
    }
    return items;
  });

  function handleDateChange(range: any) {
    dateRange.value = range;
    fetchData();
  }

  const fetchData = async () => {
    try {
      const mergedParams = {
        ...props.params,
        ...dateRange.value,
      };
      const [overviewRes, summaryRes] = await Promise.all([
        queryOverview(props.params),
        querySummary(mergedParams),
      ]);
      d.value = overviewRes.data;
      s.value = summaryRes.data;
    } catch {
      /* empty */
    }
  };

  watch(() => props.params, fetchData, { deep: true, immediate: true });
</script>

<script lang="ts">
  export default { name: 'OverviewCards' };
</script>

<style scoped lang="less">
  @import '../style/statistics-overview-shared.less';
</style>
