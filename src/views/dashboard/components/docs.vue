<template>
  <a-card
    class="general-card"
    :title="appStore.getDocumentTitle"
    :header-style="cardHeaderStyle"
    :body-style="cardBodyStyle"
    :bordered="false"
  >
    <template #extra>
      <a-link
        v-if="appStore.getDocumentMoreUrl"
        :href="appStore.getDocumentMoreUrl"
        target="_blank"
      >
        {{ $t('dashboard.view_more') }}
      </a-link>
    </template>
    <a-row>
      <a-col
        v-for="(document, idx) in appStore.getDocuments"
        :key="idx"
        :span="12"
      >
        <a-link :href="document.jump_url" target="_blank">
          {{ document.title }}
        </a-link>
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';

  const appStore = useAppStore();

  const cardHeaderStyle = { padding: '10px 20px 0 20px', height: '36px' };
  const cardBodyStyle = { padding: '10px 20px 10px 20px' };
</script>

<script lang="ts">
  export default {
    name: 'Docs',
  };
</script>

<style lang="less" scoped>
  .arco-card-body .arco-link {
    margin: 2px 0;
    color: rgb(var(--gray-8));
  }
</style>
