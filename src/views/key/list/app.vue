<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-safe />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.key.app') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.key.app.list') }}</a-breadcrumb-item>
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
              <a-col v-permission="['admin']" :span="8">
                <a-form-item field="user_id" :label="$t('key.form.userId')">
                  <a-input-number
                    v-model="formModel.user_id"
                    :placeholder="$t('key.form.userId.placeholder')"
                    :min="1"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['admin']" :span="8">
                <a-form-item field="app_id" :label="$t('key.form.appId')">
                  <a-input-number
                    v-model="formModel.app_id"
                    :placeholder="$t('key.form.appId.placeholder')"
                    :min="1"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['user']" :span="8">
                <a-form-item field="app_id" :label="$t('key.form.app')">
                  <a-select
                    v-model="formModel.app_id"
                    :placeholder="$t('key.form.selectDefault')"
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="item in apps"
                      :key="item.app_id"
                      :value="item.app_id"
                      :label="item.name"
                    />
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="key" :label="$t('key.form.appkey')">
                  <a-input
                    v-model="formModel.key"
                    :placeholder="$t('key.form.appkey.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['user']" :span="8">
                <a-form-item field="models" :label="$t('key.form.app.models')">
                  <a-select
                    v-model="formModel.models"
                    :placeholder="$t('key.form.selectDefault')"
                    :max-tag-count="2"
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
                <a-form-item field="quota" :label="$t('key.form.quota')">
                  <a-input-number
                    v-model="formModel.quota"
                    :placeholder="$t('key.form.quota.placeholder')"
                    :min="0.000001"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('key.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('key.form.selectDefault')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="quota_expires_at"
                  :label="$t('key.form.quota_expires_at')"
                >
                  <a-range-picker
                    v-model="formModel.quota_expires_at"
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
              {{ $t('key.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('key.form.reset') }}
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
          <a-tooltip :content="$t('actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('actions.density')">
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
          <a-tooltip :content="$t('actions.column_setting')">
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
        <template #key="{ record }">
          {{ record.key.substr(0, 10) + record.key.substr(-10) }}
          <icon-copy class="copy-btn" @click="handleCopy(record.id)" />
        </template>
        <template #quota="{ record }">
          <span v-if="record.is_limit_quota">
            {{
              record.quota > 0
                ? `$${quotaConv(record.quota)}`
                : record.quota < 0
                ? `-$${quotaConv(-record.quota)}`
                : '$0.00'
            }}
          </span>
          <span v-else>{{ $t(`key.columns.quota.no_limit`) }}</span>
        </template>
        <template #used_quota="{ record }">
          ${{ record.used_quota > 0 ? quotaConv(record.used_quota) : '0.00' }}
        </template>
        <template #quota_expires_at="{ record }">
          {{ record.is_limit_quota ? record.quota_expires_at || '-' : '-' }}
        </template>
        <template #model_names="{ record }">
          <span v-if="record.model_names">{{
            record.model_names.join(',')
          }}</span>
          <span v-else>{{ $t(`key.columns.app.models.no_limit`) }}</span>
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
                id: `${record.id}`,
                status: Number(`${record.status}`),
              })
            "
          />
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('key.columns.operations.view') }}
          </a-button>
          <a-button type="text" size="small" @click="updateKey(record)">
            {{ $t('key.columns.operations.update') }}
          </a-button>
          <a-popconfirm
            content="你确定要删除吗?"
            @ok="keyDelete({ id: `${record.id}` })"
          >
            <a-button type="text" size="small">
              {{ $t('key.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>

      <a-drawer
        :title="$t('menu.key.detail')"
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
        v-model:visible="visible"
        :width="600"
        :title="$t('app.form.title.keyConfig')"
        :ok-text="$t('app.button.save')"
        @cancel="handleCancel"
        @before-ok="handleBeforeOk"
      >
        <a-form ref="formRef" :model="formData">
          <a-form-item field="key" :label="$t('app.label.key')">
            <a-input
              v-model="formData.key"
              :placeholder="$t('app.placeholder.key')"
              readonly
            />
          </a-form-item>
          <a-form-item
            field="is_limit_quota"
            :label="$t('app.label.isLimitQuota')"
          >
            <a-switch v-model="formData.is_limit_quota" />
          </a-form-item>
          <a-form-item
            v-if="formData.is_limit_quota"
            field="quota"
            :label="$t('app.label.quota')"
            :rules="[
              {
                required: true,
                message: $t('app.error.quota.required'),
              },
            ]"
          >
            <a-input-number
              v-model="formData.quota"
              :placeholder="$t('app.placeholder.quota')"
              :precision="0"
              :min="0"
              :max="9999999999999"
              style="margin-right: 10px"
            />
            <div>
              ${{ formData.quota ? quotaConv(formData.quota) : '0.00' }}</div
            >
          </a-form-item>
          <a-form-item v-if="formData.is_limit_quota">
            <a-radio-group
              type="button"
              @change="handleQuotaQuickChange as any"
            >
              <a-radio :value="1"> $1 </a-radio>
              <a-radio :value="5"> $5 </a-radio>
              <a-radio :value="10"> $10 </a-radio>
              <a-radio :value="20"> $20 </a-radio>
              <a-radio :value="100"> $100 </a-radio>
              <a-radio :value="500"> $500 </a-radio>
              <a-radio :value="1000"> $1000 </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="formData.is_limit_quota"
            field="quota_expires_at"
            :label="$t('app.label.quota_expires_at')"
          >
            <a-date-picker
              v-model="formData.quota_expires_at"
              :placeholder="$t('app.placeholder.quota_expires_at')"
              :time-picker-props="{ defaultValue: '23:59:59' }"
              :disabled-date="(current:Date) => dayjs(current).isBefore(dayjs())"
              style="width: 100%"
              show-time
              :shortcuts="[
                {
                  label: '1',
                  value: () => dayjs().add(1, 'day'),
                },
                {
                  label: '7',
                  value: () => dayjs().add(7, 'day'),
                },
                {
                  label: '15',
                  value: () => dayjs().add(15, 'day'),
                },
                {
                  label: '30',
                  value: () => dayjs().add(30, 'day'),
                },
                {
                  label: '90',
                  value: () => dayjs().add(90, 'day'),
                },
                {
                  label: '180',
                  value: () => dayjs().add(180, 'day'),
                },
                {
                  label: '365',
                  value: () => dayjs().add(365, 'day'),
                },
              ]"
            />
          </a-form-item>
          <a-form-item field="models" :label="$t('app.label.models')">
            <a-select
              v-model="formData.models"
              :placeholder="$t('app.placeholder.models')"
              :max-tag-count="3"
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
          <a-form-item
            field="ip_whitelist"
            :label="$t('app.label.ip_whitelist')"
          >
            <a-textarea
              v-model="formData.ip_whitelist"
              :placeholder="$t('app.placeholder.ip_whitelist')"
              :auto-size="{ minRows: 5, maxRows: 5 }"
            />
          </a-form-item>
          <a-form-item
            field="ip_blacklist"
            :label="$t('app.label.ip_blacklist')"
          >
            <a-textarea
              v-model="formData.ip_blacklist"
              :placeholder="$t('app.placeholder.ip_blacklist')"
              :auto-size="{ minRows: 5, maxRows: 5 }"
            />
          </a-form-item>
          <a-form-item field="remark" :label="$t('app.placeholder.remark')">
            <a-textarea
              v-model="formData.remark"
              :placeholder="$t('app.placeholder.remark')"
            />
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
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import dayjs from 'dayjs';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { quotaConv } from '@/utils/common';
  import {
    queryKeyPage,
    KeyPage,
    KeyPageParams,
    submitKeyDelete,
    KeyDeleteParams,
    KeyChangeStatus,
    submitKeyChangeStatus,
    KeyBatchOperate,
    submitKeyBatchOperate,
    queryKeyDetail,
  } from '@/api/key';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import {
    queryAppList,
    AppList,
    submitAppKeyConfig,
    AppKeyConfig,
  } from '@/api/app';
  import { queryModelList, ModelList } from '@/api/model';
  import { Message } from '@arco-design/web-vue';
  import { useClipboard } from '@vueuse/core';
  import Detail from '../detail/index.vue';

  const { proxy } = getCurrentInstance() as any;

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const route = useRoute();

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const apps = ref<AppList[]>([]);

  const getAppList = async () => {
    try {
      const { data } = await queryAppList();
      apps.value = data.items;
      if (route.query.app_id) {
        formModel.value.app_id = Number(route.query.app_id);
      }
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getAppList();

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

  const keyDelete = async (params: KeyDeleteParams) => {
    setLoading(true);
    try {
      await submitKeyDelete(params);
      proxy.$message.success('删除成功');
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const generateFormModel = () => {
    return {
      type: 1,
      user_id: ref(),
      app_id: ref(),
      key: '',
      models: [],
      quota: ref(),
      quota_expires_at: [],
      status: ref(),
      created_at: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<KeyPage[]>([]);
  const formModel = ref(generateFormModel());
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
      title: t('key.columns.user_id'),
      dataIndex: 'user_id',
      slotName: 'user_id',
      align: 'center',
      width: 80,
    },
    {
      title: t('key.columns.app_id'),
      dataIndex: 'app_id',
      slotName: 'app_id',
      align: 'center',
      width: 80,
    },
    {
      title: t('key.columns.key'),
      dataIndex: 'key',
      slotName: 'key',
      align: 'center',
      width: 220,
    },
    {
      title: t('key.columns.quota'),
      dataIndex: 'quota',
      slotName: 'quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('key.columns.used_quota'),
      dataIndex: 'used_quota',
      slotName: 'used_quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('key.columns.quota_expires_at'),
      dataIndex: 'quota_expires_at',
      slotName: 'quota_expires_at',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('key.columns.app.models'),
      dataIndex: 'model_names',
      slotName: 'model_names',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('key.columns.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('key.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 65,
    },
    // {
    //   title: t('key.columns.updated_at'),
    //   dataIndex: 'updated_at',
    //   slotName: 'updated_at',
    //   align: 'center',
    //   width: 132,
    // },
    {
      title: t('key.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 170,
    },
  ]);

  const userRole = localStorage.getItem('userRole');
  if (userRole === 'user') {
    columns.value.splice(0, 1);
  }

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('key.dict.status.1'),
      value: 1,
    },
    {
      label: t('key.dict.status.2'),
      value: 2,
    },
  ]);
  const fetchData = async (
    params: KeyPageParams = {
      ...basePagination,
      type: 1,
      app_id: route.query.app_id,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryKeyPage(params);
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
    } as unknown as KeyPageParams);
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

  const keyChangeStatus = async (params: KeyChangeStatus) => {
    setLoading(true);
    try {
      await submitKeyChangeStatus(params);
      proxy.$message.success('操作成功');
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

  const visible = ref(false);

  const formRef = ref<FormInstance>();
  const formData = ref<AppKeyConfig>({} as AppKeyConfig);

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.quota = quota * 500000;
  };

  interface AppKeyConfigView {
    id: string;
    key: string;
    is_limit_quota: boolean;
    quota: number;
    quota_expires_at: string;
    models: string[];
    ip_whitelist: string[];
    ip_blacklist: string[];
    remark: string;
  }

  const updateKey = async (params: AppKeyConfigView) => {
    setLoading(true);
    try {
      formData.value.id = params.id;
      formData.value.key = params.key;
      formData.value.is_limit_quota = params.is_limit_quota;
      formData.value.quota = params.quota;
      formData.value.quota_expires_at = params.quota_expires_at;
      formData.value.models = params.models;
      formData.value.ip_whitelist = params.ip_whitelist?.join('\n') || '';
      formData.value.ip_blacklist = params.ip_blacklist?.join('\n') || '';
      formData.value.remark = params.remark;
      visible.value = true;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleBeforeOk = async (done: any) => {
    const res = await formRef.value?.validate();
    if (res) {
      visible.value = true;
      done(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await submitAppKeyConfig(formData.value);
      navigator.clipboard.writeText(data.key);
      Message.success(t('app.success.key_config'));
      done();
      fetchData();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    visible.value = false;
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
    if (ids.value.length === 0) {
      proxy.$message.info('请选择要操作的数据');
    } else {
      let alertContent = `是否确定操作所选的${ids.value.length}条数据?`;
      switch (params.action) {
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

      proxy.$modal.warning({
        title: '警告',
        titleAlign: 'start',
        content: alertContent,
        hideCancel: false,
        onOk: () => {
          setLoading(true);
          params.ids = ids.value;
          submitKeyBatchOperate(params).then((res) => {
            setLoading(false);
            proxy.$message.success('操作成功');
            search();
            tableRef.value.selectAll(false);
          });
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
      proxy.$message.success('复制成功');
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
</script>

<script lang="ts">
  export default {
    name: 'AppKeyList',
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
