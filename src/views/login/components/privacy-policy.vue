<template>
  <div v-html="content"> </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { queryPrivacyPolicy } from '@/api/open';

  const content = ref();

  onMounted(() => {
    queryPrivacyPolicy({
      domain: window.location.hostname,
      path: window.location.pathname,
    })
      .then((res) => {
        content.value = res.data.content;
      })
      .catch(() => {});
  });
</script>

<script lang="ts">
  export default {
    name: 'PrivacyPolicy',
  };
</script>

<style scoped lang="less"></style>
