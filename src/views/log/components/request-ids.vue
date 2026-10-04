<template>
  <a-skeleton v-if="loading" :animation="true">
    <a-skeleton-line :rows="1" />
  </a-skeleton>
  <span v-else class="request-ids">{{ text }}</span>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
    requestIds: {
      type: Object,
      default: () => ({}),
    },
  });

  const text = computed(() => {
    const ids = props.requestIds as Record<string, string> | undefined;
    if (!ids) {
      return '-';
    }
    const keys = Object.keys(ids).sort();
    if (!keys.length) {
      return '-';
    }
    return keys.map((key) => `${key}: ${ids[key]}`).join('\n');
  });
</script>

<script lang="ts">
  export default {
    name: 'RequestIds',
  };
</script>

<style scoped>
  .request-ids {
    display: block;
    max-height: 220px;
    overflow: auto;
    white-space: pre-line;
    word-break: break-all;
  }
</style>
