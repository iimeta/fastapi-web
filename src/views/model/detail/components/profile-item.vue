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
  import { ModelDetail } from '@/api/model';

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
      type: Object as PropType<ModelDetail>,
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
      title: t('model.detail.title.baseInfo'),
      data: [
        {
          label: t('model.detail.label.corp'),
          value: t(`model.dict.corp.${renderData.corp}`),
        },
        {
          label: t('model.detail.label.name'),
          value: renderData.name,
        },
        {
          label: t('model.detail.label.model'),
          value: renderData.model,
        },
        {
          label: t('model.detail.label.type'),
          value: t(`model.dict.type.${renderData.type}`),
        },
        {
          label: t('model.detail.label.remark'),
          value: renderData?.remark || '-',
        },
      ],
    });

    result.push({
      title: t('model.detail.title.advanced'),
      data: [
        {
          label: t('model.detail.label.promptRatio'),
          value: renderData.prompt_ratio,
        },
        {
          label: t('model.detail.label.completionRatio'),
          value: renderData.completion_ratio,
        },
        {
          label: t('model.detail.label.dataFormat'),
          value: t(`model.dict.data_format.${renderData.data_format}`),
        },
        {
          label: t('model.detail.label.baseUrl'),
          value: renderData?.base_url || '-',
        },
        {
          label: t('model.detail.label.path'),
          value: renderData?.path || '-',
        },
        {
          label: t('model.detail.label.proxy'),
          value: renderData?.proxy || '-',
        },
        {
          label: t('model.detail.label.isPublic'),
          value: t(`model.dict.is_public.${renderData.is_public}`),
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
