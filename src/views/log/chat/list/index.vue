<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-message />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.chat') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.chat.list') }}</a-breadcrumb-item>
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
      <a-divider style="margin-top: 0; margin-bottom: 16px" />
      <a-row style="margin-bottom: 16px; align-items: center">
        <a-col :span="3">
          <a-space>
            <a-button type="primary" @click="handleChatExport({})">
              导出
            </a-button>
            <a-button
              v-permission="['admin']"
              type="primary"
              status="danger"
              @click="
                handleBatch({
                  action: 'delete',
                })
              "
            >
              删除
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="14">
          花费 = ( 提问 × 提问倍率 + 回答 × 回答倍率 ) × 分组折扣 ÷ 500000
          &nbsp;&nbsp;或&nbsp;&nbsp; 回答 × 分组折扣 ÷ 500000
        </a-col>
        <a-col :span="2"> RPM: &nbsp;{{ rpm.toLocaleString() }} </a-col>
        <a-col :span="3"> TPM: &nbsp;{{ tpm.toLocaleString() }} </a-col>
        <a-col
          :span="2"
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
        ref="tableRef"
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
        @selection-change="handleSelectionChange"
      >
        <template #user_id="{ record }">
          {{ record.is_smart_match ? '-' : record.user_id }}
        </template>
        <template #prompt_tokens="{ record }">
          {{
            record.prompt_tokens
              ? record.prompt_tokens
              : record.status === 1 && record.billing_method === 2
              ? 0
              : '-'
          }}
        </template>
        <template #completion_tokens="{ record }">
          {{
            record.completion_tokens
              ? record.completion_tokens
              : record.status === 1 && record.billing_method === 2
              ? 0
              : '-'
          }}
        </template>
        <template #total_tokens="{ record }">
          {{
            record.total_tokens
              ? `$${quotaConv(record.total_tokens)}`
              : record.status === 1 && record.billing_method === 2
              ? 0
              : '-'
          }}
        </template>
        <template #stream="{ record }">
          {{ $t(`chat.dict.stream.${record.stream || false}`) }}
        </template>
        <template #conn_time="{ record }">
          <a-tag
            v-if="record.conn_time > 30000"
            v-permission="['reseller', 'user']"
            color="red"
          >
            {{ record.conn_time }}
          </a-tag>
          <a-tag
            v-else-if="record.conn_time > 15000"
            v-permission="['reseller', 'user']"
            color="orange"
          >
            {{ record.conn_time }}
          </a-tag>
          <a-tag
            v-else-if="record.conn_time > 5000"
            v-permission="['reseller', 'user']"
            color="gold"
          >
            {{ record.conn_time }}
          </a-tag>
          <a-tag v-else v-permission="['reseller', 'user']" color="green">{{
            record.conn_time || '-'
          }}</a-tag>
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
          <a-tag v-else v-permission="['admin']" color="green">{{
            record.conn_time || '-'
          }}</a-tag>
        </template>
        <template #duration="{ record }">
          <a-tag
            v-if="record.duration > 180000"
            v-permission="['reseller', 'user']"
            color="red"
          >
            {{ record.duration }}
          </a-tag>
          <a-tag
            v-else-if="record.duration > 120000"
            v-permission="['reseller', 'user']"
            color="orange"
          >
            {{ record.duration }}
          </a-tag>
          <a-tag
            v-else-if="record.duration > 90000"
            v-permission="['reseller', 'user']"
            color="gold"
          >
            {{ record.duration }}
          </a-tag>
          <a-tag v-else v-permission="['reseller', 'user']" color="green">{{
            record.duration || '-'
          }}</a-tag>
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
          <a-tag v-else v-permission="['admin']" color="green">{{
            record.duration || '-'
          }}</a-tag>
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
        :title="$t('menu.chat.detail')"
        :width="700"
        :footer="false"
        :visible="detailVisible"
        unmount-on-close
        render-to-body
        @cancel="detailHandleCancel"
      >
        <Detail :id="recordId" />
      </a-drawer>

      <a-modal
        v-model:visible="chatExportFormVisible"
        :title="$t('chat.form.title.chat_export')"
        @cancel="chatExportHandleCancel"
        @before-ok="chatExportHandleBeforeOk"
      >
        <a-form ref="chatExportForm" :model="chatExportFormData">
          <a-form-item
            field="req_time"
            :label="$t('chat.form.req_time')"
            :rules="[
              {
                required: true,
                message: $t('chat.error.req_time.required'),
              },
            ]"
          >
            <a-range-picker
              v-model="chatExportFormData.req_time"
              :placeholder="['开始时间', '结束时间']"
              :time-picker-props="{
                defaultValue: ['00:00:00', '23:59:59'],
              }"
              show-time
            />
          </a-form-item>
          <a-form-item
            v-permission="['reseller', 'admin']"
            field="user_id"
            :label="$t('chat.form.req.user_id')"
          >
            <a-input-number
              v-model="chatExportFormData.user_id"
              :placeholder="$t('chat.form.user_id.placeholder')"
              :precision="0"
              :min="1"
              allow-clear
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
        v-model:visible="chatDelFormVisible"
        :title="$t('chat.form.title.chat_del')"
        @cancel="chatDelHandleCancel"
        @before-ok="chatDelHandleBeforeOk"
      >
        <a-form ref="chatDelForm" :model="chatDelFormData">
          <a-form-item
            field="value"
            :label="$t('chat.form.req_time')"
            :rules="[
              {
                required: true,
                message: $t('chat.error.req_time.required'),
              },
            ]"
          >
            <a-range-picker
              v-model="chatDelFormData.value"
              :placeholder="['开始时间', '结束时间']"
              :time-picker-props="{
                defaultValue: ['00:00:00', '23:59:59'],
              }"
              show-time
            />
          </a-form-item>
          <a-form-item
            field="status"
            :label="$t('chat.form.req.status')"
            :rules="[
              {
                required: true,
                message: $t('chat.error.req.status.required'),
              },
            ]"
          >
            <a-space size="large">
              <a-checkbox v-model="chatDelFormData.status" :value="1">
                成功
              </a-checkbox>
              <a-checkbox v-model="chatDelFormData.status" :value="2">
                中止
              </a-checkbox>
              <a-checkbox v-model="chatDelFormData.status" :value="3">
                重试
              </a-checkbox>
              <a-checkbox v-model="chatDelFormData.status" :value="-1">
                失败
              </a-checkbox>
            </a-space>
          </a-form-item>
          <a-form-item field="user_id" :label="$t('chat.form.req.user_id')">
            <a-input-number
              v-model="chatDelFormData.user_id"
              :placeholder="$t('chat.form.user_id.placeholder')"
              :precision="0"
              :min="1"
              allow-clear
            />
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
    onBeforeMount,
    onBeforeUnmount,
  } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import dayjs from 'dayjs';
  import { quotaConv } from '@/utils/common';
  import {
    queryChatPage,
    ChatPage,
    ChatPageParams,
    ChatExportParams,
    submitChatExport,
    ChatBatchOperate,
    submitChatBatchOperate,
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
  import { FormInstance } from '@arco-design/web-vue/es';
  import { queryModelList, ModelList } from '@/api/model';
  import { queryModelAgentList, ModelAgentList } from '@/api/agent';
  import Detail from '../detail/index.vue';

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

  const renderData = ref<ChatPage[]>([]);
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
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('chat.columns.prompt_tokens'),
      dataIndex: 'prompt_tokens',
      slotName: 'prompt_tokens',
      align: 'center',
      width: 75,
    },
    {
      title: t('chat.columns.completion_tokens'),
      dataIndex: 'completion_tokens',
      slotName: 'completion_tokens',
      align: 'center',
      width: 75,
    },
    {
      title: t('chat.columns.total_price'),
      dataIndex: 'total_tokens',
      slotName: 'total_tokens',
      align: 'center',
    },
    {
      title: t('chat.columns.stream'),
      dataIndex: 'stream',
      slotName: 'stream',
      align: 'center',
      width: 60,
    },
    {
      title: t('chat.columns.conn_time'),
      dataIndex: 'conn_time',
      slotName: 'conn_time',
      align: 'center',
    },
    {
      title: t('chat.columns.duration'),
      dataIndex: 'duration',
      slotName: 'duration',
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
    columns.value.splice(9, 1);
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
    params: ChatPageParams = {
      ...basePagination,
      ...searchFormData.value,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryChatPage(params);
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
    } as unknown as ChatPageParams);
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

  const { proxy } = getCurrentInstance() as any;

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
    }
  ) => {
    const { data } = await queryPerMinute(params);
    rpm.value = data.rpm;
    tpm.value = data.tpm;
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

  const chatExportForm = ref<FormInstance>();
  const chatExportFormVisible = ref(false);
  const chatExportFormData = ref<ChatExportParams>({} as ChatExportParams);

  const chatExportHandleBeforeOk = async (done: any) => {
    const res = await chatExportForm.value?.validate();
    if (res) {
      chatExportFormVisible.value = true;
      done(false);
      return;
    }
    done();
    handleChatExport({
      req_time: chatExportFormData.value.req_time,
      user_id: chatExportFormData.value.user_id,
    });
  };

  const chatExportHandleCancel = () => {
    chatExportFormVisible.value = false;
  };

  /**
   * 导出操作
   */
  const handleChatExport = (params: ChatExportParams) => {
    if (ids.value.length === 0 && !params.req_time) {
      chatExportFormVisible.value = true;
      return;
    }

    setLoading(true);
    params.ids = ids.value;
    submitChatExport(params)
      .then((res) => {
        setLoading(false);
        proxy.$message.success('导出成功');
        tableRef.value.selectAll(false);
        // 创建一个新的Blob对象，使用后端返回的文件流
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });

        // 创建一个指向该Blob的URL
        const url = window.URL.createObjectURL(blob);

        // 创建一个a标签用于下载文件
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '聊天日志.xlsx'); // 设置下载文件名
        document.body.appendChild(link);

        // 触发a标签的点击事件，开始下载
        link.click();

        // 清理并释放资源
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        proxy.$message.error('导出失败, 请联系管理员', error);
      });
  };

  const chatDelForm = ref<FormInstance>();
  const chatDelFormVisible = ref(false);
  const chatDelFormData = ref<ChatBatchOperate>({
    status: [1, 2, 3, -1],
  } as ChatBatchOperate);

  const chatDelHandleBeforeOk = async (done: any) => {
    const res = await chatDelForm.value?.validate();
    if (res) {
      chatDelFormVisible.value = true;
      done(false);
      return;
    }
    done();
    handleBatch({
      action: 'time',
      value: chatDelFormData.value.value,
      user_id: chatDelFormData.value.user_id,
      status: chatDelFormData.value.status,
    });
  };

  const chatDelHandleCancel = () => {
    chatDelFormVisible.value = false;
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
  const handleBatch = (params: ChatBatchOperate) => {
    if (ids.value.length === 0 && !params.value) {
      chatDelFormVisible.value = true;
    } else {
      let alertContent = `是否确定操作所选的${ids.value.length}条数据?`;
      switch (params.action) {
        case 'delete':
          alertContent = `是否确定删除所选的${ids.value.length}条数据?`;
          break;
        case 'time':
          if (params.user_id) {
            alertContent = `是否确定删除用户ID: ${params.user_id} 请求时间: ${params.value[0]} 至 ${params.value[1]} 的数据?`;
          } else {
            alertContent = `是否确定删除请求时间: ${params.value[0]} 至 ${params.value[1]} 的数据?`;
          }
          break;
        default:
      }

      proxy.$modal.warning({
        title: '警告',
        titleAlign: 'center',
        content: alertContent,
        hideCancel: false,
        onOk: () => {
          setLoading(true);
          params.ids = ids.value;
          submitChatBatchOperate(params).then((res) => {
            setLoading(false);
            proxy.$message.success('操作成功, 任务已提交');
            search();
            tableRef.value.selectAll(false);
          });
        },
      });
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'ChatList',
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
</style>
