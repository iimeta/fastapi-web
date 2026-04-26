<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <lucide-combine />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('group.menu') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card
      class="general-card"
      :bordered="false"
      :header-style="cardHeaderStyle"
      :body-style="cardBodyStyle"
    >
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="searchFormData"
            :label-col-props="{ span: 5 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="name" :label="$t('group.label.name')">
                  <a-input
                    v-model="searchFormData.name"
                    :placeholder="$t('group.placeholder.name')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="models" :label="$t('common.models')">
                  <a-select
                    v-model="searchFormData.models"
                    :placeholder="$t('common.all')"
                    :max-tag-count="2"
                    :scrollbar="false"
                    multiple
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="item in models"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="model_agents"
                  :label="$t('common.model_agents')"
                >
                  <a-select
                    v-model="searchFormData.model_agents"
                    :placeholder="$t('common.all')"
                    :max-tag-count="2"
                    :scrollbar="false"
                    multiple
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="item in modelAgents"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="remark" :label="$t('group.label.remark')">
                  <a-input
                    v-model="searchFormData.remark"
                    :placeholder="$t('group.placeholder.remark')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('common.status')">
                  <a-select
                    v-model="searchFormData.status"
                    :placeholder="$t('common.all')"
                    :options="statusOptions"
                    :scrollbar="false"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="expires_at"
                  :label="$t('common.expires_at')"
                >
                  <a-range-picker
                    v-model="searchFormData.expires_at"
                    class="list-full-width"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider class="list-search-divider" direction="vertical" />
        <a-col :flex="'86px'" class="list-search-actions">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('button.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('button.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>

      <a-divider class="list-toolbar-divider" />

      <a-row class="list-toolbar-row" :gutter="12">
        <a-col :span="16">
          <a-space wrap>
            <a-button
              type="primary"
              @click="$router.push({ name: 'GroupCreate' })"
            >
              {{ $t('button.create') }}
            </a-button>
            <a-button
              type="primary"
              status="success"
              :disabled="multiple"
              :title="multiple ? $t('placeholder.operation.data') : ''"
              @click="handleBatch({ action: 'status', value: 1 })"
            >
              {{ $t('button.enable') }}
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="multiple"
              :title="multiple ? $t('placeholder.operation.data') : ''"
              @click="handleBatch({ action: 'status', value: 2 })"
            >
              {{ $t('button.disable') }}
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="multiple"
              :title="multiple ? $t('placeholder.operation.data') : ''"
              @click="handleBatch({ action: 'delete' })"
            >
              {{ $t('button.delete') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="8" class="list-table-actions">
          <a-tooltip :content="$t('action.refresh')">
            <div class="action-icon" @click="search">
              <icon-refresh size="18" />
            </div>
          </a-tooltip>
          <a-tooltip :content="$t('action.list_view')">
            <div class="action-icon" @click="switchView('list')">
              <icon-menu size="18" />
            </div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('action.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('action.column_setting')">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="groupCardFieldSetting">
                  <div
                    v-for="(item, index) in showFields"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div class="list-drag-handle">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="handleFieldChange($event, item, index)"
                      />
                    </div>
                    <div class="title">{{ item.title }}</div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>

      <div class="group-card-toolbar">
        <a-checkbox
          :model-value="allCurrentChecked"
          :indeterminate="indeterminate"
          @change="toggleSelectAll"
        >
          {{ $t('common.all') }}
        </a-checkbox>
      </div>

      <a-spin :loading="loading" class="group-card-body">
        <a-empty
          v-if="!loading && renderData.length === 0"
          style="padding: 80px 0"
        />
        <div v-else class="list-wrap group-card-wrap">
          <a-row class="list-row" :gutter="24">
            <a-col
              v-for="item in renderData"
              :key="item.id"
              :xs="12"
              :sm="12"
              :md="12"
              :lg="8"
              :xl="8"
              :xxl="6"
              class="list-col"
            >
              <CardItem
                :record="item"
                :checked="ids.includes(item.id)"
                :size="size"
                :visible-fields="visibleFields"
                @toggle-check="toggleSelection(item.id, $event)"
                @detail="detailHandle"
                @models="modelsHandle"
                @update="updateHandle"
                @time-rules="viewTimeRules"
                @public-change="groupChangePublic"
                @status-change="groupChangeStatus"
                @expire-change="groupChangeExpire"
              />
            </a-col>
          </a-row>
        </div>
      </a-spin>

      <div v-if="(pagination.total || 0) > 0" class="group-card-pager">
        <a-pagination
          :current="pagination.current"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          show-total
          show-page-size
          :page-size-options="basePagination.pageSizeOptions"
          @change="onPageChange"
          @page-size-change="onPageSizeChange"
        />
      </div>

      <a-drawer
        :title="$t('group.menu.detail')"
        unmount-on-close
        render-to-body
        :width="700"
        :footer="false"
        :visible="detailVisible"
        @cancel="detailHandleCancel"
      >
        <Detail :id="recordId" />
      </a-drawer>

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

      <a-modal
        v-model:visible="timeRulesVisible"
        hide-title
        hide-cancel
        simple
        width="888px"
        :ok-text="$t('button.close')"
      >
        <a-table
          :columns="timeRulesColumns"
          :data="timeRulesData"
          :pagination="false"
          :bordered="false"
        >
          <template #discount="{ record }">
            {{ formatDiscountText(record.discount) }}
          </template>
          <template #model_names="{ record }">
            {{ record.model_names?.join(', ') || $t('common.all') }}
          </template>
          <template #time_range="{ record }">
            {{ formatMs(record.start_time) }}~{{ formatMs(record.end_time) }}
          </template>
          <template #days="{ record }">
            {{ formatDays(record) }}
          </template>
          <template #priority_title>
            {{ $t('time_rule.label.priority') }}
            <a-tooltip :content="$t('time_rule.placeholder.priority')">
              <icon-question-circle class="priority-tooltip" />
            </a-tooltip>
          </template>
        </a-table>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, reactive, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { Message, Modal } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import {
    queryGroupPage,
    GroupPage,
    GroupPageParams,
    GroupChangePublic,
    submitGroupChangePublic,
    GroupChangeExpire,
    submitGroupChangeExpire,
    GroupChangeStatus,
    submitGroupChangeStatus,
    GroupBatchOperate,
    submitGroupBatchOperate,
  } from '@/api/group';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { queryModelList, ModelList } from '@/api/model';
  import { queryModelAgentList, ModelAgentList } from '@/api/model_agent';
  import Models from '@/views/common/models.vue';
  import Detail from '../detail/index.vue';
  import CardItem from '../components/card-item.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type SearchParams = {
    name: string;
    models: string[];
    model_agents: string[];
    status: number | undefined;
    remark: string;
    expires_at: string[];
  };
  type FieldItem = {
    title: string;
    dataIndex: string;
    checked?: boolean;
  };
  type GroupCardRecord = GroupPage & {
    model_agent_names?: string[];
    weight?: number;
    is_public?: boolean;
    is_enable_model_agent?: boolean;
    lb_strategy?: number;
  };

  const { t } = useI18n();
  const router = useRouter();
  localStorage.setItem('groupListView', 'card');
  const { loading, setLoading } = useLoading(true);

  const cardHeaderStyle = { padding: '20px' };
  const cardBodyStyle = { padding: '25px 20px 20px 20px' };
  const modelsModalStyle = { padding: '25px 15px 20px 15px' };

  const generateSearchParams = (): SearchParams => ({
    name: '',
    models: [],
    model_agents: [],
    status: undefined,
    remark: '',
    expires_at: [],
  });

  const renderData = ref<GroupCardRecord[]>([]);
  const searchFormData = ref(generateSearchParams());
  const size = ref<SizeProps>('medium');
  const ids = ref<string[]>([]);
  const recordId = ref('');
  const action = ref('');
  const detailVisible = ref(false);
  const modelsVisible = ref(false);
  const timeRulesVisible = ref(false);
  const timeRulesData = ref<any[]>([]);
  let fieldSortable: Sortable | null = null;

  const basePagination: Pagination = {
    current: 1,
    pageSize: 60,
    showTotal: true,
    showPageSize: true,
    pageSizeOptions: [20, 60, 100, 500, 1000],
  };

  const pagination = reactive({ ...basePagination });

  const fieldOptions = computed<FieldItem[]>(() => [
    { title: t('common.multiplier'), dataIndex: 'time_rules' },
    { title: t('common.models'), dataIndex: 'models' },
    { title: t('common.model_agents'), dataIndex: 'model_agent_names' },
    { title: t('common.used_quota'), dataIndex: 'used_quota' },
    { title: t('group.label.weight'), dataIndex: 'weight' },
    { title: t('common.lb_strategy'), dataIndex: 'lb_strategy' },
    { title: t('common.public'), dataIndex: 'is_public' },
    { title: t('common.expires_at'), dataIndex: 'expires_at' },
  ]);

  const cloneFields = ref<FieldItem[]>([]);
  const showFields = ref<FieldItem[]>([]);

  watch(
    () => fieldOptions.value,
    (val) => {
      cloneFields.value = cloneDeep(val);
      cloneFields.value.forEach((item) => {
        item.checked = !['expires_at'].includes(item.dataIndex);
      });
      showFields.value = cloneDeep(cloneFields.value);
    },
    { deep: true, immediate: true }
  );

  const visibleFields = computed(() =>
    cloneFields.value.filter((item) => item.checked)
  );

  const densityList = computed(() => [
    { name: t('size.mini'), value: 'mini' },
    { name: t('size.small'), value: 'small' },
    { name: t('size.medium'), value: 'medium' },
    { name: t('size.large'), value: 'large' },
  ]);

  const statusOptions = computed<SelectOptionData[]>(() => [
    { label: t('dict.status.1'), value: 1 },
    { label: t('dict.status.2'), value: 2 },
  ]);

  const models = ref<ModelList[]>([]);
  const modelAgents = ref<ModelAgentList[]>([]);

  const multiple = computed(() => ids.value.length === 0);
  const currentPageIds = computed(() =>
    renderData.value.map((item) => item.id)
  );
  const allCurrentChecked = computed(
    () =>
      currentPageIds.value.length > 0 &&
      currentPageIds.value.every((id) => ids.value.includes(id))
  );
  const indeterminate = computed(
    () =>
      ids.value.length > 0 &&
      currentPageIds.value.some((id) => ids.value.includes(id)) &&
      !allCurrentChecked.value
  );

  const clearSelection = () => {
    ids.value = [];
  };

  const fetchData = async (
    params: GroupPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryGroupPage(params);
      renderData.value = data.items as GroupCardRecord[];
      pagination.current = params.current;
      pagination.pageSize = params.pageSize;
      pagination.total = data.paging.total;
      clearSelection();
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };
  fetchData();

  const search = () => {
    fetchData({
      ...basePagination,
      ...searchFormData.value,
    } as unknown as GroupPageParams);
  };

  const reset = () => {
    searchFormData.value = generateSearchParams();
    search();
  };

  const onPageChange = (current: number) => {
    fetchData({
      ...basePagination,
      ...searchFormData.value,
      current,
    } as unknown as GroupPageParams);
  };

  const onPageSizeChange = (pageSize: number) => {
    basePagination.pageSize = pageSize;
    fetchData({
      ...basePagination,
      ...searchFormData.value,
    } as unknown as GroupPageParams);
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined
  ) => {
    size.value = val as SizeProps;
  };

  const handleFieldChange = (
    checked: boolean | (string | boolean | number)[],
    field: FieldItem,
    index: number
  ) => {
    if (!checked) {
      cloneFields.value = showFields.value.filter(
        (item) => item.dataIndex !== field.dataIndex
      );
    } else {
      cloneFields.value.splice(index, 0, field);
    }
  };

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (visible: boolean) => {
    if (visible) {
      nextTick(() => {
        const el = document.getElementById(
          'groupCardFieldSetting'
        ) as HTMLElement;
        if (!el) return;
        fieldSortable?.destroy();
        fieldSortable = new Sortable(el, {
          onEnd(e: Sortable.SortableEvent) {
            const { oldIndex, newIndex } = e;
            if (oldIndex === undefined || newIndex === undefined) return;
            exchangeArray(cloneFields.value, oldIndex, newIndex);
            exchangeArray(showFields.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  const toggleSelection = (id: string, checked: boolean) => {
    if (checked) {
      if (!ids.value.includes(id)) {
        ids.value = [...ids.value, id];
      }
      return;
    }
    ids.value = ids.value.filter((item) => item !== id);
  };

  const toggleSelectAll = (
    checked: boolean | (string | boolean | number)[]
  ) => {
    if (checked) {
      ids.value = [...currentPageIds.value];
      return;
    }
    clearSelection();
  };

  const getModelList = async () => {
    try {
      const { data } = await queryModelList();
      models.value = data.items;
    } catch (err) {
      // ignore
    }
  };
  getModelList();

  const getModelAgentList = async () => {
    try {
      const { data } = await queryModelAgentList();
      modelAgents.value = data.items;
    } catch (err) {
      // ignore
    }
  };
  getModelAgentList();

  const groupChangePublic = (params: GroupChangePublic) => {
    const item = renderData.value.find((r) => r.id === params.id);
    if (item) item.is_public = !params.is_public;
    const confirmKey = params.is_public
      ? 'group.public.enable.confirm'
      : 'group.public.disable.confirm';
    Modal.warning({
      title: t('modal.warning.title'),
      titleAlign: 'center',
      content: t(confirmKey),
      okText: t('button.ok'),
      cancelText: t('button.cancel'),
      hideCancel: false,
      onOk: async () => {
        setLoading(true);
        try {
          await submitGroupChangePublic(params);
          Message.success(t('success.operate'));
          search();
        } catch (err) {
          // ignore
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const groupChangeExpire = async (params: GroupChangeExpire) => {
    setLoading(true);
    try {
      await submitGroupChangeExpire(params);
      Message.success(t('success.operate'));
      search();
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const groupChangeStatus = async (params: GroupChangeStatus) => {
    setLoading(true);
    try {
      await submitGroupChangeStatus(params);
      Message.success(t('success.operate'));
      search();
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleBatch = (params: GroupBatchOperate) => {
    if (ids.value.length === 0) {
      Message.info(t('placeholder.operation.data'));
      return;
    }

    let alertContent = t('placeholder.batch.operation', {
      count: ids.value.length,
    });

    switch (params.action) {
      case 'status':
        alertContent =
          params.value === 1
            ? t('placeholder.batch.operation.enable', {
                count: ids.value.length,
              })
            : t('placeholder.batch.operation.disable', {
                count: ids.value.length,
              });
        break;
      case 'delete':
        alertContent = t('placeholder.batch.operation.delete', {
          count: ids.value.length,
        });
        break;
      default:
    }

    Modal.warning({
      title: t('modal.warning.title'),
      titleAlign: 'center',
      content: alertContent,
      okText: t('button.ok'),
      cancelText: t('button.cancel'),
      hideCancel: false,
      onOk: () => {
        setLoading(true);
        submitGroupBatchOperate({
          ...params,
          ids: ids.value,
        }).then(() => {
          setLoading(false);
          Message.success(t('success.operate'));
          search();
        });
      },
    });
  };

  const detailHandle = (id: string) => {
    detailVisible.value = true;
    recordId.value = id;
  };

  const detailHandleCancel = () => {
    detailVisible.value = false;
  };

  const modelsHandle = (id: string) => {
    modelsVisible.value = true;
    recordId.value = id;
    action.value = 'group';
  };

  const updateHandle = (id: string) => {
    router.push({
      name: 'GroupUpdate',
      query: { id },
    });
  };

  const switchView = (view: 'list' | 'card') => {
    localStorage.setItem('groupListView', view);
    router.replace({
      name: view === 'card' ? 'GroupCardList' : 'GroupList',
    });
  };

  const tableHeaderCellStyle = { background: 'var(--color-bg-2)' };

  const timeRulesColumns = computed<TableColumnData[]>(() => [
    {
      title: t('time_rule.label.rule'),
      headerCellStyle: tableHeaderCellStyle,
      children: [
        {
          title: t('time_rule.label.name'),
          dataIndex: 'name',
          align: 'center',
          width: 100,
        },
        {
          title: t('common.multiplier'),
          slotName: 'discount',
          align: 'center',
          width: 100,
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
          width: 100,
        },
        {
          title: t('common.model'),
          slotName: 'model_names',
          align: 'center',
          width: 100,
          ellipsis: true,
          tooltip: true,
        },
      ],
    },
  ]);

  const getDiscountRange = (rules: any[]) => {
    const discounts = rules.map((r: any) => r.discount);
    const min = Math.min(...discounts);
    const max = Math.max(...discounts);
    return `${formatDiscountText(min)}~${formatDiscountText(max)}`;
  };

  const formatDiscountText = (discount: number) => `${discount / 100}x`;

  const viewTimeRules = (rules: any[]) => {
    timeRulesData.value = rules;
    timeRulesVisible.value = true;
  };

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
</script>

<script lang="ts">
  export default {
    name: 'GroupCardList',
  };
</script>

<style scoped lang="less">
  .group-card-toolbar {
    display: flex;
    align-items: center;
    padding-bottom: 16px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .group-card-body {
    width: 100%;
  }

  .group-card-wrap {
    .list-row {
      align-items: stretch;
    }

    .list-col {
      margin-bottom: 16px;
    }
  }

  .group-card-pager {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
  }

  .priority-tooltip {
    cursor: pointer;
    color: var(--color-text-3);
  }
</style>
