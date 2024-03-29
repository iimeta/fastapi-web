<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-common />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model.list') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card
      class="general-card"
      :title="$t('menu.model.list')"
      :bordered="false"
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
                <a-form-item field="corp" :label="$t('model.form.corp')">
                  <a-select
                    v-model="formModel.corp"
                    :options="corpOptions"
                    :placeholder="$t('model.form.selectDefault')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('model.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('model.form.name.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="model" :label="$t('model.form.model')">
                  <a-input
                    v-model="formModel.model"
                    :placeholder="$t('model.form.model.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="type" :label="$t('model.form.type')">
                  <a-select
                    v-model="formModel.type"
                    :options="typeOptions"
                    :placeholder="$t('model.form.selectDefault')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('model.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('model.form.selectDefault')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="created_at"
                  :label="$t('model.form.created_at')"
                >
                  <a-range-picker
                    v-model="formModel.created_at"
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
              {{ $t('model.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('model.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button
              type="primary"
              @click="$router.push({ name: 'ModelCreate' })"
            >
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('model.operation.create') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
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
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
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
      >
        <template #type="{ record }">
          {{ $t(`model.dict.type.${record.type}`) }}
        </template>
        <template #corp="{ record }">
          {{ $t(`model.dict.corp.${record.corp}`) }}
        </template>
        <template #dataFormat="{ record }">
          {{ $t(`model.dict.data_format.${record.data_format}`) }}
        </template>
        <template #status="{ record }">
          <span v-if="record.status === 2" class="circle red"></span>
          <span v-else class="circle"></span>
          {{ $t(`model.dict.status.${record.status}`) }}
        </template>
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'ModelDetail',
                query: { id: `${record.id}` },
              })
            "
          >
            {{ $t('model.columns.operations.view') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'ModelUpdate',
                query: { id: `${record.id}` },
              })
            "
          >
            {{ $t('model.columns.operations.update') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              modelChangeStatus({
                id: `${record.id}`,
                status: Number(`${record.status}`),
              })
            "
          >
            {{ $t(`model.columns.operations.status.${record.status}`) }}
          </a-button>
          <a-popconfirm
            content="你确定要删除吗?"
            @ok="modelDelete({ id: `${record.id}` })"
          >
            <a-button type="text" size="small">
              {{ $t('model.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryModelPage,
    ModelPage,
    ModelPageParams,
    submitModelDelete,
    ModelDeleteParams,
    ModelChangeStatus,
    submitModelChangeStatus,
  } from '@/api/model';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const modelDelete = async (params: ModelDeleteParams) => {
    setLoading(true);
    try {
      await submitModelDelete(params);
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const generateFormModel = () => {
    return {
      corp: '',
      name: '',
      model: '',
      type: ref(),
      status: ref(),
      created_at: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<ModelPage[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
    showTotal: true,
    showPageSize: true,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('model.columns.corp'),
      dataIndex: 'corp',
      slotName: 'corp',
      align: 'center',
      width: 100,
    },
    {
      title: t('model.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
    },
    {
      title: t('model.columns.model'),
      dataIndex: 'model',
      slotName: 'model',
      align: 'center',
    },
    {
      title: t('model.columns.type'),
      dataIndex: 'type',
      slotName: 'type',
      align: 'center',
    },
    {
      title: t('model.columns.data_format'),
      dataIndex: 'data_format',
      slotName: 'dataFormat',
      align: 'center',
    },
    {
      title: t('model.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 80,
    },
    {
      title: t('model.columns.updated_at'),
      dataIndex: 'updated_at',
      slotName: 'updated_at',
      align: 'center',
      width: 170,
    },
    {
      title: t('model.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 220,
    },
  ]);
  const corpOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('model.dict.corp.OpenAI'),
      value: 'OpenAI',
    },
    // {
    //   label: t('model.dict.corp.Baidu'),
    //   value: 'Baidu',
    // },
    // {
    //   label: t('model.dict.corp.Xfyun'),
    //   value: 'Xfyun',
    // },
    // {
    //   label: t('model.dict.corp.Aliyun'),
    //   value: 'Aliyun',
    // },
  ]);
  const typeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('model.dict.type.1'),
      value: 1,
    },
    {
      label: t('model.dict.type.2'),
      value: 2,
    },
    {
      label: t('model.dict.type.3'),
      value: 3,
    },
    {
      label: t('model.dict.type.4'),
      value: 4,
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('model.dict.status.1'),
      value: 1,
    },
    {
      label: t('model.dict.status.2'),
      value: 2,
    },
  ]);
  const fetchData = async (
    params: ModelPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelPage(params);
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
    } as unknown as ModelPageParams);
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

  const modelChangeStatus = async (params: ModelChangeStatus) => {
    setLoading(true);
    try {
      params.status = params.status === 1 ? 2 : 1;
      await submitModelChangeStatus(params);
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
</script>

<script lang="ts">
  export default {
    name: 'ModelList',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
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
    margin: 16px 0;
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
