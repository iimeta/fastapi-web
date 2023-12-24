<template>
  <div class="success-wrap">
    <a-result
      status="success"
      :title="$t('model.success.title')"
      :subtitle="$t('model.success.update.subTitle')"
    />
    <a-space :size="16">
      <a-button
        key="finish"
        type="secondary"
        @click="$router.push({ name: 'ModelList' })"
      >
        {{ $t('model.button.return') }}
      </a-button>
      <a-button
        key="again"
        type="primary"
        @click="
          $router.push({
            name: 'ModelDetail',
            query: { id: `${$route.query.id}` },
          })
        "
      >
        {{ $t('model.button.view') }}
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
