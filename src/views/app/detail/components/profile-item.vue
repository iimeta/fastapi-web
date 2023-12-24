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
  import { AppDetail } from '@/api/app';

  type BlockList = {
    title: string;
    data: {
      label: string;
      value: string;
    }[];
  }[];

  const props = defineProps({
    type: {
      type: String,
      default: '',
    },
    renderData: {
      type: Object as PropType<AppDetail>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });
  const { t } = useI18n();
  const blockDataList = computed<BlockList>(() => {
    const { renderData } = props;
    const result = [];
    result.push({
      title: t('app.detail.title.baseInfo'),
      data: [
        {
          label: t('app.detail.label.appId'),
          value: renderData.app_id,
        },
        {
          label: t('app.detail.label.name'),
          value: renderData.name,
        },
        {
          label: t('app.detail.label.remark'),
          value: renderData?.remark || '-',
        },
      ],
    });

    result.push({
      title: t('app.detail.title.advanced'),
      data: [
        {
          label: t('app.detail.label.models'),
          value: renderData?.models ? renderData?.models.join('\n') : '-',
        },
        {
          label: t('app.detail.label.ip_whitelist'),
          value: renderData?.ip_whitelist || '-',
        },
        {
          label: t('app.detail.label.ip_blacklist'),
          value: renderData?.ip_blacklist || '-',
        },
      ],
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
