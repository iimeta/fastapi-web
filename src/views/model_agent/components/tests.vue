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
              <a-col :span="6">
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
              <a-col :span="6">
                <a-form-item
                  field="name"
                  :label="$t('model.agent.label.model_name')"
                  :label-col-props="{ span: 4 }"
                  :wrapper-col-props="{ span: 20 }"
                >
                  <a-input
                    v-model="searchFormData.name"
                    :placeholder="$t('model.form.placeholder.name')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  field="model"
                  :label="$t('common.model')"
                  :label-col-props="{ span: 4 }"
                  :wrapper-col-props="{ span: 20 }"
                >
                  <a-input
                    v-model="searchFormData.model"
                    :placeholder="$t('model.form.placeholder.model')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  field="type"
                  :label="$t('common.type')"
                  :label-col-props="{ span: 4 }"
                  :wrapper-col-props="{ span: 20 }"
                >
                  <a-select
                    v-model="searchFormData.type"
                    :placeholder="$t('common.all')"
                    :options="typeOptions"
                    :scrollbar="false"
                    allow-search
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
      <a-form
        ref="testModelFormRef"
        :model="testModelParams"
        :label-col-props="{ span: 4 }"
        :wrapper-col-props="{ span: 18 }"
        label-align="left"
      >
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item
              field="test_method"
              :label="$t('model.agent.label.test_models.test_method')"
              :label-col-props="{ span: 5 }"
              :wrapper-col-props="{ span: 18 }"
            >
              <a-radio-group v-model="testModelParams.test_method">
                <a-radio :value="1">
                  {{ $t('model.agent.dict.test_method.1') }}
                </a-radio>
                <a-radio :value="2">
                  {{ $t('model.agent.dict.test_method.2') }}
                </a-radio>
                <a-radio :value="3">
                  {{ $t('model.agent.dict.test_method.3') }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col v-if="testModelParams.test_method === 3" :span="7">
            <a-form-item
              field="base_url"
              :label="$t('model.agent.label.test_models.base_url')"
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.agent.error.required.test_models.base_url'
                  ),
                },
              ]"
              :label-col-props="{ span: 8 }"
              :wrapper-col-props="{ span: 16 }"
            >
              <a-input
                v-model="testModelParams.base_url"
                :placeholder="
                  $t('model.agent.placeholder.test_models.base_url')
                "
              />
            </a-form-item>
          </a-col>
          <a-col
            v-if="testModelParams.test_method !== 2"
            :span="testModelParams.test_method === 1 ? 14 : 7"
          >
            <a-form-item
              field="key"
              :label="$t('model.agent.label.test_models.key')"
              :rules="[
                {
                  required: true,
                  message: $t('model.agent.placeholder.test_models.key'),
                },
              ]"
              :label-col-props="{
                span: testModelParams.test_method !== 3 ? 3 : 7,
              }"
              :wrapper-col-props="{
                span: testModelParams.test_method !== 3 ? 21 : 17,
              }"
            >
              <a-input
                v-model="testModelParams.key"
                :placeholder="$t('model.agent.placeholder.test_models.key')"
              />
            </a-form-item>
          </a-col>
          <a-col
            :span="testModelParams.test_method !== 2 ? 2 : 16"
            style="text-align: right"
          >
            <a-button
              type="primary"
              :disabled="allMultiple"
              @click="handleBatch"
            >
              {{ $t('button.batch.test') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        ref="tableRef"
        row-key="id"
        :loading="loading"
        :pagination="false"
        :columns="cloneColumns"
        :data="renderData"
        :bordered="false"
        :size="size"
        :scroll="{
          y: '480px',
        }"
        :scrollbar="false"
        :row-selection="rowSelection"
        @selection-change="handleSelectionChange"
      >
        <template #result_total_time="{ record }">
          <a-spin v-if="record.testing" />
          <span v-else :title="record.error" @click="handleCopy(record.error)">
            <span v-if="record.result != undefined">
              <a-tag v-if="record.result" color="green">
                {{ $t(`dict.success.${record.result}`) }}
              </a-tag>
              <a-tag v-else color="red">
                {{ $t(`dict.success.${record.result}`) }}
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
            @click="testHandle(record)"
          >
            {{ $t('button.test') }}
          </a-button>
          <a-link
            v-if="testModelParams.test_method !== 2"
            :href="getDetailUrl(record)"
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
  import { computed, ref, watch, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { useRouter } from 'vue-router';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import {
    queryModelPermissions,
    ModelPermissions,
    ModelPermissionsParams,
  } from '@/api/model';
  import { testModel, TestModelParams } from '@/api/model_agent';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import { useClipboard } from '@vueuse/core';
  import { queryProviderList, ProviderList } from '@/api/provider';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const router = useRouter();

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

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
  const ids = ref<Array<string>>([]);
  const multiple = ref(true);
  const allMultiple = ref(true);
  const tableRef = ref();
  const testModelFormRef = ref<FormInstance>();
  const testModelParams = ref<TestModelParams>({
    model_agent_id: props.id,
    test_method: 1,
  } as TestModelParams);

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
    {
      label: t('dict.model_type.10000'),
      value: 10000,
    },
  ]);

  const fetchData = async (
    params: ModelPermissionsParams = { id: props.id, action: props.action }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelPermissions(params);
      renderData.value = data.items;
      if (data.items.length > 0) {
        allMultiple.value = false;
      } else {
        allMultiple.value = true;
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
      tableRef.value.selectAll(false);
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

  const testHandle = async (record: ModelPermissions) => {
    const res = await testModelFormRef.value?.validate();
    if (!res) {
      record.testing = true;
      record.trace_id = '';
      testModelParams.value.model_id = record.id;
      const startTime = Date.now();
      try {
        const { data } = await testModel(testModelParams.value);
        record.trace_id = data.trace_id;
        record.result = data.result;
        record.total_time = data.total_time;
        record.error = data.error;
        if (data.error) {
          Message.error({
            content: data.error,
            duration: 5 * 1000,
          });
        }
      } catch (err) {
        record.result = false;
        record.total_time = Date.now() - startTime;
        record.error = err;
      } finally {
        record.testing = false;
      }
    }
  };

  const getDetailUrl = (record: ModelPermissions) => {
    const routeMap = new Map<number, string>([
      [2, 'LogImageList'],
      [5, 'LogAudioList'],
      [6, 'LogAudioList'],
      [8, 'LogVideoList'],
      [10000, 'LogGeneralList'],
    ]);

    const route = router.resolve({
      name: routeMap.get(record.type) || 'LogTextList',
      query: { trace_id: record.trace_id },
    });
    return route.href;
  };

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
  const handleBatch = () => {
    if (ids.value.length > 0) {
      for (let i = 0; i < ids.value.length; i += 1) {
        for (let j = 0; j < renderData.value.length; j += 1) {
          if (ids.value[i] === renderData.value[j].id) {
            testHandle(renderData.value[j]);
          }
        }
      }
    } else {
      for (let i = 0; i < renderData.value.length; i += 1) {
        testHandle(renderData.value[i]);
      }
    }
  };

  /**
   * 复制内容
   *
   * @param content 内容
   */
  const { copy, copied } = useClipboard();
  const handleCopy = async (content: string) => {
    copy(content);
  };

  watch(copied, () => {
    if (copied.value) {
      Message.success(t('success.copy'));
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'Tests',
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
</style>
