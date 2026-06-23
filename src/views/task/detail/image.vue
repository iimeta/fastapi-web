<template>
  <div class="task-detail-container">
    <a-descriptions :column="2" bordered :value-style="descriptionValueStyle">
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
      <a-descriptions-item :label="$t('task.detail.response_format')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.response_format || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.image_id')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.image_id }}
          <icon-copy
            class="copy-btn"
            @click="handleCopy(currentData.image_id)"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="currentData.job_id"
        :label="$t('task.detail.job_id')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.job_id }}
          <icon-copy class="copy-btn" @click="handleCopy(currentData.job_id)" />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.image_url')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <div v-else>
          <div
            v-if="currentData.image_urls && currentData.image_urls.length > 1"
          >
            <div
              v-for="(url, index) in currentData.image_urls"
              :key="index"
              style="margin-bottom: 4px"
            >
              <span>{{ getFullUrl(url) }}</span>
              <icon-copy
                class="copy-btn"
                @click="handleCopy(getFullUrl(url))"
              />
            </div>
          </div>
          <span v-else>
            {{ getFullUrl(currentData.image_url) || '-' }}
            <icon-copy
              class="copy-btn"
              @click="handleCopy(getFullUrl(currentData.image_url))"
            />
          </span>
        </div>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.prompt')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.prompt }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.size')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.size || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.n')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.n || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.quality')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.quality || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.output_format')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.output_format || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.status')">
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
            {{ currentData.progress || 0 }}%
          </a-tag>
          <a-tag
            v-else-if="currentData.status === 'failed' || !currentData.status"
            color="red"
          >
            {{ $t(`task.dict.status.${currentData.status || 'failed'}`) }}
          </a-tag>
          <a-tag v-else color="gray">
            {{ $t(`task.dict.status.${currentData.status}`) }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.error')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="task-detail-scroll-110">
          {{ currentData.error || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="
          currentData.file_name ||
          (currentData.file_names && currentData.file_names.length > 0)
        "
        :label="$t('task.detail.file_name')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <div v-else>
          <div
            v-if="currentData.file_names && currentData.file_names.length > 1"
          >
            <div v-for="(name, index) in currentData.file_names" :key="index">
              {{ name }}
            </div>
          </div>
          <span v-else>{{ currentData.file_name }}</span>
        </div>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="
          currentData.file_path ||
          (currentData.file_paths && currentData.file_paths.length > 0)
        "
        :label="$t('task.detail.file_path')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <div v-else>
          <div
            v-if="currentData.file_paths && currentData.file_paths.length > 1"
          >
            <div v-for="(fp, index) in currentData.file_paths" :key="index">
              {{ fp }}
            </div>
          </div>
          <span v-else>{{ currentData.file_path }}</span>
        </div>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="
          currentData.input_file_paths &&
          currentData.input_file_paths.length > 0
        "
        :label="$t('task.detail.input_file_paths')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <div v-else>
          <div v-for="(fp, index) in currentData.input_file_paths" :key="index">
            {{ fp }}
          </div>
        </div>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.completed_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.completed_at || '-' }}
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
  import {
    queryImageDetail,
    DetailParams,
    ImageDetail,
    imageCopyField,
  } from '@/api/task';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const descriptionValueStyle = {
    width: '350px',
    padding: '5px 8px 5px 20px',
  };
  const currentData = ref<ImageDetail>({} as ImageDetail);
  const { copy, copied } = useClipboard();

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getImageDetail = async (params: DetailParams = { id: props.id }) => {
    setLoading(true);
    try {
      const { data } = await queryImageDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getImageDetail();

  const handleCopy = (content: string) => {
    copy(content);
  };

  watch(copied, () => {
    if (copied.value) {
      Message.success(t('success.copy'));
    }
  });

  const handleCopyField = async (id: string, field: string) => {
    const { data } = await imageCopyField({ id, field });
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
    name: 'TaskImageDetail',
  };
</script>

<style scoped lang="less">
  @import '../style/task-detail-shared.less';
</style>
