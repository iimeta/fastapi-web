<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item><lucide-clipboard-check /></a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('invite.menu') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{
        $t('invite.menu.manage.apply')
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
                <a-form-item field="user_id" :label="$t('common.user_id')">
                  <a-input-number
                    v-model="searchFormData.user_id"
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
                  field="applied_at"
                  :label="$t('invite.columns.applied_at')"
                >
                  <a-range-picker
                    v-model="searchFormData.applied_at"
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
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #columns>
          <a-table-column
            :title="$t('invite.columns.order_no')"
            data-index="order_no"
            align="center"
          />
          <a-table-column
            :title="$t('common.user_id')"
            data-index="user_id"
            align="center"
          />
          <a-table-column
            :title="$t('common.reseller_id')"
            data-index="rid"
            align="center"
          />
          <a-table-column
            :title="$t('common.quota')"
            data-index="total_quota"
            align="center"
          >
            <template #cell="{ record }"
              ><Quota :model-value="record.total_quota"
            /></template>
          </a-table-column>
          <a-table-column
            :title="$t('common.status')"
            data-index="status"
            align="center"
          >
            <template #cell="{ record }">{{
              $t(`invite.dict.apply_status.${record.status}`)
            }}</template>
          </a-table-column>
          <a-table-column
            :title="$t('invite.columns.reject_reason')"
            data-index="reject_reason"
            align="center"
          />
          <a-table-column
            :title="$t('invite.columns.applied_at')"
            data-index="applied_at"
            align="center"
          />
          <a-table-column
            :title="$t('invite.columns.audited_at')"
            data-index="audited_at"
            align="center"
          />
          <a-table-column
            :title="$t('common.operations')"
            align="center"
            :width="180"
          >
            <template #cell="{ record }">
              <a-space>
                <a-button
                  size="mini"
                  type="primary"
                  :disabled="record.status !== 1"
                  @click="approve(record.id)"
                  >{{ $t('invite.button.approve') }}</a-button
                >
                <a-button
                  size="mini"
                  status="danger"
                  :disabled="record.status !== 1"
                  @click="reject(record.id)"
                  >{{ $t('invite.button.reject') }}</a-button
                >
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import {
    queryManageInviteRewardApplyPage,
    submitManageInviteRewardApplyApprove,
    submitManageInviteRewardApplyReject,
    InviteRewardApplyPage,
    InviteRewardApplyPageParams,
  } from '@/api/invite';
  import Quota from '@/views/common/quota.vue';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const cardHeaderStyle = { padding: '20px' };
  const cardBodyStyle = { padding: '25px 20px 20px 20px' };
  const generateSearchParams = () => ({
    user_id: undefined,
    rid: undefined,
    status: undefined,
    applied_at: [],
  });
  const renderData = ref<InviteRewardApplyPage[]>([]);
  const searchFormData = ref(generateSearchParams());
  const statusOptions = [
    { label: t('invite.dict.apply_status.1'), value: 1 },
    { label: t('invite.dict.apply_status.2'), value: 2 },
    { label: t('invite.dict.apply_status.3'), value: 3 },
    { label: t('invite.dict.apply_status.4'), value: 4 },
    { label: t('invite.dict.apply_status.5'), value: 5 },
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
    params: InviteRewardApplyPageParams = {
      ...basePagination,
      ...searchFormData.value,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryManageInviteRewardApplyPage(params);
      renderData.value = data.items;
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
    } as InviteRewardApplyPageParams);
  const reset = () => {
    searchFormData.value = generateSearchParams();
    search();
  };
  const approve = async (id: string) => {
    await submitManageInviteRewardApplyApprove(id);
    Message.success('操作成功');
    fetchData({
      ...basePagination,
      ...searchFormData.value,
      current: pagination.current,
    });
  };
  const reject = async (id: string) => {
    await submitManageInviteRewardApplyReject(id, undefined, true);
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
  export default { name: 'ManageInviteApply' };
</script>
