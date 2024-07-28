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
        <a-statistic
          :title="$t('workplace.current.quota')"
          :value="expense.quota"
          show-group-separator
        />
      </div>
      <div class="quota-box">
        <div class="quota-usd-box">
          <div class="quota">剩余额度</div>
          <div class="quota-usd">{{
            expense.quota > 0
              ? `$${quotaConv4(expense.quota)}`
              : expense.quota < 0
              ? `-$${quotaConv4(-expense.quota)}`
              : '$0.00'
          }}</div>
        </div>
        <div>
          <div class="used-quota">已用额度</div>
          <div class="used-quota-usd">${{ expense.used_quota_usd }} </div>
        </div>
      </div>
      <div class="expires_at">
        额度过期时间: {{ expense.quota_expires_at || '2099-12-31 23:59:59' }}
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { quotaConv4 } from '@/utils/common';
  import { queryExpense, Expense } from '@/api/dashboard';

  const expense = reactive({}) as Expense;

  const getExpense = async () => {
    try {
      const { data } = await queryExpense();
      expense.quota = data.quota;
      expense.quota_usd = data.quota_usd;
      expense.used_quota = data.used_quota;
      expense.used_quota_usd = data.used_quota_usd;
      expense.quota_expires_at = data.quota_expires_at;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getExpense();
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
</style>
