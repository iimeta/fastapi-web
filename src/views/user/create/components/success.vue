<template>
  <div class="success-wrap">
    <a-result
      status="success"
      :title="$t('app.success.title')"
      :subtitle="$t('app.success.create.subTitle')"
    />
    <a-space :size="16">
      <a-button
        key="finish"
        type="secondary"
        @click="$router.push({ name: 'AppList' })"
      >
        {{ $t('app.button.finish') }}
      </a-button>
      <a-button key="again" type="primary" @click="oneMore">
        {{ $t('app.button.again') }}
      </a-button>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  const emits = defineEmits(['changeStep']);
  const oneMore = () => {
    emits('changeStep', 1);
  };
</script>

<style scoped lang="less">
  .success-wrap {
    text-align: center;
  }
  :deep(.arco-result) {
    padding-top: 0;
  }
  .details-wrapper {
    width: 895px;
    margin-top: 54px;
    padding: 20px;
    text-align: left;
    background-color: var(--color-fill-2);
  }
</style>
