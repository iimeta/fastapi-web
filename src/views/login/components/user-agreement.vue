<template>
  <div v-html="content"> </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { queryUserAgreement } from '@/api/open';

  const content = ref();

  onMounted(() => {
    queryUserAgreement({
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
    name: 'UserAgreement',
  };
</script>

<style scoped lang="less"></style>
