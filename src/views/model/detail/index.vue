<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-common />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model.detail') }}</a-breadcrumb-item>
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
    queryModelDetail,
    ModelDetailParams,
    ModelDetail,
  } from '@/api/model';
  import ProfileItem from './components/profile-item.vue';

  const { loading, setLoading } = useLoading(true);
  const route = useRoute();
  const currentData = ref<ModelDetail>({} as ModelDetail);

  const getModelDetail = async (
    params: ModelDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelDetail();
</script>

<script lang="ts">
  export default {
    name: 'ModelDetail',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  .container-breadcrumb {
    margin: 16px 0;
    :deep(.arco-breadcrumb-item) {
      color: rgb(var(--gray-6));
      &:last-child {
        color: rgb(var(--gray-8));
      }
    }
  }
</style>
