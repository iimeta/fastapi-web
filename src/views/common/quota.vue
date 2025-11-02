<template>
  <span>
    <template v-if="modelValue > 0"
      ><span class="currency-symbol">{{ currencySymbol }}</span
      >{{ parseQuota(modelValue, n) }}</template
    >
    <template v-else-if="modelValue < 0"
      ><span class="currency-symbol">-</span
      ><span class="currency-symbol">{{ currencySymbol }}</span
      >{{ parseQuota(-modelValue, n) }}</template
    >
    <template v-else
      ><span class="currency-symbol">{{ currencySymbol }}</span
      >0.00</template
    >
  </span>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import { parseQuota } from '@/utils/common';

  const currencySymbol = useAppStore().getCurrencySymbol;

  defineProps<{
    modelValue: number;
    n?: number;
  }>();
</script>

<script lang="ts">
  export default {
    name: 'Quota',
  };
</script>

<style scoped lang="less">
  .currency-symbol {
    padding-right: 2px;
  }
</style>
