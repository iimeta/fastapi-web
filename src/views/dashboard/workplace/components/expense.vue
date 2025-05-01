<template>
  <a-card
    class="general-card"
    :title="$t('workplace.expense')"
    :header-style="{ padding: '10px 20px 0 20px', height: '36px' }"
    :body-style="{ padding: '10px 20px 20px 20px' }"
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
        <div class="quota-usd-box">
          <div class="quota">剩余额度</div>
          <div class="quota-usd">
            {{
              expense.quota > 0
                ? `$${quotaConv4(expense.quota)}`
                : expense.quota < 0
                ? `-$${quotaConv4(-expense.quota)}`
                : '$0.00'
            }}
          </div>
        </div>
        <div>
          <div class="used-quota">已用额度</div>
          <div class="used-quota-usd">${{ expense.used_quota_usd }} </div>
        </div>
      </div>
      <div v-permission="['reseller']" class="quota-box2">
        <div class="quota-usd-box">
          <div class="quota">已分配额度</div>
          <div class="quota-usd">{{
            expense.allocated_quota > 0
              ? `$${quotaConv4(expense.allocated_quota)}`
              : expense.allocated_quota < 0
              ? `-$${quotaConv4(-expense.allocated_quota)}`
              : '$0.00'
          }}</div>
        </div>
        <div>
          <div class="used-quota">待分配额度</div>
          <div class="used-quota-usd">
            {{
              expense.to_be_allocated > 0
                ? `$${quotaConv4(expense.to_be_allocated)}`
                : expense.to_be_allocated < 0
                ? `-$${quotaConv4(-expense.to_be_allocated)}`
                : '$0.00'
            }}
          </div>
        </div>
      </div>
      <div class="expires_at">
        额度过期时间: {{ expense.quota_expires_at || '2099-12-31 23:59:59' }}
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
    padding: 7px 0;
    margin-top: 8px;
    display: flex;
    align-items: center;
    border-radius: 6px;
    text-align: center;
    div {
      flex: 1;
    }
  }

  .quota-box2 {
    background: #f7f8fa;
    padding: 7px 0;
    margin-top: 5px;
    display: flex;
    align-items: center;
    border-radius: 6px;
    text-align: center;
    div {
      flex: 1;
    }
  }

  .quota-usd-box {
    border-right: 1px solid var(--color-text-4);
  }

  .quota {
    color: var(--color-text-2);
    font-size: 13px;
    margin-right: 8px;
    white-space: nowrap;
    padding-left: 8px;
  }

  .quota-usd {
    color: var(--color-text-1);
    font-size: 16px;
    font-weight: 600;
    padding: 6px 8px 0 8px;
    white-space: nowrap;
  }

  .used-quota {
    color: var(--color-text-2);
    font-size: 13px;
    margin-right: 8px;
    white-space: nowrap;
    padding-left: 8px;
  }

  .used-quota-usd {
    color: var(--color-text-1);
    font-size: 16px;
    font-weight: 600;
    padding: 6px 8px 0 8px;
    white-space: nowrap;
  }

  .expires_at {
    margin-top: 10px;
  }

  .arco-link {
    margin-left: 18px;
    padding: 0 4px;
  }
</style>
