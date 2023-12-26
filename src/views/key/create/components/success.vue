<template>
  <div class="success-wrap">
    <a-result
      status="success"
      :title="$t('key.success.title')"
      :subtitle="$t('key.success.create.subTitle')"
    />
    <a-space :size="16">
      <a-button
        key="finish"
        type="secondary"
        @click="$router.push({ name: 'KeyModelList' })"
      >
        {{ $t('key.button.finish') }}
      </a-button>
      <a-button key="again" type="primary" @click="oneMore">
        {{ $t('key.button.again') }}
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
