<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <lucide-bot />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('model.agent.menu') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card
      class="general-card"
      :bordered="false"
      :header-style="cardHeaderStyle"
      :body-style="cardBodyStyle"
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
                <a-form-item field="provider_id" :label="$t('common.provider')">
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
                <a-form-item field="name" :label="$t('model.agent.label.name')">
                  <a-input
                    v-model="searchFormData.name"
                    :placeholder="$t('model.agent.placeholder.name')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="base_url"
                  :label="$t('model.agent.label.base_url')"
                >
                  <a-input
                    v-model="searchFormData.base_url"
                    :placeholder="$t('model.agent.error.required.base_url')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="models" :label="$t('common.bind_models')">
                  <a-select
                    v-model="searchFormData.models"
                    :placeholder="$t('common.all')"
                    :max-tag-count="2"
                    :scrollbar="false"
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
                <a-form-item field="status" :label="$t('common.status')">
                  <a-select
                    v-model="searchFormData.status"
                    :placeholder="$t('common.all')"
                    :options="statusOptions"
                    :scrollbar="false"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="remark" :label="$t('common.remark')">
                  <a-input
                    v-model="searchFormData.remark"
                    :placeholder="$t('placeholder.remark')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider class="list-search-divider" direction="vertical" />
        <a-col :flex="'86px'" class="list-search-actions">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('button.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('button.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>

      <a-divider class="list-toolbar-divider" />

      <a-row class="list-toolbar-row" :gutter="12">
        <a-col :span="16">
          <a-space wrap>
            <a-button
              type="primary"
              @click="$router.push({ name: 'ModelAgentCreate' })"
            >
              {{ $t('button.create') }}
            </a-button>
            <a-button
              type="primary"
              status="success"
              :disabled="multiple"
              :title="multiple ? $t('placeholder.operation.data') : ''"
              @click="
                handleBatch({
                  action: 'status',
                  value: 1,
                })
              "
            >
              {{ $t('button.enable') }}
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="multiple"
              :title="multiple ? $t('placeholder.operation.data') : ''"
              @click="
                handleBatch({
                  action: 'status',
                  value: 2,
                })
              "
            >
              {{ $t('button.disable') }}
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="multiple"
              :title="multiple ? $t('placeholder.operation.data') : ''"
              @click="
                handleBatch({
                  action: 'delete',
                })
              "
            >
              {{ $t('button.delete') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="8" class="list-table-actions">
          <a-tooltip :content="$t('action.refresh')">
            <div class="action-icon" @click="search">
              <icon-refresh size="18" />
            </div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('action.density')">
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
          <a-tooltip :content="$t('action.column_setting')">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="cardFieldSetting">
                  <div
                    v-for="(item, index) in showFields"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div class="list-drag-handle">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="handleFieldChange($event, item, index)"
                      />
                    </div>
                    <div class="title">{{ item.title }}</div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>

      <div class="model-agent-card-toolbar">
        <a-checkbox
          :model-value="allCurrentChecked"
          :indeterminate="indeterminate"
          @change="toggleSelectAll"
        >
          {{ $t('common.all') }}
        </a-checkbox>
      </div>

      <a-spin :loading="loading" class="model-agent-card-body">
        <a-empty
          v-if="!loading && renderData.length === 0"
          style="padding: 80px 0"
        />
        <div v-else class="list-wrap model-agent-card-wrap">
          <a-row class="list-row" :gutter="24">
            <a-col
              v-for="item in renderData"
              :key="item.id"
              :xs="12"
              :sm="12"
              :md="12"
              :lg="8"
              :xl="8"
              :xxl="6"
              class="list-col"
            >
              <CardItem
                :record="item"
                :checked="ids.includes(item.id)"
                :size="size"
                :visible-fields="visibleFields"
                @toggle-check="toggleSelection(item.id, $event)"
                @detail="detailHandle"
                @models="modelsHandle"
                @update="updateHandle"
                @keys="keysHandle"
                @test="testsHandle"
                @status-change="modelAgentChangeStatus"
              />
            </a-col>
          </a-row>
        </div>
      </a-spin>

      <div v-if="(pagination.total || 0) > 0" class="model-agent-card-pager">
        <a-pagination
          :current="pagination.current"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          show-total
          show-page-size
          :page-size-options="basePagination.pageSizeOptions"
          @change="onPageChange"
          @page-size-change="onPageSizeChange"
        />
      </div>

      <a-drawer
        :title="$t('model.agent.menu.detail')"
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
        v-model:visible="modelsVisible"
        :title="$t('common.bind_models')"
        :modal-style="modelsModalStyle"
        unmount-on-close
        hide-cancel
        simple
        width="1080px"
        :ok-text="$t('button.close')"
      >
        <Models :id="recordId" :action="action" />
      </a-modal>

      <a-modal
        v-model:visible="testsVisible"
        :title="$t('model.agent.title.test_models')"
        :modal-style="modelsModalStyle"
        unmount-on-close
        hide-cancel
        simple
        width="1288px"
        :ok-text="$t('button.close')"
        :footer="false"
        hide-title
      >
        <Tests :id="recordId" :action="action" />
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, reactive, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { Message, Modal } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import {
    queryModelAgentPage,
    ModelAgentPage,
    ModelAgentPageParams,
    ModelAgentChangeStatus,
    submitModelAgentChangeStatus,
    ModelAgentBatchOperate,
    submitModelAgentBatchOperate,
  } from '@/api/model_agent';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { queryProviderList, ProviderList } from '@/api/provider';
  import { queryModelList, ModelList } from '@/api/model';
  import Models from '@/views/common/models.vue';
  import Detail from '../detail/index.vue';
  import Tests from '../components/tests.vue';
  import CardItem from '../components/card-item.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type SearchParams = {
    provider_id: string;
    name: string;
    base_url: string;
    models: string[];
    status: number | undefined;
    remark: string;
  };
  type FieldItem = {
    title: string;
    dataIndex: string;
    checked?: boolean;
  };
  type ModelAgentCardRecord = ModelAgentPage & {
    group_names?: string[];
    updated_at?: string;
    lb_strategy?: number;
  };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const router = useRouter();

  const cardHeaderStyle = { padding: '20px' };
  const cardBodyStyle = { padding: '25px 20px 20px 20px' };
  const modelsModalStyle = { padding: '25px 15px 20px 15px' };

  const generateSearchParams = (): SearchParams => ({
    provider_id: '',
    name: '',
    base_url: '',
    models: [],
    status: undefined,
    remark: '',
  });

  const renderData = ref<ModelAgentCardRecord[]>([]);
  const searchFormData = ref(generateSearchParams());
  const size = ref<SizeProps>('medium');
  const ids = ref<string[]>([]);
  const recordId = ref('');
  const action = ref('');
  const detailVisible = ref(false);
  const modelsVisible = ref(false);
  const testsVisible = ref(false);

  const basePagination: Pagination = {
    current: 1,
    pageSize: 60,
    showTotal: true,
    showPageSize: true,
    pageSizeOptions: [20, 60, 100, 500, 1000],
  };

  const pagination = reactive({
    ...basePagination,
  });

  const fieldOptions = computed<FieldItem[]>(() => [
    { title: t('common.bind_group'), dataIndex: 'group_names' },
    { title: t('common.bind_models'), dataIndex: 'models' },
    { title: t('common.weight'), dataIndex: 'weight' },
    { title: t('common.lb_strategy'), dataIndex: 'lb_strategy' },
  ]);

  const cloneFields = ref<FieldItem[]>([]);
  const showFields = ref<FieldItem[]>([]);
  let fieldSortable: Sortable | null = null;

  watch(
    () => fieldOptions.value,
    (val) => {
      cloneFields.value = cloneDeep(val);
      cloneFields.value.forEach((item) => {
        item.checked = true;
      });
      showFields.value = cloneDeep(cloneFields.value);
    },
    { deep: true, immediate: true }
  );

  const visibleFields = computed(() =>
    cloneFields.value.filter((item) => item.checked)
  );

  const densityList = computed(() => [
    { name: t('size.mini'), value: 'mini' },
    { name: t('size.small'), value: 'small' },
    { name: t('size.medium'), value: 'medium' },
    { name: t('size.large'), value: 'large' },
  ]);

  const statusOptions = computed<SelectOptionData[]>(() => [
    { label: t('dict.status.1'), value: 1 },
    { label: t('dict.status.2'), value: 2 },
  ]);

  const providers = ref<ProviderList[]>([]);
  const models = ref<ModelList[]>([]);

  const multiple = computed(() => ids.value.length === 0);
  const currentPageIds = computed(() =>
    renderData.value.map((item) => item.id)
  );
  const allCurrentChecked = computed(
    () =>
      currentPageIds.value.length > 0 &&
      currentPageIds.value.every((id) => ids.value.includes(id))
  );
  const indeterminate = computed(
    () =>
      ids.value.length > 0 &&
      currentPageIds.value.some((id) => ids.value.includes(id)) &&
      !allCurrentChecked.value
  );
  const clearSelection = () => {
    ids.value = [];
  };

  const fetchData = async (
    params: ModelAgentPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelAgentPage(params);
      renderData.value = data.items as ModelAgentCardRecord[];
      pagination.current = params.current;
      pagination.pageSize = params.pageSize;
      pagination.total = data.paging.total;
      clearSelection();
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };
  fetchData();

  const search = () => {
    fetchData({
      ...basePagination,
      ...searchFormData.value,
    } as ModelAgentPageParams);
  };

  const reset = () => {
    searchFormData.value = generateSearchParams();
    search();
  };

  const onPageChange = (current: number) => {
    fetchData({
      ...basePagination,
      ...searchFormData.value,
      current,
    } as ModelAgentPageParams);
  };

  const onPageSizeChange = (pageSize: number) => {
    basePagination.pageSize = pageSize;
    fetchData({
      ...basePagination,
      ...searchFormData.value,
    } as ModelAgentPageParams);
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined
  ) => {
    size.value = val as SizeProps;
  };

  const handleFieldChange = (
    checked: boolean | (string | boolean | number)[],
    field: FieldItem,
    index: number
  ) => {
    if (!checked) {
      cloneFields.value = showFields.value.filter(
        (item) => item.dataIndex !== field.dataIndex
      );
    } else {
      cloneFields.value.splice(index, 0, field);
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
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (visible: boolean) => {
    if (visible) {
      nextTick(() => {
        const el = document.getElementById('cardFieldSetting') as HTMLElement;
        if (!el) return;
        fieldSortable?.destroy();
        fieldSortable = new Sortable(el, {
          onEnd(e: Sortable.SortableEvent) {
            const { oldIndex, newIndex } = e;
            if (oldIndex === undefined || newIndex === undefined) return;
            exchangeArray(cloneFields.value, oldIndex, newIndex);
            exchangeArray(showFields.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  const toggleSelection = (id: string, checked: boolean) => {
    if (checked) {
      if (!ids.value.includes(id)) {
        ids.value = [...ids.value, id];
      }
      return;
    }
    ids.value = ids.value.filter((item) => item !== id);
  };

  const toggleSelectAll = (
    checked: boolean | (string | boolean | number)[]
  ) => {
    if (checked) {
      ids.value = [...currentPageIds.value];
      return;
    }
    clearSelection();
  };

  const getProviderList = async () => {
    try {
      const { data } = await queryProviderList();
      providers.value = data.items;
    } catch (err) {
      // ignore
    }
  };
  getProviderList();

  const getModelList = async () => {
    try {
      const { data } = await queryModelList();
      models.value = data.items;
    } catch (err) {
      // ignore
    }
  };
  getModelList();

  const modelAgentChangeStatus = async (params: ModelAgentChangeStatus) => {
    setLoading(true);
    try {
      await submitModelAgentChangeStatus(params);
      Message.success(t('success.operate'));
      search();
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleBatch = (params: ModelAgentBatchOperate) => {
    if (ids.value.length === 0) {
      Message.info(t('placeholder.operation.data'));
      return;
    }

    let alertContent = t('placeholder.batch.operation', {
      count: ids.value.length,
    });

    switch (params.action) {
      case 'status':
        alertContent =
          params.value === 1
            ? t('placeholder.batch.operation.enable', {
                count: ids.value.length,
              })
            : t('placeholder.batch.operation.disable', {
                count: ids.value.length,
              });
        break;
      case 'delete':
        alertContent = t('placeholder.batch.operation.delete', {
          count: ids.value.length,
        });
        break;
      default:
    }

    Modal.warning({
      title: t('modal.warning.title'),
      titleAlign: 'center',
      content: alertContent,
      okText: t('button.ok'),
      cancelText: t('button.cancel'),
      hideCancel: false,
      onOk: () => {
        setLoading(true);
        submitModelAgentBatchOperate({
          ...params,
          ids: ids.value,
        }).then(() => {
          setLoading(false);
          Message.success(t('success.operate'));
          search();
        });
      },
    });
  };

  const detailHandle = (id: string) => {
    detailVisible.value = true;
    recordId.value = id;
  };

  const detailHandleCancel = () => {
    detailVisible.value = false;
  };

  const modelsHandle = (id: string) => {
    modelsVisible.value = true;
    recordId.value = id;
    action.value = 'agent';
  };

  const testsHandle = (id: string) => {
    testsVisible.value = true;
    recordId.value = id;
    action.value = 'agent';
  };

  const updateHandle = (id: string) => {
    router.push({
      name: 'ModelAgentUpdate',
      query: { id },
    });
  };

  const keysHandle = (id: string) => {
    router.push({
      name: 'ModelKeyList',
      query: { agent_id: id },
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'ModelAgentCardList',
  };
</script>

<style scoped lang="less">
  .model-agent-card-toolbar {
    display: flex;
    align-items: center;
    padding-bottom: 16px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .model-agent-card-body {
    width: 100%;
  }

  .model-agent-card-wrap {
    .list-row {
      align-items: stretch;
    }

    .list-col {
      margin-bottom: 16px;
    }
  }

  .model-agent-card-pager {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
  }
</style>
