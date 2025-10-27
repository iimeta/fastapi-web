<template>
  <div style="margin: 10px 0 30px 10px">
    <a-descriptions
      :column="2"
      bordered
      :value-style="{ width: '350px', padding: '5px 8px 5px 20px' }"
    >
      <a-descriptions-item :label="t('bill.detail.label.stat_date')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.stat_date || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('bill.detail.label.user_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.user_id || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('bill.detail.label.total')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.total.toLocaleString() }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('bill.detail.label.tokens')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.tokens > 0 ? `$${currentData.tokens}` : '$0.00' }}
        </span>
      </a-descriptions-item>
    </a-descriptions>
    <a-table
      style="margin-top: 15px"
      :data="currentData.model_stats"
      :pagination="false"
      :bordered="false"
    >
      <template #columns>
        <a-table-column
          :title="t('bill.detail.label.model')"
          data-index="model"
          align="center"
        >
          <template #cell="{ record }">
            {{ record.model || '-' }}
          </template>
        </a-table-column>
        <a-table-column
          :title="t('bill.detail.label.total')"
          data-index="total"
          align="center"
        >
          <template #cell="{ record }">
            {{ record.total.toLocaleString() }}
          </template>
        </a-table-column>
        <a-table-column
          :title="t('bill.detail.label.tokens')"
          data-index="tokens"
          align="center"
        >
          <template #cell="{ record }">
            {{ record.tokens > 0 ? `$${record.tokens}` : '$0.00' }}
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryBillDetail,
    BillDetailParams,
    StatisticsUser,
  } from '@/api/finance';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<StatisticsUser>({} as StatisticsUser);
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getBillDetail = async (params: BillDetailParams = { id: props.id }) => {
    setLoading(true);
    try {
      const { data } = await queryBillDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getBillDetail();
</script>

<script lang="ts">
  export default {
    name: 'BillDetail',
  };
</script>

<style scoped lang="less"></style>
