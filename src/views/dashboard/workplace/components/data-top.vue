<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ padding: '15px 20px 8px 20px' }"
      :body-style="{ padding: '10px 20px 21px 20px' }"
      :bordered="false"
    >
      <template #title>
        {{ $t('workplace.dataTop') }}
      </template>
      <template #extra>
        <a-radio-group
          v-model:model-value="dateRange"
          type="button"
          @change="handleDateRangeChange as any"
        >
          <a-radio :value="1">
            {{ $t('workplace.dateRange1') }}
          </a-radio>
          <a-radio :value="7">
            {{ $t('workplace.dateRange7') }}
          </a-radio>
          <a-radio :value="15">
            {{ $t('workplace.dateRange15') }}
          </a-radio>
          <a-radio :value="30">
            {{ $t('workplace.dateRange30') }}
          </a-radio>
        </a-radio-group>
      </template>
      <a-space direction="vertical" :size="10" fill>
        <a-radio-group
          v-model:model-value="dataType"
          type="button"
          @change="typeChange as any"
        >
          <a-radio v-if="userRole === 'admin'" value="user">
            {{ $t('workplace.dataTop.user') }}
          </a-radio>
          <a-radio value="app">
            {{ $t('workplace.dataTop.app') }}
          </a-radio>
          <a-radio v-if="userRole === 'user'" value="app_key">
            {{ $t('workplace.dataTop.app_key') }}
          </a-radio>
          <a-radio value="model">
            {{ $t('workplace.dataTop.model') }}
          </a-radio>
        </a-radio-group>
        <a-table
          :data="renderList"
          :pagination="false"
          :bordered="false"
          :scroll="{ x: '100%', y: '500px' }"
        >
          <template #columns>
            <a-table-column title="排名" data-index="key" :width="60">
              <template #cell="{ rowIndex }">
                {{ rowIndex + 1 }}
              </template>
            </a-table-column>
            <a-table-column
              v-if="dataType === 'user' && userRole === 'admin'"
              title="用户ID"
              data-index="user_id"
              align="center"
            >
            </a-table-column>
            <a-table-column
              v-if="dataType === 'app_key'"
              title="密钥"
              data-index="app_key"
              align="center"
              ellipsis
              tooltip
            >
            </a-table-column>
            <a-table-column
              v-if="dataType === 'app' || dataType === 'app_key'"
              title="应用ID"
              data-index="app_id"
              align="center"
            >
            </a-table-column>
            <a-table-column
              v-if="dataType === 'app' && userRole === 'admin'"
              title="用户ID"
              data-index="user_id"
              align="center"
            >
            </a-table-column>
            <a-table-column
              v-if="dataType === 'model'"
              title="模型"
              data-index="model"
              align="center"
              ellipsis
              tooltip
            >
            </a-table-column>
            <a-table-column title="调用数" data-index="call" align="center">
              <template #cell="{ record }">
                {{ record.call.toLocaleString() }}
              </template>
            </a-table-column>
            <a-table-column
              title="花费"
              data-index="tokens"
              align="center"
              ellipsis
              tooltip
            >
              <template #cell="{ record }">
                {{
                  record.tokens > 0 ? `$${quotaConv(record.tokens)}` : '$0.00'
                }}
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { quotaConv } from '@/utils/common';
  import { queryDataTop } from '@/api/dashboard';
  import type { TableData } from '@arco-design/web-vue/es/table/interface';

  const userRole = localStorage.getItem('userRole');
  const { loading, setLoading } = useLoading();

  const dateRange = ref(15);

  let day = 15;
  let dataType = 'user';
  if (userRole === 'user') {
    dataType = 'app';
  }

  const renderList = ref<TableData[]>();
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await queryDataTop({
        days: day,
        data_type: dataType,
      });
      renderList.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const typeChange = (type: string) => {
    dataType = type;
    fetchData();
  };

  /**
   * 切换日期范围
   *
   * @param days 日期数
   */
  const handleDateRangeChange = (days: number) => {
    day = days;
    fetchData();
  };

  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'DataTop', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style scoped lang="less">
  .general-card {
    height: 582px;
  }
  :deep(.arco-table-tr) {
    height: 42px;
    .arco-typography {
      margin-bottom: 0;
    }
  }
  .increases-cell {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
  }
  .arco-card {
    position: relative;
    background: var(--color-bg-2);
    border-radius: 4px;
    transition: box-shadow 0.2s cubic-bezier(0, 0, 1, 1);
  }
</style>
