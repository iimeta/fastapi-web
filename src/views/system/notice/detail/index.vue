<template>
  <div style="margin: 10px 0 30px 10px">
    <a-descriptions
      :column="2"
      bordered
      :value-style="{ width: '350px', padding: '5px 8px 5px 20px' }"
    >
      <a-descriptions-item :label="t('notice.detail.title')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.title }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.title')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.title }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.logo')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.logo }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.favicon')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.favicon }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.avatar')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.avatar || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.bg_img')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.bg_img || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.copyright')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.copyright || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.jump_url')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.jump_url || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.keywords')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.keywords || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.description')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.description || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.icp_beian')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.icp_beian || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.ga_beian')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.ga_beian || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('notice.detail.register_tips')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.register_tips || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.grant_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.grant_quota || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('notice.detail.quota_expires_at')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.quota_expires_at || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('notice.detail.support_email_suffix')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData?.support_email_suffix?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.host')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.host || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.port')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.port || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.user_name')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.user_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.password')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.password || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.from_name')" :span="2">
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
      <a-descriptions-item :label="t('common.status')" :span="2">
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
      <a-descriptions-item :label="t('common.updated_at')" :span="2">
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
    NoticeDetailParams,
    queryNoticeDetail,
    NoticeDetail,
  } from '@/api/notice';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<NoticeDetail>({} as NoticeDetail);
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getNoticeDetail = async (
    params: NoticeDetailParams = { id: props.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryNoticeDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getNoticeDetail();
</script>

<script lang="ts">
  export default {
    name: 'NoticeDetail',
  };
</script>

<style scoped lang="less"></style>
