<template>
  <div class="model-square-page">
    <!-- 筛选区 -->
    <a-card :bordered="false" class="model-square-filter-card">
      <!-- 搜索栏 -->
      <div class="model-square-search-row">
        <a-input
          v-model="form.model"
          class="model-square-search-input"
          :placeholder="$t('model.square.search.placeholder')"
          allow-clear
          size="large"
          @press-enter="search"
          @clear="search"
        >
          <template #prefix>
            <icon-search :size="18" />
          </template>
          <template #suffix>
            <a-button
              type="primary"
              size="small"
              class="model-square-search-btn"
              @click="search"
            >
              {{ $t('button.search') }}
            </a-button>
          </template>
        </a-input>
      </div>

      <!-- 供应商 -->
      <div class="model-square-filter-row">
        <span class="model-square-filter-label">
          {{ $t('model.square.filter.provider') }}
        </span>
        <div class="model-square-filter-body">
          <span
            class="model-square-pill"
            :class="{ 'model-square-pill-on': !form.provider_id }"
            @click="pick('provider_id', '')"
          >
            {{ $t('model.square.filter.all') }}
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
          {{ $t('model.square.filter.model_type') }}
        </span>
        <div class="model-square-filter-body">
          <span
            class="model-square-pill"
            :class="{ 'model-square-pill-on': !form.type }"
            @click="pickType(undefined)"
          >
            {{ $t('model.square.filter.all') }}
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
      <div class="model-square-filter-row model-square-filter-row--last">
        <span class="model-square-filter-label">
          {{ $t('model.square.filter.group') }}
        </span>
        <div class="model-square-filter-body">
          <span
            class="model-square-pill"
            :class="{ 'model-square-pill-on': !form.group }"
            @click="pick('group', '')"
          >
            {{ $t('model.square.filter.all') }}
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
      <template v-if="loading && list.length === 0">
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
        v-else-if="!loading && list.length === 0"
        style="padding: 80px 0"
      >
        <template #description>
          {{
            hasFilter
              ? $t('model.square.empty.search')
              : $t('model.square.empty')
          }}
        </template>
      </a-empty>

      <!-- 网格 -->
      <template v-else>
        <a-row :gutter="24">
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
              @view-pricing="openPricing"
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
        :page-size-options="[20, 40, 60, 100]"
        @change="onPage"
        @page-size-change="onSize"
      />
    </div>

    <!-- 定价弹窗 -->
    <a-modal
      v-model:visible="pricingVis"
      :width="888"
      :body-style="{ maxHeight: '520px' }"
      :modal-style="{ padding: '25px 20px 20px 20px' }"
      hide-title
      hide-cancel
      simple
      :ok-text="$t('button.close')"
    >
      <PricingDetail
        v-model="pricingData"
        :model-type="pricingType"
        :time-rules="pricingTR"
        :provider-code="pricingPC"
        :provider-name="pricingPN"
      />
    </a-modal>

    <!-- 模型详情弹窗 -->
    <a-modal
      v-model:visible="detailVis"
      :width="960"
      :body-style="{ maxHeight: '70vh', overflow: 'auto' }"
      hide-cancel
      :ok-text="$t('button.close')"
    >
      <template #title>
        <div class="model-square-detail-title">
          {{ detailRecord?.name || detailRecord?.model }}
        </div>
      </template>
      <template v-if="detailRecord">
        <!-- 上部: 模型信息 -->
        <a-descriptions
          :column="2"
          bordered
          size="medium"
          class="model-square-detail-desc"
        >
          <a-descriptions-item :label="$t('common.provider')">
            {{ detailRecord.provider_name }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('common.status')">
            <a-badge
              :status="detailRecord.status === 1 ? 'success' : 'danger'"
              :text="$t(`dict.status.${detailRecord.status}`)"
            />
          </a-descriptions-item>
          <a-descriptions-item :label="$t('common.model')">
            <span class="model-square-detail-mono">
              {{ detailRecord.model }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('common.model_type')">
            {{ $t(`dict.model_type.${detailRecord.type}`) }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('common.billing_methods')">
            {{
              $t(
                `dict.billing_methods.${
                  detailRecord.pricing?.billing_methods || 1
                }`
              )
            }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('model.label.groups')">
            {{ detailRecord.group_names?.join(', ') || '-' }}
          </a-descriptions-item>
          <a-descriptions-item
            v-if="detailRecord.remark"
            :label="$t('model.label.remark')"
            :span="2"
          >
            {{ detailRecord.remark }}
          </a-descriptions-item>
        </a-descriptions>

        <!-- 时段规则 -->
        <template
          v-if="detailRecord.time_rules && detailRecord.time_rules.length"
        >
          <div class="model-square-detail-section-title">
            {{ $t('time_rule.label.rule') }}
          </div>
          <div class="model-square-detail-time-grid">
            <div
              v-for="(tr, idx) in detailRecord.time_rules"
              :key="idx"
              class="model-square-detail-time-card"
            >
              <div class="model-square-detail-time-name">
                {{ tr.name }}
              </div>
              <div class="model-square-detail-time-info">
                <span class="model-square-detail-time-discount">
                  {{ tr.discount }}%
                </span>
                <span class="model-square-detail-time-range">
                  {{ fmtMs(tr.start_time) }}~{{ fmtMs(tr.end_time) }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <!-- 下部: 完整定价信息 -->
        <div class="model-square-detail-section-title">
          {{ $t('model.columns.pricing') }}
        </div>
        <div
          v-if="detailPricingItems.length"
          class="model-square-detail-pricing-grid"
        >
          <div
            v-for="pi in detailPricingItems"
            :key="pi.key"
            class="model-square-detail-pricing-card"
          >
            <div class="model-square-detail-pricing-name">
              {{ pi.label }}
            </div>
            <div class="model-square-detail-pricing-val">
              {{ pi.value }}
            </div>
          </div>
        </div>
        <div v-else class="model-square-detail-pricing-empty">
          {{ $t('model.square.card.pricing.empty') }}
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Pricing } from '@/api/common';
  import { queryModelPage, ModelPage, ModelPageParams } from '@/api/model';
  import { Pagination } from '@/types/global';
  import { queryProviderList, ProviderList } from '@/api/provider';
  import { queryGroupList, GroupList } from '@/api/group';
  import { useAppStore } from '@/store';
  import { parseQuota } from '@/utils/common';
  import PricingDetail from '../components/pricing_detail.vue';
  import ModelSquareCard from '../components/model-square-card.vue';
  import ModelSquareSkeleton from '../components/model-square-skeleton.vue';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();

  /* ---- 搜索表单 ---- */
  const initForm = () => ({
    provider_id: '',
    model: '',
    type: undefined as number | undefined,
    group: '',
    status: undefined as number | undefined,
    remark: '',
  });
  const form = reactive(initForm());

  const hasFilter = computed(
    () => !!(form.provider_id || form.model || form.type || form.group)
  );

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

  /* ---- 数据 ---- */
  const list = ref<ModelPage[]>([]);
  const hasAnyRemark = computed(() => list.value.some((m) => !!m.remark));
  const basePage: Pagination = {
    current: 1,
    pageSize: 20,
    showTotal: true,
    showPageSize: true,
  };
  const pagination = reactive({
    ...basePage,
    total: 0,
  });

  const fetchData = async (params: ModelPageParams = { ...basePage }) => {
    setLoading(true);
    try {
      const { data } = await queryModelPage(params);
      list.value = data.items;
      pagination.current = params.current;
      pagination.pageSize = params.pageSize;
      pagination.total = data.paging.total;
    } catch {
      /* ignore */
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

  /* ---- 定价弹窗 ---- */
  const pricingVis = ref(false);
  const pricingData = ref<Pricing>({ billing_items: [] } as unknown as Pricing);
  const pricingType = ref(0);
  const pricingTR = ref<any[]>([]);
  const pricingPC = ref('');
  const pricingPN = ref('');

  const openPricing = (r: ModelPage) => {
    pricingVis.value = true;
    pricingData.value = r.pricing;
    pricingType.value = r.type;
    pricingTR.value = r.time_rules || [];
    pricingPC.value = r.provider_code || '';
    pricingPN.value = r.provider_name || '';
  };

  /* ---- 详情弹窗 ---- */
  const detailVis = ref(false);
  const detailRecord = ref<ModelPage | null>(null);

  interface PricingItem {
    key: string;
    label: string;
    value: string;
  }

  const fmtMoney = (v: any) => {
    const n = Number(v || 0);
    const sym = useAppStore().getCurrencySymbol;
    return `${sym}${parseQuota(n) || '0.00'}`;
  };

  const fmtMs = (ms: number): string => {
    if (!ms) return '00:00';
    const total = Math.floor(ms / 60000);
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const detailPricingItems = computed((): PricingItem[] => {
    const r = detailRecord.value;
    if (!r?.pricing) return [];
    const p = r.pricing;
    const bi = p.billing_items || [];
    if (!bi.length) return [];
    const arr: PricingItem[] = [];
    const il = t('model.square.card.pricing.input');
    const ol = t('model.square.card.pricing.output');
    const has = (k: string) => bi.includes(k);

    if (has('text') && p.text?.length) {
      const v = p.text[0];
      arr.push({
        key: 'text',
        label: t('dict.billing_items.text'),
        value: `${il} ${fmtMoney(v.input_ratio)}/M\n${ol} ${fmtMoney(
          v.output_ratio
        )}/M`,
      });
    }
    if (has('text_cache') && p.text_cache?.length) {
      const v = p.text_cache[0];
      arr.push({
        key: 'textCache',
        label: t('dict.billing_items.text_cache'),
        value: `${fmtMoney(v.read_ratio)}/M`,
      });
    }
    if (has('tiered_text') && p.tiered_text?.length) {
      p.tiered_text.forEach((v, i) => {
        arr.push({
          key: `tiered-${i}`,
          label: t('dict.billing_items.tiered_text'),
          value: `${v.gt || 0}k-${v.lte || 0}k\n${fmtMoney(v.input_ratio)}/M`,
        });
      });
    }
    if (has('image_generation') && p.image_generation?.length) {
      p.image_generation.forEach((v, i) => {
        arr.push({
          key: `imgGen-${i}`,
          label: t('dict.billing_items.image_generation'),
          value: `${v.width}x${v.height}\n${fmtMoney(v.once_ratio)}/${t(
            'unit.piece'
          )}`,
        });
      });
    }
    if (has('vision') && p.vision?.length) {
      p.vision.forEach((v, i) => {
        arr.push({
          key: `vision-${i}`,
          label: t('dict.billing_items.vision'),
          value: `${v.mode || '-'}\n${fmtMoney(v.once_ratio)}/${t(
            'unit.once'
          )}`,
        });
      });
    }
    if (has('audio') && p.audio) {
      arr.push({
        key: 'audio',
        label: t('dict.billing_items.audio'),
        value: `${il} ${fmtMoney(p.audio.input_ratio)}/M\n${ol} ${fmtMoney(
          p.audio.output_ratio
        )}/M`,
      });
    }
    if (has('image') && p.image) {
      arr.push({
        key: 'image',
        label: t('dict.billing_items.image'),
        value: `${il} ${fmtMoney(p.image.input_ratio)}/M\n${ol} ${fmtMoney(
          p.image.output_ratio
        )}/M`,
      });
    }
    if (has('video_generation') && p.video_generation?.length) {
      p.video_generation.forEach((v, i) => {
        arr.push({
          key: `vidGen-${i}`,
          label: t('dict.billing_items.video_generation'),
          value: `${v.width}x${v.height}\n${fmtMoney(v.once_ratio)}/${t(
            'unit.second'
          )}`,
        });
      });
    }
    if (has('video') && p.video) {
      arr.push({
        key: 'video',
        label: t('dict.billing_items.video'),
        value: `${il} ${fmtMoney(p.video.input_ratio)}/M\n${ol} ${fmtMoney(
          p.video.output_ratio
        )}/M`,
      });
    }
    if (has('search') && p.search?.length) {
      p.search.forEach((v, i) => {
        arr.push({
          key: `search-${i}`,
          label: t('dict.billing_items.search'),
          value: `${v.context_size || '-'}\n${fmtMoney(v.once_ratio)}/${t(
            'unit.once'
          )}`,
        });
      });
    }
    if (has('midjourney') && p.midjourney?.length) {
      p.midjourney.forEach((v, i) => {
        arr.push({
          key: `mj-${i}`,
          label: t('dict.billing_items.midjourney'),
          value: `${v.name || v.action || '-'}\n${fmtMoney(v.once_ratio)}/${t(
            'unit.once'
          )}`,
        });
      });
    }
    if (has('once') && p.once) {
      arr.push({
        key: 'once',
        label: t('dict.billing_items.once'),
        value: `${fmtMoney(p.once.once_ratio)}/${t('unit.once')}`,
      });
    }
    return arr;
  });

  const openDetail = (r: ModelPage) => {
    detailRecord.value = r;
    detailVis.value = true;
  };
</script>

<script lang="ts">
  export default { name: 'ModelSquare' };
</script>

<style scoped lang="less">
  .model-square-page {
    padding: 24px;
  }

  /* ===== 筛选区 ===== */

  .model-square-filter-card {
    margin-bottom: 20px;
    border-radius: 10px;

    // Keep local: filter card needs tighter top padding for search row
    :deep(.arco-card-body) {
      padding: 16px 24px 6px;
    }
  }

  .model-square-search-row {
    display: flex;
    justify-content: center;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--color-fill-2);
  }

  .model-square-search-input {
    width: 520px;
    border-radius: 20px;
    padding-left: 6px;

    // Keep local: search input needs rounded wrapper
    :deep(.arco-input-wrapper) {
      border-radius: 20px;
      padding-right: 4px;
    }
  }

  .model-square-search-btn {
    border-radius: 16px;
    padding: 0 20px;
  }

  .model-square-filter-row {
    display: flex;
    align-items: flex-start;
    padding: 14px 0;

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
    color: var(--color-text-3);
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
    color: var(--color-text-2);
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
    gap: 8px;
    margin-bottom: 16px;
    font-size: 13px;
    color: var(--color-text-3);
  }

  .model-square-info-reset {
    font-size: 14px;
    cursor: pointer;
    color: var(--color-text-4);
    transition: color 0.2s;

    &:hover {
      color: rgb(var(--primary-6));
    }
  }

  /* ===== 内容区 ===== */

  .model-square-body {
    width: 100%;
    min-height: 260px;
  }

  .model-square-col {
    margin-bottom: 20px;
  }

  /* ===== 分页 ===== */

  .model-square-pager {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }

  /* ===== 详情弹窗 ===== */

  .model-square-detail-title {
    font-size: 16px;
    font-weight: 700;
  }

  .model-square-detail-desc {
    margin-bottom: 20px;
  }

  .model-square-detail-mono {
    font-family: Consolas, 'Liberation Mono', Menlo, monospace;
  }

  .model-square-detail-section-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--color-text-1);
    margin-bottom: 12px;
  }

  .model-square-detail-time-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }

  .model-square-detail-time-card {
    padding: 8px 14px;
    background: rgba(var(--orangered-1), 0.4);
    border: 1px solid rgba(var(--orangered-3), 0.3);
    border-radius: 8px;
  }

  .model-square-detail-time-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-1);
    margin-bottom: 4px;
  }

  .model-square-detail-time-info {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .model-square-detail-time-discount {
    font-size: 13px;
    font-weight: 600;
    color: rgb(var(--orangered-6));
  }

  .model-square-detail-time-range {
    font-size: 12px;
    color: var(--color-text-3);
    font-family: Consolas, 'Liberation Mono', Menlo, monospace;
  }

  .model-square-detail-pricing-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }

  .model-square-detail-pricing-card {
    min-height: 64px;
    padding: 10px 12px;
    background: linear-gradient(180deg, #f8fbff, #fff);
    border: 1px solid var(--color-border-1);
    border-radius: 10px;
  }

  .model-square-detail-pricing-name {
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-1);
  }

  .model-square-detail-pricing-val {
    font-size: 12px;
    color: var(--color-text-3);
    line-height: 1.5;
    white-space: pre-line;
    word-break: break-word;
  }

  .model-square-detail-pricing-empty {
    font-size: 13px;
    color: var(--color-text-4);
  }

  @media (max-width: 768px) {
    .model-square-detail-pricing-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
