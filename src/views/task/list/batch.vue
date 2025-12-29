<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-calendar />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.task') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.task.batch.list') }}</a-breadcrumb-item>
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
              <a-col v-permission="['user']" :span="8">
                <a-form-item field="app_id" :label="$t('task.form.app_id')">
                  <a-select
                    v-model="formModel.app_id"
                    :placeholder="$t('task.form.selectDefault')"
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
              <a-col v-permission="['reseller', 'admin']" :span="8">
                <a-form-item field="user_id" :label="$t('task.form.user_id')">
                  <a-input-number
                    v-model="formModel.user_id"
                    :placeholder="$t('task.form.user_id.placeholder')"
                    :min="1"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="trace_id" :label="$t('task.form.trace_id')">
                  <a-input
                    v-model="formModel.trace_id"
                    :placeholder="$t('task.form.trace_id.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="batch_id" :label="$t('task.form.batch_id')">
                  <a-input
                    v-model="formModel.batch_id"
                    :placeholder="$t('task.form.batch_id.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="file_id" :label="$t('task.form.file_id')">
                  <a-input
                    v-model="formModel.file_id"
                    :placeholder="$t('task.form.file_id.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('task.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('task.form.selectDefault')"
                    :scrollbar="false"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="created_at"
                  :label="$t('task.form.created_at')"
                >
                  <a-range-picker
                    v-model="formModel.created_at"
                    :placeholder="['开始时间', '结束时间']"
                    :time-picker-props="{
                      defaultValue: ['00:00:00', '23:59:59'],
                    }"
                    show-time
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
              {{ $t('task.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('task.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider
        v-permission="['reseller', 'admin']"
        style="margin-top: 0; margin-bottom: 16px"
      />
      <a-row style="margin-bottom: 16px">
        <a-col
          :span="24"
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
      >
        <template #batch_id="{ record }">
          <span class="copy-btn" @click="handleCopy(record.batch_id)">
            {{ record.batch_id || '-' }}
          </span>
        </template>
        <template #input_file_id="{ record }">
          <span class="copy-btn" @click="handleCopy(record.input_file_id)">
            {{ record.input_file_id || '-' }}
          </span>
        </template>
        <template #output_file_id="{ record }">
          <span class="copy-btn" @click="handleCopy(record.output_file_id)">
            {{ record.output_file_id || '-' }}
          </span>
        </template>
        <template #status="{ record }">
          <a-tag v-if="record.status === 'completed'" color="green">
            {{ $t(`task.dict.status.${record.status}`) }}
          </a-tag>
          <a-tag v-else-if="record.status === 'finalizing'" color="green">
            {{ $t(`task.dict.status.${record.status}`) }}
          </a-tag>
          <a-tag v-else-if="record.status === 'validating'" color="arcoblue">
            {{ $t(`task.dict.status.${record.status}`) }}
          </a-tag>
          <a-tag v-else-if="record.status === 'in_progress'" color="orange">
            {{ $t(`task.dict.status.${record.status}`) }}
          </a-tag>
          <a-tag v-else-if="record.status === 'failed'" color="red">
            {{ $t(`task.dict.status.${record.status}`) }}
          </a-tag>
          <a-tag v-else color="gray">
            {{ $t(`task.dict.status.${record.status}`) }}
          </a-tag>
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('task.columns.operations.view') }}
          </a-button>
        </template>
      </a-table>

      <a-drawer
        :title="$t('menu.task.batch.detail')"
        unmount-on-close
        render-to-body
        :width="700"
        :footer="false"
        :visible="detailVisible"
        @cancel="detailHandleCancel"
      >
        <Detail :id="recordId" />
      </a-drawer>
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
  import { queryAppList, AppList } from '@/api/app';
  import { queryBatchPage, BatchPage, BatchPageParams } from '@/api/task';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { useClipboard } from '@vueuse/core';
  import Detail from '../detail/batch.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { proxy } = getCurrentInstance() as any;
  const userRole = localStorage.getItem('userRole');

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const generateFormModel = () => {
    return {
      user_id: ref(),
      app_id: ref(),
      trace_id: '',
      batch_id: '',
      file_id: '',
      status: ref(),
      created_at: [],
    };
  };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<BatchPage[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');
  const tableRef = ref();

  const apps = ref<AppList[]>([]);
  const getAppList = async () => {
    try {
      const { data } = await queryAppList();
      apps.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };

  if (userRole === 'user') {
    getAppList();
  }

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
      title:
        userRole === 'reseller' || userRole === 'admin'
          ? t('task.columns.user_id')
          : t('task.columns.app_id'),
      dataIndex:
        userRole === 'reseller' || userRole === 'admin' ? 'user_id' : 'app_id',
      slotName:
        userRole === 'reseller' || userRole === 'admin' ? 'user_id' : 'app_id',
      align: 'center',
      width: 75,
    },
    {
      title: t('task.columns.model'),
      dataIndex: 'model',
      slotName: 'model',
      align: 'center',
    },
    {
      title: t('task.columns.batch_id'),
      dataIndex: 'batch_id',
      slotName: 'batch_id',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('task.columns.input_file_id'),
      dataIndex: 'input_file_id',
      slotName: 'input_file_id',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('task.columns.output_file_id'),
      dataIndex: 'output_file_id',
      slotName: 'output_file_id',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('task.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
    },
    {
      title: t('task.columns.created_at'),
      dataIndex: 'created_at',
      slotName: 'created_at',
      align: 'center',
      width: 132,
    },
    {
      title: t('task.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 75,
    },
  ]);

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('task.dict.status.queued'),
      value: 'queued',
    },
    {
      label: t('task.dict.status.in_progress'),
      value: 'in_progress',
    },
    {
      label: t('task.dict.status.completed'),
      value: 'completed',
    },
    {
      label: t('task.dict.status.failed'),
      value: 'failed',
    },
    {
      label: t('task.dict.status.expired'),
      value: 'expired',
    },
  ]);

  if (userRole === 'admin') {
    statusOptions.value.push({
      label: t('task.dict.status.deleted'),
      value: 'deleted',
    });
  }

  const fetchData = async (
    params: BatchPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryBatchPage(params);
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
    } as unknown as BatchPageParams);
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
   * 复制内容
   *
   * @param content 内容
   */
  const { copy, copied } = useClipboard();
  const handleCopy = async (content: string) => {
    copy(content);
  };

  watch(copied, () => {
    if (copied.value) {
      proxy.$message.success('复制成功');
    }
  });

  const getFullUrl = (url: string) => {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return window.location.origin + (url.startsWith('/') ? url : `/${url}`);
  };
</script>

<script lang="ts">
  export default {
    name: 'TaskBatchList',
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
    cursor: pointer;
  }
  .copy-btn:hover {
    color: rgb(var(--arcoblue-6));
  }
</style>
