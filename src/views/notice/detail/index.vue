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
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.title }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.content')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span
          v-else
          style="max-height: 500px; display: block; overflow: auto"
          v-html="currentData.content"
        >
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.category')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`notice.dict.category.${currentData.category}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.scope')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`notice.dict.scope.${currentData.scope}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.users')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.users?.toString() || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.resellers')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.resellers?.toString() || '-' }}
        </span>
      </a-descriptions-item>
      <!-- <a-descriptions-item :label="t('notice.detail.channels')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`notice.dict.channels.${currentData.channels}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.is_popup')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`dict.${currentData.is_popup || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.priority')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.priority }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.expires_at')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.expires_at || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.scheduled_time')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.scheduled_time || '-' }}
        </span>
      </a-descriptions-item> -->
      <a-descriptions-item :label="t('common.remark')" :span="2">
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
          <a-tag :color="currentData.status === 1 ? 'green' : ''">
            {{ $t(`notice.dict.status.${currentData.status}`) }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('notice.detail.publish_time')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.publish_time || '-' }}
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
