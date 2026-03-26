<template>
  <div class="detail-container">
    <a-descriptions :column="2" bordered :value-style="descriptionValueStyle">
      <a-descriptions-item :label="$t('notice.template.label.name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-scroll-110">
          {{ currentData.name }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('notice.template.label.scenes')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.scenes.toString() }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('notice.template.label.title')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-scroll-110">
          {{ currentData.title }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('notice.template.label.content')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-scroll-500" v-html="currentData.content">
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.remark')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-scroll-110">
          {{ currentData.remark || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.status')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag :color="currentData.status === 1 ? 'green' : 'red'">
            {{ $t(`dict.status.${currentData.status}`) }}
          </a-tag>
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
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    NoticeTemplateDetailParams,
    queryNoticeTemplateDetail,
    NoticeTemplateDetail,
  } from '@/api/notice_template';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<NoticeTemplateDetail>({} as NoticeTemplateDetail);
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

  const getNoticeTemplateDetail = async (
    params: NoticeTemplateDetailParams = { id: props.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryNoticeTemplateDetail(params);
      for (let i = 0; i < data.scenes.length; i += 1) {
        data.scenes[i] = t(`notice.template.dict.scenes.${data.scenes[i]}`);
      }
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getNoticeTemplateDetail();
</script>

<script lang="ts">
  export default {
    name: 'NoticeTemplateDetail',
  };
</script>

<style scoped lang="less">
  // 公共骨架已由 global.less 全局提供
  .detail-scroll-110 {
    display: block;
    max-height: 110px;
    overflow: auto;
  }
</style>
