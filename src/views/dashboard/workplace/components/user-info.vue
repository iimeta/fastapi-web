<template>
  <a-card
    class="general-card"
    :header-style="{ padding: '20px 20px 0 20px' }"
    :body-style="{ padding: '20px' }"
    :bordered="false"
  >
    <div class="header">
      <a-space :size="12" direction="vertical" align="center">
        <a-avatar :size="64">
          <template #trigger-icon>
            <icon-camera />
          </template>
          <img :src="userInfo.avatar || 'https://www.fastapi.ai/logo.png'" />
        </a-avatar>
        <a-typography-title :heading="6" style="margin: 0">
          {{ userInfo.name }}
        </a-typography-title>
        <!-- <div v-permission="['user']" class="user-msg">
          <a-space :size="18">
            <div>
              <icon-email />
              <a-typography-text>{{ userInfo.email }}</a-typography-text>
            </div>
          </a-space>
        </div> -->
      </a-space>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store';

  const userInfo = useUserStore();
</script>

<style lang="less" scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-10);
    background-size: cover;
    border-radius: 4px;

    :deep(.arco-avatar-trigger-icon-button) {
      color: rgb(var(--arcoblue-6));

      :deep(.arco-icon) {
        vertical-align: -1px;
      }
    }
    .user-msg {
      .arco-icon {
        color: rgb(var(--gray-10));
      }
      .arco-typography {
        margin-left: 6px;
      }
    }
  }
</style>
