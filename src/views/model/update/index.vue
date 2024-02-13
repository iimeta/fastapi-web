<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-common />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model.update') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card" :bordered="false">
        <template #title>
          {{ $t('model.title.update') }}
        </template>
        <div class="wrapper">
          <a-steps
            v-model:current="step"
            style="width: 660px"
            line-less
            class="steps"
          >
            <a-step :description="$t('model.subTitle.baseInfo')">
              {{ $t('model.title.baseInfo') }}
            </a-step>
            <a-step :description="$t('model.subTitle.advanced')">
              {{ $t('model.title.advanced') }}
            </a-step>
            <a-step :description="$t('model.subTitle.update.finish')">
              {{ $t('model.title.update.finish') }}
            </a-step>
          </a-steps>
          <keep-alive>
            <BaseInfo v-if="step === 1" @change-step="changeStep" />
            <Advanced v-else-if="step === 2" @change-step="changeStep" />
            <Success v-else-if="step === 3" @change-step="changeStep" />
          </keep-alive>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    submitModelUpdate,
    ModelUpdate,
    ModelUpdateBaseInfo,
  } from '@/api/model';
  import BaseInfo from './components/base-info.vue';
  import Advanced from './components/advanced.vue';
  import Success from './components/success.vue';

  const { loading, setLoading } = useLoading(false);
  const step = ref(1);
  const submitModel = ref<ModelUpdate>({} as ModelUpdate);
  const submitForm = async () => {
    setLoading(true);
    try {
      await submitModelUpdate(submitModel.value); // The mock api default success
      step.value = 3;
      submitModel.value = {} as ModelUpdate; // init
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const changeStep = (
    direction: string | number,
    model: ModelUpdateBaseInfo | ModelUpdate
  ) => {
    if (typeof direction === 'number') {
      step.value = direction;
      return;
    }

    if (direction === 'forward' || direction === 'submit') {
      submitModel.value = {
        ...submitModel.value,
        ...model,
      };
      if (direction === 'submit') {
        submitForm();
        return;
      }
      step.value += 1;
    } else if (direction === 'backward') {
      step.value -= 1;
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'ModelUpdate',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 0;
    background-color: var(--color-bg-2);
    :deep(.arco-form) {
      .arco-form-item {
        &:last-child {
          margin-top: 20px;
        }
      }
    }
  }
  .steps {
    margin-bottom: 76px;
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
