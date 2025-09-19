<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-safe />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.key.app') }}</a-breadcrumb-item>
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
            :model="formData"
            :label-col-props="{ span: 5 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col v-permission="['reseller', 'admin']" :span="8">
                <a-form-item field="user_id" :label="$t('key.form.userId')">
                  <a-input-number
                    v-model="formData.user_id"
                    :placeholder="$t('key.form.userId.placeholder')"
                    :precision="0"
                    :min="1"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['reseller', 'admin']" :span="8">
                <a-form-item field="app_id" :label="$t('key.form.appId')">
                  <a-input-number
                    v-model="formData.app_id"
                    :placeholder="$t('key.form.appId.placeholder')"
                    :precision="0"
                    :min="1"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['user']" :span="8">
                <a-form-item field="app_id" :label="$t('key.form.app')">
                  <a-select
                    v-model="formData.app_id"
                    :placeholder="$t('key.form.selectDefault')"
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
              <a-col :span="8">
                <a-form-item field="key" :label="$t('key.form.appkey')">
                  <a-input
                    v-model="formData.key"
                    :placeholder="$t('key.form.appkey.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col v-permission="['user']" :span="8">
                <a-form-item field="models" :label="$t('key.form.app.models')">
                  <a-select
                    v-model="formData.models"
                    :placeholder="$t('key.form.selectDefault')"
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
                <a-form-item field="quota" :label="$t('key.form.quota')">
                  <a-input-number
                    v-model="formData.quota"
                    :placeholder="$t('key.form.quota.placeholder')"
                    :min="0.000001"
                    :max="9999999999999"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('key.form.status')">
                  <a-select
                    v-model="formData.status"
                    :placeholder="$t('key.form.selectDefault')"
                    :options="statusOptions"
                    :scrollbar="false"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="quota_expires_at"
                  :label="$t('key.form.quota_expires_at')"
                >
                  <a-range-picker
                    v-model="formData.quota_expires_at"
                    style="width: 100%"
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
              {{ $t('key.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('key.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0; margin-bottom: 16px" />
      <a-row style="margin-bottom: 16px">
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
              {{ $t('key.operation.create') }}
            </a-button>
            <a-button
              type="primary"
              status="warning"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleAppKeyBatch({
                  action: 'update',
                })
              "
            >
              修改
            </a-button>
            <a-button
              type="primary"
              status="success"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'status',
                  value: 1,
                })
              "
            >
              启用
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'status',
                  value: 2,
                })
              "
            >
              禁用
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="multiple"
              :title="multiple ? '请选择要操作的数据' : ''"
              @click="
                handleBatch({
                  action: 'delete',
                })
              "
            >
              删除
            </a-button>
            <a-button
              type="primary"
              status="warning"
              :disabled="allMultiple"
              :title="allMultiple ? '请查询要操作的数据' : ''"
              @click="
                handleAppKeyBatch({
                  action: 'all-update',
                })
              "
            >
              全部修改
            </a-button>
            <a-button
              type="primary"
              status="success"
              :disabled="allMultiple"
              :title="allMultiple ? '请查询要操作的数据' : ''"
              @click="
                handleAppKeyBatch({
                  action: 'all-status',
                  value: 1,
                })
              "
            >
              全部启用
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="allMultiple"
              :title="allMultiple ? '请查询要操作的数据' : ''"
              @click="
                handleAppKeyBatch({
                  action: 'all-status',
                  value: 2,
                })
              "
            >
              全部禁用
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="allMultiple"
              :title="allMultiple ? '请查询要操作的数据' : ''"
              @click="
                handleAppKeyBatch({
                  action: 'all-delete',
                })
              "
            >
              全部删除
            </a-button>
            <a-button type="primary" @click="handleAppKeyExport({})">
              导出
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="
            display: flex;
            height: 32px;
            align-items: center;
            justify-content: end;
          "
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
        <template #key="{ record }">
          {{ record.key.substr(0, 10) + record.key.substr(-10) }}
          <icon-copy class="copy-btn" @click="handleCopy(record.id)" />
        </template>
        <template #quota="{ record }">
          <span v-if="record.is_limit_quota">
            {{
              record.quota > 0
                ? `$${quotaConv(record.quota)}`
                : record.quota < 0
                ? `-$${quotaConv(-record.quota)}`
                : '$0.00'
            }}
          </span>
          <span v-else>{{ $t(`key.columns.quota.no_limit`) }}</span>
        </template>
        <template #used_quota="{ record }">
          ${{ record.used_quota > 0 ? quotaConv(record.used_quota) : '0.00' }}
        </template>
        <template #quota_expires_at="{ record }">
          {{ record.is_limit_quota ? record.quota_expires_at || '-' : '-' }}
        </template>
        <template #models="{ record }">
          <span v-if="record.models">
            <a-button type="text" size="small" @click="modelsHandle(record.id)">
              查看
            </a-button>
          </span>
          <span v-else>{{ $t(`key.columns.app.models.no_limit`) }}</span>
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
                id: `${record.id}`,
                status: Number(`${record.status}`),
              })
            "
          />
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="detailHandle(record.id)">
            {{ $t('key.columns.operations.view') }}
          </a-button>
          <a-button type="text" size="small" @click="updateKey(record)">
            {{ $t('key.columns.operations.update') }}
          </a-button>
          <a-popconfirm
            content="你确定要删除吗?"
            @ok="keyDelete({ id: `${record.id}` })"
          >
            <a-button type="text" size="small">
              {{ $t('key.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>

      <a-drawer
        :title="$t('menu.key.detail')"
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
        :width="600"
        :title="$t('app.form.title.keyConfig')"
        :ok-text="$t('button.save')"
        :body-style="{ height: '520px' }"
        @cancel="handleCancel"
        @before-ok="handleBeforeOk"
      >
        <a-form ref="formRef" :model="formData">
          <a-form-item field="key" :label="$t('app.label.key')">
            <a-input
              v-model="formData.key"
              :placeholder="$t('app.placeholder.key')"
              readonly
            />
          </a-form-item>
          <a-form-item field="models" :label="$t('app.label.models')">
            <a-tree-select
              v-model="formData.models"
              :placeholder="$t('app.placeholder.key.models')"
              :allow-search="true"
              :allow-clear="true"
              :tree-checkable="true"
              :data="treeData"
              :max-tag-count="3"
              :scrollbar="false"
              tree-checked-strategy="child"
            />
          </a-form-item>
          <a-form-item
            field="is_limit_quota"
            :label="$t('app.label.isLimitQuota')"
          >
            <a-switch v-model="formData.is_limit_quota" />
          </a-form-item>
          <a-form-item
            v-if="formData.is_limit_quota"
            field="quota"
            :label="$t('app.label.quota')"
            :rules="[
              {
                required: true,
                message: $t('app.error.quota.required'),
              },
            ]"
          >
            <a-input-number
              v-model="formData.quota"
              :placeholder="$t('app.placeholder.quota')"
              :precision="0"
              :min="0"
              :max="9999999999999"
              style="margin-right: 10px"
            />
            <div>
              ${{ formData.quota ? quotaConv(formData.quota) : '0.00' }}</div
            >
          </a-form-item>
          <a-form-item v-if="formData.is_limit_quota">
            <a-radio-group
              type="button"
              @change="handleQuotaQuickChange as any"
            >
              <a-radio :value="1"> $1 </a-radio>
              <a-radio :value="5"> $5 </a-radio>
              <a-radio :value="10"> $10 </a-radio>
              <a-radio :value="20"> $20 </a-radio>
              <a-radio :value="100"> $100 </a-radio>
              <a-radio :value="500"> $500 </a-radio>
              <a-radio :value="1000"> $1000 </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="formData.is_limit_quota"
            field="quota_expires_rule"
            :label="$t('app.label.quota_expires_rule')"
          >
            <a-space size="large">
              <a-radio
                v-model="formData.quota_expires_rule"
                value="1"
                :default-checked="true"
              >
                固定
              </a-radio>
              <a-radio v-model="formData.quota_expires_rule" value="2"
                >时长</a-radio
              >
            </a-space>
          </a-form-item>
          <a-form-item
            v-if="
              formData.is_limit_quota && formData.quota_expires_rule === '1'
            "
            field="quota_expires_at"
            :label="$t('app.label.quota_expires_at')"
          >
            <a-date-picker
              v-model="formData.quota_expires_at"
              :placeholder="$t('app.placeholder.quota_expires_at')"
              :time-picker-props="{ defaultValue: '23:59:59' }"
              :disabled-date="
                (current) => dayjs(current).isBefore(dayjs().subtract(1, 'day'))
              "
              style="width: 100%"
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
            :label="$t('app.label.quota_expires_minutes')"
          >
            <a-input-number
              v-model="formData.quota_expires_minutes"
              :placeholder="$t('app.placeholder.quota_expires_minutes')"
              :precision="0"
              :min="1"
              :max="9999999999999"
            />
          </a-form-item>
          <a-form-item
            field="is_bind_group"
            :label="$t('app.label.is_bind_group')"
          >
            <a-switch v-model="formData.is_bind_group" />
          </a-form-item>
          <a-form-item
            v-if="formData.is_bind_group"
            field="group"
            :label="$t('app.label.group')"
            :rules="[
              {
                required: true,
                message: $t('app.error.group.required'),
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
              <a-option
                v-for="item in groups"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </a-select>
          </a-form-item>
          <a-form-item
            field="ip_whitelist"
            :label="$t('app.label.ip_whitelist')"
          >
            <a-textarea
              v-model="formData.ip_whitelist"
              :placeholder="$t('app.placeholder.ip_whitelist')"
              :auto-size="{ minRows: 5, maxRows: 5 }"
            />
          </a-form-item>
          <a-form-item
            field="ip_blacklist"
            :label="$t('app.label.ip_blacklist')"
          >
            <a-textarea
              v-model="formData.ip_blacklist"
              :placeholder="$t('app.placeholder.ip_blacklist')"
              :auto-size="{ minRows: 5, maxRows: 5 }"
            />
          </a-form-item>
          <a-form-item field="remark" :label="$t('common.remark')">
            <a-textarea
              v-model="formData.remark"
              :placeholder="$t('app.placeholder.remark')"
            />
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 模型权限 -->
      <a-modal
        v-model:visible="modelsVisible"
        :title="$t('common.models')"
        :modal-style="{
          padding: '25px 15px 20px 15px',
        }"
        unmount-on-close
        hide-cancel
        simple
        width="1080px"
        ok-text="关闭"
      >
        <Models :id="recordId" :action="action" />
      </a-modal>

      <!-- 批量操作 -->
      <a-modal
        v-model:visible="batchVisible"
        :width="600"
        :title="$t('app.form.title.batch.create')"
        :body-style="{ height: '520px' }"
        @cancel="handleBatchCancel"
        @before-ok="handleBatchBeforeOk"
      >
        <a-form ref="batchFormRef" :model="batchFormData">
          <a-form-item
            v-if="
              batchFormData.action === 'create' &&
              (userRole === 'reseller' || userRole === 'admin')
            "
            field="user_id"
            :label="$t('app.label.user_id')"
            :rules="[
              {
                required: userRole === 'reseller' || userRole === 'admin',
                message: $t('app.error.user_id.required'),
              },
            ]"
          >
            <a-input-number
              v-model="batchFormData.user_id"
              :placeholder="$t('app.placeholder.user_id')"
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
            :label="$t('app.label.app_id')"
            :rules="[
              {
                required: userRole === 'reseller' || userRole === 'admin',
                message: $t('app.error.app_id.required'),
              },
            ]"
          >
            <a-input-number
              v-model="batchFormData.app_id"
              :placeholder="$t('app.placeholder.app_id')"
              :precision="0"
              :min="1"
            />
          </a-form-item>
          <a-form-item
            v-if="batchFormData.action === 'create' && userRole === 'user'"
            field="app_id"
            :label="$t('key.form.app')"
            :rules="[
              {
                required: userRole === 'user',
                message: $t('app.error.app.required'),
              },
            ]"
          >
            <a-select
              v-model="batchFormData.app_id"
              :placeholder="$t('app.placeholder.app')"
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
            field="n"
            :label="$t('app.label.n')"
            :rules="[
              {
                required: true,
                message: $t('app.error.n.required'),
              },
            ]"
          >
            <a-input-number
              v-model="batchFormData.n"
              :placeholder="$t('app.placeholder.n')"
              :precision="0"
              :min="1"
              :max="100000"
            />
          </a-form-item>
          <a-form-item field="models" :label="$t('app.label.models')">
            <a-tree-select
              v-model="batchFormData.models"
              :placeholder="$t('app.placeholder.key.models')"
              :allow-search="true"
              :allow-clear="true"
              :tree-checkable="true"
              :data="treeData"
              :max-tag-count="3"
              :scrollbar="false"
              tree-checked-strategy="child"
            />
          </a-form-item>
          <a-form-item
            field="is_limit_quota"
            :label="$t('app.label.isLimitQuota')"
          >
            <a-switch v-model="batchFormData.is_limit_quota" />
          </a-form-item>
          <a-form-item
            v-if="batchFormData.is_limit_quota"
            field="quota"
            :label="$t('app.label.quota')"
            :rules="[
              {
                required: true,
                message: $t('app.error.quota.required'),
              },
            ]"
          >
            <a-input-number
              v-model="batchFormData.quota"
              :placeholder="$t('app.placeholder.quota')"
              :precision="0"
              :min="0"
              :max="9999999999999"
              style="margin-right: 10px"
            />
            <div>
              ${{
                batchFormData.quota ? quotaConv(batchFormData.quota) : '0.00'
              }}</div
            >
          </a-form-item>
          <a-form-item v-if="batchFormData.is_limit_quota">
            <a-radio-group
              type="button"
              @change="handleQuotaQuickChange as any"
            >
              <a-radio :value="1"> $1 </a-radio>
              <a-radio :value="5"> $5 </a-radio>
              <a-radio :value="10"> $10 </a-radio>
              <a-radio :value="20"> $20 </a-radio>
              <a-radio :value="100"> $100 </a-radio>
              <a-radio :value="500"> $500 </a-radio>
              <a-radio :value="1000"> $1000 </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="batchFormData.is_limit_quota"
            field="quota_expires_rule"
            :label="$t('app.label.quota_expires_rule')"
          >
            <a-space size="large">
              <a-radio
                v-model="batchFormData.quota_expires_rule"
                value="1"
                :default-checked="true"
              >
                固定
              </a-radio>
              <a-radio v-model="batchFormData.quota_expires_rule" value="2"
                >时长</a-radio
              >
            </a-space>
          </a-form-item>
          <a-form-item
            v-if="
              batchFormData.is_limit_quota &&
              batchFormData.quota_expires_rule === '1'
            "
            field="quota_expires_at"
            :label="$t('app.label.quota_expires_at')"
          >
            <a-date-picker
              v-model="batchFormData.quota_expires_at"
              :placeholder="$t('app.placeholder.quota_expires_at')"
              :time-picker-props="{ defaultValue: '23:59:59' }"
              :disabled-date="
                (current) => dayjs(current).isBefore(dayjs().subtract(1, 'day'))
              "
              style="width: 100%"
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
            :label="$t('app.label.quota_expires_minutes')"
          >
            <a-input-number
              v-model="batchFormData.quota_expires_minutes"
              :placeholder="$t('app.placeholder.quota_expires_minutes')"
              :precision="0"
              :min="1"
              :max="9999999999999"
            />
          </a-form-item>
          <a-form-item
            field="is_bind_group"
            :label="$t('app.label.is_bind_group')"
          >
            <a-switch v-model="batchFormData.is_bind_group" />
          </a-form-item>
          <a-form-item
            v-if="batchFormData.is_bind_group"
            field="group"
            :label="$t('app.label.group')"
            :rules="[
              {
                required: true,
                message: $t('app.error.group.required'),
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
              <a-option
                v-for="item in groups"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </a-select>
          </a-form-item>
          <a-form-item
            field="ip_whitelist"
            :label="$t('app.label.ip_whitelist')"
          >
            <a-textarea
              v-model="batchFormData.ip_whitelist"
              :placeholder="$t('app.placeholder.ip_whitelist')"
              :auto-size="{ minRows: 5, maxRows: 5 }"
            />
          </a-form-item>
          <a-form-item
            field="ip_blacklist"
            :label="$t('app.label.ip_blacklist')"
          >
            <a-textarea
              v-model="batchFormData.ip_blacklist"
              :placeholder="$t('app.placeholder.ip_blacklist')"
              :auto-size="{ minRows: 5, maxRows: 5 }"
            />
          </a-form-item>
          <a-form-item field="remark" :label="$t('common.remark')">
            <a-textarea
              v-model="batchFormData.remark"
              :placeholder="$t('app.placeholder.remark')"
            />
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal
        v-model:visible="appKeyExportFormVisible"
        :title="$t('app.form.title.app_key_export')"
        @cancel="appKeyExportHandleCancel"
        @before-ok="appKeyExportHandleBeforeOk"
      >
        <a-form ref="appKeyExportForm" :model="appKeyExportFormData">
          <a-form-item
            v-if="userRole === 'reseller' || userRole === 'admin'"
            field="user_id"
            :label="$t('app.form.userId')"
          >
            <a-input-number
              v-model="appKeyExportFormData.user_id"
              :placeholder="$t('app.form.userId.placeholder')"
              :precision="0"
              :min="1"
              allow-clear
            />
          </a-form-item>
          <a-form-item
            v-if="userRole === 'reseller' || userRole === 'admin'"
            field="app_id"
            :label="$t('app.form.appId')"
          >
            <a-input-number
              v-model="appKeyExportFormData.app_id"
              :placeholder="$t('app.form.appId.placeholder')"
              :precision="0"
              :min="1"
              allow-clear
            />
          </a-form-item>
          <a-form-item
            v-if="userRole === 'user'"
            field="app_id"
            :label="$t('key.form.app')"
          >
            <a-select
              v-model="appKeyExportFormData.app_id"
              :placeholder="$t('key.form.selectDefault')"
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
  import {
    computed,
    ref,
    reactive,
    watch,
    nextTick,
    getCurrentInstance,
  } from 'vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import dayjs from 'dayjs';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { quotaConv } from '@/utils/common';
  import { queryAppList, AppList } from '@/api/app';
  import {
    queryAppKeyPage,
    AppKeyPage,
    AppKeyPageParams,
    submitAppKeyDelete,
    AppKeyDeleteParams,
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
  import { queryModelList, ModelList, queryModelTree, Tree } from '@/api/model';
  import { queryGroupList, GroupList } from '@/api/group';
  import { Message } from '@arco-design/web-vue';
  import { useClipboard } from '@vueuse/core';
  import Models from '@/views/common/models.vue';
  import Detail from '../detail/index.vue';

  const { proxy } = getCurrentInstance() as any;
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const route = useRoute();

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
      if (route.query.app_id) {
        formData.value.app_id = Number(route.query.app_id);
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
    setLoading(true);
    try {
      const { data } = await queryModelTree();
      treeData.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelTree();

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

  const keyDelete = async (params: AppKeyDeleteParams) => {
    setLoading(true);
    try {
      await submitAppKeyDelete(params);
      proxy.$message.success('删除成功');
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const generateFormModel = () => {
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
  const formData = ref(generateFormModel());
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
      title: t('key.columns.user_id'),
      dataIndex: 'user_id',
      slotName: 'user_id',
      align: 'center',
      width: 80,
    },
    {
      title: t('key.columns.app_id'),
      dataIndex: 'app_id',
      slotName: 'app_id',
      align: 'center',
      width: 80,
    },
    {
      title: t('key.columns.key'),
      dataIndex: 'key',
      slotName: 'key',
      align: 'center',
      width: 220,
    },
    {
      title: t('key.columns.quota'),
      dataIndex: 'quota',
      slotName: 'quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('key.columns.used_quota'),
      dataIndex: 'used_quota',
      slotName: 'used_quota',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('key.columns.quota_expires_at'),
      dataIndex: 'quota_expires_at',
      slotName: 'quota_expires_at',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('key.columns.app.models'),
      dataIndex: 'models',
      slotName: 'models',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('key.columns.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('key.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 65,
    },
    // {
    //   title: t('key.columns.updated_at'),
    //   dataIndex: 'updated_at',
    //   slotName: 'updated_at',
    //   align: 'center',
    //   width: 132,
    // },
    {
      title: t('key.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
      width: 170,
    },
  ]);

  const userRole = localStorage.getItem('userRole');
  if (userRole === 'user') {
    columns.value.splice(0, 1);
  }

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('key.dict.status.1'),
      value: 1,
    },
    {
      label: t('key.dict.status.2'),
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
        (formData.value.user_id ||
          formData.value.app_id ||
          formData.value.key ||
          formData.value.models.length > 0 ||
          formData.value.quota ||
          formData.value.status ||
          (formData.value.quota_expires_at &&
            formData.value.quota_expires_at.length > 0))
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

  const search = () => {
    fetchData({
      ...basePagination,
      ...formData.value,
    } as unknown as AppKeyPageParams);
  };

  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, ...formData.value, current });
  };

  const onPageSizeChange = (pageSize: number) => {
    basePagination.pageSize = pageSize;
    fetchData({ ...basePagination, ...formData.value });
  };

  fetchData();

  const reset = () => {
    formData.value = generateFormModel();
    search();
  };

  const keyChangeStatus = async (params: AppKeyChangeStatus) => {
    setLoading(true);
    try {
      await submitAppKeyChangeStatus(params);
      proxy.$message.success('操作成功');
      search();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
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
  const batchVisible = ref(false);

  const formRef = ref<FormInstance>();
  const batchFormRef = ref<FormInstance>();
  const formData = ref<AppKeyConfig>({} as AppKeyConfig);
  const batchFormData = ref<AppKeyBatchOperate>({} as AppKeyBatchOperate);

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.quota = quota * 500000;
    batchFormData.value.quota = quota * 500000;
  };

  interface AppKeyConfigView {
    id: string;
    key: string;
    models: string[];
    is_limit_quota: boolean;
    quota: number;
    quota_expires_rule: string;
    quota_expires_at: string;
    quota_expires_minutes: any;
    is_bind_group: boolean;
    group: string;
    ip_whitelist: string[];
    ip_blacklist: string[];
    remark: string;
  }

  const updateKey = async (params: AppKeyConfigView) => {
    setLoading(true);
    try {
      formData.value.id = params.id;
      formData.value.key = params.key;
      formData.value.models = params.models;
      formData.value.is_limit_quota = params.is_limit_quota;
      formData.value.quota = params.quota;
      formData.value.quota_expires_rule =
        String(params.quota_expires_rule) || '1';
      formData.value.quota_expires_at = params.quota_expires_at;
      formData.value.quota_expires_minutes = params.quota_expires_minutes;
      formData.value.is_bind_group = params.is_bind_group;
      formData.value.group = params.group;
      formData.value.ip_whitelist = params.ip_whitelist?.join('\n') || '';
      formData.value.ip_blacklist = params.ip_blacklist?.join('\n') || '';
      formData.value.remark = params.remark;
      visible.value = true;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
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
      Message.success(t('app.success.key_config'));
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
      batchFormData.value.query_params.user_id = formData.value.user_id;
      batchFormData.value.query_params.app_id = formData.value.app_id;
      batchFormData.value.query_params.key = formData.value.key;
      batchFormData.value.query_params.models = formData.value.models;
      batchFormData.value.query_params.quota = formData.value.quota;
      batchFormData.value.query_params.quota_expires_at =
        formData.value.quota_expires_at;
      batchFormData.value.query_params.status = formData.value.status;
      const { data } = await submitAppKeyBatchOperate(batchFormData.value);
      navigator.clipboard.writeText(data.keys);
      if (batchFormData.value.action === 'create') {
        Message.success('操作成功, 密钥已复制到剪贴板');
      } else {
        Message.success('操作成功, 任务已提交');
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
      proxy.$message.info('请选择要操作的数据');
    } else {
      let alertContent = `是否确定操作所选的${ids.value.length}条数据?`;
      switch (params.action) {
        case 'status':
          if (params.value === 1) {
            alertContent = `是否确定启用所选的${ids.value.length}条数据?`;
          } else {
            alertContent = `是否确定禁用所选的${ids.value.length}条数据?`;
          }
          break;
        case 'delete':
          alertContent = `是否确定删除所选的${ids.value.length}条数据?`;
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
          submitAppKeyBatchOperate(params).then((res) => {
            setLoading(false);
            proxy.$message.success('操作成功');
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
      proxy.$message.info('请选择要操作的数据');
    } else {
      let alertContent = `是否确定操作所选的${ids.value.length}条数据?`;
      switch (params.action) {
        case 'create':
          batchFormData.value = {} as AppKeyBatchOperate;
          batchFormData.value.action = params.action;
          batchFormData.value.n = 1;
          batchVisible.value = true;
          return;
        case 'update':
          batchFormData.value = {} as AppKeyBatchOperate;
          batchFormData.value.action = params.action;
          batchVisible.value = true;
          return;
        case 'all-update':
          batchFormData.value = {} as AppKeyBatchOperate;
          batchFormData.value.action = params.action;
          batchVisible.value = true;
          return;
        case 'all-status':
          if (params.value === 1) {
            alertContent = `是否确定全部启用查询结果的${pagination.total}条数据?`;
          } else {
            alertContent = `是否确定全部禁用查询结果的${pagination.total}条数据?`;
          }
          break;
        case 'all-delete':
          alertContent = `是否确定全部删除查询结果的${pagination.total}条数据?`;
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
          params.query_params = {};
          params.query_params.user_id = formData.value.user_id;
          params.query_params.app_id = formData.value.app_id;
          params.query_params.key = formData.value.key;
          params.query_params.models = formData.value.models;
          params.query_params.quota = formData.value.quota;
          params.query_params.quota_expires_at =
            formData.value.quota_expires_at;
          params.query_params.status = formData.value.status;
          submitAppKeyBatchOperate({ ...params, ...formData.value }).then(
            (res) => {
              setLoading(false);
              proxy.$message.success('操作成功, 任务已提交');
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
      proxy.$message.success('复制成功');
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
        proxy.$message.success('导出成功');
        tableRef.value.selectAll(false);
        // 创建一个新的Blob对象，使用后端返回的文件流
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });

        // 创建一个指向该Blob的URL
        const url = window.URL.createObjectURL(blob);

        // 创建一个a标签用于下载文件
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '应用密钥.xlsx'); // 设置下载文件名
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
</script>

<script lang="ts">
  export default {
    name: 'AppKeyList',
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
  .copy-btn {
    color: gray;
    cursor: pointer;
  }
  .copy-btn:hover {
    color: rgb(var(--arcoblue-6));
  }
</style>
