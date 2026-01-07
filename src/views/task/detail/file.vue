<template>
  <div style="margin: 10px 0 30px 10px">
    <a-descriptions
      :column="2"
      bordered
      :value-style="{ width: '350px', padding: '5px 8px 5px 20px' }"
    >
      <a-descriptions-item :label="$t('common.trace_id')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.trace_id }}
          <icon-copy
            class="copy-btn"
            @click="handleCopy(currentData.trace_id)"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="currentData.batch_trace_id"
        :label="$t('task.detail.batch_trace_id')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.batch_trace_id }}
          <icon-copy
            class="copy-btn"
            @click="handleCopy(currentData.batch_trace_id)"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.creator')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.creator }}
          <icon-copy
            class="copy-btn"
            @click="handleCopyField(currentData.id, 'creator')"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.app_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.app_id }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.user_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.user_id }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.model')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.model }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.purpose')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.purpose || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.file_id')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.file_id }}
          <icon-copy
            class="copy-btn"
            @click="handleCopy(currentData.file_id)"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.file_name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.file_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.bytes')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ formatBytes(currentData.bytes) || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="currentData.file_url"
        :label="$t('task.detail.file_url')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ getFullUrl(currentData.file_url) || '-' }}
          <icon-copy
            class="copy-btn"
            @click="handleCopy(getFullUrl(currentData.file_url))"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.error')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.error || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="currentData.file_path"
        :label="$t('task.detail.file_path')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.file_path }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.status')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.status === 'processed'" color="green">
            {{ $t(`task.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else-if="currentData.status === 'uploaded'" color="uploaded">
            {{ $t(`task.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else-if="currentData.status === 'error'" color="red">
            {{ $t(`task.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else color="gray">
            {{ $t(`task.dict.status.${currentData.status}`) }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.expires_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.expires_at || '-' }}
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
  import { ref, watch } from 'vue';
  import { useClipboard } from '@vueuse/core';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { formatBytes } from '@/utils/common';
  import {
    queryFileDetail,
    DetailParams,
    FileDetail,
    fileCopyField,
  } from '@/api/task';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<FileDetail>({} as FileDetail);
  const { copy, copied } = useClipboard();

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getFileDetail = async (params: DetailParams = { id: props.id }) => {
    setLoading(true);
    try {
      const { data } = await queryFileDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getFileDetail();

  /**
   * 复制内容
   *
   * @param content 内容
   */
  const handleCopy = (content: string) => {
    copy(content);
  };

  watch(copied, () => {
    if (copied.value) {
      Message.success(t('success.copy'));
    }
  });

  /**
   * 复制字段值
   */
  const handleCopyField = async (id: string, field: string) => {
    const { data } = await fileCopyField({ id, field });
    copy(data.value);
  };

  const getFullUrl = (url: string) => {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return window.location.origin + (url.startsWith('/') ? url : `/${url}`);
  };
</script>

<script lang="ts">
  export default {
    name: 'TaskFileDetail',
  };
</script>

<style scoped lang="less">
  .copy-btn {
    color: gray;
    cursor: pointer;
  }
  .copy-btn:hover {
    color: rgb(var(--arcoblue-6));
  }
</style>
