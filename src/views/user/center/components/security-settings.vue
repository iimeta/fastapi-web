<template>
  <a-list :bordered="false">
    <a-list-item>
      <UpdatePwd />
    </a-list-item>
    <a-list-item>
      <UpdateEmail />
    </a-list-item>
  </a-list>
</template>

<script lang="ts" setup>
  import UpdatePwd from './security-settings/update-pwd.vue';
  import UpdateEmail from './security-settings/update-email.vue';
</script>

<script lang="ts">
  export default {
    name: 'SecuritySettings',
  };
</script>

<style scoped lang="less">
  // Keep local: security settings uses a custom arco-list layout for its three-column content.
  :deep(.arco-list-item) {
    &:not(:last-child) {
      border-bottom: none;
    }

    .arco-typography {
      margin-bottom: 20px;
    }
    .arco-list-item-meta-avatar {
      width: 70px;
      margin-right: 24px;
    }
    .arco-list-item-meta {
      padding: 0;
    }
  }

  // Keep local: this flex layout and divider styling are specific to the security settings list.
  :deep(.arco-list-item-meta-content) {
    flex: 1;
    border-bottom: 1px solid var(--color-neutral-3);
    .arco-list-item-meta-description {
      display: flex;
      .tip {
        width: 50%;
        color: rgb(var(--gray-6));
        margin-right: 24px;
      }
      .content {
        flex: 1 1 0;
      }
      .operation {
        margin-right: 6px;
      }
    }
  }
</style>
