<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-apps />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('app.menu') }}</a-breadcrumb-item>
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
              <a-col v-permission="['reseller', 'admin']" :span="8">
                <a-form-item field="user_id" :label="$t('common.user_id')">
                  <a-input-number
                    v-model="searchFormData.user_id"
                    :placeholder="$t('placeholder.user_id')"
                    :precision="0"
                    :min="1"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="app_id" :label="$t('common.app_id')">
                  <a-input-number
                    v-model="searchFormData.app_id"
                    :placeholder="$t('placeholder.app_id')"
                    :precision="0"
                    :min="1"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('common.app_name')">
                  <a-input
                    v-model="searchFormData.name"
                    :placeholder="$t('placeholder.app_name')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['user']" :span="8">
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
                <a-form-item field="key" :label="$t('common.app_key')">
                  <a-input
                    v-model="searchFormData.app_key"
                    :placeholder="$t('placeholder.app_key')"
                    allow-clear
                  />
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
                <a-form-item
                  field="quota_expires_at"
                  :label="$t('common.expires_at')"
                >
                  <a-range-picker
                    v-model="searchFormData.quota_expires_at"
                    class="list-full-width"
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
      <a-row class="list-toolbar-row">
        <a-col :span="12">
          <a-space>
            <a-button
              type="primary"
              @click="$router.push({ name: 'AppCreate' })"
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
        <a-col :span="12" class="list-table-actions">
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
                    <div class="list-drag-handle">
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
        @selection-change="handleSelectionChange"
      >
        <template #models="{ record }">
          <span v-if="record.models">
            <a-button type="text" size="small" @click="modelsHandle(record.id)">
              {{ $t('button.view') }}
            </a-button>
          </span>
          <span v-else>{{ $t(`common.no_limit`) }}</span>
        </template>
        <template #quota="{ record }">
          <Quota v-if="record.is_limit_quota" :model-value="record.quota" />
          <span v-else>{{ $t(`common.no_limit`) }}</span>
        </template>
        <template #used_quota="{ record }">
          <Quota :model-value="record.used_quota" />
        </template>
        <template #quota_expires_at="{ record, rowIndex }">
          <a-date-picker
            v-if="record.is_limit_quota"
            v-model="renderData[rowIndex].quota_expires_at"
            :placeholder="$t('app.placeholder.quota_expires_at')"
            :time-picker-props="{ defaultValue: '23:59:59' }"
            :disabled-date="disabledDate"
            show-time
            :shortcuts="[
              {
                label: '1',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(1, 'day'),
              },
              {
                label: '7',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(7, 'day'),
              },
              {
                label: '15',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(15, 'day'),
              },
              {
                label: '30',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(30, 'day'),
              },
              {
                label: '90',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(90, 'day'),
              },
              {
                label: '180',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(180, 'day'),
              },
              {
                label: '365',
                value: () =>
                  dayjs(
                    renderData[rowIndex].quota_expires_at ||
                      new Date().setHours(23, 59, 59, 999)
                  ).add(365, 'day'),
              },
            ]"
            @change="
              appChangeQuotaExpire({
                id: renderData[rowIndex].id,
                quota_expires_at: renderData[rowIndex].quota_expires_at,
              })
            "
          >
            <a-button class="app-list-expire-button">{{
              renderData[rowIndex].quota_expires_at ||
              $t('app.placeholder.quota_expires_at')
            }}</a-button>
          </a-date-picker>
          <span v-else>-</span>
        </template>
        <template #status="{ record }">
          <a-switch
            v-model="record.status"
            :checked-value="1"
            :unchecked-value="2"
            @change="
              appChangeStatus({
                id: record.id,
                status: record.status,
              })
            "
          />
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('button.detail') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'AppUpdate',
                query: { id: record.id },
              })
            "
          >
            {{ $t('button.update') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              createKey({
                app_id: record.app_id,
              })
            "
          >
            {{ $t('app.columns.operations.create_key') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="
              $router.push({
                name: 'AppKeyList',
                query: { app_id: record.app_id },
              })
            "
          >
            {{ $t('app.columns.operations.manage_key') }}
          </a-button>
        </template>
      </a-table>

      <a-drawer
        :title="$t('app.menu.detail')"
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
        v-model:visible="visible"
        :width="726"
        :title="$t('app.key.form.title.key_config')"
        :ok-text="$t('button.save')"
        :body-style="keyConfigModalBodyStyle"
        @cancel="handleCancel"
        @before-ok="handleBeforeOk"
      >
        <a-form ref="formRef" :model="formData" :label-col-props="{ span: 4 }">
          <a-form-item field="key" :label="$t('common.app_key')">
            <a-input
              v-model="formData.key"
              :placeholder="$t('common.app_key')"
              readonly
            />
          </a-form-item>
          <a-form-item field="name" :label="$t('common.key_name')">
            <a-input
              v-model="formData.name"
              :placeholder="$t('placeholder.key_name')"
            />
          </a-form-item>
          <a-form-item
            field="billing_methods"
            :label="$t('common.billing_methods')"
            :rules="[
              {
                required: true,
                message: $t('placeholder.billing_methods'),
              },
            ]"
          >
            <a-space size="large">
              <a-checkbox
                v-model="formData.billing_methods"
                :value="1"
                disabled
              >
              </a-checkbox>
              <span class="app-list-billing-method-label">
                {{ $t('app.key.dict.billing_methods.1') }}
              </span>
              <a-checkbox v-model="formData.billing_methods" :value="2">
                {{ $t('app.key.dict.billing_methods.2') }}
              </a-checkbox>
            </a-space>
          </a-form-item>
          <a-form-item field="models" :label="$t('common.models')">
            <a-tree-select
              v-model="formData.models"
              :placeholder="$t('app.key.placeholder.key.models')"
              :allow-search="true"
              :allow-clear="true"
              :tree-checkable="true"
              :data="treeData"
              :max-tag-count="3"
              :scrollbar="false"
              tree-checked-strategy="child"
            />
          </a-form-item>
          <a-form-item field="is_limit_quota" :label="$t('common.limit_quota')">
            <a-switch v-model="formData.is_limit_quota" />
          </a-form-item>
          <a-form-item
            v-if="formData.is_limit_quota"
            field="quota"
            :label="$t('common.quota')"
            :rules="[
              {
                required: true,
                message: $t('placeholder.quota'),
              },
            ]"
          >
            <a-input-number
              v-model="formData.quota"
              :placeholder="$t('app.placeholder.quota')"
              :min="0.000001"
              :max="9999999999999"
              :parser="parsePrice"
              allow-clear
            >
              <template #prefix> {{ appStore.getCurrencySymbol }} </template>
            </a-input-number>
          </a-form-item>
          <a-form-item v-if="formData.is_limit_quota">
            <a-radio-group type="button" @change="handleQuotaQuickChange">
              <a-radio :value="10"> <Quota :model-value="10" /> </a-radio>
              <a-radio :value="20"> <Quota :model-value="20" /> </a-radio>
              <a-radio :value="50"> <Quota :model-value="50" /> </a-radio>
              <a-radio :value="100"> <Quota :model-value="100" /> </a-radio>
              <a-radio :value="200"> <Quota :model-value="200" /> </a-radio>
              <a-radio :value="500"> <Quota :model-value="500" /> </a-radio>
              <a-radio :value="1000"> <Quota :model-value="1000" /> </a-radio>
              <a-radio :value="2000"> <Quota :model-value="2000" /> </a-radio>
              <a-radio :value="5000"> <Quota :model-value="5000" /> </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="formData.is_limit_quota"
            field="quota_expires_rule"
            :label="$t('app.key.label.quota_expires_rule')"
          >
            <a-space size="large">
              <a-radio
                v-model="formData.quota_expires_rule"
                value="1"
                :default-checked="true"
              >
                {{ $t('dict.quota_expires_rule.1') }}
              </a-radio>
              <a-radio v-model="formData.quota_expires_rule" value="2">
                {{ $t('dict.quota_expires_rule.2') }}
              </a-radio>
            </a-space>
          </a-form-item>
          <a-form-item
            v-if="
              formData.is_limit_quota && formData.quota_expires_rule === '1'
            "
            field="quota_expires_at"
            :label="$t('common.expires_at')"
          >
            <a-date-picker
              v-model="formData.quota_expires_at"
              :placeholder="$t('app.placeholder.quota_expires_at')"
              :time-picker-props="{ defaultValue: '23:59:59' }"
              :disabled-date="disabledDate"
              class="list-full-width"
              show-time
              :shortcuts="[
                {
                  label: '1',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(1, 'day'),
                },
                {
                  label: '7',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(7, 'day'),
                },
                {
                  label: '15',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(15, 'day'),
                },
                {
                  label: '30',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(30, 'day'),
                },
                {
                  label: '90',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(90, 'day'),
                },
                {
                  label: '180',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(180, 'day'),
                },
                {
                  label: '365',
                  value: () =>
                    dayjs(
                      formData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(365, 'day'),
                },
              ]"
            />
          </a-form-item>
          <a-form-item
            v-if="
              formData.is_limit_quota && formData.quota_expires_rule === '2'
            "
            field="quota_expires_minutes"
            :label="$t('app.key.label.quota_expires_minutes')"
          >
            <a-input-number
              v-model="formData.quota_expires_minutes"
              :placeholder="$t('app.key.placeholder.quota_expires_minutes')"
              :precision="0"
              :min="1"
              :max="9999999999999"
            >
              <template #append> {{ $t('unit.minute') }} </template>
            </a-input-number>
          </a-form-item>
          <a-form-item
            v-if="formData.is_limit_quota"
            field="is_cycle_reset_quota"
            :label="$t('common.cycle_reset')"
          >
            <a-switch v-model="formData.is_cycle_reset_quota" />
          </a-form-item>
          <a-form-item
            v-if="formData.is_cycle_reset_quota && formData.is_limit_quota"
            field="reset_quota"
            :label="$t('common.reset_quota')"
            :rules="[
              {
                required: true,
                message: $t('placeholder.reset_quota'),
              },
            ]"
          >
            <a-input-number
              v-model="formData.reset_quota"
              :placeholder="$t('placeholder.reset_quota')"
              :min="0.000001"
              :max="9999999999999"
              :parser="parsePrice"
              allow-clear
            >
              <template #prefix> {{ appStore.getCurrencySymbol }} </template>
            </a-input-number>
          </a-form-item>
          <a-form-item
            v-if="formData.is_cycle_reset_quota && formData.is_limit_quota"
          >
            <a-radio-group type="button" @change="handleResetQuotaQuickChange">
              <a-radio :value="10"> <Quota :model-value="10" /> </a-radio>
              <a-radio :value="20"> <Quota :model-value="20" /> </a-radio>
              <a-radio :value="50"> <Quota :model-value="50" /> </a-radio>
              <a-radio :value="100"> <Quota :model-value="100" /> </a-radio>
              <a-radio :value="200"> <Quota :model-value="200" /> </a-radio>
              <a-radio :value="500"> <Quota :model-value="500" /> </a-radio>
              <a-radio :value="1000"> <Quota :model-value="1000" /> </a-radio>
              <a-radio :value="2000"> <Quota :model-value="2000" /> </a-radio>
              <a-radio :value="5000"> <Quota :model-value="5000" /> </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="formData.is_cycle_reset_quota && formData.is_limit_quota"
            field="cycle_period"
            :label="$t('common.cycle_period')"
            :rules="[
              {
                required: true,
                message: $t('placeholder.cycle_period'),
              },
            ]"
          >
            <a-input-number
              v-model="formData.cycle_period"
              :placeholder="$t('placeholder.cycle_period')"
              :precision="0"
              :min="1"
              allow-clear
            >
              <template #append>
                <a-radio-group v-model="formData.period_unit" type="button">
                  <a-radio value="hour"> {{ $t('unit.hour') }} </a-radio>
                  <a-radio value="day"> {{ $t('unit.day') }} </a-radio>
                </a-radio-group>
                <a-radio-group v-model="formData.reset_mode" type="button">
                  <a-radio value="natural">
                    {{ $t('dict.reset_mode.natural') }}
                  </a-radio>
                  <a-radio value="relative">
                    {{ $t('dict.reset_mode.relative') }}
                  </a-radio>
                </a-radio-group>
              </template>
            </a-input-number>
          </a-form-item>
          <a-form-item
            v-if="
              formData.is_cycle_reset_quota &&
              formData.is_limit_quota &&
              formData.period_unit === 'hour'
            "
          >
            <a-radio-group type="button" @change="handleCyclePeriodQuickChange">
              <a-radio :value="1">
                1<span class="hour">{{ $t('unit.hour') }}</span>
              </a-radio>
              <a-radio :value="3">
                3<span class="hour">{{ $t('unit.hour') }}</span>
              </a-radio>
              <a-radio :value="5">
                5<span class="hour">{{ $t('unit.hour') }}</span>
              </a-radio>
              <a-radio :value="8">
                8<span class="hour">{{ $t('unit.hour') }}</span>
              </a-radio>
              <a-radio :value="12">
                12<span class="hour">{{ $t('unit.hour') }}</span>
              </a-radio>
              <a-radio :value="24">
                24<span class="app-list-hour-label app-list-hour-label--wide">{{
                  $t('unit.hour')
                }}</span>
              </a-radio>
              <a-radio :value="72">
                72<span class="app-list-hour-label app-list-hour-label--wide">{{
                  $t('unit.hour')
                }}</span>
              </a-radio>
              <a-radio :value="168">
                168<span
                  class="app-list-hour-label app-list-hour-label--extra-wide"
                  >{{ $t('unit.hour') }}</span
                >
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="
              formData.is_cycle_reset_quota &&
              formData.is_limit_quota &&
              formData.period_unit === 'day'
            "
          >
            <a-radio-group type="button" @change="handleCyclePeriodQuickChange">
              <a-radio :value="1">
                1<span class="day">{{ $t('unit.day') }}</span>
              </a-radio>
              <a-radio :value="2">
                2<span class="day">{{ $t('unit.day') }}</span>
              </a-radio>
              <a-radio :value="3">
                3<span class="day">{{ $t('unit.day') }}</span>
              </a-radio>
              <a-radio :value="5">
                5<span class="day">{{ $t('unit.day') }}</span>
              </a-radio>
              <a-radio :value="7">
                7<span class="day">{{ $t('unit.day') }}</span>
              </a-radio>
              <a-radio :value="10">
                10<span class="day">{{ $t('unit.day') }}</span>
              </a-radio>
              <a-radio :value="15">
                15<span class="day">{{ $t('unit.day') }}</span>
              </a-radio>
              <a-radio :value="30">
                30<span class="day">{{ $t('unit.day') }}</span>
              </a-radio>
              <a-radio :value="60">
                60 <span class="day">{{ $t('unit.day') }}</span>
              </a-radio>
              <a-radio :value="90">
                90
                <span class="app-list-day-label app-list-day-label--compact">{{
                  $t('unit.day')
                }}</span>
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="is_bind_group" :label="$t('common.bind_group')">
            <a-switch v-model="formData.is_bind_group" />
          </a-form-item>
          <a-form-item
            v-if="formData.is_bind_group"
            field="group"
            :label="$t('common.groups')"
            :rules="[
              {
                required: true,
                message: $t('app.error.required.group'),
              },
            ]"
          >
            <a-select
              v-model="formData.group"
              :placeholder="$t('app.key.placeholder.group')"
              :scrollbar="false"
              allow-search
              allow-clear
            >
              <template #label>
                <div
                  v-if="selectedGroup"
                  class="app-form-group-option app-form-group-option--selected"
                >
                  <div class="app-form-group-option--content">
                    <span class="app-form-group-option--name">
                      {{ selectedGroup.name }}
                    </span>
                  </div>
                  <span class="app-form-group-option--discount">
                    {{ getGroupDiscountText(selectedGroup) }}
                  </span>
                </div>
              </template>
              <a-option
                v-for="item in groups"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
                <div class="app-form-group-option">
                  <div class="app-form-group-option--content">
                    <span class="app-form-group-option--name">{{
                      item.name
                    }}</span>
                    <span class="app-form-group-option--remark">{{
                      item.remark
                    }}</span>
                  </div>
                  <span class="app-form-group-option--discount">
                    {{ getGroupDiscountText(item) }}
                  </span>
                </div>
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="ip_whitelist" :label="$t('common.ip_whitelist')">
            <a-textarea
              v-model="formData.ip_whitelist"
              :placeholder="$t('app.placeholder.ip_whitelist')"
              :auto-size="{ minRows: 5, maxRows: 5 }"
            />
          </a-form-item>
          <a-form-item field="ip_blacklist" :label="$t('common.ip_blacklist')">
            <a-textarea
              v-model="formData.ip_blacklist"
              :placeholder="$t('app.placeholder.ip_blacklist')"
              :auto-size="{ minRows: 5, maxRows: 5 }"
            />
          </a-form-item>
          <a-form-item field="remark" :label="$t('common.remark')">
            <a-textarea
              v-model="formData.remark"
              :placeholder="$t('placeholder.remark')"
            />
          </a-form-item>
        </a-form>
      </a-modal>

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
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import dayjs from 'dayjs';
  import { FormInstance, Message, Modal } from '@arco-design/web-vue';
  import { useAppStore } from '@/store';
  import { disabledDate, parsePrice } from '@/utils/common';
  import {
    queryAppPage,
    AppPage,
    AppPageParams,
    AppChangeQuotaExpire,
    submitAppChangeQuotaExpire,
    AppChangeStatus,
    submitAppChangeStatus,
    AppBatchOperate,
    submitAppBatchOperate,
  } from '@/api/app';
  import {
    submitAppKeyCreate,
    AppKeyCreate,
    submitAppKeyConfig,
    AppKeyConfig,
  } from '@/api/app_key';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { queryModelList, ModelList, queryModelTree, Tree } from '@/api/model';
  import { queryGroupList, GroupList } from '@/api/group';
  import Models from '@/views/common/models.vue';
  import Quota from '@/views/common/quota.vue';
  import Detail from '../detail/index.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const appStore = useAppStore();
  const userRole = localStorage.getItem('userRole');
  const cardHeaderStyle = {
    padding: '20px',
  };
  const cardBodyStyle = {
    padding: '25px 20px 20px 20px',
  };
  const keyConfigModalBodyStyle = {
    height: '520px',
  };
  const modelsModalStyle = {
    padding: '25px 15px 20px 15px',
  };

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const generateSearchParams = () => {
    return {
      user_id: ref(),
      app_id: ref(),
      name: '',
      models: [],
      app_key: '',
      type: ref(),
      status: ref(),
      quota_expires_at: [],
      created_at: [],
    };
  };

  const renderData = ref<AppPage[]>([]);
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
      title: t('common.user_id'),
      dataIndex: 'user_id',
      slotName: 'user_id',
      align: 'center',
      width: 80,
    },
    {
      title: t('common.app_id'),
      dataIndex: 'app_id',
      slotName: 'app_id',
      align: 'center',
      width: 80,
    },
    {
      title: t('common.app_name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.models'),
      dataIndex: 'models',
      slotName: 'models',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.current_quota'),
      dataIndex: 'quota',
      slotName: 'quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.used_quota'),
      dataIndex: 'used_quota',
      slotName: 'used_quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.expires_at'),
      dataIndex: 'quota_expires_at',
      slotName: 'quota_expires_at',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 65,
    },
    {
      title: t('common.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 260,
    },
  ]);

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('dict.status.1'),
      value: 1,
    },
    {
      label: t('dict.status.2'),
      value: 2,
    },
  ]);

  const fetchData = async (
    params: AppPageParams = {
      ...basePagination,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryAppPage(params);
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
    } as unknown as AppPageParams);
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
      if (userRole === 'user') {
        cloneColumns.value.splice(0, 1);
      }
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

  const treeData = ref<Tree[]>([]);
  const getModelTree = async () => {
    try {
      const { data } = await queryModelTree();
      treeData.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getModelTree();

  const groups = ref<GroupList[]>([]);
  const selectedGroup = computed(() =>
    groups.value.find((item) => item.id === formData.value.group)
  );

  const getDiscountRange = (rules: any[]) => {
    const discounts = rules.map((r: any) => r.discount);
    const min = Math.min(...discounts);
    const max = Math.max(...discounts);
    return `${min}%~${max}%`;
  };

  const getGroupDiscountText = (group: GroupList) => {
    if (!group.time_rules?.length) {
      return '';
    }
    if (group.time_rules.length === 1) {
      return `${group.time_rules[0].discount}%`;
    }
    return getDiscountRange(group.time_rules);
  };

  const getGroupList = async () => {
    try {
      const { data } = await queryGroupList();
      groups.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getGroupList();

  const appChangeQuotaExpire = async (params: AppChangeQuotaExpire) => {
    setLoading(true);
    try {
      await submitAppChangeQuotaExpire(params);
      Message.success(t('success.operate'));
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const appChangeStatus = async (params: AppChangeStatus) => {
    setLoading(true);
    try {
      await submitAppChangeStatus(params);
      Message.success(t('success.operate'));
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const visible = ref(false);

  const formRef = ref<FormInstance>();
  const formData = ref<AppKeyConfig>({
    billing_methods: [1],
    period_unit: 'day',
    reset_mode: 'natural',
  } as AppKeyConfig);

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.quota = quota;
  };

  const createKey = async (params: AppKeyCreate) => {
    const { data } = await submitAppKeyCreate(params);
    formData.value.app_id = data.app_id;
    formData.value.key = data.key;
    formData.value.quota_expires_rule = '1';
    formData.value.quota_expires_at = '';
    formData.value.quota_expires_minutes = ref();
    visible.value = true;
  };

  const handleBeforeOk = async (done: any) => {
    const res = await formRef.value?.validate();
    if (res) {
      visible.value = true;
      done(false);
      return;
    }

    setLoading(true);
    if (formData.value.quota_expires_rule === '1') {
      formData.value.quota_expires_minutes = '';
    }
    if (formData.value.quota_expires_rule === '2') {
      formData.value.quota_expires_at = '';
    }
    try {
      await submitAppKeyConfig(formData.value);
      navigator.clipboard.writeText(formData.value.key);
      Message.success(t('app.key.success.save'));
      done();
    } catch (err) {
      done(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    visible.value = false;
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

  const modelsVisible = ref(false);
  const action = ref();

  const modelsHandle = (id: string) => {
    modelsVisible.value = true;
    recordId.value = id;
    action.value = 'app';
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
  const handleBatch = (params: AppBatchOperate) => {
    if (ids.value.length === 0) {
      Message.info(t('placeholder.operation.data'));
    } else {
      let alertContent = t('placeholder.batch.operation', {
        count: ids.value.length,
      });
      switch (params.action) {
        case 'status':
          if (params.value === 1) {
            alertContent = t('placeholder.batch.operation.enable', {
              count: ids.value.length,
            });
          } else {
            alertContent = t('placeholder.batch.operation.disable', {
              count: ids.value.length,
            });
          }
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
          params.ids = ids.value;
          submitAppBatchOperate(params).then((res) => {
            setLoading(false);
            Message.success(t('success.operate'));
            search();
            tableRef.value.selectAll(false);
          });
        },
      });
    }
  };

  const handleResetQuotaQuickChange = (quota: number) => {
    formData.value.reset_quota = quota;
  };

  const handleCyclePeriodQuickChange = (cyclePeriod: number) => {
    formData.value.cycle_period = cyclePeriod;
  };
</script>

<script lang="ts">
  export default {
    name: 'AppList',
  };
</script>

<style scoped lang="less">
  @import '../style/app-form-shared.less';
  // 公共骨架已由 page-list.less 全局提供

  .app-list-billing-method-label {
    margin-left: -15px;
  }

  .app-list-expire-button {
    width: 150px;
  }

  .app-list-hour-label {
    &--wide {
      margin-left: 3px;
    }

    &--extra-wide {
      margin-left: 4px;
    }
  }

  .app-list-day-label {
    &--compact {
      margin-left: 2px;
    }
  }

  :deep(.arco-radio-button-content) {
    padding: 0 10px;
  }

  .hour {
    margin-left: 1px;
  }

  .day {
    margin-left: 3px;
  }
</style>
