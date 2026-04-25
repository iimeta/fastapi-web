<template>
  <div class="model-square-page">
    <!-- 筛选区 -->
    <a-card :bordered="false" class="model-square-filter-card">
      <!-- 搜索栏 -->
      <div class="model-square-search-row">
        <div class="model-square-search-wrap">
          <icon-search class="model-square-search-icon" :size="18" />
          <a-input
            v-model="form.search_value"
            class="model-square-search-input"
            :placeholder="$t('model.square.search.placeholder')"
            allow-clear
            size="large"
            @press-enter="search"
            @clear="search"
          />
          <a-button
            type="primary"
            size="small"
            class="model-square-search-btn"
            @click="search"
          >
            {{ $t('button.search') }}
          </a-button>
        </div>
      </div>

      <!-- 供应商 -->
      <div class="model-square-filter-row">
        <span class="model-square-filter-label">
          {{ $t('common.provider') }}
        </span>
        <div class="model-square-filter-body">
          <span
            class="model-square-pill"
            :class="{ 'model-square-pill-on': !form.provider_id }"
            @click="pick('provider_id', '')"
          >
            {{ $t('common.all') }}
          </span>
          <span
            v-for="p in providers"
            :key="p.id"
            class="model-square-pill"
            :class="{
              'model-square-pill-on': form.provider_id === p.id,
            }"
            @click="pick('provider_id', p.id)"
          >
            {{ p.name }}
          </span>
        </div>
      </div>

      <!-- 模型类型 -->
      <div class="model-square-filter-row">
        <span class="model-square-filter-label">
          {{ $t('common.model_type') }}
        </span>
        <div class="model-square-filter-body">
          <span
            class="model-square-pill"
            :class="{ 'model-square-pill-on': !form.type }"
            @click="pickType(undefined)"
          >
            {{ $t('common.all') }}
          </span>
          <span
            v-for="o in typeOpts"
            :key="o.value"
            class="model-square-pill"
            :class="{
              'model-square-pill-on': form.type === o.value,
            }"
            @click="pickType(o.value)"
          >
            {{ o.label }}
          </span>
        </div>
      </div>

      <!-- 所属分组 -->
      <div class="model-square-filter-row">
        <span class="model-square-filter-label">
          {{ $t('model.label.groups') }}
        </span>
        <div class="model-square-filter-body">
          <span
            class="model-square-pill"
            :class="{ 'model-square-pill-on': !form.group }"
            @click="pick('group', '')"
          >
            {{ $t('common.all') }}
          </span>
          <span
            v-for="g in groups"
            :key="g.id"
            class="model-square-pill"
            :class="{
              'model-square-pill-on': form.group === g.id,
            }"
            @click="pick('group', g.id)"
          >
            {{ g.name }}
          </span>
        </div>
      </div>

      <!-- 计费方式 -->
      <div class="model-square-filter-row model-square-filter-row--last">
        <span class="model-square-filter-label">
          {{ $t('common.billing_methods') }}
        </span>
        <div class="model-square-filter-body">
          <span
            class="model-square-pill"
            :class="{ 'model-square-pill-on': !form.billing_method }"
            @click="pickBilling(undefined)"
          >
            {{ $t('common.all') }}
          </span>
          <span
            v-for="o in billingOpts"
            :key="o.value"
            class="model-square-pill"
            :class="{
              'model-square-pill-on': form.billing_method === o.value,
            }"
            @click="pickBilling(o.value)"
          >
            {{ o.label }}
          </span>
        </div>
      </div>
    </a-card>

    <!-- 统计条 -->
    <div class="model-square-info">
      <span>
        {{
          $t('model.square.total', {
            total: pagination.total || 0,
          })
        }}
      </span>
      <a-tooltip :content="$t('button.reset')" mini>
        <icon-refresh class="model-square-info-reset" @click="reset" />
      </a-tooltip>
    </div>

    <!-- 卡片区 -->
    <a-spin :loading="loading" class="model-square-body">
      <!-- 骨架 -->
      <template v-if="loading && (!list || list.length === 0)">
        <a-row :gutter="24">
          <a-col
            v-for="i in 8"
            :key="i"
            :xs="12"
            :sm="12"
            :md="12"
            :lg="8"
            :xl="8"
            :xxl="6"
            class="model-square-col"
          >
            <ModelSquareSkeleton />
          </a-col>
        </a-row>
      </template>

      <!-- 空 -->
      <a-empty
        v-else-if="!loading && (!list || list.length === 0)"
        style="padding: 80px 0"
      />

      <!-- 网格 -->
      <template v-else>
        <a-row :gutter="12">
          <a-col
            v-for="item in list"
            :key="item.id"
            :xs="12"
            :sm="12"
            :md="12"
            :lg="8"
            :xl="8"
            :xxl="6"
            class="model-square-col"
          >
            <ModelSquareCard
              :record="item"
              :show-remark="hasAnyRemark"
              @click-card="openDetail"
            />
          </a-col>
        </a-row>
      </template>
    </a-spin>

    <!-- 分页 -->
    <div v-if="pagination.total > 0" class="model-square-pager">
      <a-pagination
        :current="pagination.current"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        show-total
        show-page-size
        :page-size-options="basePage.pageSizeOptions"
        @change="onPage"
        @page-size-change="onSize"
      />
    </div>

    <!-- 模型详情弹窗 -->
    <a-modal
      v-model:visible="detailVis"
      :width="960"
      :body-style="{
        padding: '0',
        maxHeight: '82vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }"
      hide-title
      hide-cancel
      :ok-text="$t('button.close')"
      modal-class="tech-modal"
    >
      <div v-if="detailRecord" class="tech-detail">
        <!-- 顶部渐变头 -->
        <div class="tech-header" :style="{ '--brand': detailBrandColor }">
          <div class="tech-header-grid" />
          <div class="tech-header-content">
            <div class="tech-avatar" :style="{ '--brand': detailBrandColor }">
              <svg
                v-if="detailLogo?.kind === 'svg'"
                class="tech-avatar-svg"
                :viewBox="detailLogo.viewBox"
                :style="
                  detailLogo.color ? { color: detailLogo.color } : undefined
                "
              >
                <path v-if="detailLogo.path" :d="detailLogo.path" />
                <g v-else-if="detailLogo.markup" v-html="detailLogo.markup" />
              </svg>
              <span v-else class="tech-avatar-letter">
                {{ detailInitial }}
              </span>
            </div>
            <div class="tech-title-area">
              <div class="tech-name-row">
                <h2 class="tech-name" @click="copyName">
                  <span class="tech-name-text">{{
                    detailRecord.name || detailRecord.model
                  }}</span>
                  <icon-copy class="tech-copy-icon" />
                </h2>
                <span
                  class="tech-tag tech-tag--head"
                  :style="detailTypeTagStyle"
                >
                  {{ $t(`dict.model_type.${detailRecord.type}`) }}
                </span>
              </div>
              <div class="tech-model-row">
                <div class="tech-model-id" @click="copyModel">
                  <span class="tech-model-text">{{ detailRecord.model }}</span>
                  <icon-copy class="tech-copy-icon" />
                </div>
                <div class="tech-billing-tags">
                  <span
                    v-for="bm in detailRecord.pricing?.billing_methods || [1]"
                    :key="bm"
                    class="tech-tag"
                    :style="detailBillingTagStyle(bm)"
                  >
                    {{ $t(`dict.billing_methods.${bm}`) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p v-if="detailRecord.remark" class="tech-remark-row">{{
            detailRecord.remark
          }}</p>
          <div
            v-if="detailRecord.group_names && detailRecord.group_names.length"
            class="tech-groups-row"
          >
            <icon-user-group class="tech-groups-icon" />
            <span
              v-for="g in detailRecord.group_names"
              :key="g"
              class="tech-tag tech-tag--group"
            >
              {{ g }}
            </span>
          </div>
        </div>

        <!-- 内容区（可滚动） -->
        <div class="tech-body">
          <!-- 时段规则卡片 -->
          <div
            v-if="detailRecord.time_rules && detailRecord.time_rules.length > 0"
            class="tech-card tech-time-rule-card"
          >
            <div class="tech-card-title">
              <span class="tech-card-icon">
                <icon-clock-circle />
              </span>
              {{ $t('time_rule.label.rule') }}
            </div>
            <div class="tech-pricing-content">
              <PricingDetail
                v-model="detailRecord.pricing"
                :model-type="detailRecord.type"
                :time-rules="detailRecord.time_rules || []"
                :provider-code="detailRecord.provider_code || ''"
                :provider-name="detailRecord.provider_name || ''"
                only-time-rules
              />
            </div>
          </div>

          <!-- 定价区域 -->
          <div class="tech-card tech-pricing-card">
            <div class="tech-card-title">
              <span class="tech-card-icon tech-card-icon--currency">{{
                appStore.getCurrencySymbol || '$'
              }}</span>
              {{ $t('model.columns.pricing') }}
            </div>
            <div class="tech-pricing-content">
              <PricingDetail
                v-if="detailRecord.pricing"
                v-model="detailRecord.pricing"
                :model-type="detailRecord.type"
                :time-rules="[]"
                :provider-code="detailRecord.provider_code || ''"
                :provider-name="detailRecord.provider_name || ''"
              />
              <a-empty
                v-else
                :description="$t('model.square.card.pricing.empty')"
                style="padding: 20px 0"
              />
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { useClipboard } from '@vueuse/core';
  import useLoading from '@/hooks/loading';
  import { useAppStore } from '@/store';
  import { queryModelPage, ModelPage, ModelPageParams } from '@/api/model';
  import { Pagination } from '@/types/global';
  import { queryProviderList, ProviderList } from '@/api/provider';
  import { queryGroupList, GroupList } from '@/api/group';
  import {
    getProviderBrandColor,
    getProviderInitial,
    getProviderLogo,
  } from '@/utils/provider-brand';
  import PricingDetail from '../components/pricing_detail.vue';
  import ModelSquareCard from '../components/model-square-card.vue';
  import ModelSquareSkeleton from '../components/model-square-skeleton.vue';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const { copy } = useClipboard();
  const appStore = useAppStore();

  /* ---- 搜索表单 ---- */
  const initForm = () => ({
    provider_id: '',
    type: undefined as number | undefined,
    billing_method: undefined as number | undefined,
    group: '',
    status: undefined as number | undefined,
    search_value: '',
  });
  const form = reactive(initForm());

  /* ---- 选项 ---- */
  const typeOpts = computed(() => [
    { label: t('dict.model_type.1'), value: 1 },
    { label: t('dict.model_type.2'), value: 2 },
    { label: t('dict.model_type.3'), value: 3 },
    { label: t('dict.model_type.4'), value: 4 },
    { label: t('dict.model_type.5'), value: 5 },
    { label: t('dict.model_type.6'), value: 6 },
    { label: t('dict.model_type.7'), value: 7 },
    { label: t('dict.model_type.8'), value: 8 },
    { label: t('dict.model_type.100'), value: 100 },
    { label: t('dict.model_type.101'), value: 101 },
    { label: t('dict.model_type.102'), value: 102 },
    { label: t('dict.model_type.103'), value: 103 },
    { label: t('dict.model_type.10000'), value: 10000 },
  ]);

  const billingOpts = computed(() => [
    { label: t('dict.billing_methods.1'), value: 1 },
    { label: t('dict.billing_methods.2'), value: 2 },
  ]);

  /* ---- 数据 ---- */
  const list = ref<ModelPage[]>([]);
  const hasAnyRemark = computed(() => list.value.some((m) => !!m.remark));
  const basePage: Pagination = {
    current: 1,
    pageSize: 60,
    showTotal: true,
    showPageSize: true,
    pageSizeOptions: [20, 60, 100, 500, 1000],
  };
  const pagination = reactive({
    ...basePage,
    total: 0,
  });

  const fetchData = async (params: ModelPageParams = { ...basePage }) => {
    setLoading(true);
    try {
      const { data } = await queryModelPage(params);
      list.value = data?.items || [];
      pagination.current = params.current;
      pagination.pageSize = params.pageSize;
      pagination.total = data?.paging?.total || 0;
    } catch {
      list.value = [];
      pagination.current = params.current;
      pagination.pageSize = params.pageSize;
      pagination.total = 0;
    } finally {
      setLoading(false);
    }
  };
  fetchData();

  const search = () => {
    fetchData({
      ...basePage,
      ...form,
    } as unknown as ModelPageParams);
  };

  const reset = () => {
    Object.assign(form, initForm());
    search();
  };

  const onPage = (c: number) => {
    fetchData({
      ...basePage,
      ...form,
      current: c,
      pageSize: pagination.pageSize,
    } as unknown as ModelPageParams);
  };

  const onSize = (s: number) => {
    basePage.pageSize = s;
    fetchData({
      ...basePage,
      ...form,
    } as unknown as ModelPageParams);
  };

  /* ---- 筛选操作 ---- */
  const pick = (key: 'provider_id' | 'group', v: string) => {
    form[key] = v;
    search();
  };
  const pickType = (v: number | undefined) => {
    form.type = v;
    search();
  };
  const pickBilling = (v: number | undefined) => {
    form.billing_method = v;
    search();
  };
  /* ---- 供应商 / 分组 ---- */
  const providers = ref<ProviderList[]>([]);
  const groups = ref<GroupList[]>([]);

  (async () => {
    try {
      const { data } = await queryProviderList();
      providers.value = data.items;
    } catch {
      /* ignore */
    }
  })();

  (async () => {
    try {
      const { data } = await queryGroupList();
      groups.value = data.items;
    } catch {
      /* ignore */
    }
  })();

  /* ---- 详情弹窗 ---- */
  const detailVis = ref(false);
  const detailRecord = ref<ModelPage | null>(null);

  /* ---- Logo Map ---- */
  const detailLogo = computed(() => {
    if (!detailRecord.value) return null;
    return getProviderLogo(
      detailRecord.value.provider_code,
      detailRecord.value.provider_name
    );
  });

  const detailInitial = computed(() => {
    if (!detailRecord.value) return '?';
    return getProviderInitial(detailRecord.value.provider_name);
  });

  const openDetail = (r: ModelPage) => {
    detailRecord.value = r;
    detailVis.value = true;
  };

  const detailBrandColor = computed(() => {
    if (!detailRecord.value) return '#6366f1';
    return getProviderBrandColor(
      detailRecord.value.provider_code,
      detailRecord.value.provider_name
    );
  });

  const typeColorMap: Record<number, string> = {
    1: '22, 93, 255',
    2: '168, 85, 247',
    3: '14, 165, 233',
    4: '236, 72, 153',
    5: '245, 158, 11',
    6: '34, 197, 94',
    7: '6, 182, 212',
    8: '239, 68, 68',
    100: '99, 102, 241',
    101: '79, 70, 229',
    102: '217, 119, 87',
    103: '20, 184, 166',
    10000: '107, 114, 128',
  };

  const detailTypeTagStyle = computed(() => {
    if (!detailRecord.value) return {};
    const rgb = typeColorMap[detailRecord.value.type] || '99, 102, 241';
    return {
      color: `rgb(${rgb})`,
      background: `rgba(${rgb}, 0.08)`,
      borderColor: `rgba(${rgb}, 0.15)`,
    };
  });

  const billingColorMap: Record<number, string> = {
    1: '6, 182, 212', // 按Tokens - 青
    2: '245, 158, 11', // 按次 - 琥珀
  };

  const detailBillingTagStyle = (bm: number) => {
    const rgb = billingColorMap[bm] || '107, 114, 128';
    return {
      color: `rgb(${rgb})`,
      background: `rgba(${rgb}, 0.08)`,
      borderColor: `rgba(${rgb}, 0.15)`,
    };
  };

  const copyModel = async () => {
    if (!detailRecord.value) return;
    try {
      await copy(detailRecord.value.model);
      Message.success(t('model.square.card.copied'));
    } catch {
      Message.error('Copy failed');
    }
  };

  const copyName = async () => {
    if (!detailRecord.value) return;
    try {
      await copy(detailRecord.value.name || detailRecord.value.model);
      Message.success(t('model.square.card.copied'));
    } catch {
      Message.error('Copy failed');
    }
  };
</script>

<script lang="ts">
  export default { name: 'ModelSquare' };
</script>

<style scoped lang="less">
  .model-square-page {
    padding: 10px;
  }

  /* ===== 筛选区 ===== */

  .model-square-filter-card {
    margin-bottom: 15px;
    border-radius: 10px;

    // Keep local: filter card needs tighter top padding for search row
    :deep(.arco-card-body) {
      padding: 15px 15px 0px 15px;
    }
  }

  .model-square-search-row {
    display: flex;
    justify-content: center;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--color-fill-2);
  }

  .model-square-search-wrap {
    display: flex;
    align-items: center;
    width: 560px;
    height: 42px;
    background: var(--color-fill-1);
    border: 1px solid var(--color-border-2);
    border-radius: 21px;
    padding: 0 5px 0 12px;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus-within {
      border-color: rgb(var(--primary-6));
      box-shadow: 0 0 0 2px rgba(var(--primary-6), 0.1);
    }

    :deep(.arco-input-wrapper) {
      background: transparent !important;
      border: none !important;
      border-color: transparent !important;
      box-shadow: none !important;
      padding: 0;
    }

    :deep(.arco-input) {
      font-size: 14px;
    }

    :deep(.arco-input-clear-btn) {
      margin-right: 8px;
    }
  }

  .model-square-search-icon {
    flex-shrink: 0;
    color: var(--color-text-3);
    margin-right: 8px;
  }

  .model-square-search-input {
    flex: 1;
    min-width: 0;
  }

  .model-square-search-btn {
    flex-shrink: 0;
    border-radius: 16px;
    padding: 0 20px;
    height: 32px;
  }

  .model-square-filter-row {
    display: flex;
    align-items: flex-start;
    padding: 12px 0;

    & + & {
      border-top: 1px solid var(--color-fill-2);
    }

    &--last {
      border-bottom: none;
    }
  }

  .model-square-filter-label {
    flex-shrink: 0;
    width: 90px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-2);
    line-height: 28px;
    text-align: right;
    padding-right: 20px;
  }

  .model-square-filter-body {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 10px;
  }

  .model-square-pill {
    padding: 4px 14px;
    font-size: 13px;
    line-height: 20px;
    color: var(--color-text-1);
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
    white-space: nowrap;

    &:hover {
      color: rgb(var(--primary-6));
      background: var(--color-fill-2);
    }
  }

  .model-square-pill-on {
    color: rgb(var(--primary-6));
    font-weight: 500;
    background: rgba(var(--primary-6), 0.08);
  }

  /* ===== 统计条 ===== */

  .model-square-info {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    margin-bottom: 2px;
    margin-right: 10px;
    font-size: 13px;
    color: var(--color-text-3);
  }

  .model-square-info-reset {
    font-size: 14px;
    cursor: pointer;
    color: rgb(var(--primary-6));
    transition: color 0.2s, transform 0.2s;

    &:hover {
      color: rgb(var(--primary-5));
      transform: rotate(-90deg);
    }
  }

  /* ===== 内容区 ===== */

  .model-square-body {
    width: 100%;
    min-height: 260px;
  }

  .model-square-col {
    margin-bottom: 12px;
  }

  /* ===== 分页 ===== */

  .model-square-pager {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }

  /* ===== 详情弹窗（科技感卡片） ===== */
  // tech-modal 样式移至全局 style 块（modal teleport 到 body，scoped 不生效）

  .tech-detail {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 82vh;
  }

  /* --- 头部渐变区域 --- */
  .tech-header {
    position: relative;
    padding: 22px 28px 16px;
    border-bottom: 1px solid var(--color-border-1);
    overflow: hidden;
    flex-shrink: 0;
    background: linear-gradient(
      110deg,
      color-mix(in srgb, var(--brand) 12%, var(--color-bg-2)),
      var(--color-bg-2) 40%,
      var(--color-bg-2) 60%,
      color-mix(in srgb, var(--brand) 6%, var(--color-bg-2))
    );
    background-size: 200% 100%;
    animation: tech-bg-flow 5s ease-in-out infinite alternate;
  }

  @keyframes tech-bg-flow {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }

  .tech-header-grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(var(--brand) 1px, transparent 1px),
      linear-gradient(90deg, var(--brand) 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: 0.03;
    pointer-events: none;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, transparent 80%);
    -webkit-mask-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.6) 0%,
      transparent 80%
    );
  }

  .tech-header-content {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }

  .tech-avatar {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-2);
    border: 1px solid var(--color-border-1);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 10%, transparent),
      0 2px 8px rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }

  .tech-avatar-svg {
    width: 32px;
    height: 32px;
  }

  .tech-avatar-letter {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--brand), rgba(0, 0, 0, 0.3));
    color: #fff;
    font-size: 22px;
    font-weight: 700;
  }

  .tech-title-area {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .tech-name-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .tech-name {
    margin: 0;
    min-width: 0;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: rgb(var(--primary-6));
      .tech-copy-icon {
        opacity: 1;
      }
    }
  }

  .tech-name-text {
    font-size: 20px;
    font-weight: 700;
    color: inherit;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tech-model-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .tech-model-id {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--color-text-2);
    font-family: 'JetBrains Mono', Consolas, 'Liberation Mono', Menlo, monospace;
    cursor: pointer;
    transition: color 0.2s;
    min-width: 0;
    flex: 1;

    &:hover {
      color: rgb(var(--primary-6));
      .tech-copy-icon {
        opacity: 1;
      }
    }
  }

  .tech-model-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tech-copy-icon {
    flex-shrink: 0;
    font-size: 14px;
    color: var(--color-text-3);
    opacity: 0;
    transition: opacity 0.15s;
  }

  .tech-billing-tags {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
    margin-left: auto;
  }

  .tech-groups-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    padding-left: 76px;
  }

  .tech-groups-icon {
    font-size: 13px;
    color: rgb(var(--primary-6));
    flex-shrink: 0;
  }

  .tech-tag {
    font-size: 11px;
    line-height: 1;
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: 500;
    letter-spacing: 0.01em;
    border: 1px solid transparent;

    &--head {
      flex-shrink: 0;
      margin-left: auto;
    }

    &--group {
      color: rgb(var(--primary-6));
      background: rgba(var(--primary-6), 0.06);
      border-color: rgba(var(--primary-6), 0.12);
    }
  }

  /* --- 内容区（可滚动） --- */
  .tech-body {
    padding: 8px;
    background: var(--color-fill-1);
    overflow-y: auto;
    flex: 1;
    min-height: 0;

    > * + * {
      margin-top: 8px;
    }
  }

  /* --- 备注（header 内） --- */
  .tech-remark-row {
    margin: 8px 0 0;
    padding: 0 0 0 76px;
    font-size: 12px;
    line-height: 1.5;
    color: var(--color-text-2);
    word-break: break-word;
  }

  .tech-card {
    background: var(--color-bg-2);
    border: 1px solid var(--color-border-1);
    border-radius: 10px;
    transition: box-shadow 0.2s;
  }

  .tech-time-rule-card {
    .tech-card-icon {
      background: rgba(var(--purple-6), 0.08);
      color: rgb(var(--purple-6));
    }
  }

  .tech-pricing-card {
    .tech-card-icon--currency {
      background: rgba(var(--gold-6), 0.08);
      color: rgb(var(--gold-6));
      font-weight: 700;
      font-size: 13px;
      font-family: 'JetBrains Mono', Consolas, monospace;
    }
  }

  .tech-pricing-content {
    padding: 8px 12px 10px;
  }

  .tech-card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-1);
  }

  .tech-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background: rgba(var(--primary-6), 0.08);
    color: rgb(var(--primary-6));
    font-size: 12px;
  }

  /* --- 定价表格美化 --- */
  :deep(.tech-pricing-content .pricing-detail-table-spacing) {
    margin-bottom: 10px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--color-border-1);

    .arco-table {
      border-radius: 8px;
    }

    .arco-table-container {
      border: none;
    }

    .arco-table-th {
      background: var(--color-fill-1);
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-2);
      padding: 5px 8px;
      border-bottom: 1px solid var(--color-border-1);
      line-height: 1.4;
    }

    // 分组标题行（如 "文本"、"时段规则"）
    .arco-table-th[colspan] {
      background: var(--color-bg-2);
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-1);
      padding: 5px 10px;
      border-bottom: 1px solid var(--color-fill-2);
    }

    .arco-table-td {
      font-size: 12px;
      padding: 5px 8px;
      border-bottom: 1px solid var(--color-fill-2);
      color: var(--color-text-1);
      line-height: 1.4;
    }

    .arco-table-tr:last-child .arco-table-td {
      border-bottom: none;
    }

    .arco-table-tr:hover .arco-table-td {
      background: var(--color-fill-1);
    }
  }

  :deep(.tech-pricing-content .pricing-detail-table-spacing:last-child) {
    margin-bottom: 0;
  }
</style>

<style lang="less">
  .tech-modal {
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06),
      0 24px 64px rgba(0, 0, 0, 0.25);

    .arco-modal-footer {
      border-top: 1px solid var(--color-border-1);
      text-align: center;
    }
  }
</style>
