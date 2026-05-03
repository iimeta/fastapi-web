<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <lucide-headset />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('ticket.menu') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{
        $t(
          $route.name === 'TicketMyList'
            ? 'ticket.menu.my_tickets'
            : 'ticket.menu.list'
        )
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
              <a-col :span="6">
                <a-form-item
                  field="ticket_no"
                  :label="$t('ticket.label.ticket_no')"
                >
                  <a-input
                    v-model="searchFormData.ticket_no"
                    :placeholder="$t('ticket.placeholder.ticket_no')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="title" :label="$t('ticket.label.title')">
                  <a-input
                    v-model="searchFormData.title"
                    :placeholder="$t('ticket.placeholder.title')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  field="category"
                  :label="$t('ticket.label.category')"
                >
                  <a-select
                    v-model="searchFormData.category"
                    :placeholder="$t('common.all')"
                    :scrollbar="false"
                    allow-clear
                  >
                    <a-option value="account">{{
                      $t('ticket.dict.category.account')
                    }}</a-option>
                    <a-option value="billing">{{
                      $t('ticket.dict.category.billing')
                    }}</a-option>
                    <a-option value="technical">{{
                      $t('ticket.dict.category.technical')
                    }}</a-option>
                    <a-option value="feature">{{
                      $t('ticket.dict.category.feature')
                    }}</a-option>
                    <a-option value="other">{{
                      $t('ticket.dict.category.other')
                    }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="status" :label="$t('ticket.label.status')">
                  <a-select
                    v-model="searchFormData.status"
                    :placeholder="$t('common.all')"
                    :scrollbar="false"
                    allow-clear
                  >
                    <a-option :value="1">{{
                      $t('ticket.dict.status.1')
                    }}</a-option>
                    <a-option :value="2">{{
                      $t('ticket.dict.status.2')
                    }}</a-option>
                    <a-option :value="3">{{
                      $t('ticket.dict.status.3')
                    }}</a-option>
                    <a-option :value="4">{{
                      $t('ticket.dict.status.4')
                    }}</a-option>
                    <a-option :value="5">{{
                      $t('ticket.dict.status.5')
                    }}</a-option>
                    <a-option :value="6">{{
                      $t('ticket.dict.status.6')
                    }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col v-if="userStore.role !== 'user'" :span="6">
                <a-form-item
                  field="user_name"
                  :label="$t('ticket.label.submitter')"
                >
                  <a-input
                    v-model="searchFormData.user_name"
                    :placeholder="$t('ticket.placeholder.submitter')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  field="priority"
                  :label="$t('ticket.label.priority')"
                >
                  <a-select
                    v-model="searchFormData.priority"
                    :placeholder="$t('common.all')"
                    :scrollbar="false"
                    allow-clear
                  >
                    <a-option :value="1">{{
                      $t('ticket.dict.priority.1')
                    }}</a-option>
                    <a-option :value="2">{{
                      $t('ticket.dict.priority.2')
                    }}</a-option>
                    <a-option :value="3">{{
                      $t('ticket.dict.priority.3')
                    }}</a-option>
                    <a-option :value="4">{{
                      $t('ticket.dict.priority.4')
                    }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  field="created_at"
                  :label="$t('ticket.label.created_at')"
                >
                  <a-range-picker
                    v-model="searchFormData.created_at"
                    style="width: 100%"
                    allow-clear
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
      <a-divider class="list-toolbar-divider" />
      <a-row class="list-toolbar-row">
        <a-col :span="12">
          <a-space>
            <a-button
              v-if="isMyTickets"
              type="primary"
              @click="$router.push({ name: 'TicketCreate' })"
            >
              {{ $t('ticket.button.create') }}
            </a-button>
            <a-button
              v-if="userStore.role === 'admin'"
              type="primary"
              status="danger"
              :disabled="multiple"
              :title="multiple ? $t('placeholder.operation.data') : ''"
              @click="handleBatchDelete"
            >
              {{ $t('button.delete') }}
            </a-button>
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
        ref="tableRef"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="cloneColumns"
        :data="renderData"
        :bordered="false"
        :size="size"
        :row-selection="userStore.role === 'admin' ? rowSelection : undefined"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template #ticket_no="{ record }">
          <a-space :size="2">
            <span>{{ record.ticket_no }}</span>
            <a-button
              v-if="record.ticket_no"
              type="text"
              size="mini"
              @click.stop="handleCopyTicketNo(record.ticket_no)"
            >
              <template #icon><icon-copy /></template>
            </a-button>
          </a-space>
        </template>
        <template #title="{ record }">
          <a-link @click="viewDetail(record)">{{ record.title }}</a-link>
        </template>
        <template #category="{ record }">
          <a-tag :color="categoryColor(record.category)">{{
            $t(`ticket.dict.category.${record.category}`)
          }}</a-tag>
        </template>
        <template #priority="{ record }">
          <a-tag :color="priorityColor(record.priority)">
            {{ $t(`ticket.dict.priority.${record.priority}`) }}
          </a-tag>
        </template>
        <template #status="{ record }">
          <a-tag :color="statusColor(record.status)">
            {{ $t(`ticket.dict.status.${record.status}`) }}
          </a-tag>
        </template>
        <template #user_name="{ record }">
          {{ record.user_name || '-' }}
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="viewDetail(record)">
              {{ $t('button.detail') }}
            </a-button>
            <a-button
              v-if="record.status !== 6"
              type="text"
              size="small"
              status="danger"
              @click="handleClose(record)"
            >
              {{ $t('ticket.button.close') }}
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter, useRoute } from 'vue-router';
  import { Message, Modal } from '@arco-design/web-vue';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import useLoading from '@/hooks/loading';
  import { useUserStore } from '@/store';
  import { Pagination } from '@/types/global';
  import {
    queryTicketPage,
    submitTicketClose,
    submitTicketBatchDelete,
    TicketPageParams,
    TicketPage,
  } from '@/api/ticket';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { t } = useI18n();
  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();
  const { loading, setLoading } = useLoading(true);

  // "我的工单" route only shows user's own tickets
  const isMyTickets = computed(() => route.name === 'TicketMyList');
  const cardHeaderStyle = {
    padding: '20px',
  };
  const cardBodyStyle = {
    padding: '25px 20px 20px 20px',
  };

  const generateSearchParams = () => {
    return {
      ticket_no: '',
      title: '',
      user_name: '',
      category: ref(),
      status: ref(),
      priority: ref(),
      created_at: ref(),
    };
  };

  const renderData = ref<TicketPage[]>([]);
  const searchFormData = ref(generateSearchParams());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');
  const tableRef = ref();

  // Batch selection state (admin only)
  const ids = ref<string[]>([]);
  const multiple = ref(true);

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

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

  const columns = computed<TableColumnData[]>(() => {
    const cols: TableColumnData[] = [
      {
        title: t('ticket.label.ticket_no'),
        dataIndex: 'ticket_no',
        slotName: 'ticket_no',
        align: 'center',
        width: 160,
      },
      {
        title: t('ticket.label.title'),
        dataIndex: 'title',
        slotName: 'title',
        align: 'center',
        ellipsis: true,
        tooltip: true,
      },
      {
        title: t('ticket.label.category'),
        dataIndex: 'category',
        slotName: 'category',
        align: 'center',
        width: 110,
      },
      {
        title: t('ticket.label.priority'),
        dataIndex: 'priority',
        slotName: 'priority',
        align: 'center',
        width: 90,
      },
      {
        title: t('ticket.label.status'),
        dataIndex: 'status',
        slotName: 'status',
        align: 'center',
        width: 100,
      },
    ];

    // Non-user roles can see submitter
    if (userStore.role !== 'user') {
      cols.push({
        title: t('ticket.label.submitter'),
        dataIndex: 'user_name',
        slotName: 'user_name',
        align: 'center',
        width: 120,
      });
    }

    cols.push(
      {
        title: t('ticket.label.reply_count'),
        dataIndex: 'reply_count',
        align: 'center',
        width: 90,
      },
      {
        title: t('ticket.label.created_at'),
        dataIndex: 'created_at',
        align: 'center',
        width: 170,
      },
      {
        title: t('common.operations'),
        dataIndex: 'operations',
        slotName: 'operations',
        align: 'center',
        width: 150,
        fixed: 'right',
      }
    );

    return cols;
  });

  const buildParams = (): TicketPageParams => {
    const params: TicketPageParams = {
      ...basePagination,
      ...searchFormData.value,
    };
    // Convert date range to start/end strings
    if (
      searchFormData.value.created_at &&
      searchFormData.value.created_at.length === 2
    ) {
      [params.created_at_start, params.created_at_end] =
        searchFormData.value.created_at;
    }
    delete (params as any).created_at;
    return params;
  };

  const fetchData = async (params: TicketPageParams = buildParams()) => {
    if (isMyTickets.value) {
      params.scope = 'my';
    }
    setLoading(true);
    try {
      const { data } = await queryTicketPage(params);
      renderData.value = data.items || [];
      pagination.current = params.current;
      pagination.pageSize = params.pageSize;
      pagination.total = data.paging.total;
    } catch (err) {
      // error handled by interceptor
    } finally {
      setLoading(false);
    }
  };
  fetchData();

  // Re-fetch when switching between TicketMyList and TicketList (same component)
  watch(
    () => route.name,
    () => {
      fetchData({ ...basePagination } as TicketPageParams);
    }
  );

  const search = () => {
    const params = buildParams();
    params.current = 1;
    fetchData(params);
  };

  const onPageChange = (current: number) => {
    const params = buildParams();
    params.current = current;
    fetchData(params);
  };

  const onPageSizeChange = (pageSize: number) => {
    basePagination.pageSize = pageSize;
    const params = buildParams();
    fetchData(params);
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

  const viewDetail = (record: TicketPage) => {
    router.push({ name: 'TicketDetail', query: { id: record.id } });
  };

  const handleClose = (record: TicketPage) => {
    Modal.warning({
      title: t('ticket.button.close'),
      content: t('ticket.message.close.confirm'),
      hideCancel: false,
      onOk: async () => {
        await submitTicketClose({ id: record.id });
        Message.success(t('ticket.message.close.success'));
        search();
      },
    });
  };

  // Batch selection
  const handleSelectionChange = (rowKeys: string[]) => {
    ids.value = rowKeys;
    multiple.value = !rowKeys.length;
  };

  // Batch delete (admin only)
  const handleBatchDelete = () => {
    Modal.warning({
      title: t('modal.warning.title'),
      content: t('placeholder.batch.operation.delete', {
        count: ids.value.length,
      }),
      hideCancel: false,
      onOk: async () => {
        setLoading(true);
        try {
          await submitTicketBatchDelete({ ids: ids.value });
          Message.success(t('success.delete'));
          search();
          tableRef.value.selectAll(false);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const categoryColor = (category: string) => {
    const colors: Record<string, string> = {
      account: 'blue',
      billing: 'orange',
      technical: 'purple',
      feature: 'cyan',
      other: 'gray',
    };
    return colors[category] || 'gray';
  };

  const handleCopyTicketNo = (ticketNo: string) => {
    navigator.clipboard.writeText(ticketNo);
    Message.success(t('ticket.message.copy.success'));
  };

  const priorityColor = (priority: number) => {
    const colors: Record<number, string> = {
      1: 'gray',
      2: 'blue',
      3: 'orange',
      4: 'red',
    };
    return colors[priority] || 'gray';
  };

  const statusColor = (status: number) => {
    const colors: Record<number, string> = {
      1: 'purple', // 待回复
      2: 'orangered', // 待处理
      3: 'blue', // 处理中
      4: 'cyan', // 已回复
      5: 'green', // 已解决
      6: 'gray', // 已关闭
    };
    return colors[status] || 'gray';
  };
</script>

<script lang="ts">
  export default {
    name: 'TicketList',
  };
</script>

<style scoped lang="less">
  @import '@/assets/style/page-list.less';
</style>
