<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-message />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.image') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.image.list') }}</a-breadcrumb-item>
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
            <a-row v-permission="['reseller', 'user']" :gutter="16">
              <a-col v-permission="['user']" :span="8">
                <a-form-item field="app_id" :label="$t('chat.form.app_id')">
                  <a-select
                    v-model="searchFormData.app_id"
                    :placeholder="$t('chat.form.selectDefault')"
                    :scrollbar="false"
                    allow-search
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
              <a-col v-permission="['reseller']" :span="8">
                <a-form-item
                  field="trace_id"
                  :label="$t('chat.form.user.trace_id')"
                >
                  <a-input
                    v-model="searchFormData.trace_id"
                    :placeholder="$t('chat.form.trace_id.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['reseller']" :span="8">
                <a-form-item
                  field="user_id"
                  :label="$t('chat.form.reseller.user_id')"
                >
                  <a-input-number
                    v-model="searchFormData.user_id"
                    :placeholder="$t('chat.form.user_id.placeholder')"
                    :precision="0"
                    :min="1"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['user']" :span="8">
                <a-form-item field="key" :label="$t('chat.form.key')">
                  <a-input
                    v-model="searchFormData.key"
                    :placeholder="$t('chat.form.key.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['user']" :span="8">
                <a-form-item
                  field="trace_id"
                  :label="$t('chat.form.user.trace_id')"
                >
                  <a-input
                    v-model="searchFormData.trace_id"
                    :placeholder="$t('chat.form.trace_id.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['reseller']" :span="8">
                <a-form-item
                  field="total_time"
                  :label="$t('chat.form.total_time')"
                >
                  <a-input-number
                    v-model="searchFormData.total_time"
                    :placeholder="$t('chat.form.total_time.placeholder')"
                    :precision="0"
                    :min="1"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="models" :label="$t('chat.form.models')">
                  <a-select
                    v-model="searchFormData.models"
                    :placeholder="$t('chat.form.selectDefault')"
                    :max-tag-count="1"
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
                <a-form-item field="status" :label="$t('chat.form.status')">
                  <a-select
                    v-model="searchFormData.status"
                    :placeholder="$t('chat.form.selectDefault')"
                    :options="statusOptions"
                    :scrollbar="false"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="req_time" :label="$t('chat.form.req_time')">
                  <a-range-picker
                    v-model="searchFormData.req_time"
                    :placeholder="['开始时间', '结束时间']"
                    :time-picker-props="{
                      defaultValue: ['00:00:00', '23:59:59'],
                    }"
                    show-time
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-permission="['admin']" :gutter="16">
              <a-col :span="5">
                <a-form-item
                  field="trace_id"
                  :label="$t('chat.form.trace_id')"
                  :label-col-props="{ span: 6 }"
                >
                  <a-input
                    v-model="searchFormData.trace_id"
                    :placeholder="$t('chat.form.trace_id.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  field="models"
                  :label="$t('chat.form.models')"
                  :label-col-props="{ span: 5 }"
                >
                  <a-select
                    v-model="searchFormData.models"
                    :placeholder="$t('chat.form.selectDefault')"
                    :max-tag-count="1"
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
              <a-col :span="5">
                <a-form-item
                  field="key"
                  :label="$t('chat.form.key')"
                  :label-col-props="{ span: 6 }"
                >
                  <a-input
                    v-model="searchFormData.key"
                    :placeholder="$t('chat.form.key.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="total_time"
                  :label="$t('chat.form.total_time')"
                >
                  <a-input-number
                    v-model="searchFormData.total_time"
                    :placeholder="$t('chat.form.total_time.placeholder')"
                    :precision="0"
                    :min="1"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item
                  field="user_id"
                  :label="$t('chat.form.user_id')"
                  :label-col-props="{ span: 6 }"
                >
                  <a-input-number
                    v-model="searchFormData.user_id"
                    :placeholder="$t('chat.form.user_id.placeholder')"
                    :precision="0"
                    :min="1"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  field="model_agents"
                  :label="$t('key.form.modelAgents')"
                  :label-col-props="{ span: 5 }"
                >
                  <a-select
                    v-model="searchFormData.model_agents"
                    :placeholder="$t('key.form.selectDefault')"
                    :max-tag-count="1"
                    :scrollbar="false"
                    multiple
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="item in modelAgents"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item
                  field="status"
                  :label="$t('chat.form.status')"
                  :label-col-props="{ span: 6 }"
                >
                  <a-select
                    v-model="searchFormData.status"
                    :placeholder="$t('chat.form.selectDefault')"
                    :options="statusOptions"
                    :scrollbar="false"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="req_time" :label="$t('chat.form.req_time')">
                  <a-range-picker
                    v-model="searchFormData.req_time"
                    :placeholder="['开始时间', '结束时间']"
                    :time-picker-props="{
                      defaultValue: ['00:00:00', '23:59:59'],
                    }"
                    show-time
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
              {{ $t('chat.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('chat.form.reset') }}
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
        <template #user_id="{ record }">
          {{ record.is_smart_match ? '-' : record.user_id }}
        </template>
        <template #images="{ record }">
          <a-button type="text" size="small" @click="viewImage(record.id)"
            >查看</a-button
          >
          <a-image-preview-group
            v-if="imageVisibleId === record.id"
            v-model:visible="imageVisible"
            :src-list="record.images"
          />
        </template>
        <template #total_spend_tokens="{ record }">
          <span
            class="spend"
            @click="
              record.status === 1 || record.status === 2
                ? spendHandle(record.spend, record.model_type)
                : undefined
            "
          >
            {{
              record.spend.total_spend_tokens
                ? `$${quotaConv(record.spend.total_spend_tokens)}`
                : record.status === 1 || record.status === 2
                ? '$0.00'
                : '-'
            }}
          </span>
        </template>
        <template #total_time="{ record }">
          <a-tag
            v-if="record.total_time > 180000"
            v-permission="['reseller', 'user']"
            color="red"
          >
            {{ record.total_time }}
          </a-tag>
          <a-tag
            v-else-if="record.total_time > 120000"
            v-permission="['reseller', 'user']"
            color="orange"
          >
            {{ record.total_time }}
          </a-tag>
          <a-tag
            v-else-if="record.total_time > 90000"
            v-permission="['reseller', 'user']"
            color="gold"
          >
            {{ record.total_time }}
          </a-tag>
          <a-tag v-else v-permission="['reseller', 'user']" color="green">{{
            record.total_time || '-'
          }}</a-tag>
          <a-tag
            v-if="record.total_time > 120000"
            v-permission="['admin']"
            color="red"
          >
            {{ record.total_time }}
          </a-tag>
          <a-tag
            v-else-if="record.total_time > 90000"
            v-permission="['admin']"
            color="orange"
          >
            {{ record.total_time }}
          </a-tag>
          <a-tag
            v-else-if="record.total_time > 60000"
            v-permission="['admin']"
            color="gold"
          >
            {{ record.total_time }}
          </a-tag>
          <a-tag v-else v-permission="['admin']" color="green">{{
            record.total_time || '-'
          }}</a-tag>
        </template>
        <template #internal_time="{ record }">
          <a-tag
            v-if="record.internal_time > 1000"
            v-permission="['reseller', 'user']"
            color="red"
          >
            {{ record.internal_time }}
          </a-tag>
          <a-tag
            v-else-if="record.internal_time > 500"
            v-permission="['reseller', 'user']"
            color="orange"
          >
            {{ record.internal_time }}
          </a-tag>
          <a-tag
            v-else-if="record.internal_time > 300"
            v-permission="['reseller', 'user']"
            color="gold"
          >
            {{ record.internal_time }}
          </a-tag>
          <a-tag v-else v-permission="['reseller', 'user']" color="green">{{
            record.internal_time || '-'
          }}</a-tag>
          <a-tag
            v-if="record.internal_time > 500"
            v-permission="['admin']"
            color="red"
          >
            {{ record.internal_time }}
          </a-tag>
          <a-tag
            v-else-if="record.internal_time > 300"
            v-permission="['admin']"
            color="orange"
          >
            {{ record.internal_time }}
          </a-tag>
          <a-tag
            v-else-if="record.internal_time > 100"
            v-permission="['admin']"
            color="gold"
          >
            {{ record.internal_time }}
          </a-tag>
          <a-tag v-else v-permission="['admin']" color="green">{{
            record.internal_time || '-'
          }}</a-tag>
        </template>
        <template #status="{ record }">
          <a-tag v-if="record.status === -1" color="red">{{
            $t(`chat.dict.status.${record.status}`)
          }}</a-tag>
          <a-tag v-else-if="record.status === 2" color="gold">{{
            $t(`chat.dict.status.${record.status}`)
          }}</a-tag>
          <a-tag v-else-if="record.status === 3" color="orange">{{
            $t(`chat.dict.status.${record.status}`)
          }}</a-tag>
          <a-tag v-else color="green">{{
            $t(`chat.dict.status.${record.status}`)
          }}</a-tag>
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('chat.columns.operations.view') }}
          </a-button>
        </template>
      </a-table>

      <a-drawer
        :title="$t('menu.image.detail')"
        :width="700"
        :footer="false"
        :visible="detailVisible"
        unmount-on-close
        render-to-body
        @cancel="detailHandleCancel"
      >
        <Detail :id="recordId" />
      </a-drawer>

      <!-- 花费明细 -->
      <a-modal
        v-model:visible="spendVisible"
        :width="888"
        :body-style="{ maxHeight: '520px' }"
        :modal-style="{
          padding: '25px 20px 20px 20px',
        }"
        hide-title
        hide-cancel
        unmount-on-close
        simple
        ok-text="关闭"
      >
        <SpendDetail v-model="spend" :model-type="modelType" />
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import dayjs from 'dayjs';
  import { quotaConv } from '@/utils/common';
  import { queryImagePage, ImagePage, ImagePageParams } from '@/api/log';
  import { queryAppList, AppList } from '@/api/app';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { queryModelList, ModelList } from '@/api/model';
  import { queryModelAgentList, ModelAgentList } from '@/api/agent';
  import { Spend } from '@/api/common';
  import Detail from '../detail/image.vue';
  import SpendDetail from '../components/spend.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const userRole = localStorage.getItem('userRole');

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const generateSearchParams = () => {
    return {
      app_id: ref(),
      trace_id: ref(),
      user_id: ref(),
      key: '',
      models: [],
      model_agents: [],
      total_time: ref(),
      status: ref(),
      req_time: [
        dayjs().format('YYYY-MM-DD 00:00:00'),
        dayjs().format('YYYY-MM-DD 23:59:59'),
      ],
    };
  };

  const renderData = ref<ImagePage[]>([]);
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
      title:
        userRole === 'reseller' || userRole === 'admin'
          ? t('chat.columns.user_id')
          : t('chat.columns.app_id'),
      dataIndex:
        userRole === 'reseller' || userRole === 'admin' ? 'user_id' : 'app_id',
      slotName:
        userRole === 'reseller' || userRole === 'admin' ? 'user_id' : 'app_id',
      align: 'center',
      width: 75,
    },
    {
      title: t('chat.columns.model'),
      dataIndex: 'model',
      slotName: 'model',
      align: 'center',
    },
    {
      title: t('chat.columns.prompt'),
      dataIndex: 'prompt',
      slotName: 'prompt',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('chat.columns.images'),
      dataIndex: 'images',
      slotName: 'images',
      align: 'center',
    },
    {
      title: t('chat.columns.total_spend_tokens'),
      dataIndex: 'total_spend_tokens',
      slotName: 'total_spend_tokens',
      align: 'center',
    },
    {
      title: t('chat.columns.total_time'),
      dataIndex: 'total_time',
      slotName: 'total_time',
      align: 'center',
    },
    {
      title: t('chat.columns.internal_time'),
      dataIndex: 'internal_time',
      slotName: 'internal_time',
      align: 'center',
    },
    {
      title: t('chat.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 65,
    },
    {
      title: t('chat.columns.req_time'),
      dataIndex: 'req_time',
      slotName: 'req_time',
      align: 'center',
      width: 132,
    },
    {
      title: t('chat.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 75,
    },
  ]);

  if (userRole === 'reseller' || userRole === 'user') {
    columns.value.splice(6, 1);
  }

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('chat.dict.status.1'),
      value: 1,
    },
    {
      label: t('chat.dict.status.2'),
      value: 2,
    },
    {
      label: t('chat.dict.status.-1'),
      value: -1,
    },
  ]);

  if (userRole === 'admin') {
    statusOptions.value.push(
      {
        label: t('chat.dict.status.3'),
        value: 3,
      },
      {
        label: t('chat.dict.status.-100'),
        value: -100,
      }
    );
  }

  const fetchData = async (
    params: ImagePageParams = {
      ...basePagination,
      ...searchFormData.value,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryImagePage(params);
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
    } as unknown as ImagePageParams);
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

  const apps = ref<AppList[]>([]);

  const getAppList = async () => {
    try {
      const { data } = await queryAppList();
      apps.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };

  if (userRole === 'user') {
    getAppList();
  }

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

  const modelAgents = ref<ModelAgentList[]>([]);

  const getModelAgentList = async () => {
    try {
      const { data } = await queryModelAgentList();
      modelAgents.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };

  if (userRole === 'admin') {
    getModelAgentList();
  }

  const imageVisibleId = ref();
  const imageVisible = ref(false);
  const viewImage = (id: any) => {
    imageVisibleId.value = id;
    imageVisible.value = true;
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

  const spendVisible = ref(false);
  const spend = ref();
  const modelType = ref();

  const spendHandle = async (s: Spend, t: number) => {
    spendVisible.value = true;
    spend.value = s;
    modelType.value = t;
  };
</script>

<script lang="ts">
  export default {
    name: 'ImageList',
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
  :deep(.arco-tabs-content) {
    padding-top: 5px;
    padding-left: 15px;
  }
  .spend {
    color: rgb(var(--gray-10));
    padding: 0;
  }
  .spend:hover {
    color: rgb(var(--link-6));
    cursor: pointer;
  }
</style>
