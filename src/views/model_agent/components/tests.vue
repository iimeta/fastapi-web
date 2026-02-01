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
            :model="searchFormData"
            :label-col-props="{ span: 5 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="provider_id"
                  :label="$t('common.provider')"
                  :label-col-props="{ span: 6 }"
                >
                  <a-select
                    v-model="searchFormData.provider_id"
                    :placeholder="$t('common.all')"
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
                  :label="$t('common.model_name')"
                  :label-col-props="{ span: 6 }"
                >
                  <a-input
                    v-model="searchFormData.name"
                    :placeholder="$t('model.form.placeholder.name')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="model"
                  :label="$t('common.model')"
                  :label-col-props="{ span: 6 }"
                >
                  <a-input
                    v-model="searchFormData.model"
                    :placeholder="$t('model.form.placeholder.model')"
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
      <a-divider style="margin-top: 0" />
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="false"
        :columns="cloneColumns"
        :data="renderData"
        :bordered="false"
        :size="size"
        :scroll="{
          y: '380px',
        }"
        :scrollbar="false"
      >
        <template #result_total_time="{ record }">
          <a-spin v-if="record.testing" />
          <span v-else>
            <span v-if="record.result">
              <a-tag v-if="record.result === 1" color="green">
                {{ $t(`log.dict.status.${record.result}`) }}
              </a-tag>
              <a-tag v-else color="red">
                {{ $t(`log.dict.status.${record.result}`) }}
              </a-tag>
            </span>
            <span v-else> - </span>
            /
            <span v-if="record.total_time">
              <a-tag v-if="record.total_time > 120000" color="red">
                {{ record.total_time }} ms
              </a-tag>
              <a-tag v-else-if="record.total_time > 90000" color="orange">
                {{ record.total_time }} ms
              </a-tag>
              <a-tag v-else-if="record.total_time > 60000" color="gold">
                {{ record.total_time }} ms
              </a-tag>
              <a-tag v-else color="green"
                >{{ record.total_time || '-' }} ms</a-tag
              >
            </span>
            <span v-else> - </span>
          </span>
        </template>
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            :disabled="record.testing"
            @click="testsHandle(record)"
          >
            {{ $t('button.test') }}
          </a-button>
          <a-link
            :href="getDetailUrl(record.trace_id)"
            :disabled="!record.trace_id || record.trace_id === ''"
            target="_blank"
          >
            {{ $t('button.detail') }}
          </a-link>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { useRouter } from 'vue-router';
  import {
    queryModelPermissions,
    ModelPermissions,
    ModelPermissionsParams,
  } from '@/api/model';
  import { testModel } from '@/api/model_agent';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import { queryProviderList, ProviderList } from '@/api/provider';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const router = useRouter();

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

  const generateSearchParams = () => {
    return {
      provider_id: '',
      name: '',
      model: '',
      type: ref(),
      status: ref(),
    };
  };

  const renderData = ref<ModelPermissions[]>([]);
  const searchFormData = ref(generateSearchParams());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');

  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('common.provider'),
      dataIndex: 'provider_name',
      slotName: 'provider_name',
      align: 'center',
    },
    {
      title: t('common.model_name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.model'),
      dataIndex: 'model',
      slotName: 'model',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('model.agent.columns.result_total_time'),
      dataIndex: 'result_total_time',
      slotName: 'result_total_time',
      align: 'center',
    },
    {
      title: t('common.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 120,
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
  fetchData();

  const search = () => {
    fetchData({
      id: props.id,
      action: props.action,
      ...searchFormData.value,
    } as unknown as ModelPermissionsParams);
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

  const testsHandle = async (record: ModelPermissions) => {
    record.testing = true;
    record.trace_id = '';
    const { data } = await testModel({
      model_agent_id: props.id,
      model_id: record.id,
    });
    record.trace_id = data.trace_id;
    record.result = data.result;
    record.total_time = data.total_time;
    record.testing = false;
  };

  const getDetailUrl = (id: string) => {
    const route = router.resolve({
      name: 'LogTextList',
      query: { trace_id: id },
    });
    return route.href;
  };
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
</style>
