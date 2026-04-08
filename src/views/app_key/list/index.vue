<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-safe />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('app.key.menu') }}</a-breadcrumb-item>
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
              <a-col v-permission="['reseller', 'admin']" :span="7">
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
              <a-col v-permission="['user']" :span="7">
                <a-form-item
                  field="app_id"
                  :label="$t('common.app')"
                  :label-col-props="{ span: 6 }"
                >
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
              <a-col :span="9">
                <a-form-item field="key" :label="$t('app.key.form.key')">
                  <a-input
                    v-model="searchFormData.key"
                    :placeholder="$t('app.key.form.placeholder.key')"
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
              <a-col :span="userRole === 'user' ? 7 : 8">
                <a-form-item
                  field="quota"
                  :label="$t('common.quota_lt')"
                  :label-col-props="{ span: userRole === 'user' ? 6 : 5 }"
                >
                  <a-input-number
                    v-model="searchFormData.quota"
                    :placeholder="$t('placeholder.quota')"
                    :min="0.000001"
                    :max="9999999999999"
                    allow-clear
                  >
                    <template #prefix>
                      {{ appStore.getCurrencySymbol }}
                    </template>
                  </a-input-number>
                </a-form-item>
              </a-col>
              <a-col :span="userRole === 'user' ? 9 : 7">
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
              <a-col :span="userRole === 'user' ? 8 : 9">
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
              @click="
                handleAppKeyBatch({
                  action: 'create',
                })
              "
            >
              {{ $t('button.create') }}
            </a-button>
            <a-button
              type="primary"
              status="warning"
              :disabled="multiple"
              :title="multiple ? $t('placeholder.operation.data') : ''"
              @click="
                handleAppKeyBatch({
                  action: 'update',
                })
              "
            >
              {{ $t('button.update') }}
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
            <a-button
              type="primary"
              status="warning"
              :disabled="allMultiple"
              :title="allMultiple ? $t('placeholder.search.data') : ''"
              @click="
                handleAppKeyBatch({
                  action: 'all-update',
                })
              "
            >
              {{ $t('button.all.update') }}
            </a-button>
            <a-button
              type="primary"
              status="success"
              :disabled="allMultiple"
              :title="allMultiple ? $t('placeholder.search.data') : ''"
              @click="
                handleAppKeyBatch({
                  action: 'all-status',
                  value: 1,
                })
              "
            >
              {{ $t('button.all.enable') }}
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="allMultiple"
              :title="allMultiple ? $t('placeholder.search.data') : ''"
              @click="
                handleAppKeyBatch({
                  action: 'all-status',
                  value: 2,
                })
              "
            >
              {{ $t('button.all.disable') }}
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="allMultiple"
              :title="allMultiple ? $t('placeholder.search.data') : ''"
              @click="
                handleAppKeyBatch({
                  action: 'all-delete',
                })
              "
            >
              {{ $t('button.all.delete') }}
            </a-button>
            <a-button type="primary" @click="handleAppKeyExport({})">
              {{ $t('button.export') }}
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
        <template #name="{ record }">
          {{ record.name || record.key.substr(-5) }}
        </template>
        <template #group_name="{ record }">
          <span v-if="record.group_name">
            {{ record.group_name }}
            <span
              v-if="
                record.group_time_rules && record.group_time_rules.length === 1
              "
            >
              {{ record.group_time_rules[0].discount }}%<a-button
                v-if="hasModelNames(record.group_time_rules)"
                type="text"
                size="small"
                @click="viewTimeRules(record.group_time_rules)"
              >
                {{ $t('button.view') }}
              </a-button>
            </span>
            <span
              v-else-if="
                record.group_time_rules && record.group_time_rules.length > 1
              "
            >
              {{ getDiscountRange(record.group_time_rules)
              }}<a-button
                type="text"
                size="small"
                @click="viewTimeRules(record.group_time_rules)"
              >
                {{ $t('button.view') }}
              </a-button>
            </span>
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
        <template #billing_methods="{ record }">
          {{ $t(`dict.billing_methods.${record.billing_methods || 1}`) }}
        </template>
        <template #quota_expires_at="{ record }">
          {{ record.is_limit_quota ? record.quota_expires_at || '-' : '-' }}
        </template>
        <template #models="{ record }">
          <span v-if="record.models">
            <a-button type="text" size="small" @click="modelsHandle(record.id)">
              {{ $t('button.view') }}
            </a-button>
          </span>
          <span v-else>{{ $t(`common.no_limit`) }}</span>
        </template>
        <template #remark="{ record }">
          {{ record.remark || '-' }}
        </template>
        <template #status="{ record }">
          <a-switch
            v-model="record.status"
            :checked-value="1"
            :unchecked-value="2"
            @change="
              keyChangeStatus({
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
          <a-button type="text" size="small" @click="handleCopy(record.id)">
            {{ $t('button.copy') }}
          </a-button>
          <a-button type="text" size="small" @click="updateKey(record)">
            {{ $t('button.update') }}
          </a-button>
        </template>
      </a-table>

      <a-drawer
        :title="$t('app.key.menu.detail')"
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
              <span class="app-key-list-billing-method-label">
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
                24<span
                  class="app-key-list-hour-label app-key-list-hour-label--wide"
                  >{{ $t('unit.hour') }}</span
                >
              </a-radio>
              <a-radio :value="72">
                72<span
                  class="app-key-list-hour-label app-key-list-hour-label--wide"
                  >{{ $t('unit.hour') }}</span
                >
              </a-radio>
              <a-radio :value="168">
                168<span
                  class="app-key-list-hour-label app-key-list-hour-label--extra-wide"
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
                <span
                  class="app-key-list-day-label app-key-list-day-label--compact"
                  >{{ $t('unit.day') }}</span
                >
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

      <a-modal
        v-model:visible="timeRulesVisible"
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
          <template #model_names="{ record }">
            {{ record.model_names?.join(', ') || $t('common.all') }}
          </template>
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

      <!-- 批量操作 -->
      <a-modal
        v-model:visible="batchVisible"
        :width="726"
        :title="
          batchFormData.action === 'create'
            ? $t('app.key.form.title.batch.create')
            : $t('app.key.form.title.batch.update')
        "
        :body-style="keyConfigModalBodyStyle"
        @cancel="handleBatchCancel"
        @before-ok="handleBatchBeforeOk"
      >
        <a-form
          ref="batchFormRef"
          :model="batchFormData"
          :label-col-props="{ span: 4 }"
        >
          <a-form-item
            v-if="
              batchFormData.action === 'create' &&
              (userRole === 'reseller' || userRole === 'admin')
            "
            field="user_id"
            :label="$t('common.user_id')"
            :rules="[
              {
                required: userRole === 'reseller' || userRole === 'admin',
                message: $t('placeholder.user_id'),
              },
            ]"
          >
            <a-input-number
              v-model="batchFormData.user_id"
              :placeholder="$t('placeholder.user_id')"
              :precision="0"
              :min="1"
            />
          </a-form-item>
          <a-form-item
            v-if="
              batchFormData.action === 'create' &&
              (userRole === 'reseller' || userRole === 'admin')
            "
            field="app_id"
            :label="$t('common.app_id')"
            :rules="[
              {
                required: userRole === 'reseller' || userRole === 'admin',
                message: $t('placeholder.app_id'),
              },
            ]"
          >
            <a-input-number
              v-model="batchFormData.app_id"
              :placeholder="$t('placeholder.app_id')"
              :precision="0"
              :min="1"
            />
          </a-form-item>
          <a-form-item
            v-if="batchFormData.action === 'create' && userRole === 'user'"
            field="app_id"
            :label="$t('common.app')"
            :rules="[
              {
                required: userRole === 'user',
                message: $t('placeholder.app'),
              },
            ]"
          >
            <a-select
              v-model="batchFormData.app_id"
              :placeholder="$t('placeholder.app')"
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
          <a-form-item
            v-if="batchFormData.action === 'create'"
            field="name"
            :label="$t('common.key_name')"
          >
            <a-input
              v-model="batchFormData.name"
              :placeholder="$t('placeholder.key_name')"
            />
          </a-form-item>
          <a-form-item
            v-if="batchFormData.action === 'create'"
            field="n"
            :label="$t('app.key.label.n')"
            :rules="[
              {
                required: true,
                message: $t('app.key.placeholder.n'),
              },
            ]"
          >
            <a-input-number
              v-model="batchFormData.n"
              :placeholder="$t('app.key.placeholder.n')"
              :precision="0"
              :min="1"
              :max="100000"
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
                v-model="batchFormData.billing_methods"
                :value="1"
                disabled
              >
              </a-checkbox>
              <span class="app-key-list-billing-method-label">
                {{ $t('app.key.dict.billing_methods.1') }}
              </span>
              <a-checkbox v-model="batchFormData.billing_methods" :value="2">
                {{ $t('app.key.dict.billing_methods.2') }}
              </a-checkbox>
            </a-space>
          </a-form-item>
          <a-form-item field="models" :label="$t('common.models')">
            <a-tree-select
              v-model="batchFormData.models"
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
            <a-switch v-model="batchFormData.is_limit_quota" />
          </a-form-item>
          <a-form-item
            v-if="batchFormData.is_limit_quota"
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
              v-model="batchFormData.quota"
              :placeholder="$t('app.placeholder.quota')"
              :min="0.000001"
              :max="9999999999999"
              :parser="parsePrice"
              allow-clear
            >
              <template #prefix> {{ appStore.getCurrencySymbol }} </template>
            </a-input-number>
          </a-form-item>
          <a-form-item v-if="batchFormData.is_limit_quota">
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
            v-if="batchFormData.is_limit_quota"
            field="quota_expires_rule"
            :label="$t('app.key.label.quota_expires_rule')"
          >
            <a-space size="large">
              <a-radio
                v-model="batchFormData.quota_expires_rule"
                value="1"
                :default-checked="true"
              >
                {{ $t('dict.quota_expires_rule.1') }}
              </a-radio>
              <a-radio v-model="batchFormData.quota_expires_rule" value="2">
                {{ $t('dict.quota_expires_rule.2') }}
              </a-radio>
            </a-space>
          </a-form-item>
          <a-form-item
            v-if="
              batchFormData.is_limit_quota &&
              batchFormData.quota_expires_rule === '1'
            "
            field="quota_expires_at"
            :label="$t('common.expires_at')"
          >
            <a-date-picker
              v-model="batchFormData.quota_expires_at"
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
                      batchFormData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(1, 'day'),
                },
                {
                  label: '7',
                  value: () =>
                    dayjs(
                      batchFormData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(7, 'day'),
                },
                {
                  label: '15',
                  value: () =>
                    dayjs(
                      batchFormData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(15, 'day'),
                },
                {
                  label: '30',
                  value: () =>
                    dayjs(
                      batchFormData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(30, 'day'),
                },
                {
                  label: '90',
                  value: () =>
                    dayjs(
                      batchFormData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(90, 'day'),
                },
                {
                  label: '180',
                  value: () =>
                    dayjs(
                      batchFormData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(180, 'day'),
                },
                {
                  label: '365',
                  value: () =>
                    dayjs(
                      batchFormData.quota_expires_at ||
                        new Date().setHours(23, 59, 59, 999)
                    ).add(365, 'day'),
                },
              ]"
            />
          </a-form-item>
          <a-form-item
            v-if="
              batchFormData.is_limit_quota &&
              batchFormData.quota_expires_rule === '2'
            "
            field="quota_expires_minutes"
            :label="$t('app.key.label.quota_expires_minutes')"
          >
            <a-input-number
              v-model="batchFormData.quota_expires_minutes"
              :placeholder="$t('app.key.placeholder.quota_expires_minutes')"
              :precision="0"
              :min="1"
              :max="9999999999999"
            >
              <template #append> {{ $t('unit.minute') }} </template>
            </a-input-number>
          </a-form-item>
          <a-form-item
            v-if="batchFormData.is_limit_quota"
            field="is_cycle_reset_quota"
            :label="$t('common.cycle_reset')"
          >
            <a-switch v-model="batchFormData.is_cycle_reset_quota" />
          </a-form-item>
          <a-form-item
            v-if="
              batchFormData.is_cycle_reset_quota && batchFormData.is_limit_quota
            "
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
              v-model="batchFormData.reset_quota"
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
            v-if="
              batchFormData.is_cycle_reset_quota && batchFormData.is_limit_quota
            "
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
            v-if="
              batchFormData.is_cycle_reset_quota && batchFormData.is_limit_quota
            "
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
              v-model="batchFormData.cycle_period"
              :placeholder="$t('placeholder.cycle_period')"
              :precision="0"
              :min="1"
              allow-clear
            >
              <template #append>
                <a-radio-group
                  v-model="batchFormData.period_unit"
                  type="button"
                >
                  <a-radio value="hour"> {{ $t('unit.hour') }} </a-radio>
                  <a-radio value="day"> {{ $t('unit.day') }} </a-radio>
                </a-radio-group>
                <a-radio-group v-model="batchFormData.reset_mode" type="button">
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
              batchFormData.is_cycle_reset_quota &&
              batchFormData.is_limit_quota &&
              batchFormData.period_unit === 'hour'
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
                24<span
                  class="app-key-list-hour-label app-key-list-hour-label--wide"
                  >{{ $t('unit.hour') }}</span
                >
              </a-radio>
              <a-radio :value="72">
                72<span
                  class="app-key-list-hour-label app-key-list-hour-label--wide"
                  >{{ $t('unit.hour') }}</span
                >
              </a-radio>
              <a-radio :value="168">
                168<span
                  class="app-key-list-hour-label app-key-list-hour-label--extra-wide"
                  >{{ $t('unit.hour') }}</span
                >
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="
              batchFormData.is_cycle_reset_quota &&
              batchFormData.is_limit_quota &&
              batchFormData.period_unit === 'day'
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
                <span
                  class="app-key-list-day-label app-key-list-day-label--compact"
                  >{{ $t('unit.day') }}</span
                >
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="is_bind_group" :label="$t('common.bind_group')">
            <a-switch v-model="batchFormData.is_bind_group" />
          </a-form-item>
          <a-form-item
            v-if="batchFormData.is_bind_group"
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
              v-model="batchFormData.group"
              :placeholder="$t('app.key.placeholder.group')"
              :scrollbar="false"
              allow-search
              allow-clear
            >
              <template #label>
                <div
                  v-if="batchSelectedGroup"
                  class="app-form-group-option app-form-group-option--selected"
                >
                  <div class="app-form-group-option--content">
                    <span class="app-form-group-option--name">
                      {{ batchSelectedGroup.name }}
                    </span>
                  </div>
                  <span class="app-form-group-option--discount">
                    {{ getGroupDiscountText(batchSelectedGroup) }}
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
              v-model="batchFormData.ip_whitelist"
              :placeholder="$t('app.placeholder.ip_whitelist')"
              :auto-size="{ minRows: 5, maxRows: 5 }"
            />
          </a-form-item>
          <a-form-item field="ip_blacklist" :label="$t('common.ip_blacklist')">
            <a-textarea
              v-model="batchFormData.ip_blacklist"
              :placeholder="$t('app.placeholder.ip_blacklist')"
              :auto-size="{ minRows: 5, maxRows: 5 }"
            />
          </a-form-item>
          <a-form-item field="remark" :label="$t('common.remark')">
            <a-textarea
              v-model="batchFormData.remark"
              :placeholder="$t('placeholder.remark')"
            />
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal
        v-model:visible="appKeyExportFormVisible"
        :title="$t('app.key.form.title.app_key_export')"
        @cancel="appKeyExportHandleCancel"
        @before-ok="appKeyExportHandleBeforeOk"
      >
        <a-form ref="appKeyExportForm" :model="appKeyExportFormData">
          <a-form-item
            v-if="userRole === 'reseller' || userRole === 'admin'"
            field="user_id"
            :label="$t('common.user_id')"
          >
            <a-input-number
              v-model="appKeyExportFormData.user_id"
              :placeholder="$t('placeholder.user_id')"
              :precision="0"
              :min="1"
              allow-clear
            />
          </a-form-item>
          <a-form-item
            v-if="userRole === 'reseller' || userRole === 'admin'"
            field="app_id"
            :label="$t('common.app_id')"
          >
            <a-input-number
              v-model="appKeyExportFormData.app_id"
              :placeholder="$t('placeholder.app_id')"
              :precision="0"
              :min="1"
              allow-clear
            />
          </a-form-item>
          <a-form-item
            v-if="userRole === 'user'"
            field="app_id"
            :label="$t('common.app')"
          >
            <a-select
              v-model="appKeyExportFormData.app_id"
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
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import dayjs from 'dayjs';
  import { FormInstance, Message, Modal } from '@arco-design/web-vue';
  import { disabledDate, parsePrice } from '@/utils/common';
  import { queryAppList, AppList } from '@/api/app';
  import {
    queryAppKeyPage,
    AppKeyPage,
    AppKeyPageParams,
    AppKeyChangeStatus,
    submitAppKeyChangeStatus,
    queryAppKeyDetail,
    submitAppKeyConfig,
    AppKeyConfig,
    AppKeyExportParams,
    submitAppKeyExport,
    AppKeyBatchOperate,
    submitAppKeyBatchOperate,
  } from '@/api/app_key';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { useAppStore } from '@/store';
  import { queryModelList, ModelList, queryModelTree, Tree } from '@/api/model';
  import { queryGroupList, GroupList } from '@/api/group';
  import type { TimeRule } from '@/api/common';
  import { useClipboard } from '@vueuse/core';
  import Models from '@/views/common/models.vue';
  import Quota from '@/views/common/quota.vue';
  import Detail from '../detail/index.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const route = useRoute();
  const appStore = useAppStore();

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
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
      type: 1,
      user_id: ref(),
      app_id: ref(),
      key: '',
      models: [],
      quota: ref(),
      quota_expires_at: [],
      status: ref(),
    };
  };

  const renderData = ref<AppKeyPage[]>([]);
  const searchFormData = ref(generateSearchParams());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');
  const ids = ref<Array<string>>([]);
  const multiple = ref(true);
  const allMultiple = ref(true);
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
      title: t('common.key_name'),
      dataIndex: 'name',
      slotName: 'name',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.groups'),
      dataIndex: 'group_name',
      slotName: 'group_name',
      align: 'center',
      width: 220,
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
      title: t('common.billing_methods'),
      dataIndex: 'billing_methods',
      slotName: 'billing_methods',
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
      title: t('common.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
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
      width: 160,
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
    params: AppKeyPageParams = {
      ...basePagination,
      type: 1,
      app_id: route.query.app_id,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryAppKeyPage(params);
      renderData.value = data.items;
      pagination.current = params.current;
      pagination.pageSize = params.pageSize;
      pagination.total = data.paging.total;
      if (
        data.items.length > 0 &&
        (searchFormData.value.user_id ||
          searchFormData.value.app_id ||
          searchFormData.value.key ||
          searchFormData.value.models.length > 0 ||
          searchFormData.value.quota ||
          searchFormData.value.status ||
          (searchFormData.value.quota_expires_at &&
            searchFormData.value.quota_expires_at.length > 0))
      ) {
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
      ...basePagination,
      ...searchFormData.value,
    } as unknown as AppKeyPageParams);
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

  const apps = ref<AppList[]>([]);

  const getAppList = async () => {
    try {
      const { data } = await queryAppList();
      apps.value = data.items;
      if (route.query.app_id) {
        searchFormData.value.app_id = Number(route.query.app_id);
      }
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

  const batchSelectedGroup = computed(() =>
    groups.value.find((item) => item.id === batchFormData.value.group)
  );

  const getDiscountRange = (rules: any[]) => {
    const discounts = rules.map((r: any) => r.discount);
    const min = Math.min(...discounts);
    const max = Math.max(...discounts);
    return `${min}%~${max}%`;
  };

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
          width: 100,
        },
        {
          title: t('common.discount'),
          slotName: 'discount',
          align: 'center',
          width: 100,
        },
        {
          title: t('time_rule.label.time_range'),
          slotName: 'time_range',
          align: 'center',
          width: 100,
        },
        {
          title: t('time_rule.label.days'),
          slotName: 'days',
          align: 'center',
          width: 100,
        },
        {
          title: t('time_rule.label.priority'),
          dataIndex: 'priority',
          titleSlotName: 'priority_title',
          align: 'center',
          width: 100,
        },
        {
          title: t('common.model'),
          slotName: 'model_names',
          align: 'center',
          width: 100,
          ellipsis: true,
          tooltip: true,
        },
      ],
    },
  ]);

  const hasModelNames = (rules: TimeRule[]) => {
    return rules.some((r) => r.model_names?.length);
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

  const formatDays = (rule: TimeRule) => {
    if (!rule.days || rule.days.length === 0) return t('common.all');
    if (rule.day_mode === 'month') {
      return rule.days
        .map((d: number) => `${d}${t('time_rule.label.day_suffix')}`)
        .join(', ');
    }
    return rule.days
      .map((d: number) => t(`time_rule.dict.week.${d}`))
      .join(', ');
  };

  const timeRulesVisible = ref(false);
  const timeRulesData = ref<TimeRule[]>([]);

  const viewTimeRules = (rules: TimeRule[]) => {
    timeRulesData.value = rules;
    timeRulesVisible.value = true;
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

  const keyChangeStatus = async (params: AppKeyChangeStatus) => {
    setLoading(true);
    try {
      await submitAppKeyChangeStatus(params);
      Message.success(t('success.operate'));
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const visible = ref(false);
  const batchVisible = ref(false);

  const formRef = ref<FormInstance>();
  const batchFormRef = ref<FormInstance>();
  const formData = ref<AppKeyConfig>({} as AppKeyConfig);
  const batchFormData = ref<AppKeyBatchOperate>({
    billing_methods: [1],
    quota_expires_rule: '1',
    period_unit: 'day',
    reset_mode: 'natural',
  } as AppKeyBatchOperate);

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.quota = quota;
    batchFormData.value.quota = quota;
  };

  interface AppKeyConfigView {
    id: string;
    name: string;
    key: string;
    billing_methods: number[];
    models: string[];
    is_limit_quota: boolean;
    quota: number;
    quota_expires_rule: string;
    quota_expires_at: string;
    quota_expires_minutes: any;
    is_cycle_reset_quota: boolean;
    reset_quota: number;
    cycle_period: number;
    period_unit: string;
    reset_mode: string;
    is_bind_group: boolean;
    group: string;
    ip_whitelist: string[];
    ip_blacklist: string[];
    remark: string;
  }

  const updateKey = async (params: AppKeyConfigView) => {
    formData.value.id = params.id;
    formData.value.name = params.name;
    formData.value.key = params.key;
    formData.value.billing_methods = params.billing_methods || [1];
    formData.value.models = params.models;
    formData.value.is_limit_quota = params.is_limit_quota;
    formData.value.quota = params.quota;
    formData.value.quota_expires_rule = params.quota_expires_rule
      ? String(params.quota_expires_rule)
      : '1';
    formData.value.quota_expires_at = params.quota_expires_at;
    formData.value.quota_expires_minutes = params.quota_expires_minutes;
    formData.value.is_cycle_reset_quota = params.is_cycle_reset_quota;
    formData.value.reset_quota = params.reset_quota;
    formData.value.cycle_period = params.cycle_period;
    formData.value.period_unit = params.period_unit || 'day';
    formData.value.reset_mode = params.reset_mode || 'natural';
    formData.value.is_bind_group = params.is_bind_group;
    formData.value.group = params.group;
    formData.value.ip_whitelist = params.ip_whitelist?.join('\n') || '';
    formData.value.ip_blacklist = params.ip_blacklist?.join('\n') || '';
    formData.value.remark = params.remark;
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
      const { data } = await submitAppKeyConfig(formData.value);
      navigator.clipboard.writeText(data.key);
      Message.success(t('app.key.success.save'));
      done();
      search();
    } catch (err) {
      done(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    visible.value = false;
  };

  const handleBatchBeforeOk = async (done: any) => {
    const res = await batchFormRef.value?.validate();
    if (res) {
      batchVisible.value = true;
      done(false);
      return;
    }

    setLoading(true);
    if (batchFormData.value.quota_expires_rule === '1') {
      batchFormData.value.quota_expires_minutes = '';
    }
    if (batchFormData.value.quota_expires_rule === '2') {
      batchFormData.value.quota_expires_at = '';
    }
    try {
      batchFormData.value.ids = ids.value;
      batchFormData.value.query_params = {};
      batchFormData.value.query_params.user_id = searchFormData.value.user_id;
      batchFormData.value.query_params.app_id = searchFormData.value.app_id;
      batchFormData.value.query_params.key = searchFormData.value.key;
      batchFormData.value.query_params.models = searchFormData.value.models;
      batchFormData.value.query_params.quota = searchFormData.value.quota;
      batchFormData.value.query_params.quota_expires_at =
        searchFormData.value.quota_expires_at;
      batchFormData.value.query_params.status = searchFormData.value.status;
      const { data } = await submitAppKeyBatchOperate(batchFormData.value);
      navigator.clipboard.writeText(data.keys);
      if (batchFormData.value.action === 'create') {
        Message.success(t('app.success.create'));
      } else {
        Message.success(t('success.task'));
      }
      done();
      search();
      tableRef.value.selectAll(false);
    } catch (err) {
      done(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchCancel = () => {
    batchVisible.value = false;
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
  const handleBatch = (params: AppKeyBatchOperate) => {
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
          submitAppKeyBatchOperate(params).then((res) => {
            setLoading(false);
            Message.success(t('success.operate'));
            search();
            tableRef.value.selectAll(false);
          });
        },
      });
    }
  };

  const handleAppKeyBatch = (params: AppKeyBatchOperate) => {
    batchFormData.value.action = params.action;
    if (
      allMultiple.value &&
      ids.value.length === 0 &&
      params.action !== 'create'
    ) {
      Message.info(t('placeholder.operation.data'));
    } else {
      let alertContent = t('placeholder.batch.operation', {
        count: ids.value.length,
      });
      switch (params.action) {
        case 'create':
          batchFormData.value = {
            billing_methods: [1],
            quota_expires_rule: '1',
            period_unit: 'day',
            reset_mode: 'natural',
          } as AppKeyBatchOperate;
          batchFormData.value.action = params.action;
          batchFormData.value.n = 1;
          batchVisible.value = true;
          return;
        case 'update':
          batchFormData.value = {
            billing_methods: [1],
            quota_expires_rule: '1',
            period_unit: 'day',
            reset_mode: 'natural',
          } as AppKeyBatchOperate;
          batchFormData.value.action = params.action;
          batchVisible.value = true;
          return;
        case 'all-update':
          batchFormData.value = {
            billing_methods: [1],
            quota_expires_rule: '1',
            period_unit: 'day',
            reset_mode: 'natural',
          } as AppKeyBatchOperate;
          batchFormData.value.action = params.action;
          batchVisible.value = true;
          return;
        case 'all-status':
          if (params.value === 1) {
            alertContent = t('placeholder.batch.operation.all.enable', {
              count: pagination.total,
            });
          } else {
            alertContent = t('placeholder.batch.operation.all.disable', {
              count: pagination.total,
            });
          }
          break;
        case 'all-delete':
          alertContent = t('placeholder.batch.operation.all.delete', {
            count: pagination.total,
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
          params.query_params = {};
          params.query_params.user_id = searchFormData.value.user_id;
          params.query_params.app_id = searchFormData.value.app_id;
          params.query_params.key = searchFormData.value.key;
          params.query_params.models = searchFormData.value.models;
          params.query_params.quota = searchFormData.value.quota;
          params.query_params.quota_expires_at =
            searchFormData.value.quota_expires_at;
          params.query_params.status = searchFormData.value.status;
          submitAppKeyBatchOperate({ ...params, ...searchFormData.value }).then(
            (res) => {
              setLoading(false);
              Message.success(t('success.task'));
              search();
              tableRef.value.selectAll(false);
            }
          );
        },
      });
    }
  };

  /**
   * 复制内容
   *
   * @param content 内容
   */
  const { copy, copied } = useClipboard();
  const handleCopy = async (id: string) => {
    const { data } = await queryAppKeyDetail({ id });
    copy(data.key);
  };

  watch(copied, () => {
    if (copied.value) {
      Message.success(t('app.key.success.copy'));
    }
  });

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
    action.value = 'app_key';
  };

  const appKeyExportForm = ref<FormInstance>();
  const appKeyExportFormVisible = ref(false);
  const appKeyExportFormData = ref<AppKeyExportParams>(
    {} as AppKeyExportParams
  );

  const appKeyExportHandleBeforeOk = async (done: any) => {
    const res = await appKeyExportForm.value?.validate();
    if (res) {
      appKeyExportFormVisible.value = true;
      done(false);
      return;
    }
    done();
    handleAppKeyExport(appKeyExportFormData.value);
  };

  const appKeyExportHandleCancel = () => {
    appKeyExportFormVisible.value = false;
  };

  /**
   * 导出操作
   */
  const handleAppKeyExport = (params: AppKeyExportParams) => {
    if (!appKeyExportFormVisible.value && ids.value.length === 0) {
      appKeyExportFormVisible.value = true;
      return;
    }

    setLoading(true);
    params.ids = ids.value;
    submitAppKeyExport(params)
      .then((res) => {
        setLoading(false);
        Message.success(t('success.export'));
        tableRef.value.selectAll(false);
        // 创建一个新的Blob对象，使用后端返回的文件流
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });

        // 创建一个指向该Blob的URL
        const url = window.URL.createObjectURL(blob);

        // 创建一个a标签用于下载文件
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${t('app.key.menu')}.xlsx`); // 设置下载文件名
        document.body.appendChild(link);

        // 触发a标签的点击事件，开始下载
        link.click();

        // 清理并释放资源
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        Message.error(t('error.export'), error);
      });
  };

  const handleResetQuotaQuickChange = (quota: number) => {
    formData.value.reset_quota = quota;
    batchFormData.value.reset_quota = quota;
  };

  const handleCyclePeriodQuickChange = (cyclePeriod: number) => {
    formData.value.cycle_period = cyclePeriod;
    batchFormData.value.cycle_period = cyclePeriod;
  };
</script>

<script lang="ts">
  export default {
    name: 'AppKeyList',
  };
</script>

<style scoped lang="less">
  @import '../../app/style/app-form-shared.less';
  // 公共骨架已由 page-list.less 全局提供

  .app-key-list-billing-method-label {
    margin-left: -15px;
  }

  .app-key-list-hour-label {
    &--wide {
      margin-left: 3px;
    }

    &--extra-wide {
      margin-left: 4px;
    }
  }

  .app-key-list-day-label {
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

  .priority-tooltip {
    cursor: pointer;
    color: var(--color-text-3);
  }
</style>
