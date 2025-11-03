<template>
  <a-card
    class="general-card"
    :header-style="{ padding: '20px 20px 0 20px' }"
    :body-style="{
      padding: userStore.role === 'user' ? '8px 20px' : '11px 20px',
    }"
    :bordered="false"
  >
    <div class="header">
      <a-space align="center">
        <!-- <a-avatar :size="50" @click="$router.push({ name: 'Center' })">
          <template #trigger-icon>
            <icon-settings />
          </template>
          <img
            :src="userStore.avatar || appStore.getAvatar"
            style="background-color: #ffffff"
          />
        </a-avatar> -->
        <a-descriptions
          :data="renderData"
          :column="1"
          align="right"
          layout="inline-horizontal"
          :label-style="{
            width: '52px',
            fontWeight: 'normal',
            color: 'rgb(var(--gray-8))',
            lineHeight: '1',
          }"
          :value-style="{
            width: '180px',
            paddingLeft: '2px',
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle',
            lineHeight: '1',
          }"
        >
          <template #label="{ label }">{{ $t(label) }} :</template>
          <template #value="{ value }">
            {{ value || '-' }}
          </template>
        </a-descriptions>
        <!-- <div v-if="userStore.role === 'reseller'" class="user-msg">
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
        </div> -->
      </a-space>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { useUserStore, useAppStore } from '@/store';
  import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

  const userStore = useUserStore();
  const appStore = useAppStore();

  const renderData = [
    {
      label: 'userCenter.label.userId',
      value: userStore.user_id,
    },
    {
      label: 'userCenter.label.account',
      value: userStore.account,
    },
    {
      label: 'userCenter.label.email',
      value: userStore.email,
    },
  ] as DescData[];
</script>

<script lang="ts">
  export default {
    name: 'UserInfo', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .header {
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
