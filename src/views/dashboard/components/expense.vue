<template>
  <a-card
    class="general-card"
    :title="$t('dashboard.expense')"
    :header-style="cardHeaderStyle"
    :body-style="cardBodyStyle"
    :bordered="false"
  >
    <template #extra>
      <a-link v-if="appStore.getRechargeTips" @click="recharge">
        {{ $t('common.recharge') }}
      </a-link>
      <a-link @click="quotaWarning">
        {{ $t('dashboard.quota_warning') }}
      </a-link>
    </template>
    <div>
      <div>
        <div class="arco-statistic">
          <div class="arco-statistic-content">
            <div class="arco-statistic-value dashboard-expense-value">
              <Quota :model-value="expense.quota" :n="4" />
            </div>
          </div>
        </div>
      </div>
      <div class="quota-box">
        <div class="quota-item-box">
          <span class="quota-title">{{ $t('common.used_quota') }}:</span>
          <Quota :model-value="expense.used_quota" :n="4" class="quota" />
        </div>
      </div>
      <div v-permission="['reseller']" class="quota-box">
        <div class="quota-item-box">
          <span class="quota-title">{{ $t('common.allocated_quota') }}:</span>
          <Quota :model-value="expense.allocated_quota" :n="4" class="quota" />
        </div>
      </div>
      <div v-permission="['reseller']" class="quota-box">
        <div class="quota-item-box">
          <span class="quota-title"
            >{{ $t('common.to_be_allocated_quota') }}:</span
          >
          <Quota
            :model-value="expense.to_be_allocated_quota"
            :n="4"
            class="quota"
          />
        </div>
      </div>
      <div class="quota-box">
        <div class="quota-item-box">
          <span class="quota-title">{{ $t('common.expires_at') }}:</span>
          <span class="expires_at">
            {{ expense.quota_expires_at || $t('common.forever') }}
          </span>
        </div>
      </div>
    </div>
    <a-modal
      v-model:visible="quotaWarningVisible"
      :title="$t('dashboard.quota_warning')"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form
        ref="quotaWarningForm"
        :model="quotaWarningFormData"
        auto-label-width
      >
        <a-form-item
          field="quota_warning"
          :label="$t('dashboard.quota_warning')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch v-model="quotaWarningFormData.quota_warning" />
        </a-form-item>
        <a-form-item
          v-if="quotaWarningFormData.quota_warning"
          field="warning_thresholds"
          :label="$t('dashboard.label.quota_warning.warning_thresholds')"
          :rules="[
            {
              required: true,
              type: 'array',
              minLength: 1,
              message: $t(
                'dashboard.placeholder.quota_warning.warning_thresholds'
              ),
            },
          ]"
        >
          <span
            class="arco-input-outer arco-input-outer-size-medium quota-tag-input"
          >
            <span class="arco-input-prepend">
              {{ appStore.getCurrencySymbol }}
            </span>
            <a-input-tag
              v-model="quotaWarningFormData.warning_thresholds"
              :placeholder="
                $t('dashboard.placeholder.quota_warning.warning_thresholds')
              "
              allow-clear
            />
          </span>
          <template #extra>
            {{ $t('dashboard.tip.quota_warning.warning_thresholds') }}
          </template>
        </a-form-item>
        <a-form-item
          v-if="quotaWarningFormData.quota_warning"
          field="expire_warning_thresholds"
          :label="$t('dashboard.label.quota_warning.expire_warning_thresholds')"
          :rules="[
            {
              required: true,
              type: 'array',
              minLength: 1,
              message: $t(
                'dashboard.placeholder.quota_warning.expire_warning_thresholds'
              ),
            },
          ]"
        >
          <span
            class="arco-input-outer arco-input-outer-size-medium quota-tag-input"
          >
            <a-input-tag
              v-model="quotaWarningFormData.expire_warning_thresholds"
              :placeholder="
                $t(
                  'dashboard.placeholder.quota_warning.expire_warning_thresholds'
                )
              "
              allow-clear
            />
            <span class="arco-input-append">
              {{ $t('unit.day') }}
            </span>
          </span>
          <template #extra>
            {{ $t('dashboard.tip.quota_warning.expire_warning_thresholds') }}
          </template>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FormInstance, Message, Modal } from '@arco-design/web-vue';
  import { useUserStore, useAppStore } from '@/store';
  import {
    queryExpense,
    Expense,
    QuotaWarningParams,
    submitQuotaWarning,
  } from '@/api/dashboard';
  import Quota from '@/views/common/quota.vue';

  const { t } = useI18n();
  const userStore = useUserStore();
  const appStore = useAppStore();

  const cardHeaderStyle = { padding: '10px 20px 0 20px', height: '36px' };
  const cardBodyStyle = {
    padding: userStore.role === 'user' ? '0 20px 9px 20px' : '0 20px 15px 20px',
  };

  const expense = ref<Expense>({} as Expense);
  const quotaWarningVisible = ref(false);
  const quotaWarningForm = ref<FormInstance>();
  const quotaWarningFormData = ref<QuotaWarningParams>(
    {} as QuotaWarningParams
  );
  const toNumbers = (values?: Array<string | number>) =>
    Array.from(
      new Set(
        (values || [])
          .map((v) => parseInt(`${v}`.trim(), 10))
          .filter((v) => !Number.isNaN(v) && v > 0)
      )
    ).sort((a, b) => b - a);

  const getExpense = async () => {
    const { data } = await queryExpense();
    expense.value = data;
    quotaWarningFormData.value.quota_warning =
      data.quota_warning ||
      (!(data.warning_thresholds || []).length &&
        !(data.expire_warning_thresholds || []).length);
    quotaWarningFormData.value.warning_thresholds =
      data.warning_thresholds || [];
    quotaWarningFormData.value.expire_warning_thresholds =
      data.expire_warning_thresholds || [];
  };
  getExpense();

  const quotaWarning = () => {
    quotaWarningVisible.value = true;
  };

  const handleBeforeOk = async (done: any) => {
    const res = await quotaWarningForm.value?.validate();
    if (res) {
      quotaWarningVisible.value = true;
      done(false);
      return;
    }

    quotaWarningFormData.value.warning_thresholds = toNumbers(
      quotaWarningFormData.value.warning_thresholds
    );
    quotaWarningFormData.value.expire_warning_thresholds = toNumbers(
      quotaWarningFormData.value.expire_warning_thresholds
    );

    try {
      await submitQuotaWarning(quotaWarningFormData.value);
      done();
      Message.success(t('success.operate'));
    } catch (err) {
      done(false);
    }
  };

  const handleCancel = () => {
    quotaWarningVisible.value = false;
  };

  const recharge = () => {
    Modal.warning({
      title: t('modal.warning.title.warm'),
      content: appStore.getRechargeTips,
      okText: t('modal.warning.text'),
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'Expense',
  };
</script>

<style lang="less" scoped>
  .dashboard-expense-value {
    font-size: 30px;
  }

  .quota-box {
    background: #f7f8fa;
    padding: 6px 0;
    margin-top: 6px;
    align-items: center;
    border-radius: 6px;
    text-align: left;
    div {
      flex: 1;
    }
  }

  .quota-item-box {
    display: flex;
  }

  .quota-title {
    color: var(--color-text-2);
    font-size: 15px;
    margin-right: 8px;
    white-space: nowrap;
    padding-left: 8px;
    display: block;
  }

  .quota {
    color: var(--color-text-1);
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
  }

  .expires_at {
    color: var(--color-text-1);
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
  }

  .arco-link {
    margin-left: 18px;
    padding: 0 4px;
  }

  .quota-tag-input {
    display: inline-flex;
    width: 100%;
    :deep(.arco-input-prepend) {
      border-right: none;
    }
    :deep(.arco-input-tag) {
      flex: 1;
      min-width: 0;
      border-radius: 0;
    }
  }
</style>
