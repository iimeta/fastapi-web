<template>
  <a-card
    class="general-card"
    :title="$t('dashboard.quick.operation')"
    :header-style="{ padding: '10px 20px 0 20px', height: '36px' }"
    :body-style="{
      padding: userStore.role === 'admin' ? '11px 20px' : '2px 20px',
    }"
    :bordered="false"
  >
    <a-row :gutter="8">
      <a-col
        v-for="link in links"
        :key="link.text"
        v-permission="link.permission"
        :span="8"
        class="wrapper"
        @click="
          $router.push({
            name: link.router,
          })
        "
      >
        <div class="icon">
          <component :is="link.icon" />
        </div>
        <a-typography-paragraph class="text">
          {{ $t(link.text) }}
        </a-typography-paragraph>
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store';

  const userStore = useUserStore();

  const links = [
    {
      text: 'app.menu',
      icon: 'icon-apps',
      router: 'AppList',
      permission: ['user'],
    },
    {
      text: 'menu.model',
      icon: 'icon-common',
      router: 'ModelList',
      permission: ['admin'],
    },
    {
      text: 'app.menu.key',
      icon: 'icon-safe',
      router: 'AppKeyList',
      permission: ['user'],
    },
    {
      text: 'key.menu',
      icon: 'icon-safe',
      router: 'ModelKeyList',
      permission: ['admin'],
    },
    {
      text: 'menu.model.agent',
      icon: 'icon-bug',
      router: 'ModelAgentList',
      permission: ['admin'],
    },
    {
      text: 'group.menu',
      icon: 'icon-user-group',
      router: 'GroupList',
      permission: ['admin'],
    },
    {
      text: 'menu.user',
      icon: 'icon-user',
      router: 'UserList',
      permission: ['reseller', 'admin'],
    },
    {
      text: 'app.menu',
      icon: 'icon-apps',
      router: 'AppList',
      permission: ['reseller', 'admin'],
    },
    {
      text: 'notice.menu',
      icon: 'icon-notification',
      router: 'NoticeList',
      permission: ['admin'],
    },
    {
      text: 'finance.menu',
      icon: 'icon-wechatpay',
      router: 'BillList',
      permission: ['admin'],
    },
    {
      text: 'log.menu',
      icon: 'icon-message',
      router: 'LogTextList',
      permission: ['user', 'reseller'],
    },
    {
      text: 'menu.sys.config',
      icon: 'icon-settings',
      router: 'SysConfig',
      permission: ['admin'],
    },
    {
      text: 'log.menu.text',
      icon: 'icon-message',
      router: 'LogTextList',
      permission: ['admin'],
    },
    {
      text: 'log.menu.image',
      icon: 'icon-image',
      router: 'LogImageList',
      permission: ['admin'],
    },
    {
      text: 'log.menu.audio',
      icon: 'icon-file-audio',
      router: 'LogAudioList',
      permission: ['admin'],
    },
  ];
</script>

<script lang="ts">
  export default {
    name: 'QuickOperation', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style scoped lang="less">
  .moduler-wrap .wrapper {
    margin-top: 7px;
    text-align: center;
    cursor: pointer;
  }

  div.arco-typography {
    margin-top: 0;
    margin-bottom: 0;
  }
</style>
