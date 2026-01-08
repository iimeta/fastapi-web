<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-user />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('user.menu') }}</a-breadcrumb-item>
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
                <a-form-item field="user_id" :label="$t('common.user_id')">
                  <a-input-number
                    v-model="searchFormData.user_id"
                    :placeholder="$t('placeholder.user_id')"
                    :precision="0"
                    :min="1"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item field="account" :label="$t('common.account')">
                  <a-input
                    v-model="searchFormData.account"
                    :placeholder="$t('user.error.required.account')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="9">
                <a-form-item field="name" :label="$t('user.form.name')">
                  <a-input
                    v-model="searchFormData.name"
                    :placeholder="$t('user.form.placeholder.name')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="quota" :label="$t('user.form.quota')">
                  <a-input-number
                    v-model="searchFormData.quota"
                    :placeholder="$t('placeholder.quota')"
                    :min="0.000001"
                    :max="9999999999999"
                    allow-clear
                  >
                    <template #prefix>
                      {{ appStore.getCurrencySymbol }}
                    </template>
                  </a-input-number>
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
                <a-form-item
                  field="quota_expires_at"
                  :label="$t('common.expires_at')"
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
              @click="$router.push({ name: 'UserCreate' })"
            >
              {{ $t('button.create') }}
            </a-button>
            <a-button
              type="primary"
              status="warning"
              :disabled="multiple"
              :title="multiple ? $t('placeholder.operation.data') : ''"
              @click="
                handleBatch({
                  action: 'recharge',
                })
              "
            >
              {{ $t('button.recharge') }}
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
                handleUserDelete({
                  action: 'delete',
                  data: [2, 3, 4, 5, 6],
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
        <template #user_id="{ record }">
          <span v-if="record.rid && userRole === 'admin'" :title="record.rid">
            <b>{{ record.user_id }}</b>
          </span>
          <span v-else>
            {{ record.user_id }}
          </span>
        </template>
        <template #quota="{ record }">
          <Quota :model-value="record.quota" />
        </template>
        <template #used_quota="{ record }">
          <Quota :model-value="record.used_quota" />
        </template>
        <template #quota_expires_at="{ rowIndex }">
          <a-date-picker
            v-model="renderData[rowIndex].quota_expires_at"
            :placeholder="$t('user.placeholder.quota_expires_at')"
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
                id: renderData[rowIndex].id,
                quota_expires_at: renderData[rowIndex].quota_expires_at,
              })
            "
          >
            <a-button style="width: 150px">{{
              renderData[rowIndex].quota_expires_at ||
              $t('user.placeholder.quota_expires_at')
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
                id: record.id,
                status: record.status,
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
                user_id: record.user_id,
                quota_expires_at: record.quota_expires_at,
              })
            "
          >
            {{ $t('button.recharge') }}
          </a-button>
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('button.detail') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'UserUpdate',
                query: { id: record.id },
              })
            "
          >
            {{ $t('button.update') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              handleUserDelete({
                id: record.id,
                user_id: record.user_id,
                name: record.name,
                data: [2, 3, 4, 5, 6],
              })
            "
          >
            {{ $t('button.delete') }}
          </a-button>
        </template>
      </a-table>

      <a-drawer
        :title="$t('user.menu.detail')"
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
        :title="$t('user.label.recharge')"
        :ok-text="$t('button.ok')"
        :width="728"
        @cancel="handleCancel"
        @before-ok="handleBeforeOk"
      >
        <a-form ref="formRef" :model="formData" :label-col-props="{ span: 4 }">
          <a-form-item
            field="quota"
            :label="$t('user.label.recharge')"
            :rules="[
              {
                required: true,
                message: $t('user.placeholder.recharge'),
              },
            ]"
          >
            <a-input-number
              v-model="formData.quota"
              :placeholder="$t('user.placeholder.recharge')"
              :min="0.000001"
              :max="9999999999999"
              :parser="parsePrice"
              allow-clear
            >
              <template #prefix> {{ appStore.getCurrencySymbol }} </template>
            </a-input-number>
          </a-form-item>
          <a-form-item style="margin-bottom: 8px">
            <a-radio-group
              v-model="quotaQuick"
              type="button"
              @change="handleQuotaQuickChange"
            >
              <a-radio :value="1"> <Quota :model-value="1" /> </a-radio>
              <a-radio :value="2"> <Quota :model-value="2" /> </a-radio>
              <a-radio :value="5"> <Quota :model-value="5" /> </a-radio>
              <a-radio :value="10"> <Quota :model-value="10" /> </a-radio>
              <a-radio :value="20"> <Quota :model-value="20" /> </a-radio>
              <a-radio :value="50"> <Quota :model-value="50" /> </a-radio>
              <a-radio :value="100"> <Quota :model-value="100" /> </a-radio>
              <a-radio :value="200"> <Quota :model-value="200" /> </a-radio>
              <a-radio :value="500"> <Quota :model-value="500" /> </a-radio>
              <a-radio :value="1000" style="padding: 0 3px 0 2px">
                <Quota :model-value="1000" />
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item style="margin-bottom: 10px">
            <a-radio-group
              v-model="quotaQuick"
              type="button"
              @change="handleQuotaQuickChange"
            >
              <a-radio :value="2000"> <Quota :model-value="2000" /> </a-radio>
              <a-radio :value="3000"> <Quota :model-value="3000" /> </a-radio>
              <a-radio :value="5000"> <Quota :model-value="5000" /> </a-radio>
              <a-radio :value="10000"> <Quota :model-value="10000" /> </a-radio>
              <a-radio :value="20000"> <Quota :model-value="20000" /> </a-radio>
              <a-radio :value="50000"> <Quota :model-value="50000" /> </a-radio>
              <a-radio :value="100000" style="padding-right: 1px">
                <Quota :model-value="100000" />
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            field="quota_type"
            :label="$t('user.label.quota_type')"
            :rules="[
              {
                required: true,
                message: $t('user.error.required.quota_type'),
              },
            ]"
          >
            <a-space size="large">
              <a-radio
                v-model="formData.quota_type"
                value="1"
                :default-checked="true"
              >
                {{ $t('finance.dict.deal_type.1') }}
              </a-radio>
              <a-radio v-model="formData.quota_type" value="2">
                {{ $t('finance.dict.deal_type.2') }}
              </a-radio>
              <a-radio v-model="formData.quota_type" value="3">
                {{ $t('finance.dict.deal_type.3') }}
              </a-radio>
            </a-space>
          </a-form-item>
          <a-form-item
            field="quota_expires_at"
            :label="$t('user.label.quota_expires_at')"
          >
            <a-date-picker
              v-model="formData.quota_expires_at"
              :placeholder="$t('user.placeholder.quota_expires_at')"
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
            :label="$t('user.label.is_send_notice')"
          >
            <a-switch v-model="formData.is_send_notice" />
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal
        v-model:visible="delVisible"
        :title="$t('user.form.title.del')"
        :width="688"
        @cancel="delHandleCancel"
        @before-ok="delHandleBeforeOk"
      >
        <a-form
          ref="delFormRef"
          :model="delFormData"
          :label-col-props="{ span: 4 }"
        >
          <a-form-item
            v-if="delFormData.user_id"
            field="user_id"
            :label="$t('common.user_id')"
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
            :label="$t('common.name')"
            :rules="[
              {
                required: true,
              },
            ]"
          >
            <a-input v-model="delFormData.name" readonly />
          </a-form-item>
          <a-form-item field="data" :label="$t('user.label.del.data')">
            <a-space size="large">
              <a-checkbox v-model="delFormData.data" :value="2">
                {{ $t('dict.del_data.2') }}
              </a-checkbox>
              <a-checkbox v-model="delFormData.data" :value="3">
                {{ $t('dict.del_data.3') }}
              </a-checkbox>
              <a-checkbox v-model="delFormData.data" :value="4">
                {{ $t('dict.del_data.4') }}
              </a-checkbox>
              <a-checkbox v-model="delFormData.data" :value="5">
                {{ $t('dict.del_data.5') }}
              </a-checkbox>
              <a-checkbox v-model="delFormData.data" :value="6">
                {{ $t('dict.del_data.6') }}
              </a-checkbox>
            </a-space>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import dayjs from 'dayjs';
  import { FormInstance, Message, Modal } from '@arco-design/web-vue';
  import { disabledDate, parsePrice, parseQuota } from '@/utils/common';
  import {
    queryUserPage,
    UserPage,
    UserPageParams,
    submitUserDelete,
    UserDeleteParams,
    UserRechargeParams,
    submitUserRecharge,
    UserRecharge,
    UserChangeQuotaExpire,
    submitUserChangeQuotaExpire,
    UserChangeStatus,
    submitUserChangeStatus,
    UserBatchOperate,
    submitUserBatchOperate,
  } from '@/api/admin_user';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { useAppStore } from '@/store';
  import Quota from '@/views/common/quota.vue';
  import Detail from '../detail/index.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const userRole = localStorage.getItem('userRole');
  const appStore = useAppStore();

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

  const renderData = ref<UserPage[]>([]);
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
      title: t('common.user_id'),
      dataIndex: 'user_id',
      slotName: 'user_id',
      align: 'center',
      width: 80,
    },
    {
      title: t('common.name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.account'),
      dataIndex: 'account',
      slotName: 'account',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.current_quota'),
      dataIndex: 'quota',
      slotName: 'quota',
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
      title: t('user.label.quota_expires_at'),
      dataIndex: 'quota_expires_at',
      slotName: 'quota_expires_at',
      align: 'center',
      width: 170,
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
      title: t('common.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 220,
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
    params: UserPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryUserPage(params);
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
    } as unknown as UserPageParams);
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

  const delDataMap = new Map();
  delDataMap.set(2, t('dict.del_data.2'));
  delDataMap.set(3, t('dict.del_data.3'));
  delDataMap.set(4, t('dict.del_data.4'));
  delDataMap.set(5, t('dict.del_data.5'));
  delDataMap.set(6, t('dict.del_data.6'));

  const userDelete = async (params: UserDeleteParams) => {
    let alertContent = `${t('user.placeholder.are_you_sure_delete')}: ${
      params.name
    }?`;

    if (params.data && params.data.length > 0) {
      let delData = '';
      for (let i = 0; i < params.data.length; i += 1) {
        if (i === 0) {
          delData = delDataMap.get(params.data[i]);
        } else {
          delData += `、${delDataMap.get(params.data[i])}`;
        }
      }
      alertContent = `${t('user.placeholder.are_you_sure_delete')}: ${
        params.name
      } ${t('user.placeholder.and_also_delete')}: ${delData}?`;
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
        submitUserDelete(params).then((res) => {
          setLoading(false);
          Message.success(t('success.task'));
          search();
          tableRef.value.selectAll(false);
        });
      },
    });
  };

  const userChangeQuotaExpire = async (params: UserChangeQuotaExpire) => {
    setLoading(true);
    try {
      await submitUserChangeQuotaExpire(params);
      Message.success(t('success.operate'));
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const userChangeStatus = async (params: UserChangeStatus) => {
    setLoading(true);
    try {
      await submitUserChangeStatus(params);
      Message.success(t('success.operate'));
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
  const formData = ref<UserRecharge>({} as UserRecharge);
  const delFormRef = ref<FormInstance>();
  const delFormData = ref<UserDeleteParams>({} as UserDeleteParams);

  const recharge = async (params: UserRechargeParams) => {
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
    formData.value.quota = quota;
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
      await submitUserRecharge(formData.value);
      Message.success(t('success.recharge'));
      done();
      search();
    } catch (err) {
      done(false);
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
  const handleBatch = (params: UserBatchOperate) => {
    if (ids.value.length === 0) {
      Message.info(t('placeholder.operation.data'));
    } else {
      let alertContent = t('user.placeholder.batch.operation', {
        count: ids.value.length,
      });
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
            alertContent = t('user.placeholder.batch.operation.deduct', {
              count: ids.value.length,
              currencySymbol: appStore.getCurrencySymbol,
              quota: parseQuota(params.value),
            });
          } else {
            alertContent = t('user.placeholder.batch.operation.quota_type', {
              count: ids.value.length,
              quotaType:
                formData.value.quota_type === '1'
                  ? t('finance.dict.deal_type.1')
                  : t('finance.dict.deal_type.3'),
              currencySymbol: appStore.getCurrencySymbol,
              quota: parseQuota(params.value),
            });
          }
          break;
        case 'status':
          if (params.value === 1) {
            alertContent = t('user.placeholder.batch.operation.enable', {
              count: ids.value.length,
            });
          } else {
            alertContent = t('user.placeholder.batch.operation.disable', {
              count: ids.value.length,
            });
          }
          break;
        case 'delete':
          alertContent = t('user.placeholder.batch.operation.delete', {
            count: ids.value.length,
          });
          if (params.data && params.data.length > 0) {
            let delData = '';
            for (let i = 0; i < params.data.length; i += 1) {
              if (i === 0) {
                delData = delDataMap.get(params.data[i]);
              } else {
                delData += `、${delDataMap.get(params.data[i])}`;
              }
            }
            alertContent = t('user.placeholder.batch.operation.delete_data', {
              count: ids.value.length,
              del_data: delData,
            });
          }
          break;
        default:
      }

      if (params.action === 'recharge' && !params.value) {
        return;
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
          submitUserBatchOperate(params).then((res) => {
            setLoading(false);
            Message.success(t('success.operate'));
            search();
            tableRef.value.selectAll(false);
          });
        },
      });
    }
  };

  const handleUserDelete = async (params: UserDeleteParams) => {
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
      userDelete(delFormData.value);
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
    name: 'UserList',
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

  :deep(.arco-radio-button-content) {
    padding: 0 11px;
  }
</style>
