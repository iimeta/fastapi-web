<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-notification />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.notice') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.notice.list') }}</a-breadcrumb-item>
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
              <a-col :span="8">
                <a-form-item field="title" :label="$t('notice.form.title')">
                  <a-input
                    v-model="formModel.title"
                    :placeholder="$t('notice.form.title.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="content" :label="$t('notice.form.content')">
                  <a-input
                    v-model="formModel.content"
                    :placeholder="$t('notice.form.content.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="category"
                  :label="$t('notice.form.category')"
                >
                  <a-select
                    v-model="formModel.category"
                    :placeholder="$t('notice.form.selectDefault')"
                    :options="publicOptions"
                    :scrollbar="false"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="remark" :label="$t('notice.form.remark')">
                  <a-input
                    v-model="formModel.remark"
                    :placeholder="$t('notice.form.remark.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('notice.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :placeholder="$t('notice.form.selectDefault')"
                    :options="statusOptions"
                    :scrollbar="false"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="publish_time"
                  :label="$t('notice.form.publish_time')"
                >
                  <a-range-picker
                    v-model="formModel.publish_time"
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
              {{ $t('notice.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('notice.form.reset') }}
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
              @click="$router.push({ name: 'NoticeCreate' })"
            >
              {{ $t('notice.operation.create') }}
            </a-button>
            <a-button
              type="primary"
              status="success"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'notice',
                })
              "
            >
              发送通知
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
        <template #category="{ record }">
          {{ $t(`notice.dict.category.${record.category}`) }}
        </template>
        <template #scope="{ record }">
          {{ $t(`notice.dict.scope.${record.scope}`) }}
        </template>
        <template #remark="{ record }">
          {{ record.remark || '-' }}
        </template>
        <template #status="{ record }">
          {{ $t(`notice.dict.status.${record.status}`) }}
        </template>
        <template #publish_time="{ record }">
          {{ record.publish_time || '-' }}
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('operations.view') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'NoticeUpdate',
                query: { id: `${record.id}`, action: 'copy' },
              })
            "
          >
            {{ $t('notice.columns.operations.copy') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'NoticeUpdate',
                query: { id: `${record.id}` },
              })
            "
            :disabled="record.status === 1"
          >
            {{ $t('notice.columns.operations.update') }}
          </a-button>
          <a-popconfirm
            content="你确定要删除吗?"
            @ok="noticeDelete({ id: `${record.id}` })"
          >
            <a-button type="text" size="small">
              {{ $t('notice.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>

      <a-drawer
        :title="$t('menu.notice.detail')"
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
  import {
    queryNoticePage,
    NoticePage,
    NoticePageParams,
    submitNoticeDelete,
    NoticeDeleteParams,
    NoticeBatchOperate,
    submitNoticeBatchOperate,
  } from '@/api/notice';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import Detail from '../detail/index.vue';

  const { proxy } = getCurrentInstance() as any;

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const noticeDelete = async (params: NoticeDeleteParams) => {
    setLoading(true);
    try {
      await submitNoticeDelete(params);
      proxy.$message.success('删除成功');
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const generateFormModel = () => {
    return {
      title: '',
      content: '',
      category: ref(),
      remark: '',
      status: ref(),
      publish_time: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<NoticePage[]>([]);
  const formModel = ref(generateFormModel());
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
    // {
    //   title: t('notice.columns.user_id'),
    //   dataIndex: 'user_id',
    //   slotName: 'user_id',
    //   align: 'center',
    //   width: 80,
    // },
    {
      title: t('notice.columns.title'),
      dataIndex: 'title',
      slotName: 'title',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('notice.columns.category'),
      dataIndex: 'category',
      slotName: 'category',
      align: 'center',
    },
    {
      title: t('notice.columns.scope'),
      dataIndex: 'scope',
      slotName: 'scope',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    // {
    //   title: t('notice.columns.priority'),
    //   dataIndex: 'priority',
    //   slotName: 'priority',
    //   align: 'center',
    // },
    {
      title: t('notice.columns.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('notice.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 65,
    },
    {
      title: t('notice.columns.publish_time'),
      dataIndex: 'publish_time',
      slotName: 'publish_time',
      align: 'center',
      width: 170,
    },
    {
      title: t('notice.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 220,
    },
  ]);

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('notice.dict.status.1'),
      value: 1,
    },
    {
      label: t('notice.dict.status.2'),
      value: 2,
    },
    // {
    //   label: t('notice.dict.status.3'),
    //   value: 3,
    // },
    // {
    //   label: t('notice.dict.status.4'),
    //   value: 4,
    // },
  ]);

  const publicOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('notice.dict.category.service'),
      value: 'service',
    },
    {
      label: t('notice.dict.category.activity'),
      value: 'activity',
    },
    {
      label: t('notice.dict.category.safety'),
      value: 'safety',
    },
    {
      label: t('notice.dict.category.maint'),
      value: 'maint',
    },
    {
      label: t('notice.dict.category.product'),
      value: 'product',
    },
    {
      label: t('notice.dict.category.fault'),
      value: 'fault',
    },
  ]);

  const fetchData = async (
    params: NoticePageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryNoticePage(params);
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

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as NoticePageParams);
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
  const handleBatch = (params: NoticeBatchOperate) => {
    if (ids.value.length === 0) {
      proxy.$message.info('请选择要操作的数据');
    } else {
      let alertContent = `是否确定操作所选的${ids.value.length}条数据?`;
      switch (params.action) {
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
          submitNoticeBatchOperate(params).then((res) => {
            setLoading(false);
            proxy.$message.success('操作成功');
            search();
            tableRef.value.selectAll(false);
          });
        },
      });
    }
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
    name: 'NoticeList',
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
