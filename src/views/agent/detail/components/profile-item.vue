<template>
  <div class="item-container">
    <a-space :size="16" direction="vertical" fill>
      <a-descriptions
        v-for="(item, idx) in blockDataList"
        :key="idx"
        :label-style="{
          textAlign: 'right',
          width: '200px',
          paddingRight: '10px',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{ width: '400px' }"
        :title="item.title"
        :data="item.data"
      >
        <template #value="{ value }">
          <a-skeleton v-if="loading" :animation="true">
            <a-skeleton-line :widths="['200px']" :rows="1" />
          </a-skeleton>
          <span v-else>{{ value }}</span>
        </template>
      </a-descriptions>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { computed, PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { ModelAgentDetail } from '@/api/agent';
  import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

  const props = defineProps({
    type: {
      type: String,
      default: '',
    },
    renderData: {
      type: Object as PropType<ModelAgentDetail>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const { t } = useI18n();
  const blockDataList = computed(() => {
    const { renderData } = props;
    const result = [];
    result.push({
      title: t('model.agent.detail.title.baseInfo'),
      data: [
        {
          label: t('model.agent.detail.label.name'),
          value: renderData.name,
        },
        {
          label: t('model.agent.detail.label.baseUrl'),
          value: renderData.base_url,
        },
        {
          label: t('model.agent.detail.label.path'),
          value: renderData?.path || '-',
        },
        {
          label: t('model.agent.detail.label.weight'),
          value: renderData?.weight || '-',
        },
        {
          label: t('model.agent.detail.label.remark'),
          value: renderData?.remark || '-',
        },
        {
          label: t('model.agent.detail.label.created_at'),
          value: renderData.created_at,
        },
        {
          label: t('model.agent.detail.label.updated_at'),
          value: renderData.updated_at,
        },
      ] as DescData[],
    });

    result.push({
      title: t('model.agent.detail.title.advanced'),
      data: [
        {
          label: t('model.agent.detail.label.models'),
          value: renderData?.model_names?.join('\n') || '-',
        },
      ] as DescData[],
    });

    return result;
  });
</script>

<style scoped lang="less">
  .item-container {
    padding-top: 20px;
    :deep(.arco-descriptions-item-label) {
      font-weight: normal;
    }
  }
</style>
