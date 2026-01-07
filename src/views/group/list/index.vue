<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-user-group />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('group.menu') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card
      class="general-card"
      :bordered="false"
      :header-style="{ padding: '20px' }"
      :body-style="{
        padding: '25px 20px 20px 20px',
      }"
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
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
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
      <a-divider style="margin-top: 0; margin-bottom: 16px" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
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
              @click="
                handleBatch({
                  action: 'status',
                  value: 1,
                })
              "
            >
              {{ $t('button.enable') }}
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="multiple"
              :title="multiple ? $t('placeholder.operation.data') : ''"
              @click="
                handleBatch({
                  action: 'status',
                  value: 2,
                })
              "
            >
              {{ $t('button.disable') }}
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="multiple"
              :title="multiple ? $t('placeholder.operation.data') : ''"
              @click="
                handleBatch({
                  action: 'delete',
                })
              "
            >
              {{ $t('button.delete') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="
            display: flex;
            height: 32px;
            align-items: center;
            justify-content: end;
          "
        >
          <a-tooltip :content="$t('action.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
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
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="handleChange($event, item, index)"
                      >
                      </a-checkbox>
                    </div>
                    <div class="title"> {{ item.title }} </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        ref="tableRef"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="cloneColumns"
        :data="renderData"
        :bordered="false"
        :size="size"
        :row-selection="rowSelection"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template #name="{ record }">
          <span
            v-if="record.is_default"
            :title="$t('group.detail.label.is_default')"
          >
            <b>{{ record.name }}</b>
          </span>
          <span v-else>
            {{ record.name }}
          </span>
        </template>
        <template #discount="{ record }">
          {{ Number((record.discount * 100).toFixed(2)) }}%
        </template>
        <template #model_names="{ record }">
          <span v-if="record.model_names">
            <a-button type="text" size="small" @click="modelsHandle(record.id)">
              {{ $t('button.view') }}
            </a-button>
          </span>
          <span v-else>{{ '-' }}</span>
        </template>
        <template #model_agent_names="{ record }">
          {{ record?.model_agent_names?.join(',') || '-' }}
        </template>
        <template #used_quota="{ record }">
          <Quota :model-value="record.used_quota" />
        </template>
        <template #weight="{ record }">
          <span v-if="record.is_default">
            <b>{{ $t('common.highest') }}</b>
          </span>
          <span v-else>
            {{ record.weight || '-' }}
          </span>
        </template>
        <template #lb_strategy="{ record }">
          {{
            record.is_enable_model_agent
              ? $t(`dict.lb_strategy.${record.lb_strategy || 1}`)
              : '-'
          }}
        </template>
        <template #is_public="{ record }">
          <a-switch
            v-model="record.is_public"
            :checked-value="true"
            :unchecked-value="false"
            @change="
              groupChangePublic({
                id: record.id,
                is_public: record.is_public,
              })
            "
          />
        </template>
        <template #status="{ record }">
          <a-switch
            v-model="record.status"
            :checked-value="1"
            :unchecked-value="2"
            @change="
              groupChangeStatus({
                id: record.id,
                status: record.status,
              })
            "
          />
        </template>
        <template #remark="{ record }">
          {{ record.remark || '-' }}
        </template>
        <template #expires_at="{ rowIndex }">
          <a-date-picker
            v-model="renderData[rowIndex].expires_at"
            :placeholder="$t('placeholder.expires_at')"
            :time-picker-props="{ defaultValue: '23:59:59' }"
            :disabled-date="disabledDate"
            show-time
            :shortcuts="[
              {
                label: '1',
                value: () =>
                  dayjs(
                    renderData[rowIndex].expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(1, 'day'),
              },
              {
                label: '7',
                value: () =>
                  dayjs(
                    renderData[rowIndex].expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(7, 'day'),
              },
              {
                label: '15',
                value: () =>
                  dayjs(
                    renderData[rowIndex].expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(15, 'day'),
              },
              {
                label: '30',
                value: () =>
                  dayjs(
                    renderData[rowIndex].expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(30, 'day'),
              },
              {
                label: '90',
                value: () =>
                  dayjs(
                    renderData[rowIndex].expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(90, 'day'),
              },
              {
                label: '180',
                value: () =>
                  dayjs(
                    renderData[rowIndex].expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(180, 'day'),
              },
              {
                label: '365',
                value: () =>
                  dayjs(
                    renderData[rowIndex].expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(365, 'day'),
              },
            ]"
            @change="
              groupChangeExpire({
                id: renderData[rowIndex].id,
                expires_at: renderData[rowIndex].expires_at,
              })
            "
          >
            <a-button style="width: 150px">{{
              renderData[rowIndex].expires_at || $t('placeholder.expires_at')
            }}</a-button>
          </a-date-picker>
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('button.view') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'GroupUpdate',
                query: { id: record.id },
              })
            "
          >
            {{ $t('button.update') }}
          </a-button>
          <a-popconfirm
            :content="$t('placeholder.operation.delete')"
            @ok="groupDelete({ id: record.id })"
          >
            <a-button type="text" size="small">
              {{ $t('button.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>

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

      <!-- 模型权限 -->
      <a-modal
        v-model:visible="modelsVisible"
        :title="$t('common.models')"
        :modal-style="{
          padding: '25px 15px 20px 15px',
        }"
        unmount-on-close
        hide-cancel
        simple
        width="1080px"
        :ok-text="$t('button.close')"
      >
        <Models :id="recordId" :action="action" />
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Message, Modal } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  import { disabledDate } from '@/utils/common';
  import {
    queryGroupPage,
    GroupPage,
    GroupPageParams,
    submitGroupDelete,
    GroupDeleteParams,
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
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { queryModelList, ModelList } from '@/api/model';
  import { queryModelAgentList, ModelAgentList } from '@/api/model_agent';
  import Models from '@/views/common/models.vue';
  import Quota from '@/views/common/quota.vue';
  import Detail from '../detail/index.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const generateSearchParams = () => {
    return {
      name: '',
      models: [],
      model_agents: [],
      status: ref(),
      remark: '',
      expires_at: [],
    };
  };

  const renderData = ref<GroupPage[]>([]);
  const searchFormData = ref(generateSearchParams());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');
  const ids = ref<Array<string>>([]);
  const multiple = ref(true);
  const tableRef = ref();

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
    showTotal: true,
    showPageSize: true,
    pageSizeOptions: [20, 50, 100, 500, 1000],
  };

  const pagination = reactive({
    ...basePagination,
  });

  const densityList = computed(() => [
    {
      name: t('size.mini'),
      value: 'mini',
    },
    {
      name: t('size.small'),
      value: 'small',
    },
    {
      name: t('size.medium'),
      value: 'medium',
    },
    {
      name: t('size.large'),
      value: 'large',
    },
  ]);

  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('group.label.name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.discount'),
      dataIndex: 'discount',
      slotName: 'discount',
      align: 'center',
    },
    {
      title: t('common.models'),
      dataIndex: 'model_names',
      slotName: 'model_names',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.model_agents'),
      dataIndex: 'model_agent_names',
      slotName: 'model_agent_names',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.used_quota'),
      dataIndex: 'used_quota',
      slotName: 'used_quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('group.label.weight'),
      dataIndex: 'weight',
      slotName: 'weight',
      align: 'center',
    },
    {
      title: t('common.lb_strategy'),
      dataIndex: 'lb_strategy',
      slotName: 'lb_strategy',
      align: 'center',
    },
    {
      title: t('common.public'),
      dataIndex: 'is_public',
      slotName: 'is_public',
      align: 'center',
      width: 65,
    },
    {
      title: t('group.label.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 65,
    },
    {
      title: t('common.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 170,
    },
  ]);

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('dict.status.1'),
      value: 1,
    },
    {
      label: t('dict.status.2'),
      value: 2,
    },
  ]);

  const fetchData = async (
    params: GroupPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryGroupPage(params);
      renderData.value = data.items;
      pagination.current = params.current;
      pagination.pageSize = params.pageSize;
      pagination.total = data.paging.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
      tableRef.value.selectAll(false);
    }
  };
  fetchData();

  const search = () => {
    fetchData({
      ...basePagination,
      ...searchFormData.value,
    } as unknown as GroupPageParams);
  };

  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, ...searchFormData.value, current });
  };

  const onPageSizeChange = (pageSize: number) => {
    basePagination.pageSize = pageSize;
    fetchData({ ...basePagination, ...searchFormData.value });
  };

  const reset = () => {
    searchFormData.value = generateSearchParams();
    search();
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
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
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        const sortable = new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );

  const models = ref<ModelList[]>([]);

  const getModelList = async () => {
    try {
      const { data } = await queryModelList();
      models.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getModelList();

  const modelAgents = ref<ModelAgentList[]>([]);

  const getModelAgentList = async () => {
    try {
      const { data } = await queryModelAgentList();
      modelAgents.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getModelAgentList();

  const groupDelete = async (params: GroupDeleteParams) => {
    setLoading(true);
    try {
      await submitGroupDelete(params);
      Message.success(t('success.delete'));
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const groupChangePublic = async (params: GroupChangePublic) => {
    setLoading(true);
    try {
      await submitGroupChangePublic(params);
      Message.success(t('success.operate'));
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const groupChangeExpire = async (params: GroupChangeExpire) => {
    setLoading(true);
    try {
      await submitGroupChangeExpire(params);
      Message.success(t('success.operate'));
      search();
    } catch (err) {
      // you can report use errorHandler or other
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
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  /**
   * 已选择的数据行发生改变时触发
   *
   * @param rowGroups ID 列表
   */
  const handleSelectionChange = (rowGroups: Array<any>) => {
    ids.value = rowGroups;
    multiple.value = !rowGroups.length;
  };

  /**
   * 批量操作
   */
  const handleBatch = (params: GroupBatchOperate) => {
    if (ids.value.length === 0) {
      Message.info(t('placeholder.operation.data'));
    } else {
      let alertContent = t('placeholder.batch.operation', {
        count: ids.value.length,
      });
      switch (params.action) {
        case 'status':
          if (params.value === 1) {
            alertContent = t('placeholder.batch.operation.enable', {
              count: ids.value.length,
            });
          } else {
            alertContent = t('placeholder.batch.operation.disable', {
              count: ids.value.length,
            });
          }
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
        hideCancel: false,
        onOk: () => {
          setLoading(true);
          params.ids = ids.value;
          submitGroupBatchOperate(params).then((res) => {
            setLoading(false);
            Message.success(t('success.operate'));
            search();
            tableRef.value.selectAll(false);
          });
        },
      });
    }
  };

  const detailVisible = ref(false);
  const recordId = ref();

  const detailHandle = (id: string) => {
    detailVisible.value = true;
    recordId.value = id;
  };
  const detailHandleCancel = () => {
    detailVisible.value = false;
  };

  const modelsVisible = ref(false);
  const action = ref();

  const modelsHandle = (id: string) => {
    modelsVisible.value = true;
    recordId.value = id;
    action.value = 'group';
  };
</script>

<script lang="ts">
  export default {
    name: 'GroupList',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 10px 20px 10px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
  .container-breadcrumb {
    margin: 6px 0;
    :deep(.arco-breadcrumb-item) {
      color: rgb(var(--gray-6));
      &:last-child {
        color: rgb(var(--gray-8));
      }
    }
  }
  .arco-btn-size-small {
    padding: 0 8px;
  }
  .copy-btn {
    color: gray;
    cursor: pointer;
  }
  .copy-btn:hover {
    color: rgb(var(--arcoblue-6));
  }
</style>
