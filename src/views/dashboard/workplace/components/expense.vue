<template>
  <a-card
    class="general-card"
    :title="$t('workplace.expense')"
    :header-style="{ padding: '10px 20px 10px 20px', height: '36px' }"
    :body-style="{ padding: '10px 20px 10px 20px' }"
    :bordered="false"
  >
    <div>
      <div>
        <div class="arco-statistic">
          <div class="arco-statistic-title">
            {{ $t('workplace.current.quota') }}
            <a-link @click="quotaWarning">
              {{ $t('workplace.current.quota_warning') }}
            </a-link>
          </div>
          <div class="arco-statistic-content">
            <div class="arco-statistic-value">
              <span class="arco-statistic-value-integer">
                {{
                  expense.quota ? expense.quota.toLocaleString() : expense.quota
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="quota-box">
        <div class="quota-item-box">
          <span class="quota-title">剩余额度:</span>
          <span class="quota">
            {{
              expense.quota > 0
                ? `$${quotaConv4(expense.quota)}`
                : expense.quota < 0
                ? `-$${quotaConv4(-expense.quota)}`
                : '$0.00'
            }}
          </span>
        </div>
      </div>
      <div class="quota-box">
        <div class="quota-item-box">
          <span class="quota-title">已用额度:</span>
          <span class="quota">
            {{
              expense.used_quota > 0
                ? `$${quotaConv4(expense.used_quota)}`
                : '$0.00'
            }}
          </span>
        </div>
      </div>
      <div v-permission="['reseller']" class="quota-box">
        <div class="quota-item-box">
          <span class="quota-title">已分配额度:</span>
          <span class="quota">
            {{
              expense.allocated_quota > 0
                ? `$${quotaConv4(expense.allocated_quota)}`
                : expense.allocated_quota < 0
                ? `-$${quotaConv4(-expense.allocated_quota)}`
                : '$0.00'
            }}
          </span>
        </div>
      </div>
      <div v-permission="['reseller']" class="quota-box">
        <div class="quota-item-box">
          <span class="quota-title">待分配额度:</span>
          <span class="quota">
            {{
              expense.to_be_allocated > 0
                ? `$${quotaConv4(expense.to_be_allocated)}`
                : expense.to_be_allocated < 0
                ? `-$${quotaConv4(-expense.to_be_allocated)}`
                : '$0.00'
            }}
          </span>
        </div>
      </div>
      <div class="quota-box">
        <div class="quota-item-box">
          <span class="quota-title">额度过期:</span>
          <span class="expires_at">
            {{ expense.quota_expires_at || '无期限' }}
          </span>
        </div>
      </div>
    </div>
    <a-modal
      v-model:visible="quotaWarningVisible"
      :title="$t('workplace.current.quota_warning')"
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
          :label="$t('workplace.label.quota_warning')"
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
          field="warning_threshold"
          :label="$t('workplace.label.quota_warning.warning_threshold')"
          :rules="[
            {
              required: true,
              message: $t(
                'workplace.error.quota_warning.warning_threshold.required'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="quotaWarningFormData.warning_threshold"
            :placeholder="
              $t('workplace.placeholder.quota_warning.warning_threshold')
            "
            :precision="0"
            :min="1"
            allow-clear
          />
          &nbsp;&nbsp;$&nbsp;
        </a-form-item>
        <a-form-item
          v-if="quotaWarningFormData.quota_warning"
          field="expire_warning_threshold"
          :label="$t('workplace.label.quota_warning.expire_warning_threshold')"
          :rules="[
            {
              required: true,
              message: $t(
                'workplace.error.quota_warning.expire_warning_threshold.required'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="quotaWarningFormData.expire_warning_threshold"
            :placeholder="
              $t('workplace.placeholder.quota_warning.expire_warning_threshold')
            "
            :precision="0"
            :min="1"
            allow-clear
          />
          &nbsp;&nbsp;天
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { quotaConv4 } from '@/utils/common';
  import {
    queryExpense,
    Expense,
    QuotaWarningParams,
    submitQuotaWarning,
  } from '@/api/dashboard';

  const { proxy } = getCurrentInstance() as any;

  const expense = ref<Expense>({} as Expense);
  const quotaWarningVisible = ref(false);
  const quotaWarningForm = ref<FormInstance>();
  const quotaWarningFormData = ref<QuotaWarningParams>(
    {} as QuotaWarningParams
  );

  const getExpense = async () => {
    const { data } = await queryExpense();
    expense.value = data;
    quotaWarningFormData.value.quota_warning =
      data.quota_warning ||
      (data.warning_threshold === 0 && data.expire_warning_threshold === 0);
    quotaWarningFormData.value.warning_threshold = data.warning_threshold || 50;
    quotaWarningFormData.value.expire_warning_threshold =
      data.expire_warning_threshold || 3;
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

    try {
      await submitQuotaWarning(quotaWarningFormData.value);
      done();
      proxy.$message.success('操作成功');
    } catch (err) {
      done(false);
    }
  };

  const handleCancel = () => {
    quotaWarningVisible.value = false;
  };
</script>

<script lang="ts">
  export default {
    name: 'Expense',
  };
</script>

<style lang="less" scoped>
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
</style>
