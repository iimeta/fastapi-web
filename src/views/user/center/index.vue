<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <lucide-user-round />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('user.center.menu') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-row class="user-center-panel-row">
      <a-col :span="24">
        <UserPanel />
      </a-col>
    </a-row>
    <a-row class="wrapper">
      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" :title="$t('user.center.tab.basic_info')">
            <BasicInformation />
          </a-tab-pane>
          <a-tab-pane key="2" :title="$t('user.center.tab.security_settings')">
            <SecuritySettings />
          </a-tab-pane>
          <a-tab-pane key="3" :title="$t('user.center.tab.privacy_settings')">
            <PrivacySettings />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import UserPanel from './components/user-panel.vue';
  import BasicInformation from './components/basic-information.vue';
  import SecuritySettings from './components/security-settings.vue';
  import PrivacySettings from './components/privacy-settings.vue';
</script>

<script lang="ts">
  export default {
    name: 'Setting',
  };
</script>

<style scoped lang="less">
  @import (reference) '../../../assets/style/tokens.less';

  .container {
    padding: @page-padding;
  }

  .user-center-panel-row {
    margin-bottom: 10px;
  }

  .wrapper {
    padding: 20px 0 0 20px;
    min-height: 580px;
    background-color: var(--color-bg-2);
    border-radius: 6px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
</style>
