<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title">{{
        $t('statistics.databoard.analysis.title')
      }}</div>
      <a-space :size="12">
        <a-radio-group
          v-model:model-value="dimension"
          type="button"
          @change="handleDimensionChange"
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

    <div class="analysis-body">
      <!-- 左侧排行列表 -->
      <div class="analysis-left">
        <a-spin :loading="leftLoading" style="width: 100%">
          <div
            v-if="topItems.length === 0 && !leftLoading"
            class="analysis-empty"
          >
            <a-empty />
          </div>
          <div
            v-for="(item, idx) in topItems"
            :key="idx"
            class="rank-item"
            :class="{ 'rank-item--active': selectedIdx === idx }"
            @click="handleSelect(idx)"
          >
            <div
              class="rank-index"
              :class="idx < 3 ? `rank-index--top${idx + 1}` : ''"
              >{{ idx + 1 }}</div
            >
            <div class="rank-info">
              <div class="rank-name">{{ getLabel(item) }}</div>
              <div class="rank-metrics">
                <span style="color: #3469ff">{{
                  (item.call || 0).toLocaleString()
                }}</span>
                <span class="rank-sep">/</span>
                <span style="color: #ea8d24"
                  >{{ cs }}{{ '\u2009' }}{{ fmtTokens(item.tokens) }}</span
                >
              </div>
            </div>
          </div>
        </a-spin>
      </div>

      <!-- 右侧明细 -->
      <div class="analysis-right">
        <template v-if="selectedIdx >= 0">
          <div class="detail-summary">
            <div class="detail-stat">
              <span class="detail-stat-label">{{ $t('common.call') }}</span>
              <span class="detail-stat-val" style="color: #3469ff">{{
                detailTotalCalls.toLocaleString()
              }}</span>
            </div>
            <div class="detail-stat">
              <span class="detail-stat-label">{{ $t('common.spend') }}</span>
              <span class="detail-stat-val" style="color: #ea8d24"
                >{{ cs }}{{ '\u2009' }}{{ fmtTokens(detailTotalTokens) }}</span
              >
            </div>
            <div class="detail-stat">
              <span class="detail-stat-label">{{ $t('common.abnormal') }}</span>
              <span class="detail-stat-val" style="color: #f7ba1e">{{
                detailTotalAbnormal.toLocaleString()
              }}</span>
            </div>
            <div class="detail-stat">
              <span class="detail-stat-label">{{
                $t('common.abnormal_rate')
              }}</span>
              <span class="detail-stat-val" style="color: #14c9c9"
                >{{ detailTotalAbnormalRate }}%</span
              >
            </div>
          </div>
          <a-spin :loading="rightLoading" style="width: 100%">
            <div
              v-if="detailItems.length === 0 && !rightLoading"
              class="analysis-empty"
            >
              <a-empty />
            </div>
            <div v-else class="detail-list">
              <div class="detail-row detail-row--header">
                <div class="detail-date">{{
                  dimension === 'model'
                    ? $t('common.user')
                    : $t('statistics.databoard.top.statDate')
                }}</div>
                <div class="detail-metrics">
                  <div class="detail-metric">{{ $t('common.call') }}</div>
                  <div class="detail-metric">{{ $t('common.spend') }}</div>
                  <div class="detail-metric">{{ $t('common.abnormal') }}</div>
                  <div class="detail-metric">{{
                    $t('common.abnormal_rate')
                  }}</div>
                  <div class="detail-metric detail-metric--expand"></div>
                </div>
              </div>
              <template v-for="(row, idx) in detailItems" :key="idx">
                <div
                  class="detail-row"
                  :class="{
                    'detail-row--expandable':
                      filteredModelStats(row).length > 0,
                  }"
                  @click="toggleExpand(idx)"
                >
                  <div class="detail-date">{{
                    dimension === 'model' ? row.user_id || '-' : row.stat_date
                  }}</div>
                  <div class="detail-metrics">
                    <div class="detail-metric" style="color: #3469ff">{{
                      (row.total || 0).toLocaleString()
                    }}</div>
                    <div class="detail-metric" style="color: #ea8d24"
                      >{{ cs }}{{ '\u2009' }}{{ fmtTokens(row.tokens) }}</div
                    >
                    <div class="detail-metric" style="color: #f7ba1e">{{
                      row.abnormal || 0
                    }}</div>
                    <div class="detail-metric" style="color: #14c9c9"
                      >{{ (row.abnormal_rate || 0).toFixed(2) }}%</div
                    >
                    <div class="detail-metric detail-metric--expand">
                      <icon-down
                        v-if="filteredModelStats(row).length > 0"
                        :class="{ 'expand-icon--open': expandedRows.has(idx) }"
                        class="expand-icon"
                      />
                    </div>
                  </div>
                </div>
                <!-- 展开的模型明细 -->
                <div v-if="expandedRows.has(idx)" class="model-stats">
                  <div
                    v-for="(ms, mi) in filteredModelStats(row)"
                    :key="mi"
                    class="model-stat-row"
                  >
                    <div class="model-stat-name">{{ ms.model || '-' }}</div>
                    <div class="model-stat-metrics">
                      <span style="color: #3469ff">{{
                        (ms.total || 0).toLocaleString()
                      }}</span>
                      <span class="rank-sep">/</span>
                      <span style="color: #ea8d24"
                        >{{ cs }}{{ '\u2009' }}{{ fmtTokens(ms.tokens) }}</span
                      >
                      <span class="rank-sep">/</span>
                      <span style="color: #f7ba1e">{{ ms.abnormal || 0 }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </a-spin>
          <div
            v-if="detailPaging.total > detailPaging.pageSize"
            class="detail-paging"
          >
            <a-pagination
              :total="detailPaging.total"
              :current="detailPaging.current"
              :page-size="detailPaging.pageSize"
              size="small"
              show-total
              @change="handlePageChange"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import dayjs from 'dayjs';
  import { useUserStore, useAppStore } from '@/store';
  import {
    queryTop,
    StatisticsTopItem,
    queryDetail,
    StatisticsDetailItem,
  } from '@/api/statistics';
  import { fmtTokens } from '@/utils/common';
  import DateShortcut from './date-shortcut.vue';

  const props = defineProps<{ params: any }>();
  const userStore = useUserStore();
  const appStore = useAppStore();
  const cs = computed(() => appStore.getCurrencySymbol || '$');

  const dimension = ref(userStore.role === 'user' ? 'app' : 'user');
  const dateRange = ref({
    stat_start_time: dayjs().subtract(14, 'day').startOf('day').valueOf(),
    stat_end_time: dayjs().endOf('day').valueOf(),
  });

  const topItems = ref<StatisticsTopItem[]>([]);
  const leftLoading = ref(false);
  const selectedIdx = ref(-1);

  const detailItems = ref<StatisticsDetailItem[]>([]);
  const rightLoading = ref(false);
  const detailPaging = ref({ current: 1, pageSize: 15, total: 0 });
  const expandedRows = ref(new Set<number>());

  const detailTotalCalls = computed(() =>
    detailItems.value.reduce((s, i) => s + (i.total || 0), 0)
  );
  const detailTotalTokens = computed(() =>
    detailItems.value.reduce((s, i) => s + (i.tokens || 0), 0)
  );
  const detailTotalAbnormal = computed(() =>
    detailItems.value.reduce((s, i) => s + (i.abnormal || 0), 0)
  );
  const detailTotalAbnormalRate = computed(() => {
    const total = detailTotalCalls.value;
    const abnormal = detailTotalAbnormal.value;
    if (!total) return '0.00';
    return ((abnormal / total) * 100).toFixed(2);
  });

  function getLabel(item: StatisticsTopItem): string {
    switch (dimension.value) {
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

  async function fetchTop() {
    leftLoading.value = true;
    selectedIdx.value = -1;
    detailItems.value = [];
    expandedRows.value = new Set();
    try {
      const { data } = await queryTop({
        ...props.params,
        ...dateRange.value,
        data_type: dimension.value,
        limit: 20,
      });
      topItems.value = data.items || [];
      // 默认选中第一个
      if (topItems.value.length > 0) {
        selectedIdx.value = 0;
        detailPaging.value.current = 1;
        expandedRows.value = new Set();
        fetchDetail();
      }
    } catch {
      topItems.value = [];
    } finally {
      leftLoading.value = false;
    }
  }

  function handleSelect(idx: number) {
    selectedIdx.value = idx;
    detailPaging.value.current = 1;
    expandedRows.value = new Set();
    fetchDetail();
  }

  async function fetchDetail() {
    if (selectedIdx.value < 0) return;
    const item = topItems.value[selectedIdx.value];
    if (!item) return;

    const detailType = dimension.value;

    const dp: any = {
      ...props.params,
      ...dateRange.value,
      data_type: detailType,
    };

    switch (dimension.value) {
      case 'user':
        dp.user_id = item.user_id;
        break;
      case 'app':
        dp.app_id = item.app_id;
        break;
      case 'app_key':
        // 优先使用原值, 兼容旧接口
        dp.app_key = item.app_key_raw || item.app_key;
        break;
      case 'model':
        dp.model_id = item.model;
        break;
      case 'provider':
        dp.provider = item.provider_id || item.provider;
        break;
      default:
    }

    rightLoading.value = true;
    try {
      const { data } = await queryDetail({
        ...dp,
        current: detailPaging.value.current,
        pageSize: detailPaging.value.pageSize,
      });
      detailItems.value = data.items || [];
      if (data.paging) {
        detailPaging.value.total = data.paging.total;
        detailPaging.value.current = data.paging.current;
        detailPaging.value.pageSize = data.paging.pageSize;
      }
    } catch {
      detailItems.value = [];
    } finally {
      rightLoading.value = false;
    }
  }

  function toggleExpand(idx: number) {
    const row = detailItems.value[idx];
    if (!filteredModelStats(row).length) return;
    const s = new Set(expandedRows.value);
    if (s.has(idx)) {
      s.delete(idx);
    } else {
      s.add(idx);
    }
    expandedRows.value = s;
  }

  function filteredModelStats(row: any) {
    const stats = row?.model_stats || [];
    const models = props.params?.models;
    if (!models || !models.length) return stats;
    return stats.filter((s: any) => models.includes(s.model));
  }

  function handlePageChange(page: number) {
    detailPaging.value.current = page;
    expandedRows.value = new Set();
    fetchDetail();
  }

  function handleDimensionChange() {
    fetchTop();
  }

  function handleDateChange(range: any) {
    dateRange.value = range;
    fetchTop();
  }

  watch(() => props.params, fetchTop, { deep: true, immediate: true });
</script>

<script lang="ts">
  export default { name: 'DimensionAnalysis' };
</script>

<style scoped lang="less">
  .analysis-body {
    display: flex;
    gap: 16px;
    min-height: 400px;
  }

  .analysis-left {
    width: 280px;
    flex-shrink: 0;
    max-height: 560px;
    overflow-y: auto;
  }

  .analysis-right {
    flex: 1;
    min-width: 0;
  }

  .analysis-empty {
    padding: 60px 0;
    text-align: center;
  }

  .detail-summary {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .detail-stat {
    flex: 1;
    background: var(--color-fill-1);
    border-radius: 6px;
    padding: 12px 14px;
    text-align: center;
  }

  .detail-stat-label {
    display: block;
    font-size: 12px;
    color: var(--color-text-3);
    margin-bottom: 4px;
  }

  .detail-stat-val {
    font-size: 20px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1.2;
    white-space: nowrap;
  }

  .analysis-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: var(--color-text-3);
    font-size: 14px;
  }

  .rank-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: var(--color-fill-2);
    }

    & + & {
      margin-top: 4px;
    }
  }

  .rank-item--active {
    background: var(--color-fill-3);
  }

  .rank-index {
    width: 22px;
    height: 22px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-3);
    background: var(--color-fill-2);
    flex-shrink: 0;
  }

  .rank-index--top1 {
    background: #ff4d4f;
    color: #fff;
  }

  .rank-index--top2 {
    background: #ff7a45;
    color: #fff;
  }

  .rank-index--top3 {
    background: #ffa940;
    color: #fff;
  }

  .rank-info {
    flex: 1;
    min-width: 0;
  }

  .rank-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rank-metrics {
    font-size: 12px;
    margin-top: 2px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .rank-sep {
    color: var(--color-text-4);
    margin: 0 4px;
  }

  // 右侧明细
  .detail-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail-row {
    display: flex;
    align-items: center;
    background: var(--color-fill-1);
    border-radius: 6px;
    padding: 10px 16px;
    transition: background 0.2s;

    &:hover {
      background: var(--color-fill-2);
    }
  }

  .detail-row--header {
    background: transparent;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--color-border);
    border-radius: 0;

    &:hover {
      background: transparent;
    }

    .detail-date,
    .detail-metric {
      font-size: 12px;
      font-weight: 400;
      color: var(--color-text-3);
    }
  }

  .detail-row--expandable {
    cursor: pointer;
  }

  .detail-date {
    width: 80px;
    flex-shrink: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-1);
  }

  .detail-metrics {
    flex: 1;
    display: flex;
    gap: 8px;
  }

  .detail-metric {
    flex: 1;
    text-align: right;
    font-size: 13px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .detail-metric--expand {
    flex: 0 0 24px;
    text-align: center;
  }

  .expand-icon {
    font-size: 12px;
    color: var(--color-text-3);
    transition: transform 0.2s;
  }

  .expand-icon--open {
    transform: rotate(180deg);
  }

  // 展开的模型明细
  .model-stats {
    margin-left: 80px;
    padding: 4px 16px 8px;
  }

  .model-stat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    border-radius: 4px;
    background: var(--color-fill-1);

    & + & {
      margin-top: 2px;
    }
  }

  .model-stat-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-text-2);
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .model-stat-metrics {
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .detail-paging {
    margin-top: 16px;
    text-align: right;
  }
</style>
