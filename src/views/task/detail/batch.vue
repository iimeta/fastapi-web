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
      <a-descriptions-item :label="$t('task.detail.batch_id')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.batch_id }}
          <icon-copy
            class="copy-btn"
            @click="handleCopy(currentData.batch_id)"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.input_file_id')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.input_file_id }}
          <icon-copy
            class="copy-btn"
            @click="handleCopy(currentData.input_file_id)"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.output_file_id')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.output_file_id }}
          <icon-copy
            class="copy-btn"
            @click="handleCopy(currentData.output_file_id)"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="currentData.error_file_id"
        :label="$t('task.detail.error_file_id')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.error_file_id }}
          <icon-copy
            class="copy-btn"
            @click="handleCopy(currentData.error_file_id)"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.response_data')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.response_data || '-' }}
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
      <a-descriptions-item :label="$t('common.status')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.status === 'completed'" color="green">
            {{ $t(`task.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else-if="currentData.status === 'finalizing'" color="green">
            {{ $t(`task.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag
            v-else-if="currentData.status === 'validating'"
            color="arcoblue"
          >
            {{ $t(`task.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag
            v-else-if="currentData.status === 'in_progress'"
            color="orange"
          >
            {{ $t(`task.dict.status.${currentData.status}`) }}
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
      <a-descriptions-item :label="$t('task.detail.in_progress_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.in_progress_at || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('task.detail.finalizing_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.finalizing_at || '-' }}
        </span>
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
      <a-descriptions-item :label="$t('task.detail.cancelled_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.cancelled_at || currentData.cancelling_at || '-' }}
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
    queryBatchDetail,
    DetailParams,
    BatchDetail,
    batchCopyField,
  } from '@/api/task';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<BatchDetail>({} as BatchDetail);
  const { copy, copied } = useClipboard();

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getBatchDetail = async (params: DetailParams = { id: props.id }) => {
    setLoading(true);
    try {
      const { data } = await queryBatchDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getBatchDetail();

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
    const { data } = await batchCopyField({ id, field });
    copy(data.value);
  };
</script>

<script lang="ts">
  export default {
    name: 'TaskBatchDetail',
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
