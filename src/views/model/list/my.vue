<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-common />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.my.model') }}</a-breadcrumb-item>
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
            :model="searchFormData"
            :label-col-props="{ span: 5 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="provider_id"
                  :label="$t('model.form.provider')"
                >
                  <a-select
                    v-model="searchFormData.provider_id"
                    :placeholder="$t('model.form.selectDefault')"
                    :scrollbar="false"
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="item in providers"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="model" :label="$t('model.form.model')">
                  <a-input
                    v-model="searchFormData.model"
                    :placeholder="$t('model.form.model.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="type" :label="$t('model.form.type')">
                  <a-select
                    v-model="searchFormData.type"
                    :placeholder="$t('model.form.selectDefault')"
                    :options="typeOptions"
                    :scrollbar="false"
                    allow-search
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="remark" :label="$t('model.form.remark')">
                  <a-input
                    v-model="searchFormData.remark"
                    :placeholder="$t('model.form.remark.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('model.form.status')">
                  <a-select
                    v-model="searchFormData.status"
                    :placeholder="$t('model.form.selectDefault')"
                    :options="statusOptions"
                    :scrollbar="false"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="group" :label="$t('model.form.my.group')">
                  <a-select
                    v-model="searchFormData.group"
                    :placeholder="$t('model.form.selectDefault')"
                    :scrollbar="false"
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="item in groups"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </a-select>
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
        <a-col
          :span="24"
          style="display: flex; align-items: center; justify-content: end"
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
        <template #type="{ record }">
          {{ $t(`dict.model_type.${record.type}`) }}
        </template>
        <template #pricing="{ record }">
          <a-button
            type="text"
            size="small"
            @click="viewPricing(record.pricing, record.type)"
          >
            查看
          </a-button>
        </template>
        <template #billing_methods="{ record }">
          {{
            $t(
              `model.dict.billing_methods.${
                record.pricing.billing_methods || 1
              }`
            )
          }}
        </template>
        <template #group_names="{ record }">
          {{ record?.group_names?.join(',') || '-' }}
        </template>
        <template #remark="{ record }">
          {{ record.remark || '-' }}
        </template>
        <template #status="{ record }">
          <span v-if="record.status === 2" class="circle red"></span>
          <span v-else class="circle"></span>
          {{ $t(`model.dict.status.${record.status}`) }}
        </template>
      </a-table>

      <!-- 定价 -->
      <a-modal
        v-model:visible="pricingVisible"
        :width="888"
        :body-style="{ maxHeight: '520px' }"
        :modal-style="{
          padding: '25px 20px 20px 20px',
        }"
        hide-title
        hide-cancel
        simple
        ok-text="关闭"
      >
        <PricingDetail v-model="pricing" :model-type="modelType" />
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Pricing } from '@/api/common';
  import { queryModelPage, ModelPage, ModelPageParams } from '@/api/model';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { queryProviderList, ProviderList } from '@/api/provider';
  import { queryGroupList, GroupList } from '@/api/group';
  import PricingDetail from '../components/pricing_detail.vue';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const generateSearchParams = () => {
    return {
      provider_id: '',
      model: '',
      type: ref(),
      group: '',
      remark: '',
      status: ref(),
    };
  };

  const renderData = ref<ModelPage[]>([]);
  const searchFormData = ref(generateSearchParams());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');

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
      title: t('model.columns.provider'),
      dataIndex: 'provider_name',
      slotName: 'provider_name',
      align: 'center',
      width: 120,
    },
    {
      title: t('model.columns.model'),
      dataIndex: 'model',
      slotName: 'model',
      align: 'center',
      width: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('model.columns.type'),
      dataIndex: 'type',
      slotName: 'type',
      align: 'center',
      width: 120,
    },
    {
      title: t('model.columns.pricing'),
      dataIndex: 'pricing',
      slotName: 'pricing',
      align: 'center',
      width: 80,
    },
    {
      title: t('model.columns.billing_methods'),
      dataIndex: 'billing_methods',
      slotName: 'billing_methods',
      align: 'center',
      width: 130,
    },
    {
      title: t('model.columns.my.group_names'),
      dataIndex: 'group_names',
      slotName: 'group_names',
      align: 'center',
      width: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('model.columns.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
      align: 'center',
    },
    {
      title: t('model.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 75,
    },
  ]);

  const typeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('dict.model_type.1'),
      value: 1,
    },
    {
      label: t('dict.model_type.2'),
      value: 2,
    },
    {
      label: t('dict.model_type.3'),
      value: 3,
    },
    {
      label: t('dict.model_type.4'),
      value: 4,
    },
    {
      label: t('dict.model_type.5'),
      value: 5,
    },
    {
      label: t('dict.model_type.6'),
      value: 6,
    },
    {
      label: t('dict.model_type.7'),
      value: 7,
    },
    {
      label: t('dict.model_type.8'),
      value: 8,
    },
    {
      label: t('dict.model_type.100'),
      value: 100,
    },
    {
      label: t('dict.model_type.101'),
      value: 101,
    },
    {
      label: t('dict.model_type.102'),
      value: 102,
    },
    {
      label: t('dict.model_type.103'),
      value: 103,
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
  fetchData();

  const search = () => {
    fetchData({
      ...basePagination,
      ...searchFormData.value,
    } as unknown as ModelPageParams);
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

  const providers = ref<ProviderList[]>([]);
  const getProviderList = async () => {
    setLoading(true);
    try {
      const { data } = await queryProviderList();
      providers.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getProviderList();

  const groups = ref<GroupList[]>([]);
  const getGroupList = async () => {
    try {
      const { data } = await queryGroupList();
      groups.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getGroupList();

  const pricingVisible = ref(false);
  const pricing = ref<Pricing>({ billing_items: [] } as unknown as Pricing);
  const modelType = ref(0);
  const viewPricing = (p: Pricing, t: number) => {
    pricingVisible.value = true;
    pricing.value = p;
    modelType.value = t;
  };
</script>

<script lang="ts">
  export default {
    name: 'MyModel',
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
  :deep(.arco-table-td) {
    &:last-child {
      .arco-table-td-content {
        margin: 3px 0;
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
