<template>
  <a-card
    class="general-card"
    :title="$t('workplace.expense')"
    :header-style="{ padding: '20px 20px 0 20px' }"
    :body-style="{ padding: '20px' }"
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
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { queryExpense, Expense } from '@/api/dashboard';

  const expense = reactive({}) as Expense;

  const getExpense = async () => {
    try {
      const { data } = await queryExpense();
      expense.quota = data.quota;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getExpense();
</script>

<style lang="less" scoped>
  .quota {
    font-size: 26px;
    margin-top: 10px;
  }
</style>
