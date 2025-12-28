<template>
  <div style="margin: 10px 0 30px 10px">
    <a-descriptions
      :column="2"
      bordered
      :value-style="{ width: '350px', padding: '5px 8px 5px 20px' }"
    >
      <a-descriptions-item
        :label="t('task.file.detail.label.trace_id')"
        :span="2"
      >
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
        :label="t('task.file.detail.label.creator')"
        :span="2"
      >
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
      <a-descriptions-item :label="t('task.file.detail.label.model')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.model }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('task.file.detail.label.remixed_from_file_id')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.remixed_from_file_id || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('task.file.detail.label.file_id')"
        :span="2"
      >
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
      <a-descriptions-item
        :label="t('task.file.detail.label.file_url')"
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
      <a-descriptions-item
        :label="t('task.file.detail.label.prompt')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.prompt }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('task.file.detail.label.width_height')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ `${currentData.width} × ${currentData.height}` }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('task.file.detail.label.seconds')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.seconds }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('task.file.detail.label.progress')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.progress || 0 }}
        </span>
      </a-descriptions-item>

      <a-descriptions-item :label="t('common.status')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.status === 'completed'" color="green">
            {{ $t(`task.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else-if="currentData.status === 'queued'" color="arcoblue">
            {{ $t(`task.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag
            v-else-if="currentData.status === 'in_progress'"
            color="orange"
          >
            {{ $t(`task.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else-if="currentData.status === 'failed'" color="red">
            {{ $t(`task.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else color="gray">
            {{ $t(`task.dict.status.${currentData.status}`) }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('task.file.detail.label.error')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.error || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="currentData.file_name"
        :label="t('task.file.detail.label.file_name')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.file_name }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="currentData.file_path"
        :label="t('task.file.detail.label.file_path')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.file_path }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('task.file.detail.label.completed_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.completed_at || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('task.file.detail.label.expires_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.expires_at || '-' }}
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
  import { ref, watch, getCurrentInstance } from 'vue';
  import { useClipboard } from '@vueuse/core';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
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
  const { proxy } = getCurrentInstance() as any;

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
      proxy.$message.success('复制成功');
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
