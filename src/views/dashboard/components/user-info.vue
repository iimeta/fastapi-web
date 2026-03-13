<template>
  <a-card
    class="general-card"
    :header-style="cardHeaderStyle"
    :body-style="cardBodyStyle"
    :bordered="false"
  >
    <div class="header" @click="$router.push({ name: 'Center' })">
      <a-space align="center">
        <a-avatar :size="64">
          <template #trigger-icon>
            <icon-camera />
          </template>
          <img
            class="dashboard-user-info-avatar"
            :src="userStore.avatar || appStore.getAvatar"
          />
        </a-avatar>
        <div class="user-info">
          <div class="user-name" :title="userStore.name">
            {{ userStore.name }}
          </div>
          <div
            v-if="userStore.role === 'reseller'"
            class="user-id dashboard-user-info-reseller-id"
            :title="$t('common.reseller')"
          >
            ID: {{ userStore.user_id }}
          </div>
          <div v-else class="user-id"> ID: {{ userStore.user_id }} </div>
        </div>
      </a-space>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { useUserStore, useAppStore } from '@/store';

  const userStore = useUserStore();
  const appStore = useAppStore();

  const cardHeaderStyle = { padding: '20px 20px 0 20px' };
  const cardBodyStyle = {
    padding:
      userStore.role === 'user' ? '12px 20px 10px 20px' : '15px 20px 12px 20px',
  };
</script>

<script lang="ts">
  export default {
    name: 'UserInfo',
  };
</script>

<style lang="less" scoped>
  .header {
    align-items: center;
    justify-content: center;
    color: var(--color-text-1);
    background-size: cover;
    border-radius: 4px;
    cursor: pointer;

    :deep(.arco-avatar-trigger-icon-button) {
      color: rgb(var(--arcoblue-6));

      :deep(.arco-icon) {
        vertical-align: -1px;
      }
    }
  }

  .user-info {
    margin-left: 8px;
  }

  .user-name {
    width: 165px;
    font-size: 18px;
    margin: 10px 0;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-id {
    width: 165px;
    font-size: 14px;
    text-align: center;
  }

  .dashboard-user-info-avatar {
    background-color: var(--color-bg-2);
  }

  .dashboard-user-info-reseller-id {
    color: rgb(var(--orange-6));
  }
</style>
