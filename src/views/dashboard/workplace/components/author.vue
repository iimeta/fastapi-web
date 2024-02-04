<template>
  <a-card
    class="general-card"
    :title="$t('workplace.author')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ paddingTop: '17px' }"
    :bordered="false"
  >
    <div>
      <img class="author" src="https://fastapi.ai/Author.png" />
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
  .author {
    width: 246px;
  }
</style>
