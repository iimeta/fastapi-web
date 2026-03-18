<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-user-group />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('group.menu.my') }}</a-breadcrumb-item>
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
                <a-form-item field="name" :label="$t('group.label.name')">
                  <a-input
                    v-model="searchFormData.name"
                    :placeholder="$t('group.placeholder.name')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="models" :label="$t('common.models')">
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
                <a-form-item field="remark" :label="$t('group.label.remark')">
                  <a-input
                    v-model="searchFormData.remark"
                    :placeholder="$t('group.placeholder.remark')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider class="group-my-list-search-divider" direction="vertical" />
        <a-col :flex="'86px'" class="group-my-list-search-actions">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('button.search') }}
            </a-button>
            <!-- <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('button.reset') }}
            </a-button> -->
          </a-space>
        </a-col>
      </a-row>
      <a-divider class="group-my-list-toolbar-divider" />
      <a-row class="group-my-list-toolbar-row">
        <a-col :span="22"> {{ $t('group.desc') }} </a-col>
        <a-col :span="2" class="group-my-list-table-actions">
          <a-tooltip :content="$t('action.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
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
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div class="group-my-list-drag-handle">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="handleChange($event, item, index)"
                      >
                      </a-checkbox>
                    </div>
                    <div class="title"> {{ item.title }} </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        ref="tableRef"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="cloneColumns"
        :data="renderData"
        :bordered="false"
        :size="size"
        :row-selection="rowSelection"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #name="{ record }">
          <span v-if="record.is_default" :title="$t('group.detail.is_default')">
            <b>{{ record.name }}</b>
          </span>
          <span v-else>
            {{ record.name }}
          </span>
        </template>
        <template #time_rules="{ record }">
          <span v-if="record.time_rules && record.time_rules.length === 1">
            {{ record.time_rules[0].discount }}%
          </span>
          <span v-else-if="record.time_rules && record.time_rules.length > 1">
            {{ getDiscountRange(record.time_rules) }}
            <a-button
              type="text"
              size="small"
              @click="viewTimeRules(record.time_rules)"
            >
              {{ $t('button.view') }}
            </a-button>
          </span>
          <span v-else>-</span>
        </template>
        <template #model_names="{ record }">
          <span v-if="record.model_names">
            <a-button type="text" size="small" @click="modelsHandle(record.id)">
              {{ $t('button.view') }}
            </a-button>
          </span>
          <span v-else>{{ '-' }}</span>
        </template>
        <template #expires_at="{ record }">
          {{ record.expires_at || '-' }}
        </template>
        <template #remark="{ record }">
          {{ record.remark || '-' }}
        </template>
        <template #status="{ record }">
          <span v-if="record.status === 2" class="circle red"></span>
          <span v-else class="circle"></span>
          {{ $t(`dict.status.${record.status}`) }}
        </template>
      </a-table>

      <!-- 模型权限 -->
      <a-modal
        v-model:visible="modelsVisible"
        :title="$t('common.models')"
        :modal-style="modelsModalStyle"
        unmount-on-close
        hide-cancel
        simple
        width="1080px"
        :ok-text="$t('button.close')"
      >
        <Models :id="recordId" :action="action" />
      </a-modal>

      <!-- 时段规则 -->
      <a-modal
        v-model:visible="timeRulesVisible"
        :title="$t('common.discount')"
        hide-title
        hide-cancel
        simple
        width="888px"
        :ok-text="$t('button.close')"
      >
        <a-table
          :columns="timeRulesColumns"
          :data="timeRulesData"
          :pagination="false"
          :bordered="false"
        >
          <template #discount="{ record }"> {{ record.discount }}% </template>
          <template #time_range="{ record }">
            {{ formatMs(record.start_time) }}~{{ formatMs(record.end_time) }}
          </template>
          <template #days="{ record }">
            {{ formatDays(record) }}
          </template>
          <template #priority_title>
            {{ $t('time_rule.label.priority') }}
            <a-tooltip :content="$t('time_rule.placeholder.priority')">
              <icon-question-circle class="priority-tooltip" />
            </a-tooltip>
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
  import { queryGroupPage, GroupPage, GroupPageParams } from '@/api/group';
  import { Pagination } from '@/types/global';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import Models from '@/views/common/models.vue';
  import { queryModelList, ModelList } from '@/api/model';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const cardHeaderStyle = {
    padding: '20px',
  };
  const cardBodyStyle = {
    padding: '25px 20px 20px 20px',
  };
  const modelsModalStyle = {
    padding: '25px 15px 20px 15px',
  };

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const generateSearchParams = () => {
    return {
      name: '',
      models: [],
      model_agents: [],
      status: ref(),
      remark: '',
      expires_at: [],
    };
  };

  const renderData = ref<GroupPage[]>([]);
  const searchFormData = ref(generateSearchParams());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');
  const tableRef = ref();

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
      title: t('group.label.name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
      width: 168,
    },
    {
      title: t('common.discount'),
      dataIndex: 'time_rules',
      slotName: 'time_rules',
      align: 'center',
      width: 128,
    },
    {
      title: t('common.models'),
      dataIndex: 'model_names',
      slotName: 'model_names',
      align: 'center',
      width: 128,
    },
    {
      title: t('common.expires_at'),
      dataIndex: 'expires_at',
      slotName: 'expires_at',
      align: 'center',
      width: 178,
    },
    {
      title: t('group.label.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
      align: 'center',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 75,
    },
  ]);

  const fetchData = async (
    params: GroupPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryGroupPage(params);
      renderData.value = data.items;
      pagination.current = params.current;
      pagination.pageSize = params.pageSize;
      pagination.total = data.paging.total;
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
      ...basePagination,
      ...searchFormData.value,
    } as unknown as GroupPageParams);
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

  const modelsVisible = ref(false);
  const recordId = ref();
  const action = ref();

  const modelsHandle = (id: string) => {
    modelsVisible.value = true;
    recordId.value = id;
    action.value = 'group';
  };

  const timeRulesVisible = ref(false);
  const timeRulesData = ref<any[]>([]);

  const tableHeaderCellStyle = { background: 'var(--color-bg-2)' };

  const timeRulesColumns = computed<TableColumnData[]>(() => [
    {
      title: t('time_rule.label.rule'),
      headerCellStyle: tableHeaderCellStyle,
      children: [
        {
          title: t('time_rule.label.name'),
          dataIndex: 'name',
          align: 'center',
          width: 150,
        },
        {
          title: t('common.discount'),
          slotName: 'discount',
          align: 'center',
          width: 150,
        },
        {
          title: t('time_rule.label.time_range'),
          slotName: 'time_range',
          align: 'center',
          width: 150,
        },
        {
          title: t('time_rule.label.days'),
          slotName: 'days',
          align: 'center',
          width: 150,
        },
        {
          title: t('time_rule.label.priority'),
          dataIndex: 'priority',
          titleSlotName: 'priority_title',
          align: 'center',
          width: 150,
        },
      ],
    },
  ]);

  const getDiscountRange = (rules: any[]) => {
    const discounts = rules.map((r: any) => r.discount);
    const min = Math.min(...discounts);
    const max = Math.max(...discounts);
    return `${min}%~${max}%`;
  };

  const viewTimeRules = (rules: any[]) => {
    timeRulesData.value = rules;
    timeRulesVisible.value = true;
  };

  const formatMs = (ms: number) => {
    if (ms === undefined || ms === null) return '';
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}`;
  };

  const formatDays = (rule: any) => {
    if (!rule.days || rule.days.length === 0) return t('common.all');
    if (rule.day_mode === 'month') {
      return rule.days
        .map((d: number) => d + t('time_rule.label.day_suffix'))
        .join('、');
    }
    return rule.days
      .map((d: number) => t(`time_rule.dict.week.${d}`))
      .join('、');
  };
</script>

<script lang="ts">
  export default {
    name: 'MyGroup',
  };
</script>

<style scoped lang="less">
  // 公共骨架已由 page-list.less 全局提供

  .group-my-list-search-divider {
    height: 32px;
  }

  .group-my-list-search-actions {
    text-align: right;
  }

  .group-my-list-toolbar-divider {
    margin-top: 0;
  }

  .group-my-list-toolbar-row {
    margin-bottom: 16px;
  }

  .group-my-list-table-actions {
    display: flex;
    align-items: center;
    justify-content: end;
  }

  .group-my-list-drag-handle {
    margin-right: 4px;
    cursor: move;
  }

  .copy-btn {
    color: gray;
    cursor: pointer;
  }

  .copy-btn:hover {
    color: rgb(var(--arcoblue-6));
  }

  .time-rule-tag {
    margin: 2px;
  }

  .priority-tooltip {
    cursor: pointer;
    color: var(--color-text-3);
  }
</style>
