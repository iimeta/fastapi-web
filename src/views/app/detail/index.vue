<template>
  <div style="margin: 10px 0 30px 10px">
    <a-descriptions
      :column="2"
      bordered
      :value-style="{ width: '350px', padding: '5px 8px 5px 20px' }"
    >
      <a-descriptions-item :label="t('common.app_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.app_id }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('app.detail.label.name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.name }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('app.detail.label.is_limit_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`dict.${currentData?.is_limit_quota || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('app.detail.label.quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota
            v-if="currentData.is_limit_quota"
            :model-value="currentData.quota"
          />
          <span v-else>
            {{ $t(`app.columns.quota.no_limit`) }}
          </span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('app.detail.label.used_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota :model-value="currentData.used_quota" />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('app.detail.label.quota_expires_at')">
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
      <a-descriptions-item :label="t('app.detail.label.models')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData?.model_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('app.detail.label.is_bind_group')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`dict.enable.${currentData.is_bind_group || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('app.detail.label.group')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.group_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('app.detail.label.ip_whitelist')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData?.ip_whitelist?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('app.detail.label.ip_blacklist')">
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
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { queryAppDetail, AppDetailParams, AppDetail } from '@/api/app';
  import Quota from '@/views/common/quota.vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<AppDetail>({} as AppDetail);
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getAppDetail = async (params: AppDetailParams = { id: props.id }) => {
    setLoading(true);
    try {
      const { data } = await queryAppDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getAppDetail();
</script>

<script lang="ts">
  export default {
    name: 'AppDetail',
  };
</script>

<style scoped lang="less"></style>
