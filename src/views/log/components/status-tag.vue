<template>
  <span
    :title="errMsg || undefined"
    :class="{ 'is-copyable': !!errMsg }"
    @click="handleCopy(errMsg)"
  >
    <a-tag v-if="status === -1" color="red">
      {{ $t(`log.dict.status.${status}`) }}
    </a-tag>
    <a-tag v-else-if="status === 2" color="gold">
      {{ $t(`log.dict.status.${status}`) }}
    </a-tag>
    <a-tag v-else-if="status === 3" color="orange">
      {{ $t(`log.dict.status.${status}`) }}
    </a-tag>
    <a-tag v-else color="green">
      {{ $t(`log.dict.status.${status}`) }}
    </a-tag>
  </span>
</template>

<script lang="ts" setup>
  import { watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { useClipboard } from '@vueuse/core';

  defineProps({
    status: {
      type: Number,
      default: 1,
    },
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
    name: 'LogStatusTag',
  };
</script>

<style scoped lang="less">
  .is-copyable :deep(.arco-tag) {
    cursor: pointer;
  }
</style>
