<template>
  <span>
    <template v-if="modelValue > 0"
      ><span class="currency-symbol">{{ cs }}</span
      >{{ parseQuota(modelValue, n) }}</template
    >
    <template v-else-if="modelValue < 0"
      ><span class="currency-symbol">-</span
      ><span class="currency-symbol">{{ cs }}</span
      >{{ parseQuota(-modelValue, n) }}</template
    >
    <template v-else
      ><span class="currency-symbol">{{ cs }}</span
      >0.00</template
    >
  </span>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useAppStore } from '@/store';
  import { parseQuota } from '@/utils/common';

  const appStore = useAppStore();

  const props = defineProps<{
    modelValue: number;
    n?: number;
    currencySymbol?: string;
  }>();

  const cs = computed(() => props.currencySymbol || appStore.getCurrencySymbol);
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
