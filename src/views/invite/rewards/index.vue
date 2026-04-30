<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item><lucide-coins /></a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('invite.menu') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('invite.menu.rewards') }}</a-breadcrumb-item>
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
              :disabled="selectedPendingKeys.length === 0"
              @click="applyRewards"
              >{{ $t('invite.button.apply') }}</a-button
            >
          </a-space>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :data="renderData"
        :bordered="false"
        :row-selection="rowSelection"
        v-model:selected-keys="selectedKeys"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #columns>
          <a-table-column
            :title="$t('invite.columns.invitee_user_id')"
            data-index="invitee_user_id"
            align="center"
          />
          <a-table-column
            :title="$t('common.quota')"
            data-index="quota"
            align="center"
          >
            <template #cell="{ record }"
              ><Quota :model-value="record.quota"
            /></template>
          </a-table-column>
          <a-table-column
            :title="$t('common.status')"
            data-index="status"
            align="center"
          >
            <template #cell="{ record }">{{
              $t(`invite.dict.reward_status.${record.status}`)
            }}</template>
          </a-table-column>
          <a-table-column
            :title="$t('invite.columns.trigger_type')"
            data-index="trigger_type"
            align="center"
          >
            <template #cell="{ record }">
              {{
                record.trigger_type
                  ? $t(`invite.dict.trigger_type.${record.trigger_type}`)
                  : '-'
              }}
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('invite.columns.recharge_rebate')"
            align="center"
          >
            <template #cell="{ record }">
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
          </a-table-column>
          <a-table-column
            :title="$t('invite.columns.apply_order_id')"
            data-index="apply_order_id"
            align="center"
          />
          <a-table-column
            :title="$t('common.created_at')"
            data-index="created_at"
            align="center"
          />
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import type { TableRowSelection } from '@arco-design/web-vue/es/table/interface';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import {
    queryInviteRewardPage,
    submitInviteRewardApply,
    InviteRewardPage,
    InviteRewardPageParams,
  } from '@/api/invite';
  import Quota from '@/views/common/quota.vue';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const cardHeaderStyle = { padding: '20px' };
  const cardBodyStyle = { padding: '25px 20px 20px 20px' };
  const generateSearchParams = () => ({
    invitee_user_id: undefined,
    status: undefined,
    created_at: [],
  });
  const renderData = ref<InviteRewardPage[]>([]);
  const selectedKeys = ref<string[]>([]);
  const searchFormData = ref(generateSearchParams());
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

  const fetchData = async (
    params: InviteRewardPageParams = {
      ...basePagination,
      ...searchFormData.value,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryInviteRewardPage(params);
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
  const applyRewards = async () => {
    await submitInviteRewardApply(selectedPendingKeys.value);
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
  export default { name: 'InviteRewards' };
</script>

<style scoped lang="less">
  .recharge-rebate-cell {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
</style>
