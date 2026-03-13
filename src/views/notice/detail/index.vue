<template>
  <div class="detail-container">
    <a-descriptions
      :column="2"
      bordered
      :value-style="descriptionValueStyle"
    >
      <a-descriptions-item :label="$t('notice.label.title')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{ currentData.title }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('notice.label.content')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span
          v-else
          class="detail-scroll-500"
          v-html="currentData.content"
        >
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('notice.label.category')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`notice.dict.category.${currentData.category}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('notice.label.scope')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`notice.dict.scope.${currentData.scope}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.user')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-scroll-200">
          {{
            currentData.scope === 1 || currentData.scope === 2
              ? $t('common.all')
              : currentData.scope === 4 || currentData.scope === 6
              ? currentData.users?.join('\n') || '-'
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.reseller')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-scroll-200">
          {{
            currentData.scope === 1 || currentData.scope === 3
              ? $t('common.all')
              : currentData.scope === 5 || currentData.scope === 6
              ? currentData.resellers?.join('\n') || '-'
              : '-'
          }}
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
      <a-descriptions-item :label="$t('common.status')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag :color="currentData.status === 1 ? 'green' : ''">
            {{ $t(`notice.dict.status.${currentData.status}`) }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.publish_time')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.publish_time || '-' }}
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
  import {
    NoticeDetailParams,
    queryNoticeDetail,
    NoticeDetail,
  } from '@/api/notice';

  const { loading, setLoading } = useLoading(true);
  const currentData = ref<NoticeDetail>({} as NoticeDetail);
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

<style scoped lang="less">
  // 公共骨架已由 global.less 全局提供
  .detail-scroll-200 {
    display: block;
    max-height: 200px;
    overflow: auto;
  }
</style>
