<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-safe />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.key') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.key.app.list') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card class="general-card" :title="$t('menu.key.app.list')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="app_id" :label="$t('key.form.app')">
                  <a-select
                    v-model="formModel.app_id"
                    :placeholder="$t('key.form.selectDefault')"
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
              <a-col :span="8">
                <a-form-item field="key" :label="$t('key.form.key')">
                  <a-input
                    v-model="formModel.key"
                    :placeholder="$t('key.form.key.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="models" :label="$t('key.form.models')">
                  <a-select
                    v-model="formModel.models"
                    :placeholder="$t('key.form.selectDefault')"
                    :max-tag-count="3"
                    multiple
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="item in models"
                      :key="item.model"
                      :value="item.model"
                      :label="item.model"
                    />
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="quota" :label="$t('key.form.quota')">
                  <a-input-number
                    v-model="formModel.quota"
                    :placeholder="$t('key.form.quota.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('key.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('key.form.selectDefault')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="created_at"
                  :label="$t('key.form.created_at')"
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
              {{ $t('key.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('key.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <!-- <a-button
              type="primary"
              @click="$router.push({ name: 'KeyCreate' })"
            >
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('key.operation.create') }}
            </a-button> -->
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
      >
        <template #type="{ record }">
          {{ $t(`key.dict.type.${record.type}`) }}
        </template>
        <template #corp="{ record }">
          {{ $t(`key.dict.corp.${record.corp}`) }}
        </template>
        <template #dataFormat="{ record }">
          {{ $t(`key.dict.data_format.${record.data_format}`) }}
        </template>
        <template #status="{ record }">
          <span v-if="record.status === 3" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ $t(`key.dict.status.${record.status}`) }}
        </template>
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'KeyDetail',
                query: { id: `${record.id}` },
              })
            "
          >
            {{ $t('key.columns.operations.view') }}
          </a-button>
          <a-button type="text" size="small" @click="updateKey(record)">
            {{ $t('key.columns.operations.update') }}
          </a-button>
          <a-popconfirm
            content="你确定要删除吗?"
            @ok="keyDelete({ id: `${record.id}` })"
          >
            <a-button type="text" size="small">
              {{ $t('key.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <template #extra>
        <a-modal
          v-model:visible="visible"
          :title="$t('app.form.title.keyConfig')"
          @cancel="handleCancel"
          @before-ok="handleBeforeOk"
          :okText="$t('app.button.save')"
        >
          <a-form ref="formRef" :model="formData">
            <a-form-item field="key" :label="$t('app.label.key')">
              <a-input
                v-model="formData.key"
                :placeholder="$t('app.placeholder.key')"
                readonly
              />
            </a-form-item>
            <a-form-item
              field="is_limit_quota"
              :label="$t('app.label.isLimitQuota')"
            >
              <a-switch v-model="formData.is_limit_quota" />
            </a-form-item>
            <a-form-item
              v-if="formData.is_limit_quota"
              field="quota"
              :label="$t('app.label.quota')"
              :rules="[
                {
                  required: true,
                  message: $t('app.error.quota.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.quota"
                :placeholder="$t('app.placeholder.quota')"
                :min="1"
              />
            </a-form-item>
            <a-form-item field="models" :label="$t('app.label.models')">
              <a-select
                v-model="formData.models"
                :placeholder="$t('app.placeholder.models')"
                :max-tag-count="3"
                multiple
                allow-clear
              >
                <a-option
                  v-for="item in models"
                  :key="item.model"
                  :value="item.model"
                  :label="item.model"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              field="ip_whitelist"
              :label="$t('app.label.ip_whitelist')"
            >
              <a-textarea
                v-model="formData.ip_whitelist"
                :placeholder="$t('app.placeholder.ip_whitelist')"
                :auto-size="{ minRows: 5, maxRows: 10 }"
              />
            </a-form-item>
            <a-form-item
              field="ip_blacklist"
              :label="$t('app.label.ip_blacklist')"
            >
              <a-textarea
                v-model="formData.ip_blacklist"
                :placeholder="$t('app.placeholder.ip_blacklist')"
                :auto-size="{ minRows: 5, maxRows: 10 }"
              />
            </a-form-item>
            <a-form-item field="remark" :label="$t('app.placeholder.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('app.placeholder.remark')"
              />
            </a-form-item>
          </a-form>
        </a-modal>
      </template>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import {
    queryKeyPage,
    KeyPage,
    KeyPageParams,
    submitKeyDelete,
    KeyDeleteParams,
  } from '@/api/key';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import {
    queryAppList,
    AppList,
    submitAppKeyConfig,
    AppKeyConfig,
  } from '@/api/app';
  import { queryModelList, ModelList } from '@/api/model';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const route = useRoute();

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  });

  const apps = ref<AppList[]>([]);

  const getAppList = async () => {
    try {
      const { data } = await queryAppList();
      apps.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getAppList();

  const models = ref<ModelList[]>([]);

  const getModelList = async () => {
    try {
      const { data } = await queryModelList();
      models.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getModelList();

  const keyDelete = async (params: KeyDeleteParams) => {
    setLoading(true);
    try {
      await submitKeyDelete(params);
      fetchData();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const generateFormModel = () => {
    return {
      type: 1,
      app_id: ref(),
      key: '',
      models: [],
      quota: ref(),
      status: ref(),
      created_at: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<KeyPage[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
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
      title: t('key.columns.app_id'),
      dataIndex: 'app_id',
      slotName: 'app_id',
    },
    {
      title: t('key.columns.key'),
      dataIndex: 'key',
      slotName: 'key',
    },
    {
      title: t('key.columns.quota'),
      dataIndex: 'quota',
      slotName: 'quota',
    },
    {
      title: t('key.columns.app.models'),
      dataIndex: 'models',
      slotName: 'models',
    },
    {
      title: t('key.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('key.columns.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
    },
    {
      title: t('key.columns.updated_at'),
      dataIndex: 'updated_at',
      slotName: 'updated_at',
    },
    {
      title: t('key.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('key.dict.status.1'),
      value: 1,
    },
    {
      label: t('key.dict.status.2'),
      value: 2,
    },
  ]);
  const fetchData = async (
    params: KeyPageParams = {
      current: 1,
      pageSize: 10,
      type: 1,
      app_id: route.query.app_id,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryKeyPage(params);
      renderData.value = data.items;
      pagination.current = params.current;
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
    } as unknown as KeyPageParams);
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, ...formModel.value, current });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
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

  const visible = ref(false);

  const formRef = ref<FormInstance>();
  const formData = ref<AppKeyConfig>({} as AppKeyConfig);

  interface AppKeyConfigView {
    id: string;
    key: string;
    is_limit_quota: boolean;
    quota: number;
    models: string[];
    ip_whitelist: string[];
    ip_blacklist: string[];
    remark: string;
  }

  const updateKey = async (params: AppKeyConfigView) => {
    setLoading(true);
    try {
      formData.value.id = params.id;
      formData.value.key = params.key;
      formData.value.is_limit_quota = params.is_limit_quota;
      formData.value.quota = params.quota;
      formData.value.models = params.models;
      formData.value.ip_whitelist = params.ip_whitelist?.join('\n') || '';
      formData.value.ip_blacklist = params.ip_blacklist?.join('\n') || '';
      formData.value.remark = params.remark;
      visible.value = true;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleBeforeOk = async (done) => {
    const res = await formRef.value?.validate();
    if (res) {
      visible.value = true;
      done(false);
      return;
    }

    setLoading(true);
    try {
      await submitAppKeyConfig(formData.value); // The mock api default success
      navigator.clipboard.writeText(formData.value.key);
      done();
      fetchData();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    visible.value = false;
  };
</script>

<script lang="ts">
  export default {
    name: 'AppKeyList',
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
</style>
