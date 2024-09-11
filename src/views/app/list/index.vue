<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-apps />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.app') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.app.list') }}</a-breadcrumb-item>
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
              <a-col v-permission="['admin']" :span="8">
                <a-form-item field="user_id" :label="$t('app.form.userId')">
                  <a-input-number
                    v-model="formModel.user_id"
                    :placeholder="$t('app.form.userId.placeholder')"
                    :min="1"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="app_id" :label="$t('app.form.appId')">
                  <a-input-number
                    v-model="formModel.app_id"
                    :placeholder="$t('app.form.appId.placeholder')"
                    :min="1"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('app.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('app.form.name.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['user']" :span="8">
                <a-form-item field="models" :label="$t('app.form.models')">
                  <a-select
                    v-model="formModel.models"
                    :placeholder="$t('app.form.selectDefault')"
                    :max-tag-count="2"
                    multiple
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="item in models"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="key" :label="$t('app.form.key')">
                  <a-input
                    v-model="formModel.app_key"
                    :placeholder="$t('app.form.key.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('app.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('app.form.selectDefault')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="quota_expires_at"
                  :label="$t('app.form.quota_expires_at')"
                >
                  <a-range-picker
                    v-model="formModel.quota_expires_at"
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
              {{ $t('app.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('app.form.reset') }}
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
              @click="$router.push({ name: 'AppCreate' })"
            >
              {{ $t('app.operation.create') }}
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
        <template #model_names="{ record }">
          <span v-if="record.model_names">{{
            record.model_names.join(',')
          }}</span>
          <span v-else>{{ $t(`app.columns.models.no_limit`) }}</span>
        </template>
        <template #quota="{ record }">
          <span v-if="record.is_limit_quota">
            {{
              record.quota > 0
                ? `$${quotaConv(record.quota)}`
                : record.quota < 0
                ? `-$${quotaConv(-record.quota)}`
                : '$0.00'
            }}
          </span>
          <span v-else>{{ $t(`app.columns.quota.no_limit`) }}</span>
        </template>
        <template #used_quota="{ record }">
          ${{ record.used_quota > 0 ? quotaConv(record.used_quota) : '0.00' }}
        </template>
        <template #quota_expires_at="{ record }">
          {{ record.is_limit_quota ? record.quota_expires_at || '-' : '-' }}
        </template>
        <template #status="{ record }">
          <a-switch
            v-model="record.status"
            :checked-value="1"
            :unchecked-value="2"
            @change="
              appChangeStatus({
                id: `${record.id}`,
                status: Number(`${record.status}`),
              })
            "
          />
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('app.columns.operations.view') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'AppUpdate',
                query: { id: `${record.id}` },
              })
            "
          >
            {{ $t('app.columns.operations.update') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="createKey({ app_id: `${record.app_id}` })"
          >
            {{ $t('app.columns.operations.createKey') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'AppKeyList',
                query: { app_id: `${record.app_id}` },
              })
            "
          >
            {{ $t('app.columns.operations.manageKey') }}
          </a-button>
          <a-popconfirm
            content="你确定要删除吗?"
            @ok="appDelete({ id: `${record.id}` })"
          >
            <a-button type="text" size="small">
              {{ $t('app.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>

      <a-drawer
        :title="$t('menu.app.detail')"
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
        v-model:visible="visible"
        :title="$t('app.form.title.keyConfig')"
        :ok-text="$t('app.button.save')"
        @cancel="handleCancel"
        @before-ok="handleBeforeOk"
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
              :precision="0"
              :min="0"
              :max="9999999999999"
              style="margin-right: 10px"
            />
            <div>
              ${{ formData.quota ? quotaConv(formData.quota) : '0.00' }}</div
            >
          </a-form-item>
          <a-form-item v-if="formData.is_limit_quota">
            <a-radio-group
              type="button"
              @change="handleQuotaQuickChange as any"
            >
              <a-radio :value="1"> $1 </a-radio>
              <a-radio :value="5"> $5 </a-radio>
              <a-radio :value="10"> $10 </a-radio>
              <a-radio :value="20"> $20 </a-radio>
              <a-radio :value="100"> $100 </a-radio>
              <a-radio :value="500"> $500 </a-radio>
              <a-radio :value="1000"> $1000 </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="formData.is_limit_quota"
            field="quota_expires_at"
            :label="$t('app.label.quota_expires_at')"
          >
            <a-date-picker
              v-model="formData.quota_expires_at"
              :placeholder="$t('app.placeholder.quota_expires_at')"
              :time-picker-props="{ defaultValue: '23:59:59' }"
              :disabled-date="(current:Date) => dayjs(current).isBefore(dayjs())"
              style="width: 100%"
              show-time
              :shortcuts="[
                {
                  label: '1',
                  value: () => dayjs().add(1, 'day'),
                },
                {
                  label: '7',
                  value: () => dayjs().add(7, 'day'),
                },
                {
                  label: '15',
                  value: () => dayjs().add(15, 'day'),
                },
                {
                  label: '30',
                  value: () => dayjs().add(30, 'day'),
                },
                {
                  label: '90',
                  value: () => dayjs().add(90, 'day'),
                },
                {
                  label: '180',
                  value: () => dayjs().add(180, 'day'),
                },
                {
                  label: '365',
                  value: () => dayjs().add(365, 'day'),
                },
              ]"
            />
          </a-form-item>
          <a-form-item field="models" :label="$t('app.label.models')">
            <a-select
              v-model="formData.models"
              :placeholder="$t('app.placeholder.key.models')"
              :max-tag-count="3"
              multiple
              allow-search
              allow-clear
            >
              <a-option
                v-for="item in models"
                :key="item.id"
                :value="item.id"
                :label="item.name"
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
  import dayjs from 'dayjs';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { quotaConv } from '@/utils/common';
  import {
    queryAppPage,
    AppPage,
    AppPageParams,
    submitAppDelete,
    AppDeleteParams,
    submitAppCreateKey,
    AppCreateKeyParams,
    submitAppKeyConfig,
    AppKeyConfig,
    AppChangeStatus,
    submitAppChangeStatus,
  } from '@/api/app';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { queryModelList, ModelList } from '@/api/model';
  import { Message } from '@arco-design/web-vue';
  import Detail from '../detail/index.vue';

  const { proxy } = getCurrentInstance() as any;

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

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

  const appDelete = async (params: AppDeleteParams) => {
    setLoading(true);
    try {
      await submitAppDelete(params);
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
      user_id: ref(),
      app_id: ref(),
      name: '',
      models: [],
      app_key: '',
      type: ref(),
      status: ref(),
      quota_expires_at: [],
      created_at: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<AppPage[]>([]);
  const formModel = ref(generateFormModel());
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
      title: t('app.columns.userId'),
      dataIndex: 'user_id',
      slotName: 'user_id',
      align: 'center',
      width: 80,
    },
    {
      title: t('app.columns.appId'),
      dataIndex: 'app_id',
      slotName: 'app_id',
      align: 'center',
      width: 80,
    },
    {
      title: t('app.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('app.columns.models'),
      dataIndex: 'model_names',
      slotName: 'model_names',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('app.columns.quota'),
      dataIndex: 'quota',
      slotName: 'quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('app.columns.used_quota'),
      dataIndex: 'used_quota',
      slotName: 'used_quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('app.columns.quota_expires_at'),
      dataIndex: 'quota_expires_at',
      slotName: 'quota_expires_at',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('app.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 65,
    },
    // {
    //   title: t('app.columns.updated_at'),
    //   dataIndex: 'updated_at',
    //   slotName: 'updated_at',
    //   align: 'center',
    //   width: 132,
    // },
    {
      title: t('app.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 320,
    },
  ]);

  const userRole = localStorage.getItem('userRole');
  if (userRole === 'user') {
    columns.value.splice(0, 1);
  }

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('app.dict.status.1'),
      value: 1,
    },
    {
      label: t('app.dict.status.2'),
      value: 2,
    },
  ]);

  const fetchData = async (
    params: AppPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryAppPage(params);
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
    } as unknown as AppPageParams);
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

  const appChangeStatus = async (params: AppChangeStatus) => {
    setLoading(true);
    try {
      await submitAppChangeStatus(params);
      proxy.$message.success('操作成功');
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

  const visible = ref(false);

  const formRef = ref<FormInstance>();
  const formData = ref<AppKeyConfig>({} as AppKeyConfig);

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.quota = quota * 500000;
  };

  const createKey = async (params: AppCreateKeyParams) => {
    setLoading(true);
    try {
      const { data } = await submitAppCreateKey(params);
      formData.value.app_id = data.app_id;
      formData.value.key = data.key;
      visible.value = true;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleBeforeOk = async (done: any) => {
    const res = await formRef.value?.validate();
    if (res) {
      visible.value = true;
      done(false);
      return;
    }

    setLoading(true);
    try {
      await submitAppKeyConfig(formData.value);
      navigator.clipboard.writeText(formData.value.key);
      Message.success(t('app.success.key_config'));
      done();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    visible.value = false;
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
    name: 'AppList',
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
