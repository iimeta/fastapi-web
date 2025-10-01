<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-wechatpay />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.finance') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.bill.list') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card
      class="general-card"
      :bordered="false"
      :header-style="{ padding: '20px' }"
      :body-style="{
        padding: '25px 20px 20px 20px',
      }"
    >
      <a-row v-permission="['reseller', 'admin']">
        <a-col :flex="1">
          <a-form
            :model="searchFormData"
            :label-col-props="{ span: 5 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="name" :label="$t('finance.form.user_id')">
                  <a-input-number
                    v-model="searchFormData.user_id"
                    :placeholder="$t('finance.form.user_id.placeholder')"
                    :precision="0"
                    :min="1"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="stat_date"
                  :label="$t('finance.form.stat_date')"
                >
                  <a-range-picker
                    v-model="searchFormData.stat_date"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 32px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('finance.form.search') }}
            </a-button>
            <!-- <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('finance.form.reset') }}
            </a-button> -->
          </a-space>
        </a-col>
      </a-row>
      <a-divider
        v-permission="['reseller', 'admin']"
        style="margin-top: 0; margin-bottom: 16px"
      />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleBillExport({})">
              导出
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
        <template #total="{ record }">
          {{ record.total.toLocaleString() }}
        </template>
        <template #tokens="{ record }">
          {{ record.tokens > 0 ? `$${quotaConv(record.tokens)}` : '$0.00' }}
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('operations.view') }}
          </a-button>
        </template>
      </a-table>

      <a-drawer
        :title="$t('menu.bill.detail')"
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
        v-model:visible="billExportFormVisible"
        :title="$t('finance.form.title.bill_export')"
        @cancel="billExportHandleCancel"
        @before-ok="billExportHandleBeforeOk"
      >
        <a-form ref="billExportForm" :model="billExportFormData">
          <a-form-item
            field="stat_date"
            :label="$t('finance.form.stat_date')"
            :rules="[
              {
                required: true,
                message: $t('finance.error.stat_date.required'),
              },
            ]"
          >
            <a-range-picker
              v-model="billExportFormData.stat_date"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item
            v-permission="['reseller', 'admin']"
            field="user_id"
            :label="$t('finance.form.user_id')"
          >
            <a-input-number
              v-model="billExportFormData.user_id"
              :placeholder="$t('finance.form.user_id.placeholder')"
              :precision="0"
              :min="1"
              allow-clear
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
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { quotaConv } from '@/utils/common';
  import {
    queryBillPage,
    BillPage,
    BillPageParams,
    BillExportParams,
    submitBillExport,
  } from '@/api/finance';
  import { Pagination } from '@/types/global';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { FormInstance } from '@arco-design/web-vue';
  import Detail from '../detail/bill.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

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
      stat_date: [],
    };
  };

  const renderData = ref<BillPage[]>([]);
  const searchFormData = ref(generateSearchParams());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');
  const tableRef = ref();
  const ids = ref<Array<string>>([]);
  const multiple = ref(true);

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
      title: t('finance.columns.user_id'),
      dataIndex: 'user_id',
      slotName: 'user_id',
      align: 'center',
      width: 80,
    },
    {
      title: t('finance.columns.total'),
      dataIndex: 'total',
      slotName: 'total',
      align: 'center',
    },
    {
      title: t('finance.columns.models'),
      dataIndex: 'models',
      slotName: 'models',
      align: 'center',
    },
    {
      title: t('finance.columns.tokens'),
      dataIndex: 'tokens',
      slotName: 'tokens',
      align: 'center',
    },
    {
      title: t('finance.columns.stat_date'),
      dataIndex: 'stat_date',
      slotName: 'stat_date',
      align: 'center',
    },
    {
      title: t('common.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 75,
    },
  ]);

  const fetchData = async (
    params: BillPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryBillPage(params);
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
    } as unknown as BillPageParams);
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

  const { proxy } = getCurrentInstance() as any;

  /**
   * 已选择的数据行发生改变时触发
   *
   * @param rowKeys ID 列表
   */
  const handleSelectionChange = (rowKeys: Array<any>) => {
    ids.value = rowKeys;
    multiple.value = !rowKeys.length;
  };

  const billExportForm = ref<FormInstance>();
  const billExportFormVisible = ref(false);
  const billExportFormData = ref<BillExportParams>({} as BillExportParams);

  const billExportHandleBeforeOk = async (done: any) => {
    const res = await billExportForm.value?.validate();
    if (res) {
      billExportFormVisible.value = true;
      done(false);
      return;
    }
    done();
    handleBillExport(billExportFormData.value);
  };

  const billExportHandleCancel = () => {
    billExportFormVisible.value = false;
  };

  /**
   * 导出操作
   */
  const handleBillExport = (params: BillExportParams) => {
    if (ids.value.length === 0 && !params.stat_date) {
      billExportFormVisible.value = true;
      return;
    }

    setLoading(true);
    params.ids = ids.value;
    submitBillExport(params)
      .then((res) => {
        setLoading(false);
        proxy.$message.success('导出成功');
        tableRef.value.selectAll(false);
        // 创建一个新的Blob对象，使用后端返回的文件流
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });

        // 创建一个指向该Blob的URL
        const url = window.URL.createObjectURL(blob);

        // 创建一个a标签用于下载文件
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '账单明细.xlsx'); // 设置下载文件名
        document.body.appendChild(link);

        // 触发a标签的点击事件，开始下载
        link.click();

        // 清理并释放资源
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        proxy.$message.error('导出失败, 请联系管理员', error);
      });
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
</script>

<script lang="ts">
  export default {
    name: 'BillList',
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
