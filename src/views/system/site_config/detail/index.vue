<template>
  <div style="margin: 10px 0 30px 10px">
    <a-descriptions
      :column="1"
      bordered
      :value-style="{ width: '350px', padding: '5px 8px 5px 20px' }"
    >
      <a-descriptions-item :label="t('site.config.detail.domain')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.domain }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.title')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.title }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.logo')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.logo }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.favicon')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.favicon }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.avatar')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.avatar || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.bg_img')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.bg_img || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.copyright')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.copyright || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.jump_url')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.jump_url || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.keywords')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.keywords || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.description')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.description || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.icp_beian')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.icp_beian || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.ga_beian')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.ga_beian || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.register_tips')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.register_tips || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.grant_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.grant_quota || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.quota_expires_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.quota_expires_at || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('site.config.detail.support_email_suffix')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData?.support_email_suffix?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.register_welcome')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span
          v-else
          style="max-height: 500px; display: block; overflow: auto"
          v-html="currentData.register_welcome"
        >
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.host')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.host || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.port')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.port || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.user_name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.user_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.password')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.password || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('site.config.detail.from_name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.from_name || '-' }}
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
  import {
    SiteConfigDetailParams,
    querySiteConfigDetail,
    SiteConfigDetail,
  } from '@/api/site_config';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<SiteConfigDetail>({} as SiteConfigDetail);
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getSiteConfigDetail = async (
    params: SiteConfigDetailParams = { id: props.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await querySiteConfigDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getSiteConfigDetail();
</script>

<script lang="ts">
  export default {
    name: 'SiteConfigDetail',
  };
</script>

<style scoped lang="less"></style>
