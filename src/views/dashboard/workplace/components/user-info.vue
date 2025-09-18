<template>
  <a-card
    class="general-card"
    :header-style="{ padding: '20px 20px 0 20px' }"
    :body-style="{ padding: '20px 20px 17px 20px' }"
    :bordered="false"
  >
    <div class="header">
      <a-space
        :size="userInfo.role === 'user' || userInfo.role === 'admin' ? 12 : 5"
        direction="vertical"
        align="center"
        @click="$router.push({ name: 'Center' })"
      >
        <a-avatar :size="64">
          <template #trigger-icon>
            <icon-settings />
          </template>
          <img
            :src="userInfo.avatar || appStore.getAvatar"
            style="background-color: #ffffff"
          />
        </a-avatar>
        <a-typography-title :heading="6" style="margin: 0">
          {{ userInfo.name }}
        </a-typography-title>
        <div v-if="userInfo.role === 'reseller'" class="user-msg">
          <a-space :size="64">
            <a-tag color="orange">
              <div style="font-size: 16px">
                <icon-user style="color: rgb(var(--orange-6))" />
                <a-typography-text style="color: rgb(var(--orange-6))">
                  代理商
                </a-typography-text>
              </div>
            </a-tag>
          </a-space>
        </div>
      </a-space>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { useUserStore, useAppStore } from '@/store';

  const userInfo = useUserStore();
  const appStore = useAppStore();
</script>

<script lang="ts">
  export default {
    name: 'UserInfo', // If you want the include property of keep-alive to take effect, you must name the component
  };
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
      height: 14px;
      .arco-icon {
        color: rgb(var(--gray-10));
      }
      .arco-typography {
        margin-left: 6px;
      }
    }
  }
</style>
