<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-apps />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.app') }}</a-breadcrumb-item>
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
              <a-col v-permission="['reseller', 'admin']" :span="8">
                <a-form-item field="user_id" :label="$t('app.form.userId')">
                  <a-input-number
                    v-model="searchFormData.user_id"
                    :placeholder="$t('app.form.userId.placeholder')"
                    :precision="0"
                    :min="1"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="app_id" :label="$t('app.form.appId')">
                  <a-input-number
                    v-model="searchFormData.app_id"
                    :placeholder="$t('app.form.appId.placeholder')"
                    :precision="0"
                    :min="1"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('app.form.name')">
                  <a-input
                    v-model="searchFormData.name"
                    :placeholder="$t('app.form.name.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['user']" :span="8">
                <a-form-item field="models" :label="$t('app.form.models')">
                  <a-select
                    v-model="searchFormData.models"
                    :placeholder="$t('app.form.selectDefault')"
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
                <a-form-item field="key" :label="$t('app.form.key')">
                  <a-input
                    v-model="searchFormData.app_key"
                    :placeholder="$t('app.form.key.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('app.form.status')">
                  <a-select
                    v-model="searchFormData.status"
                    :placeholder="$t('app.form.selectDefault')"
                    :options="statusOptions"
                    :scrollbar="false"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="quota_expires_at"
                  :label="$t('app.form.quota_expires_at')"
                >
                  <a-range-picker
                    v-model="searchFormData.quota_expires_at"
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
              {{ $t('app.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('app.form.reset') }}
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
              @click="$router.push({ name: 'AppCreate' })"
            >
              {{ $t('app.operation.create') }}
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
                        @change="handleChange($event, item, index)"
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
        :columns="cloneColumns"
        :data="renderData"
        :bordered="false"
        :size="size"
        :row-selection="rowSelection"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template #model_names="{ record }">
          <span v-if="record.model_names">
            <a-button type="text" size="small" @click="modelsHandle(record.id)">
              查看
            </a-button>
          </span>
          <span v-else>{{ $t(`app.columns.models.no_limit`) }}</span>
        </template>
        <template #quota="{ record }">
          <span v-if="record.is_limit_quota">
            {{
              record.quota > 0
                ? `$${parseQuota(record.quota)}`
                : record.quota < 0
                ? `-$${parseQuota(-record.quota)}`
                : '$0.00'
            }}
          </span>
          <span v-else>{{ $t(`app.columns.quota.no_limit`) }}</span>
        </template>
        <template #used_quota="{ record }">
          ${{ parseQuota(record.used_quota) || '0.00' }}
        </template>
        <template #quota_expires_at="{ record }">
          {{ record.is_limit_quota ? record.quota_expires_at || '-' : '-' }}
        </template>
        <template #status="{ record }">
          <a-switch
            v-model="record.status"
            :checked-value="1"
            :unchecked-value="2"
            @change="
              appChangeStatus({
                id: record.id,
                status: record.status,
              })
            "
          />
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('app.columns.operations.view') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'AppUpdate',
                query: { id: record.id },
              })
            "
          >
            {{ $t('app.columns.operations.update') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              createKey({
                app_id: record.app_id,
              })
            "
          >
            {{ $t('app.columns.operations.createKey') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'AppKeyList',
                query: { app_id: record.app_id },
              })
            "
          >
            {{ $t('app.columns.operations.manageKey') }}
          </a-button>
          <a-popconfirm
            content="你确定要删除吗?"
            @ok="appDelete({ id: record.id })"
          >
            <a-button type="text" size="small">
              {{ $t('app.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>

      <a-drawer
        :title="$t('menu.app.detail')"
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
        :width="728"
        :title="$t('app.form.title.keyConfig')"
        :ok-text="$t('button.save')"
        :body-style="{ height: '520px' }"
        @cancel="handleCancel"
        @before-ok="handleBeforeOk"
      >
        <a-form ref="formRef" :model="formData" :label-col-props="{ span: 4 }">
          <a-form-item field="key" :label="$t('app.label.key')">
            <a-input
              v-model="formData.key"
              :placeholder="$t('app.placeholder.key')"
              readonly
            />
          </a-form-item>
          <a-form-item
            field="billing_methods"
            :label="$t('app.label.key.billing_methods')"
            :rules="[
              {
                required: true,
                message: $t('app.error.key.billing_methods.required'),
              },
            ]"
          >
            <a-space size="large">
              <a-checkbox
                v-model="formData.billing_methods"
                :value="1"
                disabled
              >
              </a-checkbox>
              <span style="margin-left: -15px">
                {{ $t('app.key.dict.billing_methods.1') }}
              </span>
              <a-checkbox v-model="formData.billing_methods" :value="2">
                {{ $t('app.key.dict.billing_methods.2') }}
              </a-checkbox>
            </a-space>
          </a-form-item>
          <a-form-item field="models" :label="$t('app.label.models')">
            <a-tree-select
              v-model="formData.models"
              :placeholder="$t('app.placeholder.key.models')"
              :allow-search="true"
              :allow-clear="true"
              :tree-checkable="true"
              :data="treeData"
              :max-tag-count="3"
              :scrollbar="false"
              tree-checked-strategy="child"
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
              :min="0.000001"
              :max="9999999999999"
              :parser="parsePrice"
              allow-clear
            >
              <template #prefix> $ </template>
            </a-input-number>
          </a-form-item>
          <a-form-item v-if="formData.is_limit_quota">
            <a-radio-group type="button" @change="handleQuotaQuickChange">
              <a-radio :value="1"> $1 </a-radio>
              <a-radio :value="5"> $5 </a-radio>
              <a-radio :value="10"> $10 </a-radio>
              <a-radio :value="50"> $50 </a-radio>
              <a-radio :value="100"> $100 </a-radio>
              <a-radio :value="500"> $500 </a-radio>
              <a-radio :value="1000"> $1,000 </a-radio>
              <a-radio :value="5000"> $5,000 </a-radio>
              <a-radio :value="10000"> $10,000 </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="formData.is_limit_quota"
            field="quota_expires_rule"
            :label="$t('app.label.quota_expires_rule')"
          >
            <a-space size="large">
              <a-radio
                v-model="formData.quota_expires_rule"
                value="1"
                :default-checked="true"
              >
                固定
              </a-radio>
              <a-radio v-model="formData.quota_expires_rule" value="2"
                >时长</a-radio
              >
            </a-space>
          </a-form-item>
          <a-form-item
            v-if="
              formData.is_limit_quota && formData.quota_expires_rule === '1'
            "
            field="quota_expires_at"
            :label="$t('app.label.quota_expires_at')"
          >
            <a-date-picker
              v-model="formData.quota_expires_at"
              :placeholder="$t('app.placeholder.quota_expires_at')"
              :time-picker-props="{ defaultValue: '23:59:59' }"
              :disabled-date="disabledDate"
              style="width: 100%"
              show-time
              :shortcuts="[
                {
                  label: '1',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(1, 'day'),
                },
                {
                  label: '7',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(7, 'day'),
                },
                {
                  label: '15',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(15, 'day'),
                },
                {
                  label: '30',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(30, 'day'),
                },
                {
                  label: '90',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(90, 'day'),
                },
                {
                  label: '180',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(180, 'day'),
                },
                {
                  label: '365',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(365, 'day'),
                },
              ]"
            />
          </a-form-item>
          <a-form-item
            v-if="
              formData.is_limit_quota && formData.quota_expires_rule === '2'
            "
            field="quota_expires_minutes"
            :label="$t('app.label.quota_expires_minutes')"
          >
            <a-input-number
              v-model="formData.quota_expires_minutes"
              :placeholder="$t('app.placeholder.quota_expires_minutes')"
              :precision="0"
              :min="1"
              :max="9999999999999"
            >
              <template #append> 分钟 </template>
            </a-input-number>
          </a-form-item>
          <a-form-item
            field="is_bind_group"
            :label="$t('app.label.is_bind_group')"
          >
            <a-switch v-model="formData.is_bind_group" />
          </a-form-item>
          <a-form-item
            v-if="formData.is_bind_group"
            field="group"
            :label="$t('app.label.group')"
            :rules="[
              {
                required: true,
                message: $t('app.error.group.required'),
              },
            ]"
          >
            <a-select
              v-model="formData.group"
              :placeholder="$t('app.key.placeholder.group')"
              :scrollbar="false"
              allow-search
              allow-clear
            >
              <a-option
                v-for="item in groups"
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
          <a-form-item field="remark" :label="$t('common.remark')">
            <a-textarea
              v-model="formData.remark"
              :placeholder="$t('app.placeholder.remark')"
            />
          </a-form-item>
        </a-form>
      </a-modal>

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
        ok-text="关闭"
      >
        <Models :id="recordId" :action="action" />
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
  import dayjs from 'dayjs';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import { disabledDate, parsePrice, parseQuota } from '@/utils/common';
  import {
    queryAppPage,
    AppPage,
    AppPageParams,
    submitAppDelete,
    AppDeleteParams,
    AppChangeStatus,
    submitAppChangeStatus,
    AppBatchOperate,
    submitAppBatchOperate,
  } from '@/api/app';
  import {
    submitAppKeyCreate,
    AppKeyCreate,
    submitAppKeyConfig,
    AppKeyConfig,
  } from '@/api/app_key';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { queryModelList, ModelList, queryModelTree, Tree } from '@/api/model';
  import { queryGroupList, GroupList } from '@/api/group';
  import Models from '@/views/common/models.vue';
  import Detail from '../detail/index.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { proxy } = getCurrentInstance() as any;
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const generateSearchParams = () => {
    return {
      user_id: ref(),
      app_id: ref(),
      name: '',
      models: [],
      app_key: '',
      type: ref(),
      status: ref(),
      quota_expires_at: [],
      created_at: [],
    };
  };

  const renderData = ref<AppPage[]>([]);
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
      title: t('app.columns.userId'),
      dataIndex: 'user_id',
      slotName: 'user_id',
      align: 'center',
      width: 80,
    },
    {
      title: t('app.columns.appId'),
      dataIndex: 'app_id',
      slotName: 'app_id',
      align: 'center',
      width: 80,
    },
    {
      title: t('app.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('app.columns.models'),
      dataIndex: 'model_names',
      slotName: 'model_names',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('app.columns.quota'),
      dataIndex: 'quota',
      slotName: 'quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('app.columns.used_quota'),
      dataIndex: 'used_quota',
      slotName: 'used_quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('app.columns.quota_expires_at'),
      dataIndex: 'quota_expires_at',
      slotName: 'quota_expires_at',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('app.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 65,
    },
    // {
    //   title: t('app.columns.updated_at'),
    //   dataIndex: 'updated_at',
    //   slotName: 'updated_at',
    //   align: 'center',
    //   width: 132,
    // },
    {
      title: t('app.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 320,
    },
  ]);

  const userRole = localStorage.getItem('userRole');
  if (userRole === 'user') {
    columns.value.splice(0, 1);
  }

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('app.dict.status.1'),
      value: 1,
    },
    {
      label: t('app.dict.status.2'),
      value: 2,
    },
  ]);

  const fetchData = async (
    params: AppPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryAppPage(params);
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
    } as unknown as AppPageParams);
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

  const treeData = ref<Tree[]>([]);
  const getModelTree = async () => {
    setLoading(true);
    try {
      const { data } = await queryModelTree();
      treeData.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelTree();

  const groups = ref<GroupList[]>([]);
  const getGroupList = async () => {
    try {
      const { data } = await queryGroupList();
      groups.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getGroupList();

  const appDelete = async (params: AppDeleteParams) => {
    setLoading(true);
    try {
      await submitAppDelete(params);
      proxy.$message.success('删除成功');
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const appChangeStatus = async (params: AppChangeStatus) => {
    setLoading(true);
    try {
      await submitAppChangeStatus(params);
      proxy.$message.success('操作成功');
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const visible = ref(false);

  const formRef = ref<FormInstance>();
  const formData = ref<AppKeyConfig>({ billing_methods: [1] } as AppKeyConfig);

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.quota = quota;
  };

  const createKey = async (params: AppKeyCreate) => {
    const { data } = await submitAppKeyCreate(params);
    formData.value.app_id = data.app_id;
    formData.value.key = data.key;
    formData.value.quota_expires_rule = '1';
    formData.value.quota_expires_at = '';
    formData.value.quota_expires_minutes = ref();
    visible.value = true;
  };

  const handleBeforeOk = async (done: any) => {
    const res = await formRef.value?.validate();
    if (res) {
      visible.value = true;
      done(false);
      return;
    }

    setLoading(true);
    if (formData.value.quota_expires_rule === '1') {
      formData.value.quota_expires_minutes = '';
    }
    if (formData.value.quota_expires_rule === '2') {
      formData.value.quota_expires_at = '';
    }
    try {
      await submitAppKeyConfig(formData.value);
      navigator.clipboard.writeText(formData.value.key);
      Message.success(t('app.success.key_config'));
      done();
    } catch (err) {
      done(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    visible.value = false;
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
    action.value = 'app';
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
  const handleBatch = (params: AppBatchOperate) => {
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
        titleAlign: 'center',
        content: alertContent,
        hideCancel: false,
        onOk: () => {
          setLoading(true);
          params.ids = ids.value;
          submitAppBatchOperate(params).then((res) => {
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
    name: 'AppList',
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
