<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-settings />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.sys') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.reseller') }}</a-breadcrumb-item>
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
                <a-form-item
                  field="user_id"
                  :label="$t('reseller.form.userId')"
                >
                  <a-input-number
                    v-model="searchFormData.user_id"
                    :placeholder="$t('reseller.form.userId.placeholder')"
                    :precision="0"
                    :min="1"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item
                  field="account"
                  :label="$t('reseller.form.account')"
                >
                  <a-input
                    v-model="searchFormData.account"
                    :placeholder="$t('reseller.form.account.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="9">
                <a-form-item field="name" :label="$t('reseller.form.name')">
                  <a-input
                    v-model="searchFormData.name"
                    :placeholder="$t('reseller.form.name.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="quota" :label="$t('reseller.form.quota')">
                  <a-input-number
                    v-model="searchFormData.quota"
                    :placeholder="$t('reseller.form.quota.placeholder')"
                    :min="0.000001"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item field="status" :label="$t('reseller.form.status')">
                  <a-select
                    v-model="searchFormData.status"
                    :placeholder="$t('reseller.form.selectDefault')"
                    :options="statusOptions"
                    :scrollbar="false"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="9">
                <a-form-item
                  field="quota_expires_at"
                  :label="$t('reseller.form.quota_expires_at')"
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
              {{ $t('reseller.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('reseller.form.reset') }}
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
              @click="$router.push({ name: 'ResellerCreate' })"
            >
              {{ $t('reseller.operation.create') }}
            </a-button>
            <a-button
              type="primary"
              status="warning"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'recharge',
                })
              "
            >
              充值
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
                handleResellerDelete({
                  action: 'delete',
                  data: [1, 2, 3, 4, 5],
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
        <template #quota="{ record }">
          {{
            record.quota > 0
              ? `$${quotaConv(record.quota)}`
              : record.quota < 0
              ? `-$${quotaConv(-record.quota)}`
              : '$0.00'
          }}
        </template>
        <template #used_quota="{ record }">
          ${{ record.used_quota > 0 ? quotaConv(record.used_quota) : '0.00' }}
        </template>
        <template #allocated_quota="{ record }">
          ${{
            record.allocated_quota > 0
              ? quotaConv(record.allocated_quota)
              : '0.00'
          }}
        </template>
        <template #to_be_allocated="{ record }">
          ${{
            record.to_be_allocated > 0
              ? quotaConv(record.to_be_allocated)
              : '0.00'
          }}
        </template>
        <template #quota_expires_at="{ rowIndex }">
          <a-date-picker
            v-model="renderData[rowIndex].quota_expires_at"
            :placeholder="$t('reseller.columns.placeholder.quota_expires_at')"
            :time-picker-props="{ defaultValue: '23:59:59' }"
            :disabled-date="disabledDate"
            show-time
            :shortcuts="[
              {
                label: '1',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(1, 'day'),
              },
              {
                label: '7',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(7, 'day'),
              },
              {
                label: '15',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(15, 'day'),
              },
              {
                label: '30',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(30, 'day'),
              },
              {
                label: '90',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(90, 'day'),
              },
              {
                label: '180',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(180, 'day'),
              },
              {
                label: '365',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(365, 'day'),
              },
            ]"
            @change="
              userChangeQuotaExpire({
                id: `${renderData[rowIndex].id}`,
                quota_expires_at: `${renderData[rowIndex].quota_expires_at}`,
              })
            "
          >
            <a-button style="width: 150px">{{
              renderData[rowIndex].quota_expires_at ||
              $t('reseller.columns.placeholder.quota_expires_at')
            }}</a-button>
          </a-date-picker>
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
              userChangeStatus({
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
              recharge({
                user_id: `${record.user_id}`,
                quota_expires_at: `${record.quota_expires_at}`,
              })
            "
          >
            {{ $t('reseller.columns.operations.recharge') }}
          </a-button>
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('reseller.columns.operations.view') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'ResellerUpdate',
                query: { id: `${record.id}` },
              })
            "
          >
            {{ $t('reseller.columns.operations.update') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              handleResellerDelete({
                id: `${record.id}`,
                user_id: `${record.user_id}`,
                name: `${record.name}`,
                data: [1, 2, 3, 4, 5],
              })
            "
          >
            {{ $t('reseller.columns.operations.delete') }}
          </a-button>
        </template>
      </a-table>

      <a-drawer
        :title="$t('menu.reseller.detail')"
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
        v-model:visible="rechargeVisible"
        :title="$t('reseller.form.title.recharge')"
        :ok-text="$t('button.ok')"
        :width="660"
        @cancel="handleCancel"
        @before-ok="handleBeforeOk"
      >
        <a-form ref="formRef" :model="formData">
          <a-form-item
            field="quota"
            :label="$t('reseller.label.quota')"
            :rules="[
              {
                required: true,
                message: $t('reseller.error.quota.required'),
              },
            ]"
          >
            <a-input-number
              v-model="formData.quota"
              :placeholder="$t('reseller.placeholder.recharge')"
              :precision="0"
              :min="1"
              :max="9999999999999"
              style="margin-right: 10px"
            />
            <div>
              ${{ formData.quota ? quotaConv(formData.quota) : '0.00' }}</div
            >
          </a-form-item>
          <a-form-item style="width: 280px; margin-bottom: 10px">
            <a-radio-group
              v-model="quotaQuick"
              type="button"
              @change="handleQuotaQuickChange as any"
            >
              <a-radio :value="1"> $1 </a-radio>
              <a-radio :value="2"> $2 </a-radio>
              <a-radio :value="5"> $5 </a-radio>
              <a-radio :value="10"> $10 </a-radio>
              <a-radio :value="20"> $20 </a-radio>
              <a-radio :value="50"> $50 </a-radio>
              <a-radio :value="100"> $100 </a-radio>
              <a-radio :value="200"> $200 </a-radio>
              <a-radio :value="500"> $500 </a-radio>
              <a-radio :value="1000"> $1,000 </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item style="width: 280px">
            <a-radio-group
              v-model="quotaQuick"
              type="button"
              @change="handleQuotaQuickChange as any"
            >
              <a-radio :value="2000"> $2,000 </a-radio>
              <a-radio :value="3000"> $3,000 </a-radio>
              <a-radio :value="5000"> $5,000 </a-radio>
              <a-radio :value="10000"> $10,000 </a-radio>
              <a-radio :value="20000"> $20,000 </a-radio>
              <a-radio :value="50000"> $50,000 </a-radio>
              <a-radio :value="100000"> $100,000 </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            field="quota_type"
            :label="$t('reseller.label.quota_type')"
            :rules="[
              {
                required: true,
                message: $t('reseller.error.quota_type.required'),
              },
            ]"
          >
            <a-space size="large">
              <a-radio
                v-model="formData.quota_type"
                value="1"
                :default-checked="true"
              >
                充值
              </a-radio>
              <a-radio v-model="formData.quota_type" value="2"> 扣除 </a-radio>
              <a-radio v-model="formData.quota_type" value="3"> 赠送 </a-radio>
            </a-space>
          </a-form-item>
          <a-form-item
            field="quota_expires_at"
            :label="$t('reseller.label.quota_expires_at')"
          >
            <a-date-picker
              v-model="formData.quota_expires_at"
              :placeholder="$t('reseller.placeholder.quota_expires_at')"
              :time-picker-props="{ defaultValue: '23:59:59' }"
              :disabled-date="disabledDate"
              position="tl"
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
            field="is_send_notice"
            :label="$t('reseller.label.is_send_notice')"
          >
            <a-switch v-model="formData.is_send_notice" />
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal
        v-model:visible="delVisible"
        :title="$t('reseller.form.title.del')"
        :width="700"
        @cancel="delHandleCancel"
        @before-ok="delHandleBeforeOk"
      >
        <a-form ref="delFormRef" :model="delFormData">
          <a-form-item
            v-if="delFormData.user_id"
            field="user_id"
            :label="$t('reseller.form.userId')"
            :rules="[
              {
                required: true,
              },
            ]"
          >
            <a-input v-model="delFormData.user_id" readonly />
          </a-form-item>
          <a-form-item
            v-if="delFormData.name"
            field="name"
            :label="$t('reseller.label.name')"
            :rules="[
              {
                required: true,
              },
            ]"
          >
            <a-input v-model="delFormData.name" readonly />
          </a-form-item>
          <a-form-item field="data" :label="$t('reseller.label.del.data')">
            <a-space size="large">
              <a-checkbox v-model="delFormData.data" :value="1">
                用户数据
              </a-checkbox>
              <a-checkbox v-model="delFormData.data" :value="2">
                应用数据
              </a-checkbox>
              <a-checkbox v-model="delFormData.data" :value="3">
                交易记录
              </a-checkbox>
              <a-checkbox v-model="delFormData.data" :value="4">
                账单明细
              </a-checkbox>
              <a-checkbox v-model="delFormData.data" :value="5">
                日志数据
              </a-checkbox>
            </a-space>
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
  import dayjs from 'dayjs';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import { quotaConv, disabledDate } from '@/utils/common';
  import {
    queryResellerPage,
    ResellerPage,
    ResellerPageParams,
    submitResellerDelete,
    ResellerDeleteParams,
    ResellerRechargeParams,
    submitResellerRecharge,
    ResellerRecharge,
    ResellerChangeQuotaExpire,
    submitResellerChangeQuotaExpire,
    ResellerChangeStatus,
    submitResellerChangeStatus,
    ResellerBatchOperate,
    submitResellerBatchOperate,
  } from '@/api/admin_reseller';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { queryModelTree, Tree } from '@/api/model';
  import { queryGroupList, GroupList } from '@/api/group';
  import Detail from '../detail/index.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { loading, setLoading } = useLoading(true);
  const { proxy } = getCurrentInstance() as any;
  const { t } = useI18n();

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const generateSearchParams = () => {
    return {
      user_id: ref(),
      name: '',
      account: '',
      quota: ref(),
      status: ref(),
      quota_expires_at: [],
    };
  };

  const renderData = ref<ResellerPage[]>([]);
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
      title: t('reseller.columns.userId'),
      dataIndex: 'user_id',
      slotName: 'user_id',
      align: 'center',
      width: 90,
    },
    {
      title: t('reseller.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('reseller.columns.account'),
      dataIndex: 'account',
      slotName: 'account',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('reseller.columns.quota'),
      dataIndex: 'quota',
      slotName: 'quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('reseller.columns.used_quota'),
      dataIndex: 'used_quota',
      slotName: 'used_quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    // {
    //   title: t('reseller.columns.quota_expires_at'),
    //   dataIndex: 'quota_expires_at',
    //   slotName: 'quota_expires_at',
    //   align: 'center',
    //   width: 170,
    // },
    {
      title: t('reseller.columns.allocated_quota'),
      dataIndex: 'allocated_quota',
      slotName: 'allocated_quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('reseller.columns.to_be_allocated'),
      dataIndex: 'to_be_allocated',
      slotName: 'to_be_allocated',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('reseller.columns.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('reseller.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 65,
    },
    {
      title: t('reseller.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 220,
    },
  ]);

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('reseller.dict.status.1'),
      value: 1,
    },
    {
      label: t('reseller.dict.status.2'),
      value: 2,
    },
  ]);

  const fetchData = async (
    params: ResellerPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryResellerPage(params);
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
    } as unknown as ResellerPageParams);
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
    }
  };
  getGroupList();

  const delDataMap = new Map();
  delDataMap.set(1, '用户数据');
  delDataMap.set(2, '应用数据');
  delDataMap.set(3, '交易记录');
  delDataMap.set(4, '账单明细');
  delDataMap.set(5, '日志数据');

  const resellerDelete = async (params: ResellerDeleteParams) => {
    let alertContent = `是否确定删除代理商: ${params.name}?`;

    if (params.data && params.data.length > 0) {
      let delData = '';
      for (let i = 0; i < params.data.length; i += 1) {
        if (i === 0) {
          delData = delDataMap.get(params.data[i]);
        } else {
          delData += `、${delDataMap.get(params.data[i])}`;
        }
      }
      alertContent = `是否确定删除代理商: ${params.name} 以及同时删除: ${delData}?`;
    }

    proxy.$modal.warning({
      title: '警告',
      titleAlign: 'center',
      content: alertContent,
      hideCancel: false,
      onOk: () => {
        setLoading(true);
        submitResellerDelete(params).then((res) => {
          setLoading(false);
          proxy.$message.success('操作成功, 任务已提交');
          search();
          tableRef.value.selectAll(false);
        });
      },
    });
  };

  const userChangeQuotaExpire = async (params: ResellerChangeQuotaExpire) => {
    setLoading(true);
    try {
      await submitResellerChangeQuotaExpire(params);
      proxy.$message.success('操作成功');
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const userChangeStatus = async (params: ResellerChangeStatus) => {
    setLoading(true);
    try {
      await submitResellerChangeStatus(params);
      proxy.$message.success('操作成功');
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const quotaQuick = ref(0);
  const rechargeVisible = ref(false);
  const delVisible = ref(false);

  const formRef = ref<FormInstance>();
  const formData = ref<ResellerRecharge>({} as ResellerRecharge);
  const delFormRef = ref<FormInstance>();
  const delFormData = ref<ResellerDeleteParams>({} as ResellerDeleteParams);

  const recharge = async (params: ResellerRechargeParams) => {
    setLoading(true);
    try {
      quotaQuick.value = 0;
      formData.value.quota = ref();
      formData.value.quota_type = '1';
      formData.value.user_id = params.user_id;
      formData.value.quota_expires_at = params.quota_expires_at;
      formData.value.is_send_notice = true;
      tableRef.value.selectAll(false);
      rechargeVisible.value = true;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.quota = quota * 500000;
  };

  const handleBeforeOk = async (done: any) => {
    const res = await formRef.value?.validate();
    if (res) {
      rechargeVisible.value = true;
      done(false);
      return;
    }

    if (ids.value.length > 0) {
      done();
      handleBatch({
        action: 'recharge',
        value: formData.value.quota,
        quota_type: formData.value.quota_type,
        quota_expires_at: formData.value.quota_expires_at,
        is_send_notice: formData.value.is_send_notice,
      });
      return;
    }

    setLoading(true);
    try {
      await submitResellerRecharge(formData.value); // The mock api default success
      Message.success(t('success.recharge'));
      done();
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    rechargeVisible.value = false;
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
  const handleBatch = (params: ResellerBatchOperate) => {
    if (ids.value.length === 0) {
      proxy.$message.info('请选择要操作的数据');
    } else {
      let alertContent = `是否确定操作所选的${ids.value.length}位代理商?`;
      switch (params.action) {
        case 'recharge':
          if (!params.value) {
            quotaQuick.value = 0;
            formData.value.quota = ref();
            formData.value.quota_type = '1';
            formData.value.quota_expires_at = '';
            formData.value.is_send_notice = true;
            rechargeVisible.value = true;
          } else if (formData.value.quota_type === '2') {
            alertContent = `是否确定扣除所选的${
              ids.value.length
            }位代理商 $${quotaConv(params.value)} 额度?`;
          } else {
            alertContent = `是否确定给所选的${ids.value.length}位代理商${
              formData.value.quota_type === '1' ? '充值' : '赠送'
            } $${quotaConv(params.value)} 额度?`;
          }
          break;
        case 'status':
          if (params.value === 1) {
            alertContent = `是否确定启用所选的${ids.value.length}位代理商?`;
          } else {
            alertContent = `是否确定禁用所选的${ids.value.length}位代理商?`;
          }
          break;
        case 'delete':
          alertContent = `是否确定删除所选的${ids.value.length}位代理商?`;
          if (params.data && params.data.length > 0) {
            let delData = '';
            for (let i = 0; i < params.data.length; i += 1) {
              if (i === 0) {
                delData = delDataMap.get(params.data[i]);
              } else {
                delData += `、${delDataMap.get(params.data[i])}`;
              }
            }
            alertContent = `是否确定删除所选的${ids.value.length}位代理商以及同时删除: ${delData}?`;
          }
          break;
        default:
      }

      if (params.action === 'recharge' && !params.value) {
        return;
      }

      proxy.$modal.warning({
        title: '警告',
        titleAlign: 'center',
        content: alertContent,
        hideCancel: false,
        onOk: () => {
          setLoading(true);
          params.ids = ids.value;
          submitResellerBatchOperate(params).then((res) => {
            setLoading(false);
            proxy.$message.success('操作成功');
            search();
            tableRef.value.selectAll(false);
          });
        },
      });
    }
  };

  const handleResellerDelete = async (params: ResellerDeleteParams) => {
    delFormData.value = params;
    delVisible.value = true;
    if (!params.action) {
      tableRef.value.selectAll(false);
    }
  };

  const delHandleBeforeOk = async (done: any) => {
    const res = await delFormRef.value?.validate();
    if (res) {
      delVisible.value = true;
      done(false);
      return;
    }
    if (!delFormData.value.action) {
      resellerDelete(delFormData.value);
    } else {
      handleBatch({ action: 'delete', data: delFormData.value.data });
    }
  };

  const delHandleCancel = () => {
    delVisible.value = false;
  };
</script>

<script lang="ts">
  export default {
    name: 'ResellerList',
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
