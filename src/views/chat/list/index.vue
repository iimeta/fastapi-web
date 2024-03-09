<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-wechat />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.chat') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.chat.list') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card
      class="general-card"
      :title="$t('menu.chat.list')"
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
              <a-col v-permission="['user']" :span="8">
                <a-form-item field="app_id" :label="$t('chat.form.app_id')">
                  <a-select
                    v-model="formModel.app_id"
                    :placeholder="$t('chat.form.selectDefault')"
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
              <a-col v-permission="['admin']" :span="8">
                <a-form-item field="user_id" :label="$t('chat.form.user_id')">
                  <a-input
                    v-model="formModel.user_id"
                    :placeholder="$t('chat.form.user_id.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="key" :label="$t('chat.form.key')">
                  <a-input
                    v-model="formModel.key"
                    :placeholder="$t('chat.form.key.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="models" :label="$t('chat.form.models')">
                  <a-select
                    v-model="formModel.models"
                    :placeholder="$t('chat.form.selectDefault')"
                    :max-tag-count="3"
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
                <a-form-item
                  field="total_time"
                  :label="$t('chat.form.total_time')"
                >
                  <a-input-number
                    v-model="formModel.total_time"
                    :precision="0"
                    :placeholder="$t('chat.form.total_time.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('chat.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('chat.form.selectDefault')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="req_times"
                  :label="$t('chat.form.req_times')"
                >
                  <a-range-picker v-model="formModel.req_times" show-time />
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
        <a-col :span="12">
          <a-space>
            <!-- <a-button
              type="primary"
              @click="$router.push({ name: 'ChatCreate' })"
            >
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('chat.operation.create') }}
            </a-button> -->
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
        <template #prompt_tokens="{ record }">
          {{ record.prompt_tokens || '-' }}
        </template>
        <template #completion_tokens="{ record }">
          {{ record.completion_tokens || '-' }}
        </template>
        <template #total_tokens="{ record }">
          {{ record.total_tokens || '-' }}
        </template>
        <template #stream="{ record }">
          {{ $t(`chat.dict.stream.${record.stream}`) }}
        </template>
        <template #conn_time="{ record }">
          {{ record.conn_time || '-' }}
        </template>
        <template #duration="{ record }">
          {{ record.duration || '-' }}
        </template>
        <template #total_time="{ record }">
          {{ record.total_time || '-' }}
        </template>
        <template #status="{ record }">
          <span v-if="record.status === -1" class="circle red"></span>
          <span v-else class="circle"></span>
          {{ $t(`chat.dict.status.${record.status}`) }}
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="toDetail(record.id)">
            {{ $t('chat.columns.operations.view') }}
          </a-button>
        </template>
      </a-table>

      <!-- 详情区域 -->
      <a-drawer
        title="日志详情"
        :visible="visible"
        :width="700"
        :footer="false"
        unmount-on-close
        render-to-body
        @cancel="handleCancel"
      >
        <div style="margin: 10px 0 0 10px">
          <a-descriptions v-permission="['user']" :column="2" bordered>
            <a-descriptions-item label="Trace ID" :span="2">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>
                {{ currentData.trace_id }}
                <icon-copy
                  class="copy-btn"
                  @click="handleCopy(currentData.trace_id)"
                />
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="调用密钥" :span="2">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>
                {{ currentData.creator }}
                <icon-copy
                  class="copy-btn"
                  @click="handleCopy(currentData.creator)"
                />
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="用户ID">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.user_id || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="应用ID">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.app_id || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="公司">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.corp || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="模型">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.model || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="模型类型">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ $t(`chat.dict.type.${currentData.type}`) }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="流式">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{
                $t(`chat.dict.stream.${currentData.stream}`)
              }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="提问" :span="2">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.prompt || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="回答" :span="2">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.completion || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="提问倍率">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.prompt_ratio || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="回答倍率">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.completion_ratio || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="提问令牌数">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.prompt_tokens || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="回答令牌数">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.completion_tokens || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="总消耗令牌数">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.total_tokens || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="结果">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{
                $t(`chat.dict.status.${currentData.status}`)
              }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="连接耗时">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>
                <a-tag v-if="currentData.conn_time > 1500" color="red">
                  {{ currentData.conn_time || '-' }} ms
                </a-tag>
                <a-tag v-else-if="currentData.conn_time > 1000" color="orange">
                  {{ currentData.conn_time || '-' }} ms
                </a-tag>
                <a-tag v-else color="green"
                  >{{ currentData.conn_time || '-' }} ms</a-tag
                >
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="持续时长">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>
                <a-tag v-if="currentData.duration > 90000" color="red">
                  {{ currentData.duration || '-' }} ms
                </a-tag>
                <a-tag v-else-if="currentData.duration > 60000" color="orange">
                  {{ currentData.duration || '-' }} ms
                </a-tag>
                <a-tag v-else color="green"
                  >{{ currentData.duration || '-' }} ms</a-tag
                >
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="总耗时">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>
                <a-tag v-if="currentData.total_time > 120000" color="red">
                  {{ currentData.total_time || '-' }} ms
                </a-tag>
                <a-tag
                  v-else-if="currentData.total_time > 60000"
                  color="orange"
                >
                  {{ currentData.total_time || '-' }} ms
                </a-tag>
                <a-tag v-else color="green"
                  >{{ currentData.total_time || '-' }} ms</a-tag
                >
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="内耗">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>
                <a-tag v-if="currentData.internal_time > 500" color="red">
                  {{ currentData.internal_time || '-' }} ms
                </a-tag>
                <a-tag
                  v-else-if="currentData.internal_time > 100"
                  color="orange"
                >
                  {{ currentData.internal_time || '-' }} ms
                </a-tag>
                <a-tag v-else color="green"
                  >{{ currentData.internal_time || '-' }} ms</a-tag
                >
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="客户端IP">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.client_ip || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="请求时间">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.req_time || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="错误信息" :span="2">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.err_msg || '-' }}</span>
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions v-permission="['admin']" :column="2" bordered>
            <a-descriptions-item label="Trace ID" :span="2">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>
                {{ currentData.trace_id }}
                <icon-copy
                  class="copy-btn"
                  @click="handleCopy(currentData.trace_id)"
                />
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="调用密钥" :span="2">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>
                {{ currentData.creator }}
                <icon-copy
                  class="copy-btn"
                  @click="handleCopy(currentData.creator)"
                />
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="用户ID">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.user_id || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="应用ID">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.app_id || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="公司">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.corp || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="模型名称">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.name || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="模型类型">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ $t(`chat.dict.type.${currentData.type}`) }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="模型">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.model || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="流式">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{
                $t(`chat.dict.stream.${currentData.stream}`)
              }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="模型ID">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.model_id || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="启用代理">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{
                $t(
                  `chat.dict.is_enable_model_agent.${
                    currentData.is_enable_model_agent || false
                  }`
                )
              }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="代理名称">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData?.model_agent?.name || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="密钥" :span="2">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>
                {{ currentData.key || '-' }}
                <icon-copy
                  class="copy-btn"
                  @click="handleCopy(currentData.key)"
                />
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="提问" :span="2">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.prompt || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="回答" :span="2">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.completion || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="提问倍率">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.prompt_ratio || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="回答倍率">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.completion_ratio || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="提问令牌数">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.prompt_tokens || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="回答令牌数">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.completion_tokens || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="总消耗令牌数">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.total_tokens || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="结果">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{
                $t(`chat.dict.status.${currentData.status}`)
              }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="连接耗时">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>
                <a-tag v-if="currentData.conn_time > 1500" color="red">
                  {{ currentData.conn_time || '-' }} ms
                </a-tag>
                <a-tag v-else-if="currentData.conn_time > 1000" color="orange">
                  {{ currentData.conn_time || '-' }} ms
                </a-tag>
                <a-tag v-else color="green"
                  >{{ currentData.conn_time || '-' }} ms</a-tag
                >
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="持续时长">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>
                <a-tag v-if="currentData.duration > 90000" color="red">
                  {{ currentData.duration || '-' }} ms
                </a-tag>
                <a-tag v-else-if="currentData.duration > 60000" color="orange">
                  {{ currentData.duration || '-' }} ms
                </a-tag>
                <a-tag v-else color="green"
                  >{{ currentData.duration || '-' }} ms</a-tag
                >
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="总耗时">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>
                <a-tag v-if="currentData.total_time > 120000" color="red">
                  {{ currentData.total_time || '-' }} ms
                </a-tag>
                <a-tag
                  v-else-if="currentData.total_time > 60000"
                  color="orange"
                >
                  {{ currentData.total_time || '-' }} ms
                </a-tag>
                <a-tag v-else color="green"
                  >{{ currentData.total_time || '-' }} ms</a-tag
                >
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="内耗">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>
                <a-tag v-if="currentData.internal_time > 500" color="red">
                  {{ currentData.internal_time || '-' }} ms
                </a-tag>
                <a-tag
                  v-else-if="currentData.internal_time > 100"
                  color="orange"
                >
                  {{ currentData.internal_time || '-' }} ms
                </a-tag>
                <a-tag v-else color="green"
                  >{{ currentData.internal_time || '-' }} ms</a-tag
                >
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="客户端IP">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.client_ip || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="远程IP">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.remote_ip || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="请求时间">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.req_time || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :widths="['200px']" :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.created_at || '-' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="错误信息" :span="2">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.err_msg || '-' }}</span>
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions
            layout="inline-vertical"
            :column="2"
            style="margin-top: 10px; position: relative"
          >
            <a-descriptions-item :span="2">
              <a-tabs type="card">
                <a-tab-pane key="1" title="提问上下文">
                  <a-skeleton v-if="loading" :animation="true">
                    <a-skeleton-line :rows="3" />
                  </a-skeleton>
                  <a-space v-else>
                    <VueJsonPretty
                      v-if="currentData.messages"
                      :path="'res'"
                      :data="currentData.messages"
                      :show-length="true"
                    />
                    <span v-else>无</span>
                  </a-space>
                </a-tab-pane>
              </a-tabs>
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions
            v-permission="['admin']"
            layout="inline-vertical"
            :column="2"
            style="margin-top: 10px; position: relative"
          >
            <a-descriptions-item :span="2">
              <a-tabs type="card">
                <a-tab-pane key="1" title="模型代理">
                  <a-skeleton v-if="loading" :animation="true">
                    <a-skeleton-line :rows="3" />
                  </a-skeleton>
                  <a-space v-else>
                    <VueJsonPretty
                      v-if="currentData.model_agent"
                      :data="currentData.model_agent"
                      :show-length="true"
                    />
                    <span v-else>无</span>
                  </a-space>
                </a-tab-pane>
              </a-tabs>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </a-drawer>
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
  } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryChatPage,
    ChatPage,
    ChatPageParams,
    queryChatDetail,
    ChatDetail,
  } from '@/api/chat';
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
  import { useClipboard } from '@vueuse/core';
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const apps = ref<AppList[]>([]);

  const getAppList = async () => {
    try {
      const { data } = await queryAppList();
      apps.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getAppList();

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

  const generateFormModel = () => {
    return {
      app_id: ref(),
      user_id: ref(),
      key: '',
      models: [],
      total_time: ref(),
      status: ref(),
      req_times: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<ChatPage[]>([]);
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

  const userRole = localStorage.getItem('userRole');

  const columns = computed<TableColumnData[]>(() => [
    {
      title:
        userRole === 'admin'
          ? t('chat.columns.user_id')
          : t('chat.columns.app_id'),
      dataIndex: userRole === 'admin' ? 'user_id' : 'app_id',
      slotName: userRole === 'admin' ? 'user_id' : 'app_id',
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
      title: t('chat.columns.prompt_tokens'),
      dataIndex: 'prompt_tokens',
      slotName: 'prompt_tokens',
      align: 'center',
    },
    {
      title: t('chat.columns.completion_tokens'),
      dataIndex: 'completion_tokens',
      slotName: 'completion_tokens',
      align: 'center',
    },
    {
      title: t('chat.columns.total_tokens'),
      dataIndex: 'total_tokens',
      slotName: 'total_tokens',
      align: 'center',
    },
    {
      title: t('chat.columns.stream'),
      dataIndex: 'stream',
      slotName: 'stream',
      align: 'center',
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
      width: 75,
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
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('chat.dict.status.1'),
      value: 1,
    },
    {
      label: t('chat.dict.status.-1'),
      value: -1,
    },
  ]);
  const fetchData = async (
    params: ChatPageParams = {
      ...basePagination,
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
    }
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as ChatPageParams);
  };

  const onPageChange = (current: number) => {
    basePagination.current = current;
    fetchData({ ...basePagination, ...formModel.value });
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

  const visible = ref(false);
  const { copy, copied } = useClipboard();
  const { proxy } = getCurrentInstance() as any;
  const currentData = ref<ChatDetail>({} as ChatDetail);

  /**
   * 查看详情
   *
   * @param id ID
   */
  const toDetail = async (id: string) => {
    visible.value = true;
    loading.value = true;

    try {
      const { data } = await queryChatDetail({ id });
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      loading.value = false;
    }
  };

  /**
   * 关闭详情
   */
  const handleCancel = () => {
    visible.value = false;
  };

  /**
   * 复制内容
   *
   * @param content 内容
   */
  const handleCopy = (content: string) => {
    copy(content);
  };
  watch(copied, () => {
    if (copied.value) {
      proxy.$message.success('复制成功');
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'AppChatList',
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
  :deep(.arco-tabs-content) {
    padding-top: 5px;
    padding-left: 15px;
  }
</style>
