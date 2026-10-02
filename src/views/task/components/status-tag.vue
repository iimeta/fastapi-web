<template>
  <span
    :title="errMsg || undefined"
    :class="{ 'is-copyable': !!errMsg }"
    @click="handleCopy(errMsg)"
  >
    <slot />
  </span>
</template>

<script lang="ts" setup>
  import { watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { useClipboard } from '@vueuse/core';

  defineProps({
    errMsg: {
      type: String,
      default: '',
    },
  });

  const { t } = useI18n();
  const { copy, copied } = useClipboard();

  const handleCopy = async (content: string) => {
    if (content) {
      copy(content);
    }
  };

  watch(copied, () => {
    if (copied.value) {
      Message.success(t('success.copy'));
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'TaskStatusTag',
  };
</script>

<style scoped lang="less">
  .is-copyable :deep(.arco-tag) {
    cursor: pointer;
  }
</style>
