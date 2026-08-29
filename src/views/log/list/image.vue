<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <lucide-file-text />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('log.menu') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('log.menu.image') }}</a-breadcrumb-item>
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
            <a-row v-permission="['user', 'reseller']" :gutter="16">
              <a-col v-permission="['user']" :span="8">
                <a-form-item field="app_id" :label="$t('log.form.app_id')">
                  <a-select
                    v-model="searchFormData.app_id"
                    :placeholder="$t('common.all')"
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
                <a-form-item field="trace_id" :label="$t('common.trace_id')">
                  <a-input
                    v-model="searchFormData.trace_id"
                    :placeholder="$t('placeholder.trace_id')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['reseller']" :span="8">
                <a-form-item field="user_id" :label="$t('common.user_id')">
                  <a-input-number
                    v-model="searchFormData.user_id"
                    :placeholder="$t('placeholder.user_id')"
                    :precision="0"
                    :min="1"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['user']" :span="8">
                <a-form-item field="key" :label="$t('common.key')">
                  <a-input
                    v-model="searchFormData.key"
                    :placeholder="$t('placeholder.key')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['user']" :span="8">
                <a-form-item field="trace_id" :label="$t('common.trace_id')">
                  <a-input
                    v-model="searchFormData.trace_id"
                    :placeholder="$t('placeholder.trace_id')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['reseller']" :span="8">
                <a-form-item field="actions" :label="$t('log.form.action')">
                  <a-select
                    v-model="searchFormData.actions"
                    :placeholder="$t('common.all')"
                    :options="actionOptions"
                    :max-tag-count="1"
                    :scrollbar="false"
                    multiple
                    allow-search
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="models" :label="$t('common.model')">
                  <a-select
                    v-model="searchFormData.models"
                    :placeholder="$t('common.all')"
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
                <a-form-item field="status" :label="$t('log.form.status')">
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
                <a-form-item field="req_time" :label="$t('common.req_time')">
                  <a-range-picker
                    v-model="searchFormData.req_time"
                    :placeholder="[
                      $t('common.start_time'),
                      $t('common.end_time'),
                    ]"
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
                  :label="$t('log.form.trace_id')"
                  :label-col-props="{ span: 6 }"
                >
                  <a-input
                    v-model="searchFormData.trace_id"
                    :placeholder="$t('placeholder.trace_id')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  field="models"
                  :label="$t('common.model')"
                  :label-col-props="{ span: 5 }"
                >
                  <a-select
                    v-model="searchFormData.models"
                    :placeholder="$t('common.all')"
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
                  :label="$t('common.key')"
                  :label-col-props="{ span: 6 }"
                >
                  <a-input
                    v-model="searchFormData.key"
                    :placeholder="$t('placeholder.key')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="actions" :label="$t('log.form.action')">
                  <a-select
                    v-model="searchFormData.actions"
                    :placeholder="$t('common.all')"
                    :options="actionOptions"
                    :max-tag-count="1"
                    :scrollbar="false"
                    multiple
                    allow-search
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item
                  field="user_id"
                  :label="$t('log.form.user_id')"
                  :label-col-props="{ span: 6 }"
                >
                  <a-input-number
                    v-model="searchFormData.user_id"
                    :placeholder="$t('placeholder.user_id')"
                    :precision="0"
                    :min="1"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  field="model_agents"
                  :label="$t('log.form.model_agents')"
                  :label-col-props="{ span: 5 }"
                >
                  <a-select
                    v-model="searchFormData.model_agents"
                    :placeholder="$t('common.all')"
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
                  :label="$t('log.form.status')"
                  :label-col-props="{ span: 6 }"
                >
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
                <a-form-item field="req_time" :label="$t('common.req_time')">
                  <a-range-picker
                    v-model="searchFormData.req_time"
                    :placeholder="[
                      $t('common.start_time'),
                      $t('common.end_time'),
                    ]"
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
        <a-divider class="log-list-search-divider" direction="vertical" />
        <a-col :flex="'86px'" class="log-list-search-actions">
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
      <a-divider class="log-list-toolbar-divider" />
      <a-row class="log-list-toolbar-row">
        <a-col :span="16">
          <a-space>
            <a-button
              v-permission="['admin']"
              type="primary"
              status="danger"
              @click="handleBatch({ action: 'delete' })"
            >
              {{ $t('button.delete') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="3"> RPM: &nbsp;{{ rpm.toLocaleString() }} </a-col>
        <a-col :span="3"> TPM: &nbsp;{{ tpm.toLocaleString() }} </a-col>
        <a-col :span="2" class="log-list-table-actions">
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
                    <div class="log-list-drag-handle">
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
        @selection-change="handleSelectionChange"
      >
        <template #user_id="{ record }">
          {{ record.is_smart_match ? '-' : record.user_id }}
        </template>
        <template #action="{ record }">
          {{ record.action || '-' }}
        </template>
        <template #prompt="{ record }">
          {{ record.prompt || '-' }}
        </template>
        <template #size="{ record }">
          {{ record.size || '-' }}
        </template>
        <template #images="{ record }">
          <a-button
            type="text"
            size="small"
            :disabled="!record.images"
            @click="viewImage(record.id)"
          >
            {{ $t('button.view') }}
          </a-button>
          <a-image-preview-group
            v-if="imageVisibleId === record.id"
            v-model:visible="imageVisible"
            :src-list="record.images"
          />
        </template>
        <template #total_spend_tokens="{ record }">
          <div class="spend-cell">
            <span
              class="spend"
              @click="
                record.status === 1 || record.status === 2
                  ? spendHandle(
                      record.spend,
                      record.model_type,
                      record.provider_code,
                      record.provider_name
                    )
                  : undefined
              "
            >
              <Quota
                v-if="record.status === 1 || record.status === 2"
                :model-value="record.spend.total_spend_tokens"
                :currency-symbol="record.spend?.currency_symbol"
              />
              <span v-else> - </span>
            </span>
            <div
              v-if="
                userRole === 'admin' &&
                (record.status === 1 || record.status === 2) &&
                record.spend?.billing_items?.includes('image_generation') &&
                otherSpendTokens(record.spend)
              "
              class="other-spend"
            >
              <Quota
                :model-value="otherSpendTokens(record.spend)"
                :currency-symbol="record.spend?.currency_symbol"
              />
            </div>
          </div>
        </template>
        <template #stream="{ record }">
          {{ $t(`dict.${record.stream || false}`) }}
        </template>
        <template #conn_time="{ record }">
          <a-tag
            v-if="record.conn_time > 30000"
            v-permission="['user', 'reseller']"
            color="red"
          >
            {{ record.conn_time }}
          </a-tag>
          <a-tag
            v-else-if="record.conn_time > 15000"
            v-permission="['user', 'reseller']"
            color="orange"
          >
            {{ record.conn_time }}
          </a-tag>
          <a-tag
            v-else-if="record.conn_time > 5000"
            v-permission="['user', 'reseller']"
            color="gold"
          >
            {{ record.conn_time }}
          </a-tag>
          <a-tag v-else v-permission="['user', 'reseller']" color="green">
            {{ record.conn_time || '-' }}
          </a-tag>
          <a-tag
            v-if="record.conn_time > 10000"
            v-permission="['admin']"
            color="red"
          >
            {{ record.conn_time }}
          </a-tag>
          <a-tag
            v-else-if="record.conn_time > 5000"
            v-permission="['admin']"
            color="orange"
          >
            {{ record.conn_time }}
          </a-tag>
          <a-tag
            v-else-if="record.conn_time > 3000"
            v-permission="['admin']"
            color="gold"
          >
            {{ record.conn_time }}
          </a-tag>
          <a-tag v-else v-permission="['admin']" color="green">
            {{ record.conn_time || '-' }}
          </a-tag>
        </template>
        <template #duration="{ record }">
          <a-tag
            v-if="record.duration > 180000"
            v-permission="['user', 'reseller']"
            color="red"
          >
            {{ record.duration }}
          </a-tag>
          <a-tag
            v-else-if="record.duration > 120000"
            v-permission="['user', 'reseller']"
            color="orange"
          >
            {{ record.duration }}
          </a-tag>
          <a-tag
            v-else-if="record.duration > 90000"
            v-permission="['user', 'reseller']"
            color="gold"
          >
            {{ record.duration }}
          </a-tag>
          <a-tag v-else v-permission="['user', 'reseller']" color="green">
            {{ record.duration || '-' }}
          </a-tag>
          <a-tag
            v-if="record.duration > 120000"
            v-permission="['admin']"
            color="red"
          >
            {{ record.duration }}
          </a-tag>
          <a-tag
            v-else-if="record.duration > 90000"
            v-permission="['admin']"
            color="orange"
          >
            {{ record.duration }}
          </a-tag>
          <a-tag
            v-else-if="record.duration > 60000"
            v-permission="['admin']"
            color="gold"
          >
            {{ record.duration }}
          </a-tag>
          <a-tag v-else v-permission="['admin']" color="green">
            {{ record.duration || '-' }}
          </a-tag>
        </template>
        <template #total_time="{ record }">
          <div
            v-if="userRole === 'admin'"
            class="time-cell"
            :style="tokensCellStyle"
          >
            <div class="time-cell-content">
              <span :style="{ color: getTotalTimeColor(record.total_time) }">
                {{ $t('log.columns.total_time') }}:
                {{ record.total_time || '-' }}
              </span>
              <span
                class="time-cell-total"
                :style="{ color: getInternalTimeColor(record.internal_time) }"
              >
                {{ $t('log.columns.internal_time') }}:
                {{ record.internal_time || '-' }}
              </span>
            </div>
          </div>
          <template v-else>
            <a-tag
              v-if="record.total_time > 500000"
              v-permission="['user', 'reseller']"
              color="red"
            >
              {{ record.total_time }}
            </a-tag>
            <a-tag
              v-else-if="record.total_time > 300000"
              v-permission="['user', 'reseller']"
              color="orange"
            >
              {{ record.total_time }}
            </a-tag>
            <a-tag
              v-else-if="record.total_time > 180000"
              v-permission="['user', 'reseller']"
              color="gold"
            >
              {{ record.total_time }}
            </a-tag>
            <a-tag v-else v-permission="['user', 'reseller']" color="green">{{
              record.total_time || '-'
            }}</a-tag>
          </template>
        </template>
        <template #status="{ record }">
          <StatusTag :status="record.status" :err-msg="record.err_msg" />
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('button.detail') }}
          </a-button>
        </template>
      </a-table>

      <a-drawer
        :title="$t('log.menu.image.detail')"
        :width="700"
        :footer="false"
        :visible="detailVisible"
        unmount-on-close
        render-to-body
        @cancel="detailHandleCancel"
      >
        <Detail :id="recordId" />
      </a-drawer>

      <!-- 删除绘图日志 -->
      <a-modal
        v-model:visible="delFormVisible"
        :title="$t('log.form.title.image_del')"
        @cancel="delHandleCancel"
        @before-ok="delHandleBeforeOk"
      >
        <a-form ref="delForm" :model="delFormData">
          <a-form-item
            field="value"
            :label="$t('common.req_time')"
            :rules="[
              { required: true, message: $t('log.error.required.req_time') },
            ]"
          >
            <a-range-picker
              v-model="delFormData.value"
              :placeholder="[$t('common.start_time'), $t('common.end_time')]"
              :time-picker-props="{ defaultValue: ['00:00:00', '23:59:59'] }"
              show-time
            />
          </a-form-item>
          <a-form-item
            field="status"
            :label="$t('log.form.req.status')"
            :rules="[
              { required: true, message: $t('log.error.required.req.status') },
            ]"
          >
            <a-space size="large">
              <a-checkbox v-model="delFormData.status" :value="1">{{
                $t('log.dict.status.1')
              }}</a-checkbox>
              <a-checkbox v-model="delFormData.status" :value="2">{{
                $t('log.dict.status.2')
              }}</a-checkbox>
              <a-checkbox v-model="delFormData.status" :value="3">{{
                $t('log.dict.status.3')
              }}</a-checkbox>
              <a-checkbox v-model="delFormData.status" :value="-1">{{
                $t('log.dict.status.-1')
              }}</a-checkbox>
            </a-space>
          </a-form-item>
          <a-form-item field="user_id" :label="$t('common.user_id')">
            <a-input-number
              v-model="delFormData.user_id"
              :placeholder="$t('placeholder.user_id')"
              :precision="0"
              :min="1"
              allow-clear
            />
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 花费明细 -->
      <a-modal
        v-model:visible="spendVisible"
        :width="1068"
        :body-style="spendModalBodyStyle"
        :modal-style="spendModalStyle"
        hide-title
        hide-cancel
        unmount-on-close
        simple
        :ok-text="$t('button.close')"
      >
        <SpendDetail
          v-model="spend"
          :model-type="modelType"
          :provider-code="providerCode"
          :provider-name="providerName"
        />
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import {
    computed,
    ref,
    h,
    reactive,
    watch,
    nextTick,
    onBeforeMount,
    onBeforeUnmount,
  } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import dayjs from 'dayjs';
  import {
    queryImagePage,
    ImagePage,
    ImagePageParams,
    ImageBatchOperate,
    submitImageBatchOperate,
  } from '@/api/log';
  import { queryAppList, AppList } from '@/api/app';
  import { queryPerMinute, PerMinuteParams } from '@/api/dashboard';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { Tooltip, Message, Modal } from '@arco-design/web-vue';
  import { useRoute } from 'vue-router';
  import { IconQuestionCircle } from '@arco-design/web-vue/es/icon';
  import { queryModelList, ModelList } from '@/api/model';
  import { queryModelAgentList, ModelAgentList } from '@/api/model_agent';
  import { Spend } from '@/api/common';
  import Quota from '@/views/common/quota.vue';
  import Detail from '../detail/image.vue';
  import SpendDetail from '../components/spend.vue';
  import StatusTag from '../components/status-tag.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const userRole = localStorage.getItem('userRole');
  const route = useRoute();
  const cardHeaderStyle = {
    padding: '20px',
  };
  const cardBodyStyle = {
    padding: '25px 20px 20px 20px',
  };
  const spendModalBodyStyle = {
    maxHeight: '520px',
  };
  const spendModalStyle = {
    padding: '25px 20px 20px 20px',
  };

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
      actions: [],
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
  const ids = ref<Array<string>>([]);
  const multiple = ref(true);
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

  const tokensCellStyle = computed(() => ({
    minHeight: { mini: '26px', small: '30px', medium: '34px', large: '38px' }[
      size.value
    ],
  }));
  const getTimeColor = (
    value: number | undefined,
    thresholds: [number, number, number]
  ) => {
    if ((value || 0) > thresholds[0]) return 'rgb(var(--red-6))';
    if ((value || 0) > thresholds[1]) return 'rgb(var(--orange-6))';
    if ((value || 0) > thresholds[2]) return 'rgb(var(--gold-6))';
    return 'rgb(var(--green-6))';
  };
  const getTotalTimeColor = (value: number | undefined) =>
    getTimeColor(value, [300000, 210000, 120000]);
  const getInternalTimeColor = (value: number | undefined) =>
    getTimeColor(value, [500, 300, 100]);

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
          ? t('common.user_id')
          : t('common.app'),
      dataIndex:
        userRole === 'reseller' || userRole === 'admin'
          ? 'user_id'
          : 'app_name',
      slotName:
        userRole === 'reseller' || userRole === 'admin'
          ? 'user_id'
          : 'app_name',
      align: 'center',
      width: userRole === 'reseller' || userRole === 'admin' ? 75 : undefined,
    },
    ...(userRole === 'user'
      ? [
          {
            title: t('common.key_name'),
            dataIndex: 'key_name',
            slotName: 'key_name',
            align: 'center',
          } as TableColumnData,
        ]
      : []),
    {
      title: t('common.model'),
      dataIndex: 'model',
      slotName: 'model',
      align: 'center',
    },
    {
      title: t('log.columns.action'),
      dataIndex: 'action',
      slotName: 'action',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('log.columns.prompt'),
      dataIndex: 'prompt',
      slotName: 'prompt',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('log.columns.size'),
      dataIndex: 'size',
      slotName: 'size',
      align: 'center',
    },
    {
      title: t('log.columns.images'),
      dataIndex: 'images',
      slotName: 'images',
      align: 'center',
    },
    {
      title: t('common.total.spend'),
      dataIndex: 'total_spend_tokens',
      slotName: 'total_spend_tokens',
      align: 'center',
      slots: {
        title: () => [
          h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                justifyContent: 'center',
              },
            },
            [
              h('span', t('common.total.spend')),
              h(
                Tooltip,
                {
                  content: t('log.columns.tooltip.total_spend_tokens'),
                  contentStyle: {
                    whiteSpace: 'nowrap',
                    maxWidth: 'none',
                  },
                },
                {
                  default: () =>
                    h(IconQuestionCircle, {
                      style: {
                        color: 'var(--color-text-3)',
                      },
                    }),
                }
              ),
            ]
          ),
        ],
      },
    },
    {
      title: t('log.columns.stream'),
      dataIndex: 'stream',
      slotName: 'stream',
      align: 'center',
    },
    {
      title: t('log.columns.total_time'),
      dataIndex: 'total_time',
      slotName: 'total_time',
      align: 'center',
      slots: {
        title: () => [
          h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                justifyContent: 'center',
              },
            },
            [
              h('span', t('log.columns.total_time')),
              h(
                Tooltip,
                {
                  content: t('log.columns.tooltip.total_time'),
                  contentStyle: {
                    whiteSpace: 'nowrap',
                    maxWidth: 'none',
                  },
                },
                {
                  default: () =>
                    h(IconQuestionCircle, {
                      style: {
                        color: 'var(--color-text-3)',
                      },
                    }),
                }
              ),
            ]
          ),
        ],
      },
    },
    {
      title: t('log.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 65,
    },
    {
      title: t('common.req_time'),
      dataIndex: 'req_time',
      slotName: 'req_time',
      align: 'center',
      width: 132,
    },
    {
      title: t('common.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 75,
    },
  ]);

  const actionOptions = computed<SelectOptionData[]>(() => [
    {
      label: 'generations',
      value: 'generations',
    },
    {
      label: 'edits',
      value: 'edits',
    },
    {
      label: 'list',
      value: 'list',
    },
    {
      label: 'retrieve',
      value: 'retrieve',
    },
    {
      label: 'content',
      value: 'content',
    },
    {
      label: 'delete',
      value: 'delete',
    },
    {
      label: 'completions',
      value: 'completions',
    },
    {
      label: 'responses',
      value: 'responses',
    },
    {
      label: 'messages',
      value: 'messages',
    },
    {
      label: 'interactions',
      value: 'interactions',
    },
    {
      label: 'generateContent',
      value: 'generateContent',
    },
    {
      label: 'streamGenerateContent',
      value: 'streamGenerateContent',
    },
  ]);

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('log.dict.status.1'),
      value: 1,
    },
    {
      label: t('log.dict.status.2'),
      value: 2,
    },
    {
      label: t('log.dict.status.-1'),
      value: -1,
    },
  ]);

  if (userRole === 'admin') {
    statusOptions.value.push(
      {
        label: t('log.dict.status.3'),
        value: 3,
      },
      {
        label: t('log.dict.status.-100'),
        value: -100,
      }
    );
  }

  searchFormData.value.trace_id = route.query.trace_id;

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
      if (userRole !== 'admin') {
        cloneColumns.value = cloneColumns.value.filter(
          (item) => item.dataIndex !== 'internal_time'
        );
      }
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

  const rpm = ref(0);
  const tpm = ref(0);
  const getPerMinute = async (
    params: PerMinuteParams = {
      ...searchFormData.value,
      type: 'image',
    }
  ) => {
    const { data } = await queryPerMinute(params);
    rpm.value = data.rpm || 0;
    tpm.value = data.tpm || 0;
  };
  getPerMinute();

  // 定时器的标识符
  let intervalId: ReturnType<typeof setInterval> | undefined;

  const clearTimers = () => {
    clearInterval(intervalId);
  };

  /**
   * 设置定时器
   *
   * 此函数负责初始化多个定时器，用于定期执行特定的操作
   * 它包括获取基础数据、每秒执行一次的操作、每分钟执行一次的操作
   * 并且为每个操作设置了一个定时器，以确保它们能够按预期的频率自动执行
   */
  const setTimers = () => {
    intervalId = setInterval(getPerMinute, 3000);
  };

  /**
   * 处理页面可见性变化的函数
   * 当页面的可见性状态发生改变时，此函数会被调用
   * 主要作用是根据页面是否可见来启动或停止定时器
   */
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      clearTimers();
    } else {
      setTimers();
    }
  };

  /**
   * 在组件挂载前设置定时器并监听页面可见性变化
   *
   * 此生命周期钩子会在组件即将被挂载到 DOM 前执行以下操作：
   * - 调用 `setTimers` 函数来启动定时器
   * - 添加一个事件监听器，用于监听页面的可见性变化
   */
  onBeforeMount(() => {
    setTimers();
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  /**
   * 在组件卸载前清除定时器并移除页面可见性变化监听
   *
   * 此生命周期钩子会在组件即将从 DOM 中卸载前执行以下操作：
   * - 调用 `clearTimers` 函数来停止所有定时器
   * - 移除页面可见性变化的事件监听器
   */
  onBeforeUnmount(() => {
    clearTimers();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  const delForm = ref();
  const delFormVisible = ref(false);
  const delFormData = ref<ImageBatchOperate>({
    status: [1, 2, 3, -1],
  } as ImageBatchOperate);

  const delHandleBeforeOk = async (done: any) => {
    const res = await delForm.value?.validate();
    if (res) {
      delFormVisible.value = true;
      done(false);
      return;
    }
    done();
    handleBatch({
      action: 'time',
      value: delFormData.value.value,
      user_id: delFormData.value.user_id,
      status: delFormData.value.status,
    });
  };

  const delHandleCancel = () => {
    delFormVisible.value = false;
  };

  const handleSelectionChange = (rowKeys: Array<any>) => {
    ids.value = rowKeys;
    multiple.value = !rowKeys.length;
  };

  const handleBatch = (params: ImageBatchOperate) => {
    if (ids.value.length === 0 && !params.value) {
      delFormVisible.value = true;
    } else {
      let alertContent = t('placeholder.batch.operation', {
        count: ids.value.length,
      });
      switch (params.action) {
        case 'delete':
          alertContent = t('placeholder.batch.operation.delete', {
            count: ids.value.length,
          });
          break;
        case 'time':
          if (params.user_id) {
            alertContent = t(
              'log.placeholder.batch.operation.delete.time.user_id',
              {
                user_id: params.user_id,
                start_time: params.value[0],
                end_time: params.value[1],
              }
            );
          } else {
            alertContent = t('log.placeholder.batch.operation.delete.time', {
              start_time: params.value[0],
              end_time: params.value[1],
            });
          }
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
          params.ids = ids.value;
          submitImageBatchOperate(params).then(() => {
            setLoading(false);
            Message.success(t('success.task'));
            search();
            tableRef.value.selectAll(false);
          });
        },
      });
    }
  };

  const spendVisible = ref(false);
  const spend = ref();
  const modelType = ref();
  const providerName = ref('');
  const providerCode = ref('');

  const spendHandle = async (s: Spend, t: number, pc?: string, pn?: string) => {
    spendVisible.value = true;
    spend.value = s;
    modelType.value = t;
    providerCode.value = pc || '';
    providerName.value = pn || '';
  };

  // 总花费按 image_generation 计费，此处汇总其余计费项（text、text_cache、
  // image、image_cache）的花费，单独展示在总花费下方
  const otherSpendTokens = (s: Spend) => {
    if (!s) return 0;
    return (
      (s.text?.spend_tokens || 0) +
      (s.text_cache?.spend_tokens || 0) +
      (s.image?.spend_tokens || 0) +
      (s.image_cache?.spend_tokens || 0)
    );
  };
</script>

<script lang="ts">
  export default {
    name: 'LogImageList',
  };
</script>

<style scoped lang="less">
  @import '../style/log-list-shared.less';

  // 公共骨架已由 page-list.less 全局提供
  // 列表共享样式已由 log-list-shared.less 提供

  // Keep local: text list toolbar needs extra margin-bottom on divider
  .log-list-toolbar-divider {
    margin-bottom: 16px;
  }

  // Keep local: text list toolbar row needs center alignment
  .log-list-toolbar-row {
    align-items: center;
  }

  .spend-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .time-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .time-cell-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 70px;
    font-variant-numeric: tabular-nums;
    text-align: left;
    white-space: nowrap;
    font-size: 13px;
  }

  .time-cell-total {
    line-height: 1;
  }

  // 其余计费项（text、text_cache、image、image_cache）花费汇总，
  // 参考文本日志缓存样式，展示在总花费下方
  .other-spend {
    color: var(--color-text-3);
    font-size: 12px;
    line-height: 1;
  }
</style>
