<template>
  <!-- 文本 -->
  <a-table
    v-if="pricing.billing_items.includes('text')"
    :columns="textPricingColumns"
    :data="textPricing"
    :pagination="false"
    :bordered="false"
  >
    <template #input_ratio="{ record }">
      ${{ record.input_ratio }} / M
    </template>
    <template #output_ratio="{ record }">
      ${{ record.output_ratio }} / M
    </template>
  </a-table>

  <!-- 文本缓存 -->
  <a-table
    v-if="pricing.billing_items.includes('text_cache')"
    :columns="textCachePricingColumns"
    :data="textCachePricing"
    :pagination="false"
    :bordered="false"
    style="margin-top: 15px"
  >
    <template #read_ratio="{ record }"> ${{ record.read_ratio }} / M </template>
  </a-table>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    Pricing,
    TextPricing,
    CachePricing,
    ImageGenerationPricing,
    VisionPricing,
    SearchPricing,
    MidjourneyPricing,
  } from '@/api/common';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  const { t } = useI18n();

  const props = defineProps<{
    modelValue: Pricing;
  }>();

  const pricing = ref(props.modelValue);

  const textPricing = ref<TextPricing[]>([]);
  const textPricingColumns = [
    {
      title: '文本价格',
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: '输入价格',
          dataIndex: 'input_ratio',
          slotName: 'input_ratio',
          align: 'center',
        },
        {
          title: '输出价格',
          dataIndex: 'output_ratio',
          slotName: 'output_ratio',
          align: 'center',
        },
      ],
    },
  ] as TableColumnData[];

  const textCachePricing = ref<CachePricing[]>([]);
  const textCachePricingColumns = [
    {
      title: '文本缓存价格',
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: '读取价格',
          dataIndex: 'read_ratio',
          slotName: 'read_ratio',
          align: 'center',
        },
      ],
    },
  ] as TableColumnData[];

  const handlePricing = () => {
    if (pricing.value.billing_items.includes('text')) {
      textPricing.value[0] = pricing.value.text;
    }

    if (pricing.value.billing_items.includes('text_cache')) {
      textCachePricing.value[0] = pricing.value.text_cache;
    }
  };

  watch(
    () => props.modelValue,
    (val) => {
      pricing.value = val;
      handlePricing();
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'PricingDetail',
  };
</script>

<style scoped lang="less"></style>
