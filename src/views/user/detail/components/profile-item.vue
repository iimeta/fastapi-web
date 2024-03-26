<template>
  <div class="item-container">
    <a-space :size="16" direction="vertical" fill>
      <a-descriptions
        v-for="(item, idx) in blockDataList"
        :key="idx"
        :label-style="{
          textAlign: 'right',
          width: '200px',
          paddingRight: '10px',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{ width: '400px' }"
        :title="item.title"
        :data="item.data"
      >
        <template #value="{ value }">
          <a-skeleton v-if="loading" :animation="true">
            <a-skeleton-line :widths="['200px']" :rows="1" />
          </a-skeleton>
          <span v-else>{{ value }}</span>
        </template>
      </a-descriptions>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { computed, PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { UserDetail } from '@/api/admin_user';
  import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

  const props = defineProps({
    type: {
      type: String,
      default: '',
    },
    renderData: {
      type: Object as PropType<UserDetail>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const { t } = useI18n();
  const blockDataList = computed(() => {
    const { renderData } = props;
    const result = [];
    result.push({
      title: t('user.detail.title.baseInfo'),
      data: [
        {
          label: t('user.detail.label.userId'),
          value: renderData.user_id,
        },
        {
          label: t('user.detail.label.name'),
          value: renderData.name,
        },
        {
          label: t('user.detail.label.email'),
          value: renderData.email,
        },
        {
          label: t('user.detail.label.quota'),
          value: renderData.quota,
        },
        {
          label: t('user.detail.label.models'),
          value: renderData?.model_names?.join('\n') || '-',
        },
        {
          label: t('user.detail.label.remark'),
          value: renderData?.remark || '-',
        },
        {
          label: t('user.detail.label.created_at'),
          value: renderData.created_at,
        },
        {
          label: t('user.detail.label.updated_at'),
          value: renderData.updated_at,
        },
      ] as DescData[],
    });

    return result;
  });
</script>

<style scoped lang="less">
  .item-container {
    padding-top: 20px;
    :deep(.arco-descriptions-item-label) {
      font-weight: normal;
    }
  }
</style>
