<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-common />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model.list') }}</a-breadcrumb-item>
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
            :model="formModel"
            :label-col-props="{ span: 5 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="corp" :label="$t('model.form.corp')">
                  <a-select
                    v-model="formModel.corp"
                    :options="corpOptions"
                    :placeholder="$t('model.form.selectDefault')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('model.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('model.form.name.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="model" :label="$t('model.form.model')">
                  <a-input
                    v-model="formModel.model"
                    :placeholder="$t('model.form.model.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="type" :label="$t('model.form.type')">
                  <a-select
                    v-model="formModel.type"
                    :options="typeOptions"
                    :placeholder="$t('model.form.selectDefault')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('model.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('model.form.selectDefault')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="created_at"
                  :label="$t('model.form.created_at')"
                >
                  <a-range-picker
                    v-model="formModel.created_at"
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
              {{ $t('model.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('model.form.reset') }}
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
              @click="$router.push({ name: 'ModelCreate' })"
            >
              {{ $t('model.operation.create') }}
            </a-button>
            <a-button
              type="primary"
              status="success"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'agent',
                  value: 'all',
                })
              "
            >
              全部代理
            </a-button>
            <a-button
              type="primary"
              status="success"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'agent',
                  value: true,
                })
              "
            >
              启用代理
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'agent',
                  value: false,
                })
              "
            >
              关闭代理
            </a-button>
            <a-button
              type="primary"
              status="success"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'forward',
                  value: 'all',
                })
              "
            >
              全部转发
            </a-button>
            <a-button
              type="primary"
              status="success"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'forward',
                  value: true,
                })
              "
            >
              启用转发
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'forward',
                  value: false,
                })
              "
            >
              关闭转发
            </a-button>
            <a-button
              type="primary"
              status="success"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'status',
                  value: 1,
                })
              "
            >
              启用
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'status',
                  value: 2,
                })
              "
            >
              禁用
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'delete',
                })
              "
            >
              删除
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
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
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
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
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
                        @change="
                          handleChange($event, item as TableColumnData, index)
                        "
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
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
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        :row-selection="rowSelection"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template #type="{ record }">
          {{ $t(`model.dict.type.${record.type}`) }}
        </template>
        <template #corp="{ record }">
          {{ $t(`model.dict.corp.${record.corp}`) }}
        </template>
        <template #prompt_price="{ record }">
          {{ record.billing_method === 1 ? `$${record.prompt_price}/k` : '-' }}
        </template>
        <template #completion_price="{ record }">
          {{
            record.billing_method === 1
              ? `$${record.completion_price}/k`
              : `$${record.fixed_price}/次`
          }}
        </template>
        <!-- <template #billingMethod="{ record }">
          {{ $t(`model.dict.billing_method.${record.billing_method}`) }}
        </template>
        <template #dataFormat="{ record }">
          {{ $t(`model.dict.data_format.${record.data_format}`) }}
        </template> -->
        <template #status="{ record }">
          <a-switch
            v-model="record.status"
            :checked-value="1"
            :unchecked-value="2"
            @change="
              modelChangeStatus({
                id: `${record.id}`,
                status: Number(`${record.status}`),
              })
            "
          />
        </template>
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'ModelDetail',
                query: { id: `${record.id}` },
              })
            "
          >
            {{ $t('model.columns.operations.view') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'ModelUpdate',
                query: { id: `${record.id}` },
              })
            "
          >
            {{ $t('model.columns.operations.update') }}
          </a-button>
          <a-popconfirm
            content="你确定要删除吗?"
            @ok="modelDelete({ id: `${record.id}` })"
          >
            <a-button type="text" size="small">
              {{ $t('model.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-modal
        v-model:visible="agentFormVisible"
        :title="$t('model.form.title.model_agent')"
        @cancel="agentHandleCancel"
        @before-ok="agentHandleBeforeOk"
      >
        <a-form ref="agentForm" :model="agentFormData">
          <a-form-item
            field="model_agents"
            :label="$t('model.label.model_agents')"
            :rules="[
              {
                required: true,
                message: $t('model.error.model_agents.required'),
              },
            ]"
          >
            <a-select
              v-model="agentFormData.model_agents"
              :placeholder="$t('model.placeholder.model_agents')"
              :max-tag-count="15"
              multiple
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
        </a-form>
      </a-modal>
      <a-modal
        v-model:visible="forwardFormVisible"
        :title="$t('model.form.title.forward')"
        @cancel="forwardHandleCancel"
        @before-ok="forwardHandleBeforeOk"
      >
        <a-form ref="forwardForm" :model="forwardFormData">
          <a-form-item
            field="target_model"
            :label="$t('model.label.target_model')"
            :rules="[
              {
                required: true,
                message: $t('model.error.target_model.required'),
              },
            ]"
          >
            <a-select
              v-model="forwardFormData.target_model"
              :placeholder="$t('model.placeholder.target_model')"
            >
              <a-option
                v-for="item in models"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import {
    computed,
    ref,
    reactive,
    watch,
    nextTick,
    getCurrentInstance,
  } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryModelPage,
    ModelPage,
    ModelPageParams,
    submitModelDelete,
    ModelDeleteParams,
    ModelChangeStatus,
    submitModelChangeStatus,
    ModelBatchOperate,
    submitModelBatchOperate,
    queryModelList,
    ModelList,
  } from '@/api/model';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { queryModelAgentList, ModelAgentList } from '@/api/agent';

  const { proxy } = getCurrentInstance() as any;

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

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

  const modelDelete = async (params: ModelDeleteParams) => {
    setLoading(true);
    try {
      await submitModelDelete(params);
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const generateFormModel = () => {
    return {
      corp: '',
      name: '',
      model: '',
      type: ref(),
      status: ref(),
      created_at: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<ModelPage[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');
  const ids = ref<Array<string>>([]);
  const multiple = ref(true);
  const tableRef = ref();

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
    showTotal: true,
    showPageSize: true,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('model.columns.corp'),
      dataIndex: 'corp',
      slotName: 'corp',
      align: 'center',
      width: 110,
    },
    {
      title: t('model.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
    },
    {
      title: t('model.columns.model'),
      dataIndex: 'model',
      slotName: 'model',
      align: 'center',
    },
    // {
    //   title: t('model.columns.type'),
    //   dataIndex: 'type',
    //   slotName: 'type',
    //   align: 'center',
    // },
    {
      title: t('model.columns.prompt_price'),
      dataIndex: 'prompt_price',
      slotName: 'prompt_price',
      align: 'center',
    },
    {
      title: t('model.columns.completion_price'),
      dataIndex: 'completion_price',
      slotName: 'completion_price',
      align: 'center',
    },
    // {
    //   title: t('model.columns.billing_method'),
    //   dataIndex: 'billing_method',
    //   slotName: 'billingMethod',
    //   align: 'center',
    // },
    // {
    //   title: t('model.columns.data_format'),
    //   dataIndex: 'data_format',
    //   slotName: 'dataFormat',
    //   align: 'center',
    // },
    {
      title: t('model.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 65,
    },
    {
      title: t('model.columns.updated_at'),
      dataIndex: 'updated_at',
      slotName: 'updated_at',
      align: 'center',
      width: 132,
    },
    {
      title: t('model.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 170,
    },
  ]);
  const corpOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('model.dict.corp.OpenAI'),
      value: 'OpenAI',
    },
    {
      label: t('model.dict.corp.Baidu'),
      value: 'Baidu',
    },
    {
      label: t('model.dict.corp.Xfyun'),
      value: 'Xfyun',
    },
    {
      label: t('model.dict.corp.Aliyun'),
      value: 'Aliyun',
    },
    {
      label: t('model.dict.corp.ZhipuAI'),
      value: 'ZhipuAI',
    },
    {
      label: t('model.dict.corp.Midjourney'),
      value: 'Midjourney',
    },
  ]);
  const typeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('model.dict.type.1'),
      value: 1,
    },
    {
      label: t('model.dict.type.2'),
      value: 2,
    },
    {
      label: t('model.dict.type.3'),
      value: 3,
    },
    {
      label: t('model.dict.type.4'),
      value: 4,
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('model.dict.status.1'),
      value: 1,
    },
    {
      label: t('model.dict.status.2'),
      value: 2,
    },
  ]);
  const fetchData = async (
    params: ModelPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelPage(params);
      renderData.value = data.items;
      pagination.current = params.current;
      pagination.pageSize = params.pageSize;
      pagination.total = data.paging.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as ModelPageParams);
  };

  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, ...formModel.value, current });
  };

  const onPageSizeChange = (pageSize: number) => {
    basePagination.pageSize = pageSize;
    fetchData({ ...basePagination, ...formModel.value });
  };

  fetchData();

  const reset = () => {
    formModel.value = generateFormModel();
  };

  const modelChangeStatus = async (params: ModelChangeStatus) => {
    setLoading(true);
    try {
      await submitModelChangeStatus(params);
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
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

  const forwardForm = ref<FormInstance>();
  const forwardFormVisible = ref(false);
  const forwardFormData = ref<ModelBatchOperate>({} as ModelBatchOperate);

  const forwardHandleBeforeOk = async (done: any) => {
    const res = await forwardForm.value?.validate();
    if (res) {
      forwardFormVisible.value = true;
      done(false);
      return;
    }
    done();
    handleBatch({
      action: 'forward',
      value: 'all',
      target_model: forwardFormData.value.target_model,
    });
  };

  const forwardHandleCancel = () => {
    forwardFormVisible.value = false;
  };

  const agentForm = ref<FormInstance>();
  const agentFormVisible = ref(false);
  const agentFormData = ref<ModelBatchOperate>({} as ModelBatchOperate);

  const agentHandleBeforeOk = async (done: any) => {
    const res = await agentForm.value?.validate();
    if (res) {
      agentFormVisible.value = true;
      done(false);
      return;
    }
    done();
    handleBatch({
      action: 'agent',
      value: 'all',
      model_agents: agentFormData.value.model_agents,
    });
  };

  const agentHandleCancel = () => {
    agentFormVisible.value = false;
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
  const handleBatch = (params: ModelBatchOperate) => {
    if (ids.value.length === 0) {
      proxy.$message.info('请选择要操作的数据');
    } else {
      let alertContent = `是否确定操作所选的${ids.value.length}条数据?`;
      switch (params.action) {
        case 'agent':
          if (params.value === true) {
            alertContent = `是否确定启用所选${ids.value.length}条数据的模型代理?`;
          } else if (params.value === false) {
            alertContent = `是否确定关闭所选${ids.value.length}条数据的模型代理?`;
          } else if (params.value === 'all') {
            if (!params.model_agents) {
              agentFormVisible.value = true;
            } else {
              alertContent = `是否确定将所选${ids.value.length}条数据的模型代理启用并使用所选的模型代理?`;
            }
          }
          break;
        case 'forward':
          if (params.value === true) {
            alertContent = `是否确定启用所选${ids.value.length}条数据的模型转发?`;
          } else if (params.value === false) {
            alertContent = `是否确定关闭所选${ids.value.length}条数据的模型转发?`;
          } else if (params.value === 'all') {
            if (!params.target_model) {
              forwardFormVisible.value = true;
            } else {
              alertContent = `是否确定将所选${ids.value.length}条数据的模型转发启用并全部转发到所选模型?`;
            }
          }
          break;
        case 'status':
          if (params.value === 1) {
            alertContent = `是否确定启用所选的${ids.value.length}条数据?`;
          } else {
            alertContent = `是否确定禁用所选的${ids.value.length}条数据?`;
          }
          break;
        case 'delete':
          alertContent = `是否确定删除所选的${ids.value.length}条数据?`;
          break;
        default:
      }

      if (
        params.action === 'agent' &&
        params.value === 'all' &&
        !params.model_agents
      ) {
        return;
      }

      if (
        params.action === 'forward' &&
        params.value === 'all' &&
        !params.target_model
      ) {
        return;
      }

      proxy.$modal.warning({
        title: '警告',
        titleAlign: 'start',
        content: alertContent,
        hideCancel: false,
        onOk: () => {
          setLoading(true);
          params.ids = ids.value;
          submitModelBatchOperate(params).then((res) => {
            setLoading(false);
            proxy.$message.success('操作成功');
            search();
            tableRef.value.selectAll(false);
          });
        },
      });
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'ModelList',
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
</style>
