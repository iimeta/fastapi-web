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
  import { ModelDetail } from '@/api/model';
  import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

  const props = defineProps({
    type: {
      type: String,
      default: '',
    },
    renderData: {
      type: Object as PropType<ModelDetail>,
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
      title: t('model.detail.title.baseInfo'),
      data: [
        {
          label: t('model.detail.label.corp'),
          value: t(`model.dict.corp.${renderData.corp}`),
        },
        {
          label: t('model.detail.label.name'),
          value: renderData.name,
        },
        {
          label: t('model.detail.label.model'),
          value: renderData.model,
        },
        {
          label: t('model.detail.label.type'),
          value: t(`model.dict.type.${renderData.type}`),
        },
        {
          label: t('model.detail.label.remark'),
          value: renderData?.remark || '-',
        },
        {
          label: t('model.detail.label.created_at'),
          value: renderData.created_at,
        },
        {
          label: t('model.detail.label.updated_at'),
          value: renderData.updated_at,
        },
      ] as DescData[],
    });

    result.push({
      title: t('model.detail.title.advanced'),
      data: [
        {
          label: t('model.detail.label.promptRatio'),
          value: renderData.prompt_ratio,
        },
        {
          label: t('model.detail.label.completionRatio'),
          value: renderData.completion_ratio,
        },
        {
          label: t('model.detail.label.dataFormat'),
          value: t(`model.dict.data_format.${renderData.data_format}`),
        },
        {
          label: t('model.detail.label.isPublic'),
          value: t(`model.dict.is_public.${renderData.is_public}`),
        },
        {
          label: t('model.detail.label.isEnableModelAgent'),
          value: t(
            `model.dict.is_enable_model_agent.${renderData.is_enable_model_agent}`
          ),
        },
        {
          label: t('model.detail.label.modelAgentNames'),
          value: renderData?.model_agent_names?.join('\n') || '-',
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
