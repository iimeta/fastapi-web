<template>
  <a-layout-footer class="footer">
    <a-link target="_blank" :href="appStore.getJumpUrl">
      {{ appStore.getCopyright }}
    </a-link>
  </a-layout-footer>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';

  const appStore = useAppStore();
</script>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    text-align: center;
  }
</style>
