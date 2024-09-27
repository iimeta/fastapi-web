<template>
  <div v-show="currentData.type === 1" style="margin: 10px 0 0 10px">
    <a-descriptions
      :column="2"
      bordered
      :value-style="{ width: '350px', padding: '5px 8px 5px 20px' }"
    >
      <a-descriptions-item :label="t('common.key')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.key }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.app_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.app_id }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.user_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.user_id }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('key.detail.label.is_limit_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`dict.${currentData?.is_limit_quota || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('key.detail.label.quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData?.is_limit_quota
              ? currentData.quota > 0
                ? `$${quotaConv(currentData.quota)}`
                : '$0.00'
              : '不限'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('key.detail.label.used_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.used_quota > 0
              ? `$${quotaConv(currentData.used_quota)}`
              : '$0.00'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('key.detail.label.quota_expires_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData?.is_limit_quota
              ? currentData.quota_expires_at || '-'
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('key.detail.label.models')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData?.model_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('key.detail.label.ip_whitelist')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData?.ip_whitelist?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('key.detail.label.ip_blacklist')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData?.ip_blacklist?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.remark')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.remark || '-' }}
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
  </div>

  <div v-show="currentData.type === 2" style="margin: 10px 0 0 10px">
    <a-descriptions
      :column="2"
      bordered
      :value-style="{ width: '350px', padding: '5px 8px 5px 20px' }"
    >
      <a-descriptions-item :label="t('common.key')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.key }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.corp')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.corp_name }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('key.detail.label.used_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.used_quota > 0
              ? `$${quotaConv(currentData.used_quota)}`
              : '$0.00'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('key.detail.label.bind.models')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData?.model_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('key.detail.label.model_agent_names')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData?.model_agent_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('key.detail.label.is_agents_only')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`dict.${currentData?.is_agents_only || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('key.detail.label.is_auto_disabled')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`dict.${currentData?.is_auto_disabled || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('key.detail.label.auto_disabled_reason')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.auto_disabled_reason || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.remark')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.remark || '-' }}
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
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { quotaConv } from '@/utils/common';
  import { queryKeyDetail, KeyDetailParams, KeyDetail } from '@/api/key';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<KeyDetail>({} as KeyDetail);
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getKeyDetail = async (params: KeyDetailParams = { id: props.id }) => {
    setLoading(true);
    try {
      const { data } = await queryKeyDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getKeyDetail();
</script>

<script lang="ts">
  export default {
    name: 'KeyDetail',
  };
</script>

<style scoped lang="less"></style>
