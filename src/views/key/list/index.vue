<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-safe />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('key.menu') }}</a-breadcrumb-item>
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
                <a-form-item field="provider_id" :label="$t('common.provider')">
                  <a-select
                    v-model="searchFormData.provider_id"
                    :placeholder="$t('common.all')"
                    :scrollbar="false"
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="item in providers"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item field="key" :label="$t('common.key')">
                  <a-input
                    v-model="searchFormData.key"
                    :placeholder="$t('placeholder.key')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="9">
                <a-form-item field="models" :label="$t('common.model')">
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
              <a-col :span="7">
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
              <a-col :span="9">
                <a-form-item field="remark" :label="$t('key.form.remark')">
                  <a-input
                    v-model="searchFormData.remark"
                    :placeholder="$t('key.form.placeholder.remark')"
                    allow-clear
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
              @click="$router.push({ name: 'KeyCreate' })"
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
            <a-button
              type="primary"
              status="success"
              :disabled="allMultiple"
              :title="allMultiple ? $t('placeholder.search.data') : ''"
              @click="
                handleBatch({
                  action: 'all-status',
                  value: 1,
                })
              "
            >
              {{ $t('button.all.enable') }}
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="allMultiple"
              :title="allMultiple ? $t('placeholder.search.data') : ''"
              @click="
                handleBatch({
                  action: 'all-status',
                  value: 2,
                })
              "
            >
              {{ $t('button.all.disable') }}
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="allMultiple"
              :title="allMultiple ? $t('placeholder.search.data') : ''"
              @click="
                handleBatch({
                  action: 'all-delete',
                })
              "
            >
              {{ $t('button.all.delete') }}
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
        <template #key="{ record }">
          {{
            record.key.length > 11
              ? record.key.substr(0, 10) + record.key.substr(-10)
              : record.key
          }}
          <icon-copy class="copy-btn" @click="handleCopy(record.id)" />
        </template>
        <template #models="{ record }">
          <span v-if="record.models">
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
          {{ record.weight || 0 }}
        </template>
        <template #remark="{ record }">
          {{ record.remark || '-' }}
        </template>
        <template #status="{ record }">
          <a-switch
            v-model="record.status"
            :checked-value="1"
            :unchecked-value="2"
            @change="
              keyChangeStatus({
                id: record.id,
                status: record.status,
              })
            "
          />
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('button.detail') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'KeyUpdate',
                query: { id: record.id },
              })
            "
          >
            {{ $t('button.update') }}
          </a-button>
        </template>
      </a-table>

      <a-drawer
        :title="$t('key.menu.detail')"
        unmount-on-close
        render-to-body
        :width="700"
        :footer="false"
        :visible="detailVisible"
        @cancel="detailHandleCancel"
      >
        <Detail :id="recordId" />
      </a-drawer>

      <!-- 绑定模型 -->
      <a-modal
        v-model:visible="modelsVisible"
        :title="$t('common.bind_models')"
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
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Message, Modal } from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import {
    queryKeyPage,
    KeyPage,
    KeyPageParams,
    KeyChangeStatus,
    submitKeyChangeStatus,
    KeyBatchOperate,
    submitKeyBatchOperate,
    queryKeyDetail,
  } from '@/api/key';
  import { queryModelList, ModelList } from '@/api/model';
  import { queryModelAgentList, ModelAgentList } from '@/api/model_agent';
  import { queryProviderList, ProviderList } from '@/api/provider';
  import { useClipboard } from '@vueuse/core';
  import Models from '@/views/common/models.vue';
  import Quota from '@/views/common/quota.vue';
  import Detail from '../detail/index.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const route = useRoute();

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const generateSearchParams = () => {
    return {
      type: 2,
      provider_id: '',
      key: '',
      models: [],
      model_agents: ref(),
      quota: ref(),
      status: ref(),
      remark: '',
    };
  };

  const renderData = ref<KeyPage[]>([]);
  const searchFormData = ref(generateSearchParams());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');
  const ids = ref<Array<string>>([]);
  const multiple = ref(true);
  const allMultiple = ref(true);
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
      title: t('common.provider'),
      dataIndex: 'provider_name',
      slotName: 'provider_name',
      align: 'center',
      width: 120,
    },
    {
      title: t('common.key'),
      dataIndex: 'key',
      slotName: 'key',
      align: 'center',
      width: 230,
    },
    {
      title: t('common.bind_models'),
      dataIndex: 'models',
      slotName: 'models',
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
      title: t('common.weight'),
      dataIndex: 'weight',
      slotName: 'weight',
      align: 'center',
      width: 60,
    },
    {
      title: t('common.remark'),
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
      title: t('common.updated_at'),
      dataIndex: 'updated_at',
      slotName: 'updated_at',
      align: 'center',
      width: 132,
    },
    {
      title: t('common.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 120,
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

  const modelAgentId = new Array(0);
  if (route.query.agent_id) {
    modelAgentId[0] = route.query.agent_id;
  }

  const fetchData = async (
    params: KeyPageParams = {
      ...basePagination,
      type: 2,
      model_agents: modelAgentId,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryKeyPage(params);
      renderData.value = data.items;
      pagination.current = params.current;
      pagination.pageSize = params.pageSize;
      pagination.total = data.paging.total;
      if (
        data.items.length > 0 &&
        (searchFormData.value.provider_id ||
          searchFormData.value.key ||
          searchFormData.value.models.length > 0 ||
          searchFormData.value.model_agents ||
          searchFormData.value.status ||
          searchFormData.value.remark)
      ) {
        allMultiple.value = false;
      } else {
        allMultiple.value = true;
      }
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
    } as unknown as KeyPageParams);
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

  const providers = ref<ProviderList[]>([]);

  const getProviderList = async () => {
    try {
      const { data } = await queryProviderList();
      providers.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getProviderList();

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

      const modelAgentId = new Array(0);
      if (route.query.agent_id) {
        modelAgentId[0] = route.query.agent_id;
        searchFormData.value.model_agents = modelAgentId;
      }
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getModelAgentList();

  const keyChangeStatus = async (params: KeyChangeStatus) => {
    setLoading(true);
    try {
      await submitKeyChangeStatus(params);
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
   * @param rowKeys ID 列表
   */
  const handleSelectionChange = (rowKeys: Array<any>) => {
    ids.value = rowKeys;
    multiple.value = !rowKeys.length;
  };

  /**
   * 批量操作
   */
  const handleBatch = (params: KeyBatchOperate) => {
    if (allMultiple.value && ids.value.length === 0) {
      Message.info('placeholder.operation.search_data');
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
        case 'all-status':
          if (params.value === 1) {
            alertContent = t('placeholder.batch.operation.all.enable', {
              count: pagination.total,
            });
          } else {
            alertContent = t('placeholder.batch.operation.all.disable', {
              count: pagination.total,
            });
          }
          break;
        case 'all-delete':
          alertContent = t('placeholder.batch.operation.all.delete', {
            count: pagination.total,
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
          params.ids = ids.value;
          submitKeyBatchOperate({ ...params, ...searchFormData.value }).then(
            (res) => {
              setLoading(false);
              Message.success(t('success.task'));
              search();
              tableRef.value.selectAll(false);
            }
          );
        },
      });
    }
  };

  /**
   * 复制内容
   *
   * @param content 内容
   */
  const { copy, copied } = useClipboard();
  const handleCopy = async (id: string) => {
    const { data } = await queryKeyDetail({ id });
    copy(data.key);
  };

  watch(copied, () => {
    if (copied.value) {
      Message.success(t('success.copy'));
    }
  });

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
    action.value = 'key';
  };
</script>

<script lang="ts">
  export default {
    name: 'KeyList',
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

  .copy-btn {
    color: gray;
    cursor: pointer;
  }
  .copy-btn:hover {
    color: rgb(var(--arcoblue-6));
  }
</style>
