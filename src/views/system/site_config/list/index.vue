<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-settings />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.sys') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.site.config') }}</a-breadcrumb-item>
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
                <a-form-item
                  field="domain"
                  :label="$t('site.config.form.domain')"
                >
                  <a-input
                    v-model="formModel.domain"
                    :placeholder="$t('site.config.form.domain.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="title"
                  :label="$t('site.config.form.title')"
                >
                  <a-input
                    v-model="formModel.title"
                    :placeholder="$t('site.config.form.title.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('common.status')">
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('common.all')"
                    :scrollbar="false"
                    allow-clear
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
              {{ $t('button.search') }}
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
              @click="$router.push({ name: 'SiteConfigCreate' })"
            >
              {{ $t('button.create') }}
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
        <template #register_tips="{ record }">
          {{ record.register_tips || '-' }}
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
              siteChangeStatus({
                id: `${record.id}`,
                status: Number(`${record.status}`),
              })
            "
          />
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
                name: 'SiteConfigUpdate',
                query: { id: `${record.id}` },
              })
            "
          >
            {{ $t('operations.update') }}
          </a-button>
          <a-popconfirm
            content="你确定要删除吗?"
            @ok="siteDelete({ id: `${record.id}` })"
          >
            <a-button type="text" size="small">
              {{ $t('operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>

      <a-drawer
        :title="$t('menu.site.config.detail')"
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
    querySiteConfigPage,
    SiteConfigPage,
    SiteConfigPageParams,
    submitSiteConfigDelete,
    SiteConfigDeleteParams,
    SiteConfigChangeStatus,
    submitSiteConfigChangeStatus,
    SiteConfigBatchOperate,
    submitSiteConfigBatchOperate,
  } from '@/api/site_config';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { useAppStore } from '@/store';
  import Detail from '../detail/index.vue';

  const { proxy } = getCurrentInstance() as any;

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const siteDelete = async (params: SiteConfigDeleteParams) => {
    setLoading(true);
    try {
      await submitSiteConfigDelete(params);
      proxy.$message.success('删除成功');
      useAppStore().init();
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const generateFormModel = () => {
    return {
      user_id: ref(),
      domain: '',
      title: '',
      register_tips: '',
      logo: '',
      status: ref(),
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<SiteConfigPage[]>([]);
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
    {
      title: t('site.config.columns.domain'),
      dataIndex: 'domain',
      slotName: 'domain',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('site.config.columns.title'),
      dataIndex: 'title',
      slotName: 'title',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('site.config.columns.register_tips'),
      dataIndex: 'register_tips',
      slotName: 'register_tips',
      align: 'center',
      ellipsis: true,
      tooltip: true,
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
      title: t('common.updated_at'),
      dataIndex: 'updated_at',
      slotName: 'updated_at',
      align: 'center',
      width: 132,
    },
    {
      title: t('common.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 170,
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
    params: SiteConfigPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await querySiteConfigPage(params);
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
    } as unknown as SiteConfigPageParams);
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
  };

  const siteChangeStatus = async (params: SiteConfigChangeStatus) => {
    setLoading(true);
    try {
      await submitSiteConfigChangeStatus(params);
      proxy.$message.success('操作成功');
      useAppStore().init();
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
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
  const handleBatch = (params: SiteConfigBatchOperate) => {
    if (ids.value.length === 0) {
      proxy.$message.info('请选择要操作的数据');
    } else {
      let alertContent = `是否确定操作所选的${ids.value.length}条数据?`;
      switch (params.action) {
        case 'status':
          if (params.value === 1) {
            alertContent = `是否确定启用所选的${ids.value.length}条数据?`;
          } else {
            alertContent = `是否确定禁用所选的${ids.value.length}条数据?`;
          }
          break;
        case 'delete':
          alertContent = `是否确定删除所选的${ids.value.length}条数据?`;
          break;
        default:
      }

      proxy.$modal.warning({
        title: '警告',
        titleAlign: 'start',
        content: alertContent,
        hideCancel: false,
        onOk: () => {
          setLoading(true);
          params.ids = ids.value;
          submitSiteConfigBatchOperate(params).then((res) => {
            setLoading(false);
            proxy.$message.success('操作成功');
            useAppStore().init();
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
    name: 'SiteConfigList',
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
