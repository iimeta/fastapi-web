<template>
  <div class="container">
    <a-space direction="vertical" :size="16" fill>
      <a-descriptions
        v-for="(item, idx) in blockDataList"
        :key="idx"
        :label-style="{
          textAlign: 'right',
          width: '200px',
          paddingRight: '10px',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{ width: '400px' }"
        :data="item.data"
        bordered
      >
        <template #value="{ value }">
          <a-skeleton v-if="loading" :animation="true">
            <a-skeleton-line :widths="['200px']" :rows="1" />
          </a-skeleton>
          <span v-else>{{ value }}</span>
        </template>
      </a-descriptions>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryBillDetail,
    BillDetailParams,
    StatisticsUser,
  } from '@/api/finance';
  import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const { loading, setLoading } = useLoading(true);
  const currentData = ref<StatisticsUser>({} as StatisticsUser);

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

  const { t } = useI18n();
  const blockDataList = computed(() => {
    const result = [];
    result.push({
      data: [
        {
          label: t('app.detail.label.appId'),
          value: currentData.value.user_id,
        },
        {
          label: t('app.detail.label.name'),
          value: currentData.value.stat_date,
        },
        {
          label: t('app.detail.label.remark'),
          value: currentData.value.total,
        },
        {
          label: t('app.detail.label.created_at'),
          value: currentData.value.tokens || '-',
        },
        {
          label: t('app.detail.label.updated_at'),
          value: currentData.value.abnormal || '-',
        },
        {
          label: t('app.detail.label.updated_at'),
          value: currentData.value.abnormal_tokens || '-',
        },
        {
          label: t('app.detail.label.updated_at'),
          value: currentData.value.model_stats || '-',
        },
      ] as DescData[],
    });

    return result;
  });
</script>

<script lang="ts">
  export default {
    name: 'BillDetail',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 10px 20px 10px;
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
</style>
