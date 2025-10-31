<template>
  <span>
    {{
      modelValue > 0
        ? `${appStore.getCurrencySymbol + parseQuota(modelValue)}`
        : modelValue < 0
        ? `-${appStore.getCurrencySymbol + parseQuota(-modelValue)}`
        : appStore.getCurrencySymbol + '0.00'
    }}
  </span>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import { parseQuota } from '@/utils/common';

  const appStore = useAppStore();

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
