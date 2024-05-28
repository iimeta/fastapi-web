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
  import { KeyDetail } from '@/api/key';
  import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

  const props = defineProps({
    type: {
      type: String,
      default: '',
    },
    renderData: {
      type: Object as PropType<KeyDetail>,
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
      title: t('key.detail.title.baseInfo'),
      data: [
        {
          label:
            renderData.type === 1
              ? t('key.detail.label.app_id')
              : t('key.detail.label.corp'),
          value: renderData.type === 1 ? renderData.app_id : renderData.corp,
        },
        {
          label: t('key.detail.label.key'),
          value: renderData.key,
        },
        {
          label: t('key.detail.label.quota'),
          value: renderData?.quota || '-',
        },
        {
          label: t('key.detail.label.remark'),
          value: renderData?.remark || '-',
        },
        {
          label: t('key.detail.label.created_at'),
          value: renderData.created_at,
        },
        {
          label: t('key.detail.label.updated_at'),
          value: renderData.updated_at,
        },
      ] as DescData[],
    });

    if (renderData.type === 1) {
      result.push({
        title: t('key.detail.title.advanced'),
        data: [
          {
            label: t('key.detail.label.models'),
            value: renderData?.model_names?.join('\n') || '-',
          },
          {
            label: t('key.detail.label.ip_whitelist'),
            value: renderData.ip_whitelist?.join('\n') || '-',
          },
          {
            label:
              renderData.type === 1 ? t('key.detail.label.ip_blacklist') : '',
            value:
              renderData.type === 1
                ? renderData.ip_blacklist?.join('\n') || '-'
                : '',
          },
        ] as DescData[],
      });
    }

    if (renderData.type === 2) {
      result.push({
        title: t('key.detail.title.advanced'),
        data: [
          {
            label: t('key.detail.label.models'),
            value: renderData?.model_names?.join('\n') || '-',
          },
          {
            label: t('key.detail.label.modelAgentNames'),
            value: renderData?.model_agent_names?.join('\n') || '-',
          },
          {
            label: t('key.detail.label.isAgentsOnly'),
            value: t(`key.dict.is_agents_only.${renderData.is_agents_only}`),
          },
        ] as DescData[],
      });
    }

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
