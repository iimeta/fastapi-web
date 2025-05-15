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
            :model="formModel"
            :label-col-props="{ span: 5 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="corp" :label="$t('model.form.corp')">
                  <a-select
                    v-model="formModel.corp"
                    :placeholder="$t('model.form.selectDefault')"
                    :scrollbar="false"
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="item in corps"
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
                    v-model="formModel.model"
                    :placeholder="$t('model.form.model.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="type" :label="$t('model.form.type')">
                  <a-select
                    v-model="formModel.type"
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
                    v-model="formModel.remark"
                    :placeholder="$t('model.form.remark.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('model.form.status')">
                  <a-select
                    v-model="formModel.status"
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
                    v-model="formModel.group"
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
        <template #type="{ record }">
          {{ $t(`dict.model_type.${record.type}`) }}
        </template>
        <template #prompt_ratio="{ record }">
          <span v-if="record.type === 2">
            <a-button
              type="text"
              size="small"
              @click="viewImageQuota(record.image_quota)"
            >
              查看
            </a-button>
          </span>
          <span v-else-if="record.type === 5">
            {{
              record.audio_quota.billing_method === 1
                ? `$${priceConv(record.audio_quota.prompt_ratio)}/k`
                : `$${quotaConv(record.audio_quota.fixed_quota)}/次`
            }}
          </span>
          <span v-else-if="record.type === 6">-</span>
          <span v-else-if="record.type === 100">
            <a-button
              type="text"
              size="small"
              @click="viewMultimodalQuota(record.multimodal_quota)"
            >
              查看
            </a-button>
          </span>
          <span v-else-if="record.type === 101">
            <a-button
              type="text"
              size="small"
              @click="viewRealtimeQuota(record.realtime_quota)"
            >
              查看
            </a-button>
          </span>
          <span v-else-if="record.type === 102">
            <a-button
              type="text"
              size="small"
              @click="viewMultimodalAudioQuota(record.multimodal_audio_quota)"
            >
              查看
            </a-button>
          </span>
          <span v-else>{{
            record.text_quota.billing_method === 1
              ? `$${priceConv(record.text_quota.prompt_ratio)}/k`
              : '-'
          }}</span>
        </template>
        <template #completion_ratio="{ record }">
          <span v-if="record.type === 2">
            <a-button
              type="text"
              size="small"
              @click="viewImageQuota(record.image_quota)"
            >
              查看
            </a-button>
          </span>
          <span v-else-if="record.type === 5">-</span>
          <span v-else-if="record.type === 6">
            {{
              record.audio_quota.billing_method === 1
                ? `$${priceConv(record.audio_quota.completion_ratio)}/min`
                : `$${quotaConv(record.audio_quota.fixed_quota)}/次`
            }}</span
          >
          <span v-else-if="record.type === 100">
            <a-button
              type="text"
              size="small"
              @click="viewMultimodalQuota(record.multimodal_quota)"
            >
              查看
            </a-button>
          </span>
          <span v-else-if="record.type === 101">
            <a-button
              type="text"
              size="small"
              @click="viewRealtimeQuota(record.realtime_quota)"
            >
              查看
            </a-button>
          </span>
          <span v-else-if="record.type === 102">
            <a-button
              type="text"
              size="small"
              @click="viewMultimodalAudioQuota(record.multimodal_audio_quota)"
            >
              查看
            </a-button>
          </span>
          <span v-else>
            {{
              record.text_quota.billing_method === 1
                ? `$${priceConv(record.text_quota.completion_ratio)}/k`
                : `$${quotaConv(record.text_quota.fixed_quota)}/次`
            }}
          </span>
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

      <a-modal
        v-model:visible="imageQuotaVisible"
        :title="$t('model.columns.image_price')"
        width="600px"
        hide-cancel
        simple
      >
        <a-table
          :data="imageGenerationQuotas"
          :pagination="false"
          :bordered="false"
          :scroll="{
            maxHeight: '380px',
          }"
          :scrollbar="false"
        >
          <template #columns>
            <a-table-column title="质量" data-index="quality" align="center" />
            <a-table-column title="宽度" data-index="width" align="center" />
            <a-table-column title="高度" data-index="height" align="center" />
            <a-table-column
              title="价格"
              data-index="fixed_quota"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${quotaConv(record.fixed_quota)}/张` }}
              </template>
            </a-table-column>
            <a-table-column title="默认" data-index="is_default" align="center">
              <template #cell="{ record }">
                {{ record.is_default ? '是' : '-' }}
              </template>
            </a-table-column>
          </template>
        </a-table>

        <!-- 图像文本、输入、输出额度 -->
        <a-table
          v-if="imageQuotaVisible"
          style="margin-top: 15px"
          :data="imageQuotas"
          :pagination="false"
          :bordered="false"
        >
          <template #columns>
            <a-table-column
              title="文本价格"
              data-index="text_ratio"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${priceConv(record.text_ratio)}/k` }}
              </template>
            </a-table-column>
            <a-table-column
              title="图像输入价格"
              data-index="input_ratio"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${priceConv(record.input_ratio)}/k` }}
              </template>
            </a-table-column>
            <a-table-column
              title="图像输出价格"
              data-index="output_ratio"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${priceConv(record.output_ratio)}/k` }}
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-modal>

      <a-modal
        v-model:visible="multimodalQuotaVisible"
        :title="$t('model.columns.multimodal_price')"
        width="550px"
        hide-cancel
        simple
      >
        <a-table
          :data="multimodalTextQuotas"
          :pagination="false"
          :bordered="false"
        >
          <template #columns>
            <a-table-column
              title="文本提问价格"
              data-index="prompt_ratio"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${priceConv(record.prompt_ratio)}/k` }}
              </template>
            </a-table-column>
            <a-table-column
              title="文本回答价格"
              data-index="completion_ratio"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${priceConv(record.completion_ratio)}/k` }}
              </template>
            </a-table-column>
          </template>
        </a-table>

        <a-table
          style="margin-top: 15px"
          :data="multimodalVisionQuotas"
          :pagination="false"
          :bordered="false"
        >
          <template #columns>
            <a-table-column
              title="识图模式"
              data-index="mode"
              align="center"
            ></a-table-column>
            <a-table-column
              title="识图价格"
              data-index="fixed_quota"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${quotaConv(record.fixed_quota)}/张` }}
              </template>
            </a-table-column>
            <a-table-column title="默认" data-index="is_default" align="center">
              <template #cell="{ record }">
                {{ record.is_default ? '是' : '-' }}
              </template>
            </a-table-column>
          </template>
        </a-table>

        <a-table
          v-if="isShowSearchQuota"
          style="margin-top: 15px"
          :data="multimodalSearchQuota"
          :pagination="false"
          :bordered="false"
        >
          <template #columns>
            <a-table-column
              title="搜索价格"
              data-index="search_quota"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${quotaConv(record.search_quota)}/次` }}
              </template>
            </a-table-column>
          </template>
        </a-table>

        <a-table
          v-if="isShowSearchQuotas"
          style="margin-top: 15px"
          :data="multimodalSearchQuotas"
          :pagination="false"
          :bordered="false"
        >
          <template #columns>
            <a-table-column
              title="搜索上下文大小"
              data-index="search_context_size"
              align="center"
            ></a-table-column>
            <a-table-column
              title="搜索价格"
              data-index="fixed_quota"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${quotaConv(record.fixed_quota)}/次` }}
              </template>
            </a-table-column>
            <a-table-column title="默认" data-index="is_default" align="center">
              <template #cell="{ record }">
                {{ record.is_default ? '是' : '-' }}
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-modal>

      <a-modal
        v-model:visible="realtimeQuotaVisible"
        :title="$t('model.columns.realtime_price')"
        width="550px"
        hide-cancel
        simple
      >
        <a-table :data="realtimeQuotas" :pagination="false" :bordered="false">
          <template #columns>
            <a-table-column
              title="文本提问价格"
              data-index="text_quota.prompt_ratio"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${priceConv(record.text_quota.prompt_ratio)}/k` }}
              </template>
            </a-table-column>
            <a-table-column
              title="文本回答价格"
              data-index="text_quota.completion_ratio"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${priceConv(record.text_quota.completion_ratio)}/k` }}
              </template>
            </a-table-column>
            <a-table-column
              title="音频提问价格"
              data-index="audio_quota.prompt_ratio"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${priceConv(record.audio_quota.prompt_ratio)}/k` }}
              </template>
            </a-table-column>
            <a-table-column
              title="音频回答价格"
              data-index="audio_quota.completion_ratio"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${priceConv(record.audio_quota.completion_ratio)}/k` }}
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-modal>

      <a-modal
        v-model:visible="multimodalAudioQuotaVisible"
        :title="$t('model.columns.multimodal_audio_price')"
        width="550px"
        hide-cancel
        simple
      >
        <a-table
          :data="multimodalAudioQuotas"
          :pagination="false"
          :bordered="false"
        >
          <template #columns>
            <a-table-column
              title="文本提问价格"
              data-index="text_quota.prompt_ratio"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${priceConv(record.text_quota.prompt_ratio)}/k` }}
              </template>
            </a-table-column>
            <a-table-column
              title="文本回答价格"
              data-index="text_quota.completion_ratio"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${priceConv(record.text_quota.completion_ratio)}/k` }}
              </template>
            </a-table-column>
            <a-table-column
              title="音频提问价格"
              data-index="audio_quota.prompt_ratio"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${priceConv(record.audio_quota.prompt_ratio)}/k` }}
              </template>
            </a-table-column>
            <a-table-column
              title="音频回答价格"
              data-index="audio_quota.completion_ratio"
              align="center"
            >
              <template #cell="{ record }">
                {{ `$${priceConv(record.audio_quota.completion_ratio)}/k` }}
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryModelPage,
    ModelPage,
    ModelPageParams,
    TextQuota,
    GenerationQuota,
    ImageQuota,
    VisionQuota,
    MultimodalQuota,
    RealtimeQuota,
    MultimodalAudioQuota,
    SearchQuota,
  } from '@/api/model';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { priceConv, quotaConv } from '@/utils/common';
  import { queryCorpList, CorpList } from '@/api/corp';
  import { queryGroupList, GroupList } from '@/api/group';

  const { loading, setLoading } = useLoading(true);

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const generateFormModel = () => {
    return {
      corp: '',
      model: '',
      type: ref(),
      group: '',
      remark: '',
      status: ref(),
    };
  };

  const corps = ref<CorpList[]>([]);
  const getCorpList = async () => {
    setLoading(true);
    try {
      const { data } = await queryCorpList();
      corps.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getCorpList();

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

  const { t } = useI18n();
  const renderData = ref<ModelPage[]>([]);
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
      title: t('model.columns.corp'),
      dataIndex: 'corp_name',
      slotName: 'corp_name',
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
      title: t('model.columns.prompt_price'),
      dataIndex: 'prompt_ratio',
      slotName: 'prompt_ratio',
      align: 'center',
      width: 120,
    },
    {
      title: t('model.columns.completion_price'),
      dataIndex: 'completion_ratio',
      slotName: 'completion_ratio',
      align: 'center',
      width: 120,
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

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as ModelPageParams);
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

  const imageQuotaVisible = ref(false);
  const imageGenerationQuotas = ref<GenerationQuota[]>([]);
  const imageQuotas = ref<ImageQuota[]>([]);
  const viewImageQuota = (params: ImageQuota) => {
    imageQuotaVisible.value = true;
    imageGenerationQuotas.value = params.generation_quotas;
    imageQuotas.value[0] = params;
  };

  const multimodalQuotaVisible = ref(false);
  const isShowSearchQuota = ref(false);
  const isShowSearchQuotas = ref(false);
  const multimodalTextQuotas = ref<TextQuota[]>([]);
  const multimodalVisionQuotas = ref<VisionQuota[]>([]);
  const multimodalSearchQuota = ref<MultimodalQuota[]>([]);
  const multimodalSearchQuotas = ref<SearchQuota[]>([]);
  const viewMultimodalQuota = (params: MultimodalQuota) => {
    multimodalQuotaVisible.value = true;
    isShowSearchQuota.value = false;
    multimodalTextQuotas.value[0] = params.text_quota;
    multimodalVisionQuotas.value = params.vision_quotas;
    if (params.search_quota > 0) {
      isShowSearchQuota.value = true;
      multimodalSearchQuota.value[0] = params;
    }
    if (params.search_quotas) {
      isShowSearchQuotas.value = true;
      multimodalSearchQuotas.value = params.search_quotas;
    }
  };

  const realtimeQuotaVisible = ref(false);
  const realtimeQuotas = ref<RealtimeQuota[]>([]);
  const viewRealtimeQuota = (params: RealtimeQuota) => {
    realtimeQuotas.value[0] = params;
    realtimeQuotaVisible.value = true;
  };

  const multimodalAudioQuotaVisible = ref(false);
  const multimodalAudioQuotas = ref<MultimodalAudioQuota[]>([]);
  const viewMultimodalAudioQuota = (params: MultimodalAudioQuota) => {
    multimodalAudioQuotas.value[0] = params;
    multimodalAudioQuotaVisible.value = true;
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
