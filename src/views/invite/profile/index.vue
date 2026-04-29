<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item><lucide-gift /></a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('invite.menu') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('invite.menu.profile') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <InviteOverview />
  </div>
</template>

<script lang="ts" setup>
  import InviteOverview from '@/views/dashboard/components/invite-overview.vue';
</script>

<script lang="ts">
  export default {
    name: 'InviteProfile',
  };
</script>
