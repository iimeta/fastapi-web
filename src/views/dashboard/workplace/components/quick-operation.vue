<template>
  <a-card
    class="general-card"
    :title="$t('workplace.quick.operation')"
    :header-style="{ padding: '10px 20px 0 20px', height: '37px' }"
    :body-style="{ padding: '10px 20px 2px 20px' }"
    :bordered="false"
  >
    <!-- <template #extra>
      <a-link>{{ $t('workplace.quickOperation.setup') }}</a-link>
    </template> -->
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
    <!-- <a-divider class="split-line" style="margin: 0" /> -->
  </a-card>
</template>

<script lang="ts" setup>
  const links = [
    {
      text: 'workplace.appManagement',
      icon: 'icon-apps',
      router: 'AppList',
      permission: ['user'],
    },
    {
      text: 'workplace.modelManagement',
      icon: 'icon-common',
      router: 'ModelList',
      permission: ['admin'],
    },
    {
      text: 'workplace.appKeyManagement',
      icon: 'icon-safe',
      router: 'AppKeyList',
      permission: ['user'],
    },
    {
      text: 'workplace.keyManagement',
      icon: 'icon-safe',
      router: 'ModelKeyList',
      permission: ['admin'],
    },
    {
      text: 'workplace.agentManagement',
      icon: 'icon-bug',
      router: 'ModelAgentList',
      permission: ['admin'],
    },
    {
      text: 'workplace.corpManagement',
      icon: 'icon-bar-chart',
      router: 'CorpList',
      permission: ['admin'],
    },
    {
      text: 'workplace.userManagement',
      icon: 'icon-user',
      router: 'UserList',
      permission: ['admin'],
    },
    {
      text: 'workplace.appManagement',
      icon: 'icon-apps',
      router: 'AppList',
      permission: ['admin'],
    },
    {
      text: 'workplace.appKeyManagement',
      icon: 'icon-safe',
      router: 'AppKeyList',
      permission: ['admin'],
    },
    {
      text: 'workplace.financeCenter',
      icon: 'icon-wechatpay',
      router: 'BillList',
      permission: ['admin'],
    },
    {
      text: 'workplace.chatManagement',
      icon: 'icon-message',
      router: 'ChatList',
      permission: ['user', 'admin'],
    },
  ];
</script>

<style scoped lang="less">
  .moduler-wrap .wrapper {
    margin-top: 7px;
    text-align: center;
    cursor: pointer;
  }
</style>
