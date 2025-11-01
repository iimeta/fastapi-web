<template>
  <span>
    {{
      modelValue > 0
        ? currencySymbol + parseQuota(modelValue)
        : modelValue < 0
        ? `-${-currencySymbol + parseQuota(-modelValue)}`
        : currencySymbol + '0.00'
    }}
  </span>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import { parseQuota } from '@/utils/common';

  const currencySymbol = useAppStore().getCurrencySymbol;

  defineProps<{
    modelValue: number;
  }>();
</script>

<script lang="ts">
  export default {
    name: 'Quota',
  };
</script>

<style scoped lang="less"></style>
