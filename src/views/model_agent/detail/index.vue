<template>
  <div class="detail-container">
    <a-descriptions :column="2" bordered :value-style="descriptionValueStyle">
      <a-descriptions-item :label="$t('common.provider')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.provider_name }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('model.agent.label.name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.name }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('model.agent.label.base_url')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.base_url }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('model.agent.label.path')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.path || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.bind_group')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--tall">
          {{ currentData?.group_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.bind_models')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--tall">
          {{ currentData?.model_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.billing_methods')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.billing_methods.${currentData.billing_methods || 1}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.weight')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.weight || 0 }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('model.agent.label.replace_models')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.${currentData?.is_enable_model_replace || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('model.agent.label.is_enable_health_check')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.${currentData?.is_enable_health_check || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('model.agent.label.is_enable_session_keep')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.${currentData?.is_enable_session_keep || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="currentData.is_enable_session_keep"
        :label="$t('model.agent.label.session_keep_ttl')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.session_keep_config?.ttl || '-' }}
          {{ $t('unit.second') }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="currentData.is_enable_session_keep"
        :label="$t('model.agent.label.session_keep_fail_ttl')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.session_keep_config?.fail_ttl || '-' }}
          {{ $t('unit.second') }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="currentData.is_enable_session_keep"
        :label="$t('model.agent.label.session_keep_fail_switch_threshold')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.session_keep_config?.fail_switch_threshold || '-' }}
          {{ $t('unit.once') }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="currentData.is_enable_session_keep"
        :label="$t('model.agent.label.session_keep_user_limit')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.session_keep_config?.user_limit || '-' }}
          {{ $t('unit.item') }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="currentData.is_enable_session_keep"
        :label="$t('model.agent.label.session_keep_agent_total_limit')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.session_keep_config?.agent_limit || '-' }}
          {{ $t('unit.item') }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="currentData.is_enable_session_keep"
        :label="$t('model.agent.detail.session_keep_count')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.session_keep_count || 0 }}
          {{ $t('unit.item') }}
          <a-button
            size="mini"
            status="danger"
            style="margin-left: 8px"
            @click="handleClearSessionKeepCache"
          >
            {{ $t('button.clear') }}
          </a-button>
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('model.agent.label.is_remove_abnormal_model')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.${currentData?.is_remove_abnormal_model || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('model.agent.label.is_never_disable')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.${currentData?.is_never_disable || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('model.agent.label.data_passthrough')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            $t(`dict.enable.${currentData.is_enable_data_passthrough || false}`)
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('model.agent.label.req_passthrough')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <template v-if="currentData.req_passthrough_params?.length">
            <a-tag
              v-for="item in currentData.req_passthrough_params"
              :key="item"
              size="small"
              style="margin-right: 4px"
            >
              {{ $t(`dict.req_passthrough.${item}`) }}
            </a-tag>
          </template>
          <template v-else>-</template>
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('model.agent.label.req_header_passthrough_mode')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.req_passthrough_params?.includes('req_header')
              ? $t(
                  `dict.passthrough_mode.${
                    currentData.req_header_passthrough_mode || 1
                  }`
                )
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('model.agent.label.req_header_passthrough_list')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.req_header_passthrough_list?.join(', ') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('model.agent.label.res_passthrough')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <template v-if="currentData.res_passthrough_params?.length">
            <a-tag
              v-for="item in currentData.res_passthrough_params"
              :key="item"
              size="small"
              style="margin-right: 4px"
            >
              {{ $t(`dict.res_passthrough.${item}`) }}
            </a-tag>
          </template>
          <template v-else>-</template>
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('model.agent.label.res_header_passthrough_mode')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.res_passthrough_params?.includes('res_header')
              ? $t(
                  `dict.passthrough_mode.${
                    currentData.res_header_passthrough_mode || 1
                  }`
                )
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('model.agent.label.res_header_passthrough_list')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.res_header_passthrough_list?.join(', ') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('model.agent.detail.abnormal_models')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--tall">
          {{ currentData?.abnormal_model_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('model.agent.detail.fallback_models')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--tall">
          {{ currentData?.fallback_model_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('model.agent.label.lb_strategy')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.lb_strategy.${currentData.lb_strategy || 1}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.key')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--tall">
          {{ currentData.key || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('key.detail.is_auto_disabled')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.${currentData?.is_auto_disabled || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.status')">
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
      <a-descriptions-item
        :label="$t('key.detail.auto_disabled_reason')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{ currentData.auto_disabled_reason || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.remark')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{ currentData.remark || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.created_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.created_at }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.updated_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.updated_at }}
        </span>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Message, Modal } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import {
    queryModelAgentDetail,
    ModelAgentDetailParams,
    ModelAgentDetail,
    clearModelAgentSessionKeepCache,
  } from '@/api/model_agent';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const currentData = ref<ModelAgentDetail>({} as ModelAgentDetail);
  const descriptionValueStyle = {
    width: '350px',
    padding: '5px 8px 5px 20px',
  };
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getModelAgentDetail = async (
    params: ModelAgentDetailParams = { id: props.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelAgentDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelAgentDetail();

  const handleClearSessionKeepCache = () => {
    Modal.warning({
      title: t('modal.warning.title'),
      titleAlign: 'center',
      content: t('model.agent.placeholder.clear'),
      okText: t('button.ok'),
      cancelText: t('button.cancel'),
      hideCancel: false,
      onOk: async () => {
        await clearModelAgentSessionKeepCache({ id: currentData.value.id });
        Message.success(t('success.operate'));
        getModelAgentDetail();
      },
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'ModelAgentDetail',
  };
</script>

<style scoped lang="less">
  // 公共骨架已由 global.less 全局提供
</style>
