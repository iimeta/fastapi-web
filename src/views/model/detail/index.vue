<template>
  <div style="margin: 10px 0 30px 10px">
    <a-descriptions
      :column="2"
      bordered
      :label-style="{ padding: '5px 8px 5px 15px' }"
      :value-style="{ width: '350px', padding: '5px 8px 5px 15px' }"
    >
      <a-descriptions-item :label="t('common.corp')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.corp_name }}
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
      <a-descriptions-item :label="t('model.detail.label.dataFormat')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`model.dict.data_format.${currentData.data_format}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.isPublic')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`model.dict.is_public.${currentData.is_public}`) }}
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
              `model.dict.is_enable_model_agent.${currentData.is_enable_model_agent}`
            )
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('model.detail.label.modelAgentNames')">
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
      <!-- <a-descriptions-item :label="t('model.detail.label.billingMethod')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            $t(`model.dict.billing_method.${currentData.billing_method || 1}`)
          }}
        </span>
      </a-descriptions-item> -->
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
      <a-descriptions-item :label="t('model.detail.label.remark')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.remark || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.created_at')" :span="2">
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

    <!-- 文本额度 -->
    <a-table
      v-if="textQuotaVisible"
      style="margin-top: 15px"
      :data="textQuotas"
      :pagination="false"
      :bordered="false"
    >
      <template #columns>
        <a-table-column
          title="提问价格"
          data-index="prompt_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{
              record.billing_method === 1
                ? `$${priceConv(record.prompt_ratio)}/k`
                : '-'
            }}
          </template>
        </a-table-column>
        <a-table-column
          title="回答价格"
          data-index="completion_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{
              record.billing_method === 1
                ? `$${priceConv(record.completion_ratio)}/k`
                : `$${quotaConv(record.fixed_quota)}/次`
            }}
          </template>
        </a-table-column>
      </template>
    </a-table>

    <!-- 图像额度 -->
    <a-table
      v-if="imageQuotaVisible"
      style="margin-top: 15px"
      :data="imageQuotas"
      :pagination="false"
      :bordered="false"
    >
      <template #columns>
        <a-table-column
          title="宽度"
          data-index="width"
          align="center"
        ></a-table-column>
        <a-table-column title="高度" data-index="height" align="center">
        </a-table-column>
        <a-table-column title="价格" data-index="fixed_quota" align="center">
          <template #cell="{ record }">
            {{ `$${quotaConv(record.fixed_quota)}/张` }}
          </template>
        </a-table-column>
        <a-table-column title="默认" data-index="is_default" align="center">
          <template #cell="{ record }">
            {{ record.is_default ? '是' : '-' }}
          </template>
        </a-table-column>
      </template>
    </a-table>

    <!-- 音频额度 -->
    <a-table
      v-if="audioQuotaVisible"
      style="margin-top: 15px"
      :data="audioQuotas"
      :pagination="false"
      :bordered="false"
    >
      <template #columns>
        <a-table-column
          title="提问价格"
          data-index="prompt_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{
              currentData.type === 5
                ? record.billing_method === 1
                  ? `$${priceConv(record.prompt_ratio)}/k`
                  : `$${quotaConv(record.fixed_quota)}/次`
                : '-'
            }}
          </template>
        </a-table-column>
        <a-table-column
          title="回答价格"
          data-index="completion_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{
              currentData.type === 6
                ? record.billing_method === 1
                  ? `$${priceConv(record.completion_ratio)}/min`
                  : `$${quotaConv(record.fixed_quota)}/次`
                : '-'
            }}
          </template>
        </a-table-column>
      </template>
    </a-table>

    <!-- 多模态额度 -->
    <a-table
      v-if="multimodalQuotaVisible"
      style="margin-top: 15px"
      :data="multimodalTextQuotas"
      :pagination="false"
      :bordered="false"
    >
      <template #columns>
        <a-table-column
          title="文本提问价格"
          data-index="prompt_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{ `$${priceConv(record.prompt_ratio)}/k` }}
          </template>
        </a-table-column>
        <a-table-column
          title="文本回答价格"
          data-index="completion_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{ `$${priceConv(record.completion_ratio)}/k` }}
          </template>
        </a-table-column>
      </template>
    </a-table>

    <!-- 多模态识图额度 -->
    <a-table
      v-if="multimodalQuotaVisible"
      style="margin-top: 15px"
      :data="multimodalImageQuotas"
      :pagination="false"
      :bordered="false"
    >
      <template #columns>
        <a-table-column
          title="识图模式"
          data-index="mode"
          align="center"
        ></a-table-column>
        <a-table-column
          title="识图价格"
          data-index="fixed_quota"
          align="center"
        >
          <template #cell="{ record }">
            {{ `$${quotaConv(record.fixed_quota)}/张` }}
          </template>
        </a-table-column>
        <a-table-column title="默认" data-index="is_default" align="center">
          <template #cell="{ record }">
            {{ record.is_default ? '是' : '-' }}
          </template>
        </a-table-column>
      </template>
    </a-table>

    <!-- 多模态实时额度 -->
    <a-table
      v-if="realtimeQuotaVisible"
      style="margin-top: 15px"
      :data="realtimeQuotas"
      :pagination="false"
      :bordered="false"
    >
      <template #columns>
        <a-table-column
          title="文本提问价格"
          data-index="text_quota.prompt_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{ `$${priceConv(record.text_quota.prompt_ratio)}/k` }}
          </template>
        </a-table-column>
        <a-table-column
          title="文本回答价格"
          data-index="text_quota.completion_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{ `$${priceConv(record.text_quota.completion_ratio)}/k` }}
          </template>
        </a-table-column>
        <a-table-column
          title="音频提问价格"
          data-index="audio_quota.prompt_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{ `$${priceConv(record.audio_quota.prompt_ratio)}/k` }}
          </template>
        </a-table-column>
        <a-table-column
          title="音频回答价格"
          data-index="audio_quota.completion_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{ `$${priceConv(record.audio_quota.completion_ratio)}/k` }}
          </template>
        </a-table-column>
      </template>
    </a-table>

    <!-- 多模态语音额度 -->
    <a-table
      v-if="multimodalAudioQuotaVisible"
      style="margin-top: 15px"
      :data="multimodalAudioQuotas"
      :pagination="false"
      :bordered="false"
    >
      <template #columns>
        <a-table-column
          title="文本提问价格"
          data-index="text_quota.prompt_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{ `$${priceConv(record.text_quota.prompt_ratio)}/k` }}
          </template>
        </a-table-column>
        <a-table-column
          title="文本回答价格"
          data-index="text_quota.completion_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{ `$${priceConv(record.text_quota.completion_ratio)}/k` }}
          </template>
        </a-table-column>
        <a-table-column
          title="音频提问价格"
          data-index="audio_quota.prompt_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{ `$${priceConv(record.audio_quota.prompt_ratio)}/k` }}
          </template>
        </a-table-column>
        <a-table-column
          title="音频回答价格"
          data-index="audio_quota.completion_ratio"
          align="center"
        >
          <template #cell="{ record }">
            {{ `$${priceConv(record.audio_quota.completion_ratio)}/k` }}
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { priceConv, quotaConv } from '@/utils/common';
  import {
    queryModelDetail,
    ModelDetailParams,
    ModelDetail,
    TextQuota,
    ImageQuota,
    AudioQuota,
    RealtimeQuota,
    MultimodalAudioQuota,
  } from '@/api/model';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<ModelDetail>({} as ModelDetail);
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const textQuotaVisible = ref(false);
  const textQuotas = ref<TextQuota[]>([]);

  const imageQuotaVisible = ref(false);
  const imageQuotas = ref<ImageQuota[]>([]);

  const audioQuotaVisible = ref(false);
  const audioQuotas = ref<AudioQuota[]>([]);

  const multimodalQuotaVisible = ref(false);
  const multimodalTextQuotas = ref<TextQuota[]>([]);
  const multimodalImageQuotas = ref<ImageQuota[]>([]);

  const realtimeQuotaVisible = ref(false);
  const realtimeQuotas = ref<RealtimeQuota[]>([]);

  const multimodalAudioQuotaVisible = ref(false);
  const multimodalAudioQuotas = ref<MultimodalAudioQuota[]>([]);

  const getModelDetail = async (
    params: ModelDetailParams = { id: props.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelDetail(params);
      currentData.value = data;

      if (data.type === 2) {
        currentData.value.billing_method = 2;
        imageQuotaVisible.value = true;
        imageQuotas.value = data.image_quotas;
      } else if (data.type === 5 || data.type === 6) {
        currentData.value.billing_method = data.audio_quota.billing_method;
        audioQuotaVisible.value = true;
        audioQuotas.value[0] = data.audio_quota;
      } else if (data.type === 100) {
        multimodalQuotaVisible.value = true;
        multimodalTextQuotas.value[0] = data.multimodal_quota.text_quota;
        multimodalImageQuotas.value = data.multimodal_quota.image_quotas;
      } else if (data.type === 101) {
        realtimeQuotaVisible.value = true;
        realtimeQuotas.value[0] = data.realtime_quota;
      } else if (data.type === 102) {
        multimodalAudioQuotaVisible.value = true;
        multimodalAudioQuotas.value[0] = data.multimodal_audio_quota;
      } else {
        currentData.value.billing_method = data.text_quota.billing_method;
        textQuotaVisible.value = true;
        textQuotas.value[0] = data.text_quota;
      }
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
