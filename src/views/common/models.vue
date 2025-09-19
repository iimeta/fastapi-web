<template>
  <div class="container">
    <a-card
      class="general-card"
      :bordered="false"
      :header-style="{ padding: '20px' }"
      :body-style="{
        padding: '0px',
      }"
    >
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formData"
            :label-col-props="{ span: 5 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="provider_id"
                  :label="$t('model.form.provider')"
                  :label-col-props="{ span: 6 }"
                >
                  <a-select
                    v-model="formData.provider_id"
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
                <a-form-item
                  field="name"
                  :label="$t('model.form.name')"
                  :label-col-props="{ span: 6 }"
                >
                  <a-input
                    v-model="formData.name"
                    :placeholder="$t('model.form.name.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="model"
                  :label="$t('model.form.model')"
                  :label-col-props="{ span: 6 }"
                >
                  <a-input
                    v-model="formData.model"
                    :placeholder="$t('model.form.model.placeholder')"
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
              {{ $t('model.form.search') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="false"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        :scroll="{
          y: '380px',
        }"
        :scrollbar="false"
      >
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryModelPermissions,
    ModelPermissions,
    ModelPermissionsParams,
  } from '@/api/model';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import { queryProviderList, ProviderList } from '@/api/provider';

  const { loading, setLoading } = useLoading(true);
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      default: '',
    },
  });

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      provider_id: '',
      name: '',
      model: '',
      type: ref(),
      status: ref(),
    };
  };

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

  const { t } = useI18n();
  const renderData = ref<ModelPermissions[]>([]);
  const formData = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('model.columns.provider'),
      dataIndex: 'provider_name',
      slotName: 'provider_name',
      align: 'center',
    },
    {
      title: t('model.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('model.columns.model'),
      dataIndex: 'model',
      slotName: 'model',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
  ]);

  const fetchData = async (
    params: ModelPermissionsParams = { id: props.id, action: props.action }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelPermissions(params);
      renderData.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      id: props.id,
      action: props.action,
      ...formData.value,
    } as unknown as ModelPermissionsParams);
  };

  fetchData();

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
    name: 'Models',
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
