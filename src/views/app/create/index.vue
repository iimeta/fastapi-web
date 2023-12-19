<template>
  <div class="container">
    <Breadcrumb :items="['menu.app', 'menu.app.create']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <template #title>
          {{ $t('app.title') }}
        </template>
        <div class="wrapper">
          <a-steps
            v-model:current="step"
            style="width: 580px"
            line-less
            class="steps"
          >
            <a-step :description="$t('app.subTitle.baseInfo')">
              {{ $t('app.title.baseInfo') }}
            </a-step>
            <a-step :description="$t('app.subTitle.advanced')">
              {{ $t('app.title.advanced') }}
            </a-step>
            <a-step :description="$t('app.subTitle.finish')">
              {{ $t('app.title.finish') }}
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
  import { submitAppCreate, AppCreate, AppBaseInfo } from '@/api/app';
  import BaseInfo from './components/base-info.vue';
  import Advanced from './components/advanced.vue';
  import Success from './components/success.vue';

  const { loading, setLoading } = useLoading(false);
  const step = ref(1);
  const submitApp = ref<AppCreate>({} as AppCreate);
  const submitForm = async () => {
    setLoading(true);
    try {
      await submitAppCreate(submitApp.value); // The mock api default success
      step.value = 3;
      submitApp.value = {} as AppCreate; // init
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const changeStep = (
    direction: string | number,
    model: AppBaseInfo | AppCreate
  ) => {
    if (typeof direction === 'number') {
      step.value = direction;
      return;
    }

    if (direction === 'forward' || direction === 'submit') {
      submitApp.value = {
        ...submitApp.value,
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
    name: 'AppCreate',
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
</style>
