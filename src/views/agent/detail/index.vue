<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-bug />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.agent') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model.agent.detail') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-space direction="vertical" :size="16" fill>
      <a-card class="general-card" :bordered="false">
        <ProfileItem :loading="loading" :render-data="currentData" />
      </a-card>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import useLoading from '@/hooks/loading';
  import {
    queryModelAgentDetail,
    ModelAgentDetailParams,
    ModelAgentDetail,
  } from '@/api/agent';
  import ProfileItem from './components/profile-item.vue';

  const { loading, setLoading } = useLoading(true);
  const route = useRoute();
  const currentData = ref<ModelAgentDetail>({} as ModelAgentDetail);

  const getModelAgentDetail = async (
    params: ModelAgentDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelAgentDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelAgentDetail();
</script>

<script lang="ts">
  export default {
    name: 'ModelAgentDetail',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 10px 20px 10px;
  }
  .container-breadcrumb {
    margin: 6px 0;
    :deep(.arco-breadcrumb-item) {
      color: rgb(var(--gray-6));
      &:last-child {
        color: rgb(var(--gray-8));
      }
    }
  }
</style>
