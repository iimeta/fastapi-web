<template>
  <a-card
    class="general-card"
    :title="$t('workplace.quick.operation')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 20px 0 20px' }"
  >
    <template #extra>
      <a-link>{{ $t('workplace.quickOperation.setup') }}</a-link>
    </template>
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
    <a-divider class="split-line" style="margin: 0" />
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
      text: 'workplace.keyManagement',
      icon: 'icon-safe',
      router: 'KeyAppList',
      permission: ['user'],
    },
    {
      text: 'workplace.keyManagement',
      icon: 'icon-safe',
      router: 'KeyModelList',
      permission: ['admin'],
    },
    {
      text: 'workplace.advanced',
      icon: 'icon-settings',
      permission: ['user', 'admin'],
    },
  ];
</script>

<style scoped lang="less"></style>
