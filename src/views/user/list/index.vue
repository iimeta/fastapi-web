<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-user />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.user') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.user.list') }}</a-breadcrumb-item>
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
                <a-form-item field="user_id" :label="$t('user.form.userId')">
                  <a-input-number
                    v-model="formModel.user_id"
                    :placeholder="$t('user.form.userId.placeholder')"
                    :min="1"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('user.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('user.form.name.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="email" :label="$t('user.form.email')">
                  <a-input
                    v-model="formModel.email"
                    :placeholder="$t('user.form.email.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="quota_expires_at"
                  :label="$t('user.form.quota_expires_at')"
                >
                  <a-range-picker
                    v-model="formModel.quota_expires_at"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('user.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('user.form.selectDefault')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="updated_at"
                  :label="$t('user.form.updated_at')"
                >
                  <a-range-picker
                    v-model="formModel.updated_at"
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
              {{ $t('user.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('user.form.reset') }}
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
              @click="$router.push({ name: 'UserCreate' })"
            >
              {{ $t('user.operation.create') }}
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
        <template #quota="{ record }">
          ${{
            record.quota !== 0
              ? parseFloat((record.quota / 500000).toFixed(6))
              : '0.00'
          }}
        </template>
        <template #used_quota="{ record }">
          ${{
            record.used_quota > 0
              ? parseFloat((record.used_quota / 500000).toFixed(6))
              : '0.00'
          }}
        </template>
        <template #quota_expires_at="{ rowIndex }">
          <a-date-picker
            v-model="renderData[rowIndex].quota_expires_at"
            :placeholder="$t('user.columns.placeholder.quota_expires_at')"
            :time-picker-props="{ defaultValue: '23:59:59' }"
            :disabled-date="(current:Date) => dayjs(current).isBefore(dayjs())"
            show-time
            :shortcuts="[
              {
                label: '1',
                value: () =>
                  dayjs(
                    new Date(
                      renderData[rowIndex].quota_expires_at || new Date()
                    )
                  ).add(1, 'day'),
              },
              {
                label: '7',
                value: () =>
                  dayjs(
                    new Date(
                      renderData[rowIndex].quota_expires_at || new Date()
                    )
                  ).add(7, 'day'),
              },
              {
                label: '15',
                value: () =>
                  dayjs(
                    new Date(
                      renderData[rowIndex].quota_expires_at || new Date()
                    )
                  ).add(15, 'day'),
              },
              {
                label: '30',
                value: () =>
                  dayjs(
                    new Date(
                      renderData[rowIndex].quota_expires_at || new Date()
                    )
                  ).add(30, 'day'),
              },
              {
                label: '90',
                value: () =>
                  dayjs(
                    new Date(
                      renderData[rowIndex].quota_expires_at || new Date()
                    )
                  ).add(90, 'day'),
              },
              {
                label: '180',
                value: () =>
                  dayjs(
                    new Date(
                      renderData[rowIndex].quota_expires_at || new Date()
                    )
                  ).add(180, 'day'),
              },
              {
                label: '365',
                value: () =>
                  dayjs(
                    new Date(
                      renderData[rowIndex].quota_expires_at || new Date()
                    )
                  ).add(365, 'day'),
              },
            ]"
            @change="
              userChangeQuotaExpire({
                id: `${renderData[rowIndex].id}`,
                quota_expires_at: `${renderData[rowIndex].quota_expires_at}`,
              })
            "
          >
            <a-button style="width: 150px">{{
              renderData[rowIndex].quota_expires_at ||
              $t('user.columns.placeholder.quota_expires_at')
            }}</a-button>
          </a-date-picker>
        </template>
        <template #status="{ record }">
          <a-switch
            v-model="record.status"
            :checked-value="1"
            :unchecked-value="2"
            @change="
              userChangeStatus({
                id: `${record.id}`,
                status: Number(`${record.status}`),
              })
            "
          />
        </template>
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            @click="
              grantQuota({
                user_id: `${record.user_id}`,
                quota_expires_at: `${record.quota_expires_at}`,
              })
            "
          >
            {{ $t('user.columns.operations.grantQuota') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              modelsPermission({
                user_id: `${record.user_id}`,
                models: `${record.models}`.split(','),
              })
            "
          >
            {{ $t('user.columns.operations.models') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'UserDetail',
                query: { id: `${record.id}` },
              })
            "
          >
            {{ $t('user.columns.operations.view') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'UserUpdate',
                query: { id: `${record.id}` },
              })
            "
          >
            {{ $t('user.columns.operations.update') }}
          </a-button>
          <a-popconfirm
            content="你确定要删除吗?"
            @ok="userDelete({ id: `${record.id}` })"
          >
            <a-button type="text" size="small">
              {{ $t('user.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-modal
        v-model:visible="grantQuotaVisible"
        :title="$t('user.form.title.grantQuota')"
        :ok-text="$t('user.button.save')"
        @cancel="handleCancel"
        @before-ok="handleBeforeOk"
      >
        <a-form ref="formRef" :model="formData">
          <a-form-item
            field="quota"
            :label="$t('user.label.quota')"
            :rules="[
              {
                required: true,
                message: $t('user.error.quota.required'),
              },
            ]"
          >
            <a-input-number
              v-model="formData.quota"
              :placeholder="$t('user.placeholder.grant_quota')"
              :precision="0"
              :min="-9999999999999"
              :max="9999999999999"
            />
          </a-form-item>
          <a-form-item
            field="quota_expires_at"
            :label="$t('user.label.quota_expires_at')"
          >
            <a-date-picker
              v-model="formData.quota_expires_at"
              :placeholder="$t('user.placeholder.quota_expires_at')"
              :time-picker-props="{ defaultValue: '23:59:59' }"
              :disabled-date="(current:Date) => dayjs(current).isBefore(dayjs())"
              style="width: 100%"
              show-time
              :shortcuts="[
                {
                  label: '1',
                  value: () =>
                    dayjs(
                      new Date(formData.quota_expires_at || new Date())
                    ).add(1, 'day'),
                },
                {
                  label: '7',
                  value: () =>
                    dayjs(
                      new Date(formData.quota_expires_at || new Date())
                    ).add(7, 'day'),
                },
                {
                  label: '15',
                  value: () =>
                    dayjs(
                      new Date(formData.quota_expires_at || new Date())
                    ).add(15, 'day'),
                },
                {
                  label: '30',
                  value: () =>
                    dayjs(
                      new Date(formData.quota_expires_at || new Date())
                    ).add(30, 'day'),
                },
                {
                  label: '90',
                  value: () =>
                    dayjs(
                      new Date(formData.quota_expires_at || new Date())
                    ).add(90, 'day'),
                },
                {
                  label: '180',
                  value: () =>
                    dayjs(
                      new Date(formData.quota_expires_at || new Date())
                    ).add(180, 'day'),
                },
                {
                  label: '365',
                  value: () =>
                    dayjs(
                      new Date(formData.quota_expires_at || new Date())
                    ).add(365, 'day'),
                },
              ]"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
        v-model:visible="modelsVisible"
        :title="$t('user.form.title.models')"
        :ok-text="$t('user.button.save')"
        :width="700"
        @cancel="modelsHandleCancel"
        @before-ok="modelsHandleBeforeOk"
      >
        <a-form ref="modelsFormRef" :model="modelsFormData">
          <a-form-item field="models" :label="$t('user.label.models')">
            <a-select
              v-model="modelsFormData.models"
              :placeholder="$t('user.placeholder.models')"
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
  import {
    queryUserPage,
    UserPage,
    UserPageParams,
    submitUserDelete,
    UserDeleteParams,
    UserGrantQuotaParams,
    submitUserGrantQuota,
    UserGrantQuota,
    UserChangeQuotaExpire,
    submitUserChangeQuotaExpire,
    UserChangeStatus,
    submitUserChangeStatus,
    UserModelsParams,
    submitUserModels,
    UserModels,
  } from '@/api/admin_user';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { Message } from '@arco-design/web-vue';
  import { queryModelList, ModelList } from '@/api/model';

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

  const userDelete = async (params: UserDeleteParams) => {
    setLoading(true);
    try {
      await submitUserDelete(params);
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
      name: '',
      email: '',
      quota_expires_at: [],
      status: ref(),
      updated_at: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<UserPage[]>([]);
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
      title: t('user.columns.userId'),
      dataIndex: 'user_id',
      slotName: 'user_id',
      align: 'center',
      width: 80,
    },
    {
      title: t('user.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('user.columns.email'),
      dataIndex: 'email',
      slotName: 'email',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('user.columns.quota'),
      dataIndex: 'quota',
      slotName: 'quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('user.columns.used_quota'),
      dataIndex: 'used_quota',
      slotName: 'used_quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('user.columns.quota_expires_at'),
      dataIndex: 'quota_expires_at',
      slotName: 'quota_expires_at',
      align: 'center',
      width: 160,
    },
    {
      title: t('user.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
    },
    // {
    //   title: t('user.columns.updated_at'),
    //   dataIndex: 'updated_at',
    //   slotName: 'updated_at',
    //   align: 'center',
    //   width: 132,
    // },
    {
      title: t('user.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 318,
    },
  ]);

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('user.dict.status.1'),
      value: 1,
    },
    {
      label: t('user.dict.status.2'),
      value: 2,
    },
  ]);

  const fetchData = async (
    params: UserPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryUserPage(params);
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
    } as unknown as UserPageParams);
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

  const userChangeQuotaExpire = async (params: UserChangeQuotaExpire) => {
    setLoading(true);
    try {
      await submitUserChangeQuotaExpire(params);
      proxy.$message.success('操作成功');
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const userChangeStatus = async (params: UserChangeStatus) => {
    setLoading(true);
    try {
      await submitUserChangeStatus(params);
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

  const grantQuotaVisible = ref(false);
  const modelsVisible = ref(false);

  const formRef = ref<FormInstance>();
  const formData = ref<UserGrantQuota>({} as UserGrantQuota);
  const modelsFormRef = ref<FormInstance>();
  const modelsFormData = ref<UserModels>({} as UserModels);

  const grantQuota = async (params: UserGrantQuotaParams) => {
    setLoading(true);
    try {
      formData.value.quota = ref();
      formData.value.user_id = params.user_id;
      formData.value.quota_expires_at = params.quota_expires_at;
      grantQuotaVisible.value = true;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const modelsPermission = async (params: UserModelsParams) => {
    setLoading(true);
    try {
      modelsFormData.value.user_id = params.user_id;
      if (
        params.models &&
        params.models.length > 0 &&
        params.models[0] !== 'undefined'
      ) {
        modelsFormData.value.models = params.models;
      } else {
        modelsFormData.value.models = [];
      }
      modelsVisible.value = true;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleBeforeOk = async (done: any) => {
    const res = await formRef.value?.validate();
    if (res) {
      grantQuotaVisible.value = true;
      done(false);
      return;
    }

    setLoading(true);
    try {
      await submitUserGrantQuota(formData.value); // The mock api default success
      Message.success(t('user.success.grantQuota'));
      done();
      fetchData();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    grantQuotaVisible.value = false;
  };

  const modelsHandleBeforeOk = async (done: any) => {
    const res = await modelsFormRef.value?.validate();
    if (res) {
      modelsVisible.value = true;
      done(false);
      return;
    }

    setLoading(true);
    try {
      await submitUserModels(modelsFormData.value); // The mock api default success
      Message.success(t('user.success.models'));
      done();
      fetchData();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const modelsHandleCancel = () => {
    modelsVisible.value = false;
  };
</script>

<script lang="ts">
  export default {
    name: 'UserList',
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
