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
      <a-row class="list-toolbar-row">
        <a-col :span="24" class="list-table-actions">
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
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="cloneColumns"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #total_quota="{ record }">
          <Quota :model-value="record.total_quota" />
        </template>
        <template #status="{ record }">
          {{ $t(`invite.dict.apply_status.${record.status}`) }}
        </template>
        <template #operations="{ record }">
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
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import {
    queryManageInviteRewardApplyPage,
    submitManageInviteRewardApplyApprove,
    submitManageInviteRewardApplyReject,
    InviteRewardApplyPage,
    InviteRewardApplyPageParams,
  } from '@/api/invite';
  import Quota from '@/views/common/quota.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

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
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');
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
  const densityList = computed(() => [
    { name: t('size.mini'), value: 'mini' },
    { name: t('size.small'), value: 'small' },
    { name: t('size.medium'), value: 'medium' },
    { name: t('size.large'), value: 'large' },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('invite.columns.order_no'),
      dataIndex: 'order_no',
      align: 'center',
    },
    {
      title: t('common.user_id'),
      dataIndex: 'user_id',
      align: 'center',
    },
    {
      title: t('common.quota'),
      dataIndex: 'total_quota',
      slotName: 'total_quota',
      align: 'center',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
    },
    {
      title: t('invite.columns.reject_reason'),
      dataIndex: 'reject_reason',
      align: 'center',
    },
    {
      title: t('invite.columns.applied_at'),
      dataIndex: 'applied_at',
      align: 'center',
    },
    {
      title: t('invite.columns.audited_at'),
      dataIndex: 'audited_at',
      align: 'center',
    },
    {
      title: t('common.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 180,
    },
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
