<template>
  <!-- 总花费 -->
  <a-table
    :columns="totalSpendColumns"
    :data="totalSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <!-- 文本 -->
    <template #text="{ record }">
      <Quota :model-value="record.text.spend_tokens" />
    </template>

    <!-- 文本缓存 -->
    <template #text_cache="{ record }">
      <Quota :model-value="record.text_cache.spend_tokens" />
    </template>

    <!-- 音频 -->
    <template #audio="{ record }">
      <Quota :model-value="record.audio.spend_tokens" />
    </template>

    <!-- 音频缓存 -->
    <template #audio_cache="{ record }">
      <Quota :model-value="record.audio_cache.spend_tokens" />
    </template>

    <!-- 阶梯文本 -->
    <template #tiered_text="{ record }">
      <Quota :model-value="record.tiered_text.spend_tokens" />
    </template>

    <!-- 阶梯文本缓存 -->
    <template #tiered_text_cache="{ record }">
      <Quota :model-value="record.tiered_text_cache.spend_tokens" />
    </template>

    <!-- 图像 -->
    <template #image="{ record }">
      <Quota :model-value="record.image.spend_tokens" />
    </template>

    <!-- 图像生成 -->
    <template #image_generation="{ record }">
      <Quota :model-value="record.image_generation.spend_tokens" />
    </template>

    <!-- 图像缓存 -->
    <template #image_cache="{ record }">
      <Quota :model-value="record.image_cache.spend_tokens" />
    </template>

    <!-- 识图 -->
    <template #vision="{ record }">
      <Quota :model-value="record.vision.spend_tokens" />
    </template>

    <!-- 视频 -->
    <template #video="{ record }">
      <Quota :model-value="record.video.spend_tokens" />
    </template>

    <!-- 搜索 -->
    <template #search="{ record }">
      <Quota :model-value="record.search.spend_tokens" />
    </template>

    <!-- Midjourney -->
    <template #midjourney="{ record }">
      <Quota :model-value="record.midjourney.spend_tokens" />
    </template>

    <!-- 一次 -->
    <template #once="{ record }">
      <Quota :model-value="record.once.spend_tokens" />
    </template>

    <!-- 分组折扣 -->
    <template #group_discount="{ record }">
      {{
        record.group_discount > 0
          ? Number((record.group_discount * 100).toFixed(2)) + '%'
          : '-'
      }}
    </template>

    <!-- 总花费 -->
    <template #total_spend_tokens="{ record }">
      <Quota :model-value="record.total_spend_tokens" />
    </template>
  </a-table>

  <!-- 文本 -->
  <a-table
    v-if="spend.billing_items.includes('text') && textSpend.length"
    :columns="textSpendColumns"
    :data="textSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #input_tokens="{ record }">
      {{ parseQuota(record.input_tokens) || '0' }}
    </template>
    <template #input_ratio="{ record }">
      <Quota :model-value="record.pricing.input_ratio" /> / M
    </template>
    <template #output_tokens="{ record }">
      {{ parseQuota(record.output_tokens) || '0' }}
    </template>
    <template #output_ratio="{ record }">
      <Quota :model-value="record.pricing.output_ratio" /> / M
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>

  <!-- 文本缓存 -->
  <a-table
    v-if="spend.billing_items.includes('text_cache') && textCacheSpend.length"
    :columns="textCacheSpendColumns"
    :data="textCacheSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #read_tokens="{ record }">
      {{ parseQuota(record.read_tokens) || '0' }}
    </template>
    <template #read_ratio="{ record }">
      <Quota :model-value="record.pricing.read_ratio" /> / M
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>

  <!-- 音频 -->
  <a-table
    v-if="spend.billing_items.includes('audio') && audioSpend.length"
    :columns="audioSpendColumns"
    :data="audioSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #input_tokens="{ record }">
      {{ parseQuota(record.input_tokens) || '0' }}
    </template>
    <template #input_ratio="{ record }">
      <Quota :model-value="record.pricing.input_ratio" /> / M
    </template>
    <template #output_tokens="{ record }">
      {{
        modelType === 6
          ? record.output_tokens / 1000000 || '0'
          : record.output_tokens || '0'
      }}
    </template>
    <template #output_ratio="{ record }">
      <Quota :model-value="record.pricing.output_ratio" />
      {{ modelType === 5 || modelType === 6 ? '/ min' : '/ M' }}
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>

  <!-- 音频缓存 -->
  <a-table
    v-if="spend.billing_items.includes('audio_cache') && audioCacheSpend.length"
    :columns="audioCacheSpendColumns"
    :data="audioCacheSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #read_tokens="{ record }">
      {{ parseQuota(record.read_tokens) || '0' }}
    </template>
    <template #read_ratio="{ record }">
      <Quota :model-value="record.pricing.read_ratio" /> / M
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>

  <!-- 阶梯文本 -->
  <a-table
    v-if="spend.billing_items.includes('tiered_text') && tieredTextSpend.length"
    :columns="tieredTextSpendColumns"
    :data="tieredTextSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #mode="{ record }">
      {{ $t(`model.dict.mode.${record.pricing.mode}`) }}
    </template>
    <template #gt="{ record }">
      {{ record.pricing.gt }}k - {{ record.pricing.lte }}k
    </template>
    <template #input_tokens="{ record }">
      {{ parseQuota(record.input_tokens) || '0' }}
    </template>
    <template #input_ratio="{ record }">
      <Quota :model-value="record.pricing.input_ratio" /> / M
    </template>
    <template #output_tokens="{ record }">
      {{ parseQuota(record.output_tokens) || '0' }}
    </template>
    <template #output_ratio="{ record }">
      <Quota :model-value="record.pricing.output_ratio" /> / M
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>

  <!-- 阶梯文本缓存 -->
  <a-table
    v-if="
      spend.billing_items.includes('tiered_text_cache') &&
      tieredTextCacheSpend.length
    "
    :columns="tieredTextCacheSpendColumns"
    :data="tieredTextCacheSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #mode="{ record }">
      {{ $t(`model.dict.mode.${record.pricing.mode}`) }}
    </template>
    <template #gt="{ record }">
      {{ record.pricing.gt }}k - {{ record.pricing.lte }}k
    </template>
    <template #read_tokens="{ record }">
      {{ parseQuota(record.read_tokens) || '0' }}
    </template>
    <template #read_ratio="{ record }">
      <Quota :model-value="record.pricing.read_ratio" /> / M
    </template>
    <template #write_tokens="{ record }">
      {{ parseQuota(record.write_tokens) || '0' }}
    </template>
    <template #write_ratio="{ record }">
      <Quota :model-value="record.pricing.write_ratio" /> / M
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>

  <!-- 图像 -->
  <a-table
    v-if="spend.billing_items.includes('image') && imageSpend.length"
    :columns="imageSpendColumns"
    :data="imageSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #input_tokens="{ record }">
      {{ parseQuota(record.input_tokens) || '0' }}
    </template>
    <template #input_ratio="{ record }">
      <Quota :model-value="record.pricing.input_ratio" /> / M
    </template>
    <template #output_tokens="{ record }">
      {{ parseQuota(record.output_tokens) || '0' }}
    </template>
    <template #output_ratio="{ record }">
      <Quota :model-value="record.pricing.output_ratio" /> / M
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>

  <!-- 图像生成 -->
  <a-table
    v-if="
      spend.billing_items.includes('image_generation') &&
      imageGenerationSpend.length
    "
    :columns="imageGenerationSpendColumns"
    :data="imageGenerationSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #quality="{ record }">
      {{ record.pricing.quality || '-' }}
    </template>
    <template #width="{ record }">
      {{ record.pricing.width }} × {{ record.pricing.height }}
    </template>
    <template #n="{ record }"> {{ record.n || '0' }} </template>
    <template #once_ratio="{ record }">
      <Quota :model-value="record.pricing.once_ratio" /> / 张
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>

  <!-- 图像缓存 -->
  <a-table
    v-if="spend.billing_items.includes('image_cache') && imageCacheSpend.length"
    :columns="imageCacheSpendColumns"
    :data="imageCacheSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #read_tokens="{ record }">
      {{ parseQuota(record.read_tokens) || '0' }}
    </template>
    <template #read_ratio="{ record }">
      <Quota :model-value="record.pricing.read_ratio" /> / M
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>

  <!-- 识图 -->
  <a-table
    v-if="spend.billing_items.includes('vision') && visionSpend.length"
    :columns="visionSpendColumns"
    :data="visionSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #mode="{ record }">
      {{ record.pricing.mode }}
    </template>
    <template #once_ratio="{ record }">
      <Quota :model-value="record.pricing.once_ratio" /> / 张
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>

  <!-- 视频 -->
  <a-table
    v-if="spend.billing_items.includes('video') && videoSpend.length"
    :columns="videoSpendColumns"
    :data="videoSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #width="{ record }">
      {{ record.pricing.width }} × {{ record.pricing.height }}
    </template>
    <template #once_ratio="{ record }">
      <Quota :model-value="record.pricing.once_ratio" /> / 秒
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>

  <!-- 搜索 -->
  <a-table
    v-if="spend.billing_items.includes('search') && searchSpend.length"
    :columns="searchSpendColumns"
    :data="searchSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #context_size="{ record }">
      {{ record.pricing.context_size }}
    </template>
    <template #once_ratio="{ record }">
      <Quota :model-value="record.pricing.once_ratio" /> / 次
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>

  <!-- Midjourney -->
  <a-table
    v-if="spend.billing_items.includes('midjourney') && midjourneySpend.length"
    :columns="midjourneySpendColumns"
    :data="midjourneySpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #name="{ record }">
      {{ record.pricing.name }}
    </template>
    <template #action="{ record }">
      {{ record.pricing.action }}
    </template>
    <template #path="{ record }">
      {{ record.pricing.path }}
    </template>
    <template #once_ratio="{ record }">
      <Quota :model-value="record.pricing.once_ratio" /> / 次
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>

  <!-- 一次 -->
  <a-table
    v-if="spend.billing_items.includes('once') && onceSpend.length"
    :columns="onceSpendColumns"
    :data="onceSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #input_tokens="{ record }">
      {{ parseQuota(record.input_tokens) || '0' }}
    </template>
    <template #output_tokens="{ record }">
      {{ parseQuota(record.output_tokens) || '0' }}
    </template>
    <template #once_ratio="{ record }">
      <Quota :model-value="record.pricing.once_ratio" /> / 次
    </template>
    <template #spend_tokens="{ record }">
      <Quota :model-value="record.spend_tokens" />
    </template>
  </a-table>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { parseQuota } from '@/utils/common';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import {
    Spend,
    TextSpend,
    CacheSpend,
    AudioSpend,
    ImageSpend,
    ImageGenerationSpend,
    VisionSpend,
    VideoSpend,
    SearchSpend,
    MidjourneySpend,
    OnceSpend,
  } from '@/api/common';
  import Quota from '@/views/common/quota.vue';

  const { t } = useI18n();

  const props = defineProps<{
    modelValue: Spend;
    modelType: number;
  }>();

  const spend = ref(props.modelValue);

  // 总花费
  const totalSpend = ref<Spend[]>([]);
  const totalSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.total_spend_tokens'),
      headerCellStyle: { background: '#ffffff' },
    },
  ]);

  // 文本
  const textSpend = ref<TextSpend[]>([]);
  const textSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.text'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('text.columns.spend.input_tokens'),
          dataIndex: 'input_tokens',
          slotName: 'input_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.input_ratio'),
          dataIndex: 'input_ratio',
          slotName: 'input_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.output_tokens'),
          dataIndex: 'output_tokens',
          slotName: 'output_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.output_ratio'),
          dataIndex: 'output_ratio',
          slotName: 'output_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  // 文本缓存
  const textCacheSpend = ref<CacheSpend[]>([]);
  const textCacheSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.text_cache'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('text.columns.spend.read_tokens'),
          dataIndex: 'read_tokens',
          slotName: 'read_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.read_ratio'),
          dataIndex: 'read_ratio',
          slotName: 'read_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  // 音频
  const audioSpend = ref<AudioSpend[]>([]);
  const audioSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.audio'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t(
            props.modelType === 5
              ? 'text.columns.spend.audio.input_tokens'
              : 'text.columns.spend.input_tokens'
          ),
          dataIndex: 'input_tokens',
          slotName: 'input_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.input_ratio'),
          dataIndex: 'input_ratio',
          slotName: 'input_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t(
            props.modelType === 6
              ? 'text.columns.spend.audio.output_tokens'
              : 'text.columns.spend.output_tokens'
          ),
          dataIndex: 'output_tokens',
          slotName: 'output_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.output_ratio'),
          dataIndex: 'output_ratio',
          slotName: 'output_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  // 音频缓存
  const audioCacheSpend = ref<CacheSpend[]>([]);
  const audioCacheSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.audio_cache'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('text.columns.spend.read_tokens'),
          dataIndex: 'read_tokens',
          slotName: 'read_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.read_ratio'),
          dataIndex: 'read_ratio',
          slotName: 'read_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  // 阶梯文本
  const tieredTextSpend = ref<TextSpend[]>([]);
  const tieredTextSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.tiered_text'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('text.columns.spend.mode'),
          dataIndex: 'mode',
          slotName: 'mode',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.tiered.input_tokens'),
          dataIndex: 'gt',
          slotName: 'gt',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.input_tokens'),
          dataIndex: 'input_tokens',
          slotName: 'input_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.tiered.input_ratio'),
          dataIndex: 'input_ratio',
          slotName: 'input_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.output_tokens'),
          dataIndex: 'output_tokens',
          slotName: 'output_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.tiered.output_ratio'),
          dataIndex: 'output_ratio',
          slotName: 'output_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  // 阶梯文本缓存
  const tieredTextCacheSpend = ref<CacheSpend[]>([]);
  const tieredTextCacheSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.tiered_text_cache'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('text.columns.spend.mode'),
          dataIndex: 'mode',
          slotName: 'mode',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.tiered.input_tokens'),
          dataIndex: 'gt',
          slotName: 'gt',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.read_tokens'),
          dataIndex: 'read_tokens',
          slotName: 'read_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.tiered.read_ratio'),
          dataIndex: 'read_ratio',
          slotName: 'read_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.write_tokens'),
          dataIndex: 'write_tokens',
          slotName: 'write_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.tiered.write_ratio'),
          dataIndex: 'write_ratio',
          slotName: 'write_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  // 图像
  const imageSpend = ref<ImageSpend[]>([]);
  const imageSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.image'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('text.columns.spend.input_tokens'),
          dataIndex: 'input_tokens',
          slotName: 'input_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.input_ratio'),
          dataIndex: 'input_ratio',
          slotName: 'input_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.output_tokens'),
          dataIndex: 'output_tokens',
          slotName: 'output_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.output_ratio'),
          dataIndex: 'output_ratio',
          slotName: 'output_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  // 图像生成
  const imageGenerationSpend = ref<ImageGenerationSpend[]>([]);
  const imageGenerationSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.image_generation'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('text.columns.spend.image.generation.quality'),
          dataIndex: 'quality',
          slotName: 'quality',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.image.generation.width_height'),
          dataIndex: 'width',
          slotName: 'width',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.image.generation.n'),
          dataIndex: 'n',
          slotName: 'n',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.image.generation.once_ratio'),
          dataIndex: 'once_ratio',
          slotName: 'once_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  // 图像缓存
  const imageCacheSpend = ref<CacheSpend[]>([]);
  const imageCacheSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.image_cache'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('text.columns.spend.read_tokens'),
          dataIndex: 'read_tokens',
          slotName: 'read_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.read_ratio'),
          dataIndex: 'read_ratio',
          slotName: 'read_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  // 识图
  const visionSpend = ref<VisionSpend[]>([]);
  const visionSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.vision'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('text.columns.spend.mode'),
          dataIndex: 'mode',
          slotName: 'mode',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.vision.once_ratio'),
          dataIndex: 'once_ratio',
          slotName: 'once_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  // 视频
  const videoSpend = ref<VideoSpend[]>([]);
  const videoSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.video'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('text.columns.spend.video.width_height'),
          dataIndex: 'width',
          slotName: 'width',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.video.once_ratio'),
          dataIndex: 'once_ratio',
          slotName: 'once_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  // 搜索
  const searchSpend = ref<SearchSpend[]>([]);
  const searchSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.search'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('text.columns.spend.search.context_size'),
          dataIndex: 'context_size',
          slotName: 'context_size',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.search.once_ratio'),
          dataIndex: 'once_ratio',
          slotName: 'once_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  // Midjourney
  const midjourneySpend = ref<MidjourneySpend[]>([]);
  const midjourneySpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.midjourney'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('text.columns.spend.midjourney.name'),
          dataIndex: 'name',
          slotName: 'name',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.midjourney.action'),
          dataIndex: 'action',
          slotName: 'action',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.midjourney.path'),
          dataIndex: 'path',
          slotName: 'path',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.once_ratio'),
          dataIndex: 'once_ratio',
          slotName: 'once_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  // 一次
  const onceSpend = ref<OnceSpend[]>([]);
  const onceSpendColumns = ref<TableColumnData[]>([
    {
      title: t('text.columns.spend.once'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('text.columns.spend.input_tokens'),
          dataIndex: 'input_tokens',
          slotName: 'input_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.output_tokens'),
          dataIndex: 'output_tokens',
          slotName: 'output_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.once_ratio'),
          dataIndex: 'once_ratio',
          slotName: 'once_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('text.columns.spend.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 100,
        },
      ],
    },
  ]);

  const handleSpend = () => {
    // 总花费
    totalSpend.value[0] = spend.value;
    totalSpendColumns.value[0].children = [];

    // 文本
    if (spend.value.billing_items.includes('text') && spend.value.text) {
      textSpend.value[0] = spend.value.text;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.text'),
        dataIndex: 'text',
        slotName: 'text',
        align: 'center',
        width: 100,
      });
    }

    // 文本缓存
    if (
      spend.value.billing_items.includes('text_cache') &&
      spend.value.text_cache
    ) {
      textCacheSpend.value[0] = spend.value.text_cache;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.text_cache'),
        dataIndex: 'text_cache',
        slotName: 'text_cache',
        align: 'center',
        width: 100,
      });
    }

    // 音频
    if (spend.value.billing_items.includes('audio') && spend.value.audio) {
      audioSpend.value[0] = spend.value.audio;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.audio'),
        dataIndex: 'audio',
        slotName: 'audio',
        align: 'center',
        width: 100,
      });
    }

    // 音频缓存
    if (
      spend.value.billing_items.includes('audio_cache') &&
      spend.value.audio_cache
    ) {
      audioCacheSpend.value[0] = spend.value.audio_cache;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.audio_cache'),
        dataIndex: 'audio_cache',
        slotName: 'audio_cache',
        align: 'center',
        width: 100,
      });
    }

    // 阶梯文本
    if (
      spend.value.billing_items.includes('tiered_text') &&
      spend.value.tiered_text
    ) {
      tieredTextSpend.value[0] = spend.value.tiered_text;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.tiered_text'),
        dataIndex: 'tiered_text',
        slotName: 'tiered_text',
        align: 'center',
        width: 100,
      });
    }

    // 阶梯文本缓存
    if (
      spend.value.billing_items.includes('tiered_text_cache') &&
      spend.value.tiered_text_cache
    ) {
      tieredTextCacheSpend.value[0] = spend.value.tiered_text_cache;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.tiered_text_cache'),
        dataIndex: 'tiered_text_cache',
        slotName: 'tiered_text_cache',
        align: 'center',
        width: 100,
      });
    }

    // 图像
    if (spend.value.billing_items.includes('image') && spend.value.image) {
      imageSpend.value[0] = spend.value.image;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.image'),
        dataIndex: 'image',
        slotName: 'image',
        align: 'center',
        width: 100,
      });
    }

    // 图像生成
    if (
      spend.value.billing_items.includes('image_generation') &&
      spend.value.image_generation
    ) {
      imageGenerationSpend.value[0] = spend.value.image_generation;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.image_generation'),
        dataIndex: 'image_generation',
        slotName: 'image_generation',
        align: 'center',
        width: 100,
      });
    }

    // 图像缓存
    if (
      spend.value.billing_items.includes('image_cache') &&
      spend.value.image_cache
    ) {
      imageCacheSpend.value[0] = spend.value.image_cache;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.image_cache'),
        dataIndex: 'image_cache',
        slotName: 'image_cache',
        align: 'center',
        width: 100,
      });
    }

    // 识图
    if (spend.value.billing_items.includes('vision') && spend.value.vision) {
      visionSpend.value[0] = spend.value.vision;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.vision'),
        dataIndex: 'vision',
        slotName: 'vision',
        align: 'center',
        width: 100,
      });
    }

    // 视频
    if (spend.value.billing_items.includes('video') && spend.value.video) {
      videoSpend.value[0] = spend.value.video;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.video'),
        dataIndex: 'video',
        slotName: 'video',
        align: 'center',
        width: 100,
      });
    }

    // 搜索
    if (spend.value.billing_items.includes('search') && spend.value.search) {
      searchSpend.value[0] = spend.value.search;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.search'),
        dataIndex: 'search',
        slotName: 'search',
        align: 'center',
        width: 100,
      });
    }

    // Midjourney
    if (
      spend.value.billing_items.includes('midjourney') &&
      spend.value.midjourney
    ) {
      midjourneySpend.value[0] = spend.value.midjourney;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.midjourney'),
        dataIndex: 'midjourney',
        slotName: 'midjourney',
        align: 'center',
        width: 100,
      });
    }

    // 一次
    if (spend.value.billing_items.includes('once') && spend.value.once) {
      onceSpend.value[0] = spend.value.once;
      totalSpendColumns.value[0].children.push({
        title: t('text.columns.spend.once'),
        dataIndex: 'once',
        slotName: 'once',
        align: 'center',
        width: 100,
      });
    }

    // 分组折扣
    totalSpendColumns.value[0].children.push({
      title: t('text.columns.spend.group_discount'),
      dataIndex: 'group_discount',
      slotName: 'group_discount',
      align: 'center',
      width: 100,
    });

    // 总花费
    totalSpendColumns.value[0].children.push({
      title: t('text.columns.spend.total_spend_tokens'),
      dataIndex: 'total_spend_tokens',
      slotName: 'total_spend_tokens',
      align: 'center',
      width: 100,
    });
  };

  watch(
    () => props.modelValue,
    (val) => {
      spend.value = val;
      handleSpend();
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'SpendDetail',
  };
</script>

<style scoped lang="less"></style>
