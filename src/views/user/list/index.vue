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
      :title="$t('menu.user.list')"
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
                <a-form-item field="key" :label="$t('user.form.key')">
                  <a-input
                    v-model="formModel.key"
                    :placeholder="$t('user.form.key.placeholder')"
                    allow-clear
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
                  field="created_at"
                  :label="$t('user.form.created_at')"
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
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button
              type="primary"
              @click="$router.push({ name: 'UserCreate' })"
            >
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('user.operation.create') }}
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
        <template #status="{ record }">
          <span v-if="record.status === 2" class="circle red"></span>
          <span v-else class="circle"></span>
          {{ $t(`user.dict.status.${record.status}`) }}
        </template>
        <template #quota="{ record }">
          {{ record.quota.toLocaleString() }}
        </template>
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            @click="grantQuota({ user_id: `${record.user_id}` })"
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
          <!-- <a-button
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
          </a-button> -->
          <a-button
            type="text"
            size="small"
            @click="
              userChangeStatus({
                id: `${record.id}`,
                status: Number(`${record.status}`),
              })
            "
          >
            {{ $t(`user.columns.operations.status.${record.status}`) }}
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
      <template #extra>
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
                :precision="0"
                :placeholder="$t('user.placeholder.quota')"
              />
            </a-form-item>
          </a-form>
        </a-modal>
        <a-modal
          v-model:visible="modelsVisible"
          :title="$t('user.form.title.models')"
          :ok-text="$t('user.button.save')"
          @cancel="modelsHandleCancel"
          @before-ok="modelsHandleBeforeOk"
        >
          <a-form ref="formRef" :model="modelsFormData">
            <a-form-item field="models" :label="$t('user.label.models')">
              <a-select
                v-model="modelsFormData.models"
                :placeholder="$t('user.placeholder.models')"
                :max-tag-count="15"
                multiple
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
      </template>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
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
    UserChangeStatus,
    UserModelsParams,
    submitUserChangeStatus,
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
      key: '',
      status: ref(),
      created_at: [],
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
    },
    {
      title: t('user.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
    },
    {
      title: t('user.columns.email'),
      dataIndex: 'email',
      slotName: 'email',
      align: 'center',
    },
    {
      title: t('user.columns.quota'),
      dataIndex: 'quota',
      slotName: 'quota',
      align: 'center',
    },
    {
      title: t('user.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 80,
    },
    {
      title: t('user.columns.updated_at'),
      dataIndex: 'updated_at',
      slotName: 'updated_at',
      align: 'center',
      width: 170,
    },
    {
      title: t('user.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 320,
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

  const userChangeStatus = async (params: UserChangeStatus) => {
    setLoading(true);
    try {
      params.status = params.status === 1 ? 2 : 1;
      await submitUserChangeStatus(params);
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
  const modelsFormData = ref<UserModels>({} as UserModels);

  const grantQuota = async (params: UserGrantQuotaParams) => {
    setLoading(true);
    try {
      formData.value.user_id = params.user_id;
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
    const res = await formRef.value?.validate();
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
