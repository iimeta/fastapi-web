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
          value: renderData.corp_name,
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
          label: t('model.detail.label.baseUrl'),
          value: renderData?.base_url || '-',
        },
        {
          label: t('model.detail.label.path'),
          value: renderData?.path || '-',
        },
        {
          label: t('model.detail.label.prompt'),
          value: renderData?.prompt || '-',
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
          label: t('model.detail.label.billingMethod'),
          value: t(`model.dict.billing_method.${renderData.billing_method}`),
        },
        {
          label: t('model.detail.label.promptRatio'),
          value:
            renderData.billing_method === 1 ? renderData.prompt_ratio : '-',
        },
        {
          label: t('model.detail.label.promptPrice'),
          value:
            renderData.billing_method === 1
              ? `$${renderData.prompt_price}/k`
              : '-',
        },
        {
          label: t('model.detail.label.completionRatio'),
          value:
            renderData.billing_method === 1 ? renderData.completion_ratio : '-',
        },
        {
          label: t('model.detail.label.completionPrice'),
          value:
            renderData.billing_method === 1
              ? `$${renderData.completion_price}/k`
              : '-',
        },
        {
          label: t('model.detail.label.fixedPrice'),
          value:
            renderData.billing_method === 2
              ? `$${renderData.fixed_price}/次`
              : '-',
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
        {
          label: t('model.detail.label.isEnableForward'),
          value: t(
            `model.dict.is_enable_forward.${
              renderData.is_enable_forward || false
            }`
          ),
        },
        {
          label: t('model.detail.label.forwardRule'),
          value: renderData?.forward_config?.forward_rule
            ? t(
                `model.dict.forward_rule.${
                  renderData?.forward_config?.forward_rule || 1
                }`
              )
            : '-',
        },
        {
          label: t('model.detail.label.targetModelName'),
          value: renderData?.forward_config?.target_model_name || '-',
        },
        {
          label: t('model.detail.label.matchRule'),
          value: renderData?.forward_config?.match_rule
            ? t(
                `model.dict.match_rule.${
                  renderData?.forward_config?.match_rule || 1
                }`
              )
            : '-',
        },
        {
          label: t('model.detail.label.decisionModelName'),
          value: renderData?.forward_config?.decision_model_name || '-',
        },
        {
          label: t('model.detail.label.keywords'),
          value: renderData?.forward_config?.keywords?.join('\n') || '-',
        },
        {
          label: t('model.detail.label.targetModelNames'),
          value:
            renderData?.forward_config?.target_model_names?.join('\n') || '-',
        },
        {
          label: t('model.detail.label.is_enable_fallback'),
          value: t(
            `model.dict.is_enable_fallback.${
              renderData.is_enable_fallback || false
            }`
          ),
        },
        {
          label: t('model.detail.label.fallback_model_name'),
          value: renderData?.fallback_config?.fallback_model_name || '-',
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
