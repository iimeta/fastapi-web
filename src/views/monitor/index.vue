<template>
  <div class="monitor-page">
    <!-- 控制栏 -->
    <div class="monitor-control">
      <a-space :size="12" wrap>
        <a-radio-group
          v-model:model-value="mode"
          type="button"
          size="small"
          @change="handleModeChange"
        >
          <a-radio value="realtime">
            <icon-thunderbolt />
            {{ $t('monitor.mode.realtime') }}
          </a-radio>
          <a-radio value="history">
            <icon-history />
            {{ $t('monitor.mode.history') }}
          </a-radio>
        </a-radio-group>
        <a-divider direction="vertical" />
        <!-- 实时模式: 刷新间隔 + 暂停 -->
        <template v-if="mode === 'realtime'">
          <a-radio-group
            v-model:model-value="interval"
            type="button"
            size="small"
            @change="handleIntervalChange"
          >
            <a-radio :value="3">3s</a-radio>
            <a-radio :value="5">5s</a-radio>
            <a-radio :value="10">10s</a-radio>
            <a-radio :value="20">20s</a-radio>
            <a-radio :value="30">30s</a-radio>
            <a-radio :value="60">60s</a-radio>
          </a-radio-group>
          <a-button
            size="small"
            :type="paused ? 'primary' : 'outline'"
            @click="togglePause"
          >
            <template #icon>
              <icon-play-arrow v-if="paused" />
              <icon-pause v-else />
            </template>
            {{ paused ? $t('monitor.resume') : $t('monitor.pause') }}
          </a-button>
          <a-tag :color="paused ? 'orangered' : 'green'" size="small">
            {{
              paused
                ? $t('monitor.status.paused')
                : $t('monitor.status.running')
            }}
          </a-tag>
        </template>
        <!-- 历史模式: 时间范围 -->
        <template v-else>
          <a-radio-group
            v-model:model-value="historyRange"
            type="button"
            size="small"
            @change="fetchHistory"
          >
            <a-radio value="1h">1h</a-radio>
            <a-radio value="3h">3h</a-radio>
            <a-radio value="6h">6h</a-radio>
            <a-radio value="12h">12h</a-radio>
            <a-radio value="1d">1d</a-radio>
            <a-radio value="2d">2d</a-radio>
            <a-radio value="3d">3d</a-radio>
          </a-radio-group>
          <a-button size="small" type="outline" @click="fetchHistory">
            <template #icon><icon-refresh /></template>
          </a-button>
          <a-spin v-if="historyLoading" :size="16" />
        </template>
        <a-divider direction="vertical" />
        <a-select
          v-model="metrics"
          size="small"
          class="monitor-select"
          multiple
          :max-tag-count="4"
          :placeholder="$t('monitor.metrics.placeholder')"
          @change="handleMetricsChange"
        >
          <AOptionGroup :label="$t('monitor.metrics.group.throughput')">
            <a-option value="rps">RPS</a-option>
            <a-option value="tps">TPS</a-option>
            <a-option value="rpm">RPM</a-option>
            <a-option value="tpm">TPM</a-option>
          </AOptionGroup>
          <AOptionGroup :label="$t('monitor.metrics.group.latency')">
            <a-option value="avg_total_time">{{
              $t('monitor.metrics.avgTotalTime')
            }}</a-option>
            <a-option value="avg_conn_time">{{
              $t('monitor.metrics.avgConnTime')
            }}</a-option>
            <a-option value="avg_duration">{{
              $t('monitor.metrics.avgDuration')
            }}</a-option>
            <a-option value="avg_internal_time">{{
              $t('monitor.metrics.avgInternalTime')
            }}</a-option>
          </AOptionGroup>
          <AOptionGroup :label="$t('monitor.metrics.group.quality')">
            <a-option value="success_rate">{{
              $t('monitor.metrics.successRate')
            }}</a-option>
            <a-option value="error_count">{{
              $t('monitor.metrics.errorCount')
            }}</a-option>
          </AOptionGroup>
          <AOptionGroup label="Token">
            <a-option value="input_tokens">{{
              $t('monitor.metrics.inputTokens')
            }}</a-option>
            <a-option value="output_tokens">{{
              $t('monitor.metrics.outputTokens')
            }}</a-option>
            <a-option value="avg_tokens_per_req">{{
              $t('monitor.metrics.avgTokensPerReq')
            }}</a-option>
          </AOptionGroup>
        </a-select>
        <a-divider direction="vertical" />
        <a-radio-group
          v-model:model-value="layoutMode"
          type="button"
          size="small"
        >
          <a-radio value="auto">
            <icon-robot /> {{ $t('monitor.layout.auto') }}
          </a-radio>
          <a-radio value="single">
            <icon-menu-unfold /> {{ $t('monitor.layout.single') }}
          </a-radio>
          <a-radio value="double">
            <icon-apps /> {{ $t('monitor.layout.double') }}
          </a-radio>
        </a-radio-group>
      </a-space>
    </div>

    <!-- 全局实时指标 (仅实时模式) -->
    <div v-if="mode === 'realtime'" class="monitor-section">
      <div class="monitor-global">
        <div class="global-item global-item--rps">
          <div class="global-val global-val--rps">
            {{ globalPerf.rps }}
          </div>
          <div class="global-label">RPS</div>
        </div>
        <div class="global-item global-item--tps">
          <div class="global-val global-val--tps">
            {{ globalPerf.tps }}
          </div>
          <div class="global-label">TPS</div>
        </div>
        <div class="global-item global-item--rpm">
          <div class="global-val global-val--rpm">
            {{ globalPerf.rpm }}
          </div>
          <div class="global-label">RPM</div>
        </div>
        <div class="global-item global-item--tpm">
          <div class="global-val global-val--tpm">
            {{ globalPerf.tpm }}
          </div>
          <div class="global-label">TPM</div>
        </div>
        <div v-if="isAdmin" class="global-item global-item--active-video">
          <div class="global-val global-val--active-video">
            {{ globalPerf.active_video }}
          </div>
          <div class="global-label">{{ $t('monitor.activeVideo') }}</div>
        </div>
        <div v-if="isAdmin" class="global-item global-item--queued-video">
          <div class="global-val global-val--queued-video">
            {{ globalPerf.queued_video }}
          </div>
          <div class="global-label">{{ $t('monitor.queuedVideo') }}</div>
        </div>
        <div v-if="isAdmin" class="global-item global-item--active-batch">
          <div class="global-val global-val--active-batch">
            {{ globalPerf.active_batch }}
          </div>
          <div class="global-label">{{ $t('monitor.activeBatch') }}</div>
        </div>
        <div v-if="isAdmin" class="global-item global-item--queued-batch">
          <div class="global-val global-val--queued-batch">
            {{ globalPerf.queued_batch }}
          </div>
          <div class="global-label">{{ $t('monitor.queuedBatch') }}</div>
        </div>
      </div>
    </div>

    <!-- 按维度分组, 每个维度内按指标展开子图 -->
    <div
      v-for="dim in dimensionList"
      :key="dim.dimension"
      class="monitor-section"
    >
      <div class="dim-title">{{ dim.title }}</div>
      <a-grid :cols="24" :col-gap="12" :row-gap="12">
        <a-grid-item
          v-for="m in metrics"
          :key="`${dim.dimension}_${m}`"
          :span="chartSpan"
        >
          <MonitorChart
            :title="metricLabel(m)"
            :metrics="[m]"
            :time-labels="getPanelTimeLabels(dim.dimension, m)"
            :series-names="getPanelSeriesNames(dim.dimension, m)"
            :series-map="getPanelSeriesMap(dim.dimension, m)"
          />
        </a-grid-item>
      </a-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    reactive,
    computed,
    watch,
    onMounted,
    onBeforeUnmount,
  } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import { Optgroup as AOptionGroup } from '@arco-design/web-vue/es/select';
  import {
    queryPerfBreakdown,
    PerfBreakdownItem,
    queryPerfHistory,
    queryMonitorGlobal,
  } from '@/api/monitor';
  import { queryTaskStatus } from '@/api/statistics';
  import MonitorChart from './components/monitor-chart.vue';

  const MAX_POINTS = 24;
  const { t } = useI18n();
  const userStore = useUserStore();
  const isAdmin = computed(() => userStore.role === 'admin');

  const STORAGE_KEY_METRICS = 'monitor_metrics';
  const STORAGE_KEY_INTERVAL = 'monitor_interval';
  const STORAGE_KEY_LAYOUT = 'monitor_layout';

  const defaultMetrics = ['rps', 'tps', 'rpm', 'tpm'];

  function loadMetrics(): string[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_METRICS);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      }
    } catch {
      /* empty */
    }
    return defaultMetrics;
  }

  const mode = ref<'realtime' | 'history'>('realtime');
  const historyRange = ref('1h');
  const historyLoading = ref(false);

  const interval = ref(
    Number(localStorage.getItem(STORAGE_KEY_INTERVAL)) || 10
  );
  const metrics = ref<string[]>(loadMetrics());
  const paused = ref(false);
  const layoutMode = ref<'auto' | 'single' | 'double'>(
    (localStorage.getItem(STORAGE_KEY_LAYOUT) as any) || 'auto'
  );
  const screenWidth = ref(window.innerWidth);

  const chartSpan = computed(() => {
    if (layoutMode.value === 'single') return 24;
    if (layoutMode.value === 'double') return 12;
    if (screenWidth.value < 1440) return 24;
    return metrics.value.length === 1 ? 24 : 12;
  });

  const metricLabelKeys: Record<string, string> = {
    rps: 'common.rps',
    tps: 'common.tps',
    rpm: 'common.rpm',
    tpm: 'common.tpm',
    avg_total_time: 'monitor.metrics.avgTotalTime',
    avg_conn_time: 'monitor.metrics.avgConnTime',
    avg_duration: 'monitor.metrics.avgDuration',
    avg_internal_time: 'monitor.metrics.avgInternalTime',
    success_rate: 'monitor.metrics.successRate',
    error_count: 'monitor.metrics.errorCount',
    input_tokens: 'monitor.metrics.inputTokens',
    output_tokens: 'monitor.metrics.outputTokens',
    avg_tokens_per_req: 'monitor.metrics.avgTokensPerReq',
  };

  function metricLabel(m: string) {
    const key = metricLabelKeys[m];
    return key ? t(key) : m;
  }

  const globalPerf = reactive({
    rps: 0,
    tps: 0,
    rpm: 0,
    tpm: 0,
    active_batch: 0,
    active_video: 0,
    queued_video: 0,
    queued_batch: 0,
  });

  // panelDataMap: dimension -> metric -> { timeLabels, seriesNames, seriesMap }
  interface SubPanelData {
    timeLabels: string[];
    seriesNames: string[];
    seriesMap: Record<string, number[]>;
  }

  const panelDataMap = ref<Record<string, Record<string, SubPanelData>>>({});

  const dimensionList = computed(() => {
    const base = [
      { dimension: 'model', title: t('monitor.model') },
      { dimension: 'user', title: t('monitor.user') },
      { dimension: 'app', title: t('monitor.app') },
      { dimension: 'app_key', title: t('monitor.appKey') },
      { dimension: 'group', title: t('monitor.group') },
    ];
    if (isAdmin.value) {
      base.push(
        { dimension: 'model_agent', title: t('monitor.modelAgent') },
        { dimension: 'provider', title: t('monitor.provider') },
        { dimension: 'key', title: t('monitor.key') }
      );
    }
    return base;
  });

  function initPanels() {
    const map: Record<string, Record<string, SubPanelData>> = {};
    dimensionList.value.forEach((dim) => {
      map[dim.dimension] = {};
      metrics.value.forEach((m) => {
        map[dim.dimension][m] = {
          timeLabels: [],
          seriesNames: [],
          seriesMap: {},
        };
      });
    });
    panelDataMap.value = map;
  }

  function getPanelTimeLabels(dim: string, m: string): string[] {
    return panelDataMap.value[dim]?.[m]?.timeLabels || [];
  }

  function getPanelSeriesNames(dim: string, m: string): string[] {
    return panelDataMap.value[dim]?.[m]?.seriesNames || [];
  }

  function getPanelSeriesMap(dim: string, m: string): Record<string, number[]> {
    return panelDataMap.value[dim]?.[m]?.seriesMap || {};
  }

  function nowLabel() {
    const d = new Date();
    return `${String(d.getMinutes()).padStart(2, '0')}:${String(
      d.getSeconds()
    ).padStart(2, '0')}`;
  }

  const keyDimensions = new Set(['key', 'app_key']);

  function shortName(dim: string, name: string): string {
    if (keyDimensions.has(dim) && name.length > 5) {
      return name.slice(-5);
    }
    return name;
  }

  function pushData(dim: string, items: PerfBreakdownItem[]) {
    const dimMap = panelDataMap.value[dim];
    if (!dimMap) return;

    const label = nowLabel();

    metrics.value.forEach((m) => {
      const panel = dimMap[m];
      if (!panel) return;

      panel.timeLabels.push(label);
      if (panel.timeLabels.length > MAX_POINTS) {
        panel.timeLabels.shift();
      }

      const currentNames = new Set<string>();
      items.forEach((item) => {
        const name = shortName(dim, item.name || '-');
        currentNames.add(name);
        if (!panel.seriesMap[name]) {
          panel.seriesMap[name] = new Array(panel.timeLabels.length - 1).fill(
            0
          );
          panel.seriesNames.push(name);
        }
        const val = (item as any)[m] || 0;
        panel.seriesMap[name].push(Number(val));
      });

      panel.seriesNames.forEach((name) => {
        if (!currentNames.has(name)) {
          panel.seriesMap[name].push(0);
        }
        if (panel.seriesMap[name].length > MAX_POINTS) {
          panel.seriesMap[name].shift();
        }
      });
    });
  }

  // ---- 实时模式 ----

  async function fetchGlobal() {
    try {
      const { data } = await queryMonitorGlobal();
      globalPerf.rps = data.rps || 0;
      globalPerf.tps = data.tps || 0;
      globalPerf.rpm = data.rpm || 0;
      globalPerf.tpm = data.tpm || 0;
    } catch {
      /* empty */
    }
    if (isAdmin.value) {
      try {
        const { data } = await queryTaskStatus();
        globalPerf.active_batch = data.active_batch || 0;
        globalPerf.active_video = data.active_video || 0;
        globalPerf.queued_video = data.queued_video || 0;
        globalPerf.queued_batch = data.queued_batch || 0;
      } catch {
        /* empty */
      }
    }
  }

  async function fetchAllRealtime() {
    if (paused.value || mode.value !== 'realtime') return;
    fetchGlobal();
    const promises = dimensionList.value.map(async (dim) => {
      try {
        const { data } = await queryPerfBreakdown({
          dimension: dim.dimension,
          limit: 10,
          window: interval.value,
        });
        pushData(dim.dimension, data.items || []);
      } catch {
        /* empty */
      }
    });
    await Promise.all(promises);
  }

  let timer: ReturnType<typeof setInterval> | undefined;

  function startTimer() {
    clearInterval(timer);
    if (mode.value === 'realtime') {
      timer = setInterval(fetchAllRealtime, interval.value * 1000);
    }
  }

  function stopTimer() {
    clearInterval(timer);
    timer = undefined;
  }

  // ---- 历史模式 ----

  async function fetchHistory() {
    historyLoading.value = true;
    initPanels();

    const promises = dimensionList.value.map(async (dim) => {
      const metricPromises = metrics.value.map(async (m) => {
        try {
          const { data } = await queryPerfHistory({
            dimension: dim.dimension,
            range: historyRange.value,
            metric: m,
            limit: 10,
          });
          const panel = panelDataMap.value[dim.dimension]?.[m];
          if (panel && data) {
            panel.timeLabels = data.dates || [];
            const rawSeries = data.series || {};
            const mappedSeries: Record<string, number[]> = {};
            const names: string[] = [];
            Object.keys(rawSeries).forEach((key) => {
              const sn = shortName(dim.dimension, key);
              mappedSeries[sn] = rawSeries[key];
              names.push(sn);
            });
            panel.seriesNames = names;
            panel.seriesMap = mappedSeries;
          }
        } catch {
          /* empty */
        }
      });
      await Promise.all(metricPromises);
    });
    await Promise.all(promises);
    historyLoading.value = false;
  }

  // ---- 通用控制 ----

  function handleModeChange() {
    initPanels();
    if (mode.value === 'realtime') {
      fetchAllRealtime();
      startTimer();
    } else {
      stopTimer();
      fetchHistory();
    }
  }

  function handleIntervalChange() {
    localStorage.setItem(STORAGE_KEY_INTERVAL, String(interval.value));
    initPanels();
    startTimer();
    fetchAllRealtime();
  }

  function handleMetricsChange() {
    localStorage.setItem(STORAGE_KEY_METRICS, JSON.stringify(metrics.value));
    initPanels();
    if (mode.value === 'realtime') {
      fetchAllRealtime();
    } else {
      fetchHistory();
    }
  }

  watch(layoutMode, (v) => {
    localStorage.setItem(STORAGE_KEY_LAYOUT, v);
  });

  function togglePause() {
    paused.value = !paused.value;
  }

  function handleVisibility() {
    if (mode.value !== 'realtime') return;
    if (document.visibilityState === 'hidden') {
      stopTimer();
    } else if (!paused.value) {
      startTimer();
    }
  }

  function handleResize() {
    screenWidth.value = window.innerWidth;
  }

  onMounted(() => {
    initPanels();
    fetchAllRealtime();
    startTimer();
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('resize', handleResize);
  });

  onBeforeUnmount(() => {
    stopTimer();
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('resize', handleResize);
  });
</script>

<script lang="ts">
  export default { name: 'MonitorCenter' };
</script>

<style lang="less" scoped>
  @import './style/monitor-page-shared.less';
</style>
