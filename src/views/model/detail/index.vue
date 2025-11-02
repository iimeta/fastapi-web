<template>
  <div style="margin: 10px 0 30px 10px">
    <a-descriptions
      :column="2"
      bordered
      :label-style="{ padding: '5px 8px 5px 15px' }"
      :value-style="{ width: '350px', padding: '5px 8px 5px 15px' }"
      style="margin-bottom: 15px"
    >
      <a-descriptions-item :label="t('common.provider')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.provider_name }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.name }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.model')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.model }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.type')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`dict.model_type.${currentData.type}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.baseUrl')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.base_url || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.path')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.path || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.billing_rule')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            $t(
              `model.dict.billing_rule.${currentData.pricing.billing_rule || 1}`
            )
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.billing_methods')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            $t(
              `model.dict.billing_methods.${
                currentData.pricing.billing_methods || 1
              }`
            )
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.request_data_format')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            t(`model.dict.data_format.${currentData.request_data_format || 1}`)
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('model.detail.label.response_data_format')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            t(`model.dict.data_format.${currentData.response_data_format || 1}`)
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('model.detail.label.group_names')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData?.group_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.isPublic')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`model.dict.is_public.${currentData.is_public || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('model.detail.label.is_enable_preset_config')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            t(
              `model.dict.is_enable_preset_config.${
                currentData.is_enable_preset_config || false
              }`
            )
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('model.detail.label.preset_config.is_support_system_role')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            t(
              `model.dict.is_support_system_role.${
                currentData?.preset_config?.is_support_system_role || false
              }`
            )
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('model.detail.label.preset_config.is_support_stream')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            t(
              `model.dict.is_support_system_role.${
                currentData?.preset_config?.is_support_stream || false
              }`
            )
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('model.detail.label.preset_config.system_role_prompt')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData?.preset_config?.system_role_prompt || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('model.detail.label.preset_config.min_tokens')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.preset_config?.min_tokens || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('model.detail.label.preset_config.max_tokens')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.preset_config?.max_tokens || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.isEnableModelAgent')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            t(
              `model.dict.is_enable_model_agent.${
                currentData.is_enable_model_agent || false
              }`
            )
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.lb_strategy')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.lb_strategy.${currentData.lb_strategy || 1}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('model.detail.label.modelAgentNames')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData?.model_agent_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.isEnableForward')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            t(
              `model.dict.is_enable_forward.${
                currentData.is_enable_forward || false
              }`
            )
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.forwardRule')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData?.forward_config?.forward_rule
              ? t(
                  `model.dict.forward_rule.${
                    currentData?.forward_config?.forward_rule || 1
                  }`
                )
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.content_length')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.forward_config?.content_length || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.targetModelName')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.forward_config?.target_model_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.matchRule')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData?.forward_config?.match_rule
              ? t(
                  `model.dict.match_rule.${
                    currentData?.forward_config?.match_rule || 1
                  }`
                )
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.decisionModelName')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.forward_config?.decision_model_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.keywords')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData?.forward_config?.keywords?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.targetModelNames')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{
            currentData?.forward_config?.target_model_names?.join('\n') || '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.is_enable_fallback')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            t(
              `model.dict.is_enable_fallback.${
                currentData.is_enable_fallback || false
              }`
            )
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('model.detail.label.fallback_model_agent_name')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.fallback_config?.model_agent_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.fallback_model_name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.fallback_config?.model_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.status')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.status === 1" color="green">
            {{ $t(`dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else color="red">
            {{ $t(`dict.status.${currentData.status}`) }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.remark')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.remark || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.created_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.created_at }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.updated_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.updated_at }}
        </span>
      </a-descriptions-item>
    </a-descriptions>

    <!-- 定价 -->
    <PricingDetail v-model="pricing" :model-type="modelType" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Pricing } from '@/api/common';
  import {
    queryModelDetail,
    ModelDetailParams,
    ModelDetail,
  } from '@/api/model';
  import PricingDetail from '../components/pricing_detail.vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<ModelDetail>({} as ModelDetail);
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const pricing = ref<Pricing>({ billing_items: [] } as unknown as Pricing);
  const modelType = ref(0);

  const getModelDetail = async (
    params: ModelDetailParams = { id: props.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelDetail(params);
      currentData.value = data;
      pricing.value = data.pricing;
      modelType.value = data.type;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelDetail();
</script>

<script lang="ts">
  export default {
    name: 'ModelDetail',
  };
</script>

<style scoped lang="less"></style>
