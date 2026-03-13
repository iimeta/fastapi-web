<template>
  <a-col class="banner">
    <a-col :span="16">
      <a-typography-title :heading="5" class="dashboard-banner-title">
        {{ $t('dashboard.welcome') }} {{ userInfo.name }}
      </a-typography-title>
    </a-col>
    <a-divider class="panel-border" />
  </a-col>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useUserStore } from '@/store';

  const userStore = useUserStore();
  const userInfo = computed(() => {
    return {
      name: userStore.name,
    };
  });
</script>

<script lang="ts">
  export default {
    name: 'Banner',
  };
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    padding: 15px 20px 0 20px;
    background-color: var(--color-bg-2);
    border-radius: 4px 4px 0 0;
  }

  .dashboard-banner-title {
    margin-top: 0;
  }

  :deep(.arco-icon-home) {
    margin-right: 6px;
  }
</style>
