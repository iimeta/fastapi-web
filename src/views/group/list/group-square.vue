<template>
  <div class="group-square-page">
    <!-- 筛选区 -->
    <a-card :bordered="false" class="group-square-filter-card">
      <!-- 搜索栏 -->
      <div class="group-square-search-row">
        <div class="group-square-search-wrap">
          <icon-search class="group-square-search-icon" :size="18" />
          <a-input
            v-model="form.search_value"
            class="group-square-search-input"
            :placeholder="$t('group.square.search.placeholder')"
            allow-clear
            size="large"
            @press-enter="search"
            @clear="search"
          />
          <a-button
            type="primary"
            size="small"
            class="group-square-search-btn"
            @click="search"
          >
            {{ $t('button.search') }}
          </a-button>
        </div>
      </div>

      <!-- 提供商 -->
      <div class="group-square-filter-row">
        <span class="group-square-filter-label">
          {{ $t('common.provider') }}
        </span>
        <div class="group-square-filter-body">
          <span
            class="group-square-pill"
            :class="{ 'group-square-pill-on': !form.provider_id }"
            @click="pickProvider('')"
          >
            {{ $t('common.all') }}
          </span>
          <span
            v-for="p in providers"
            :key="p.id"
            class="group-square-pill"
            :class="{
              'group-square-pill-on': form.provider_id === p.id,
            }"
            @click="pickProvider(p.id)"
          >
            {{ p.name }}
          </span>
        </div>
      </div>

      <!-- 模型类型 -->
      <div class="group-square-filter-row">
        <span class="group-square-filter-label">
          {{ $t('common.model_type') }}
        </span>
        <div class="group-square-filter-body">
          <span
            class="group-square-pill"
            :class="{ 'group-square-pill-on': !form.type }"
            @click="pickType(undefined)"
          >
            {{ $t('common.all') }}
          </span>
          <span
            v-for="o in typeOpts"
            :key="o.value"
            class="group-square-pill"
            :class="{
              'group-square-pill-on': form.type === o.value,
            }"
            @click="pickType(o.value)"
          >
            {{ o.label }}
          </span>
        </div>
      </div>

      <!-- 计费方式 -->
      <div class="group-square-filter-row group-square-filter-row--last">
        <span class="group-square-filter-label">
          {{ $t('common.billing_methods') }}
        </span>
        <div class="group-square-filter-body">
          <span
            class="group-square-pill"
            :class="{ 'group-square-pill-on': !form.billing_method }"
            @click="pickBilling(undefined)"
          >
            {{ $t('common.all') }}
          </span>
          <span
            v-for="o in billingOpts"
            :key="o.value"
            class="group-square-pill"
            :class="{
              'group-square-pill-on': form.billing_method === o.value,
            }"
            @click="pickBilling(o.value)"
          >
            {{ o.label }}
          </span>
        </div>
      </div>
    </a-card>

    <!-- 统计条 -->
    <div class="group-square-info">
      <span class="group-square-desc">{{ $t('group.desc') }}</span>
      <span class="group-square-info-right">
        <span>
          {{
            $t('group.square.total', {
              total: pagination.total || 0,
            })
          }}
        </span>
        <a-tooltip :content="$t('button.reset')" mini>
          <icon-refresh class="group-square-info-reset" @click="reset" />
        </a-tooltip>
      </span>
    </div>

    <!-- 卡片区 -->
    <a-spin :loading="loading" class="group-square-body">
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
            class="group-square-col"
          >
            <GroupSquareSkeleton />
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
            class="group-square-col"
          >
            <GroupSquareCard
              :record="item"
              :show-remark="hasAnyRemark"
              @click-card="openDetail"
              @view-models="(r) => modelsHandle(r.id)"
            />
          </a-col>
        </a-row>
      </template>
    </a-spin>

    <!-- 分页 -->
    <div v-if="pagination.total > 0" class="group-square-pager">
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

    <!-- 分组详情弹窗 -->
    <a-modal
      v-model:visible="detailVis"
      :width="800"
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
      modal-class="group-tech-modal"
    >
      <div v-if="detailRecord" class="tech-detail">
        <!-- 顶部渐变头 -->
        <div class="tech-header" :style="{ '--brand': detailBrandColor }">
          <div class="tech-header-grid" />
          <div class="tech-header-content">
            <div class="tech-avatar" :style="{ '--brand': detailBrandColor }">
              <span class="tech-avatar-letter">
                {{ detailInitial }}
              </span>
            </div>
            <div class="tech-title-area">
              <div class="tech-name-row">
                <h2 class="tech-name">
                  <span
                    class="tech-name-text"
                    :class="{ 'tech-name-text--bold': detailRecord.is_default }"
                    >{{ detailRecord.name }}</span
                  >
                  <span
                    v-if="detailRecord.is_default"
                    class="tech-default-badge"
                  >
                    {{ $t('group.detail.is_default') }}
                  </span>
                </h2>
              </div>
              <div class="tech-meta-row">
                <div class="tech-billing-tags">
                  <span
                    v-for="bm in detailBillingMethods"
                    :key="bm"
                    class="tech-tag"
                    :style="detailBillingTagStyle(bm)"
                  >
                    {{ $t(`dict.billing_methods.${bm}`) }}
                  </span>
                </div>
                <div v-if="detailRecord.expires_at" class="tech-expire">
                  <icon-calendar :size="12" />
                  <span>{{ detailRecord.expires_at }}</span>
                </div>
              </div>
            </div>
          </div>
          <p v-if="detailRecord.remark" class="tech-remark-row">{{
            detailRecord.remark
          }}</p>
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
            <div class="tech-card-content">
              <a-table
                :columns="timeRulesColumns"
                :data="detailRecord.time_rules"
                :pagination="false"
                :bordered="false"
                size="small"
              >
                <template #discount="{ record }">
                  {{ record.discount }}%
                </template>
                <template #model_names="{ record }">
                  {{ record.model_names?.join(', ') || $t('common.all') }}
                </template>
                <template #time_range="{ record }">
                  {{ formatMs(record.start_time) }}~{{
                    formatMs(record.end_time)
                  }}
                </template>
                <template #days="{ record }">
                  {{ formatDays(record) }}
                </template>
                <template #priority_title>
                  {{ $t('time_rule.label.priority') }}
                  <a-tooltip :content="$t('time_rule.placeholder.priority')">
                    <icon-question-circle
                      style="cursor: pointer; color: var(--color-text-3)"
                    />
                  </a-tooltip>
                </template>
              </a-table>
            </div>
          </div>

          <!-- 模型权限卡片 -->
          <div
            v-if="
              detailRecord && detailRecord.models && detailRecord.models.length
            "
            class="tech-card tech-models-card"
          >
            <div class="tech-card-title">
              <span class="tech-card-icon tech-card-icon--models">
                <icon-apps />
              </span>
              {{ $t('common.models') }}
              <span class="tech-card-count">{{
                detailRecord.models.length
              }}</span>
              <a-button
                type="text"
                size="small"
                class="tech-card-view-btn"
                @click="modelsHandle(detailRecord?.id || '')"
              >
                {{ $t('button.view') }}
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 模型权限弹窗 -->
    <a-modal
      v-model:visible="modelsVisible"
      :title="$t('common.models')"
      :modal-style="modelsModalStyle"
      unmount-on-close
      hide-cancel
      simple
      width="1080px"
      :ok-text="$t('button.close')"
    >
      <Models :id="recordId" :action="action" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { queryGroupPage, GroupPage, GroupPageParams } from '@/api/group';
  import { queryProviderList, ProviderList } from '@/api/provider';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import Models from '@/views/common/models.vue';
  import GroupSquareCard from '../components/group-square-card.vue';
  import GroupSquareSkeleton from '../components/group-square-skeleton.vue';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();

  const modelsModalStyle = {
    padding: '25px 15px 20px 15px',
  };

  /* ---- 搜索表单 ---- */
  const initForm = () => ({
    provider_id: '',
    type: undefined as number | undefined,
    billing_method: undefined as number | undefined,
    search_value: '',
  });
  const form = reactive(initForm());

  /* ---- 选项 ---- */
  const providers = ref<ProviderList[]>([]);
  (async () => {
    try {
      const { data } = await queryProviderList();
      providers.value = data.items;
    } catch {
      /* ignore */
    }
  })();

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
  const list = ref<GroupPage[]>([]);
  const hasAnyRemark = computed(() => list.value.some((g) => !!g.remark));
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

  const fetchData = async (params: GroupPageParams = { ...basePage }) => {
    setLoading(true);
    try {
      const { data } = await queryGroupPage(params);
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
    } as unknown as GroupPageParams);
  };

  const reset = () => {
    Object.assign(form, initForm());
    search();
  };

  const onPage = (c: number) => {
    const params: any = {
      ...basePage,
      current: c,
      pageSize: pagination.pageSize,
    };
    if (form.search_value) {
      params.name = form.search_value;
    }
    if (form.provider_id) {
      params.provider_id = form.provider_id;
    }
    if (form.type) {
      params.type = form.type;
    }
    if (form.billing_method) {
      params.billing_method = form.billing_method;
    }
    fetchData(params as GroupPageParams);
  };

  const onSize = (s: number) => {
    basePage.pageSize = s;
    search();
  };

  /* ---- 筛选操作 ---- */
  const pickProvider = (v: string) => {
    form.provider_id = v;
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

  /* ---- 详情弹窗 ---- */
  const detailVis = ref(false);
  const detailRecord = ref<GroupPage | null>(null);

  const openDetail = (r: GroupPage) => {
    detailRecord.value = r;
    detailVis.value = true;
  };

  /* ---- 颜色 ---- */
  const palette = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6',
    '#f59e0b',
    '#06b6d4',
    '#10b981',
    '#f43f5e',
    '#3b82f6',
    '#a855f7',
  ];

  const detailBrandColor = computed(() => {
    if (!detailRecord.value) return '#6366f1';
    const name = detailRecord.value.name || '';
    let h = 0;
    for (let i = 0; i < name.length; i += 1) {
      h = name.charCodeAt(i) + (h * 31 - h);
    }
    return palette[Math.abs(h) % palette.length];
  });

  const detailInitial = computed(() => {
    if (!detailRecord.value) return '?';
    const n = detailRecord.value.name;
    return n ? n.charAt(0).toUpperCase() : '?';
  });

  const detailBillingMethods = computed(
    () => detailRecord.value?.billing_methods || [1, 2]
  );

  const billingColorMap: Record<number, string> = {
    1: '6, 182, 212',
    2: '245, 158, 11',
  };

  const detailBillingTagStyle = (bm: number) => {
    const rgb = billingColorMap[bm] || '107, 114, 128';
    return {
      color: `rgb(${rgb})`,
      background: `rgba(${rgb}, 0.08)`,
      borderColor: `rgba(${rgb}, 0.15)`,
    };
  };

  /* ---- 时段规则表格 ---- */
  const timeRulesColumns = computed<TableColumnData[]>(() => [
    {
      title: t('time_rule.label.name'),
      dataIndex: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: t('common.discount'),
      slotName: 'discount',
      align: 'center',
      width: 80,
    },
    {
      title: t('time_rule.label.time_range'),
      slotName: 'time_range',
      align: 'center',
      width: 100,
    },
    {
      title: t('time_rule.label.days'),
      slotName: 'days',
      align: 'center',
      width: 100,
    },
    {
      title: t('time_rule.label.priority'),
      dataIndex: 'priority',
      titleSlotName: 'priority_title',
      align: 'center',
      width: 80,
    },
    {
      title: t('common.model'),
      slotName: 'model_names',
      align: 'center',
      width: 120,
      ellipsis: true,
      tooltip: true,
    },
  ]);

  const formatMs = (ms: number) => {
    if (ms === undefined || ms === null) return '';
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}`;
  };

  const formatDays = (rule: any) => {
    if (!rule.days || rule.days.length === 0) return t('common.all');
    if (rule.day_mode === 'month') {
      return rule.days
        .map((d: number) => d + t('time_rule.label.day_suffix'))
        .join('、');
    }
    return rule.days
      .map((d: number) => t(`time_rule.dict.week.${d}`))
      .join('、');
  };

  /* ---- 模型权限弹窗 ---- */
  const modelsVisible = ref(false);
  const recordId = ref();
  const action = ref();

  const modelsHandle = (id: string) => {
    modelsVisible.value = true;
    recordId.value = id;
    action.value = 'group';
  };
</script>

<script lang="ts">
  export default { name: 'GroupSquare' };
</script>

<style scoped lang="less">
  .group-square-page {
    padding: 10px;
  }

  /* ===== 筛选区 ===== */

  .group-square-filter-card {
    margin-bottom: 15px;
    border-radius: 10px;

    :deep(.arco-card-body) {
      padding: 15px 15px 0px 15px;
    }
  }

  .group-square-search-row {
    display: flex;
    justify-content: center;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--color-fill-2);
  }

  .group-square-search-wrap {
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

  .group-square-search-icon {
    flex-shrink: 0;
    color: var(--color-text-3);
    margin-right: 8px;
  }

  .group-square-search-input {
    flex: 1;
    min-width: 0;
  }

  .group-square-search-btn {
    flex-shrink: 0;
    border-radius: 16px;
    padding: 0 20px;
    height: 32px;
  }

  .group-square-filter-row {
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

  .group-square-filter-label {
    flex-shrink: 0;
    width: 90px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-2);
    line-height: 28px;
    text-align: right;
    padding-right: 20px;
  }

  .group-square-filter-body {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 10px;
  }

  .group-square-pill {
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

  .group-square-pill-on {
    color: rgb(var(--primary-6));
    font-weight: 500;
    background: rgba(var(--primary-6), 0.08);
  }

  /* ===== 统计条 ===== */

  .group-square-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 2px;
    padding: 0 10px;
    font-size: 13px;
    color: var(--color-text-3);
  }

  .group-square-desc {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
  }

  .group-square-info-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .group-square-info-reset {
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

  .group-square-body {
    width: 100%;
    min-height: 260px;
  }

  .group-square-col {
    margin-bottom: 12px;
  }

  /* ===== 分页 ===== */

  .group-square-pager {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }

  /* ===== 详情弹窗 ===== */

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
    animation: group-tech-bg-flow 5s ease-in-out infinite alternate;
  }

  @keyframes group-tech-bg-flow {
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
    gap: 8px;
  }

  .tech-name-text {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text-1);
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &--bold {
      font-weight: 800;
    }
  }

  .tech-default-badge {
    flex-shrink: 0;
    font-size: 11px;
    line-height: 1;
    padding: 3px 8px;
    border-radius: 4px;
    color: rgb(var(--primary-6));
    background: rgba(var(--primary-6), 0.08);
    border: 1px solid rgba(var(--primary-6), 0.15);
    font-weight: 500;
  }

  .tech-meta-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .tech-billing-tags {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }

  .tech-expire {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--color-text-3);
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

  .tech-models-card {
    .tech-card-icon--models {
      background: rgba(var(--primary-6), 0.08);
      color: rgb(var(--primary-6));
    }
  }

  .tech-card-content {
    padding: 8px 12px 10px;
  }

  .tech-card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
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

  .tech-card-count {
    font-size: 12px;
    color: var(--color-text-3);
    font-weight: 400;
  }

  .tech-card-view-btn {
    margin-left: auto;
    font-size: 12px;
    color: rgb(var(--primary-6));
    padding: 0 4px;
    height: auto;
    line-height: 1;
  }

  /* --- 时段规则表格美化 --- */
  :deep(.tech-card-content) {
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
</style>

<style lang="less">
  .group-tech-modal {
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
