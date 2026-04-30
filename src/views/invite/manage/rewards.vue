<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item><lucide-coins /></a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('invite.menu') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{
        $t('invite.menu.manage.rewards')
      }}</a-breadcrumb-item>
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
                <a-form-item
                  field="inviter_user_id"
                  :label="$t('invite.columns.inviter_user_id')"
                >
                  <a-input-number
                    v-model="searchFormData.inviter_user_id"
                    :placeholder="$t('placeholder.user_id')"
                    :precision="0"
                    :min="1"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="invitee_user_id"
                  :label="$t('invite.columns.invitee_user_id')"
                >
                  <a-input-number
                    v-model="searchFormData.invitee_user_id"
                    :placeholder="$t('placeholder.user_id')"
                    :precision="0"
                    :min="1"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="rid" :label="$t('common.reseller_id')">
                  <a-input-number
                    v-model="searchFormData.rid"
                    :placeholder="$t('placeholder.reseller_id')"
                    :precision="0"
                    :min="0"
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
                  field="created_at"
                  :label="$t('common.created_at')"
                >
                  <a-range-picker
                    v-model="searchFormData.created_at"
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
              <template #icon><icon-search /></template>
              {{ $t('button.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon><icon-refresh /></template>
              {{ $t('button.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider class="list-toolbar-divider" />
      <a-row class="list-toolbar-row">
        <a-col :span="12">
          <a-space>
            <a-button
              type="primary"
              status="danger"
              :disabled="selectedPendingKeys.length === 0"
              @click="cancelRewards"
              >{{ $t('invite.button.cancel') }}</a-button
            >
          </a-space>
        </a-col>
        <a-col :span="12" class="list-table-actions">
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
                    <div class="list-drag-handle">
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
        v-model:selected-keys="selectedKeys"
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
      >
        <template #quota="{ record }">
          <Quota :model-value="record.quota" />
        </template>
        <template #status="{ record }">
          {{ $t(`invite.dict.reward_status.${record.status}`) }}
        </template>
        <template #trigger_type="{ record }">
          {{
            record.trigger_type
              ? $t(`invite.dict.trigger_type.${record.trigger_type}`)
              : '-'
          }}
        </template>
        <template #recharge_rebate="{ record }">
          <span
            v-if="record.trigger_type === 'recharge'"
            class="recharge-rebate-cell"
          >
            {{
              $t('invite.columns.recharge_sequence', {
                sequence: record.recharge_sequence,
              })
            }}
            /
            <Quota
              v-if="record.rebate_type === 'fixed'"
              :model-value="record.rebate_quota"
            />
            <template v-else>{{ record.rebate_rate }}%</template>
          </span>
          <span v-else>-</span>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import {
    queryManageInviteRewardPage,
    submitManageInviteRewardsCancel,
    InviteRewardPage,
    InviteRewardPageParams,
  } from '@/api/invite';
  import Quota from '@/views/common/quota.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const cardHeaderStyle = { padding: '20px' };
  const cardBodyStyle = { padding: '25px 20px 20px 20px' };
  const generateSearchParams = () => ({
    inviter_user_id: undefined,
    invitee_user_id: undefined,
    rid: undefined,
    status: undefined,
    created_at: [],
  });
  const renderData = ref<InviteRewardPage[]>([]);
  const selectedKeys = ref<string[]>([]);
  const searchFormData = ref(generateSearchParams());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');
  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);
  const selectedPendingKeys = computed(() =>
    selectedKeys.value.filter((key) =>
      renderData.value.some((item) => item.id === key && item.status === 1)
    )
  );
  const statusOptions = [
    { label: t('invite.dict.reward_status.1'), value: 1 },
    { label: t('invite.dict.reward_status.2'), value: 2 },
    { label: t('invite.dict.reward_status.3'), value: 3 },
    { label: t('invite.dict.reward_status.4'), value: 4 },
    { label: t('invite.dict.reward_status.5'), value: 5 },
  ];
  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
    showTotal: true,
    showPageSize: true,
    pageSizeOptions: [20, 50, 100, 500, 1000],
  };
  const pagination = reactive({ ...basePagination });
  const densityList = computed(() => [
    { name: t('size.mini'), value: 'mini' },
    { name: t('size.small'), value: 'small' },
    { name: t('size.medium'), value: 'medium' },
    { name: t('size.large'), value: 'large' },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('invite.columns.inviter_user_id'),
      dataIndex: 'inviter_user_id',
      align: 'center',
    },
    {
      title: t('invite.columns.invitee_user_id'),
      dataIndex: 'invitee_user_id',
      align: 'center',
    },
    {
      title: t('common.quota'),
      dataIndex: 'quota',
      slotName: 'quota',
      align: 'center',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
    },
    {
      title: t('invite.columns.trigger_type'),
      dataIndex: 'trigger_type',
      slotName: 'trigger_type',
      align: 'center',
    },
    {
      title: t('invite.columns.recharge_rebate'),
      dataIndex: 'recharge_rebate',
      slotName: 'recharge_rebate',
      align: 'center',
    },
    {
      title: t('invite.columns.apply_order_id'),
      dataIndex: 'apply_order_id',
      align: 'center',
    },
    {
      title: t('invite.columns.cancelled_reason'),
      dataIndex: 'cancelled_reason',
      align: 'center',
    },
    { title: t('common.created_at'), dataIndex: 'created_at', align: 'center' },
  ]);

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined
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
      cloneColumns.value.forEach((item) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );

  const fetchData = async (
    params: InviteRewardPageParams = {
      ...basePagination,
      ...searchFormData.value,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryManageInviteRewardPage(params);
      renderData.value = data.items;
      selectedKeys.value = [];
      pagination.current = params.current;
      pagination.pageSize = params.pageSize;
      pagination.total = data.paging.total;
    } finally {
      setLoading(false);
    }
  };
  fetchData();

  const search = () =>
    fetchData({
      ...basePagination,
      ...searchFormData.value,
    } as InviteRewardPageParams);
  const reset = () => {
    searchFormData.value = generateSearchParams();
    search();
  };
  const cancelRewards = async () => {
    await submitManageInviteRewardsCancel(selectedPendingKeys.value);
    Message.success('操作成功');
    fetchData({
      ...basePagination,
      ...searchFormData.value,
      current: pagination.current,
    });
  };
  const onPageChange = (current: number) =>
    fetchData({ ...basePagination, ...searchFormData.value, current });
  const onPageSizeChange = (pageSize: number) => {
    basePagination.pageSize = pageSize;
    fetchData({ ...basePagination, ...searchFormData.value });
  };
</script>

<script lang="ts">
  export default { name: 'ManageInviteRewards' };
</script>

<style scoped lang="less">
  .recharge-rebate-cell {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
</style>
