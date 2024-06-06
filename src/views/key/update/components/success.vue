<template>
  <div class="success-wrap">
    <a-result
      status="success"
      :title="$t('key.success.title')"
      :subtitle="$t('key.success.update.subTitle')"
    />
    <a-space :size="16">
      <a-button
        key="finish"
        type="secondary"
        @click="$router.push({ name: 'ModelKeyList' })"
      >
        {{ $t('key.button.return') }}
      </a-button>
      <a-button
        key="again"
        type="primary"
        @click="
          $router.push({
            name: 'KeyDetail',
            query: { id: `${$route.query.id}` },
          })
        "
      >
        {{ $t('key.button.view') }}
      </a-button>
    </a-space>
  </div>
</template>

<script lang="ts" setup></script>

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
