<template>
  <!-- 文本 -->
  <a-table
    v-if="spend.billing_items.includes('text')"
    :columns="textSpendColumns"
    :data="textSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #input_tokens="{ record }">
      {{ record.input_tokens || '0' }}
    </template>
    <template #input_ratio="{ record }">
      ${{ record.pricing.input_ratio || '0.00' }} / M
    </template>
    <template #output_tokens="{ record }">
      {{ record.output_tokens || '0' }}
    </template>
    <template #output_ratio="{ record }">
      ${{ record.pricing.output_ratio || '0.00' }} / M
    </template>
    <template #spend_tokens="{ record }">
      ${{ record.spend_tokens ? `${quotaConv(record.spend_tokens)}` : '0.00' }}
    </template>
  </a-table>

  <!-- 文本缓存 -->
  <a-table
    v-if="spend.billing_items.includes('text_cache')"
    :columns="textCacheSpendColumns"
    :data="textCacheSpend"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #read_tokens="{ record }">
      {{ record.read_tokens || '0' }}
    </template>
    <template #read_ratio="{ record }">
      ${{ record.pricing.read_ratio || '0.00' }} / M
    </template>
    <template #spend_tokens="{ record }">
      ${{ record.spend_tokens ? `${quotaConv(record.spend_tokens)}` : '0.00' }}
    </template>
  </a-table>

  <!-- 音频 -->
  <a-table
    v-if="spend.billing_items.includes('audio')"
    :columns="audioPricingColumns"
    :data="audioPricing"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #input_ratio="{ record }">
      ${{ record.input_ratio || '0.00' }} / M
    </template>
    <template #output_ratio="{ record }">
      ${{ record.output_ratio || '0.00' }}
      {{ modelType === 5 || modelType === 6 ? '/ min' : '/ M' }}
    </template>
    <template #read_ratio="{ record }">
      ${{ record.read_ratio || '0.00' }} / M
    </template>
  </a-table>

  <!-- 音频缓存 -->
  <a-table
    v-if="spend.billing_items.includes('audio_cache')"
    :columns="audioCachePricingColumns"
    :data="audioCachePricing"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #read_ratio="{ record }">
      ${{ record.read_ratio || '0.00' }} / M
    </template>
  </a-table>

  <!-- 阶梯文本 -->
  <a-table
    v-if="spend.billing_items.includes('tiered_text')"
    :columns="tieredTextPricingColumns"
    :data="tieredTextPricing"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #mode="{ record }">
      {{ $t(`model.dict.mode.${record.mode}`) }}
    </template>
    <template #gt="{ record }"> {{ record.gt }}k - {{ record.lte }}k </template>
    <template #input_ratio="{ record }">
      ${{ record.input_ratio || '0.00' }} / M
    </template>
    <template #output_ratio="{ record }">
      ${{ record.output_ratio || '0.00' }} / M
    </template>
  </a-table>

  <!-- 阶梯文本缓存 -->
  <a-table
    v-if="spend.billing_items.includes('tiered_text_cache')"
    :columns="tieredTextCachePricingColumns"
    :data="tieredTextCachePricing"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #mode="{ record }">
      {{ $t(`model.dict.mode.${record.mode}`) }}
    </template>
    <template #gt="{ record }"> {{ record.gt }}k - {{ record.lte }}k </template>
    <template #read_ratio="{ record }">
      ${{ record.read_ratio || '0.00' }} / M
    </template>
    <template #write_ratio="{ record }">
      ${{ record.write_ratio || '0.00' }} / M
    </template>
  </a-table>

  <!-- 图像 -->
  <a-table
    v-if="spend.billing_items.includes('image')"
    :columns="imagePricingColumns"
    :data="imagePricing"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #input_ratio="{ record }">
      ${{ record.input_ratio || '0.00' }} / M
    </template>
    <template #output_ratio="{ record }">
      ${{ record.output_ratio || '0.00' }} / M
    </template>
    <template #read_ratio="{ record }">
      ${{ record.read_ratio || '0.00' }} / M
    </template>
  </a-table>

  <!-- 图像生成 -->
  <a-table
    v-if="spend.billing_items.includes('image_generation')"
    :columns="imageGenerationPricingColumns"
    :data="imageGenerationPricing"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #width="{ record }">
      {{ record.width }} × {{ record.height }}
    </template>
    <template #once_ratio="{ record }">
      ${{ record.once_ratio || '0.00' }} / 张
    </template>
    <template #is_default="{ record }">
      {{ record.is_default ? '是' : '-' }}
    </template>
  </a-table>

  <!-- 图像缓存 -->
  <a-table
    v-if="spend.billing_items.includes('image_cache')"
    :columns="imageCachePricingColumns"
    :data="imageCachePricing"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #read_ratio="{ record }">
      ${{ record.read_ratio || '0.00' }} / M
    </template>
  </a-table>

  <!-- 识图 -->
  <a-table
    v-if="spend.billing_items.includes('vision')"
    :columns="visionPricingColumns"
    :data="visionPricing"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #once_ratio="{ record }">
      ${{ record.once_ratio || '0.00' }} / 张
    </template>
    <template #is_default="{ record }">
      {{ record.is_default ? '是' : '-' }}
    </template>
  </a-table>

  <!-- 视频 -->
  <a-table
    v-if="spend.billing_items.includes('video')"
    :columns="videoPricingColumns"
    :data="videoPricing"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #width="{ record }">
      {{ record.width }} × {{ record.height }}
    </template>
    <template #once_ratio="{ record }">
      ${{ record.once_ratio || '0.00' }} / 秒
    </template>
    <template #is_default="{ record }">
      {{ record.is_default ? '是' : '-' }}
    </template>
  </a-table>

  <!-- 搜索 -->
  <a-table
    v-if="spend.billing_items.includes('search')"
    :columns="searchPricingColumns"
    :data="searchPricing"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #once_ratio="{ record }">
      ${{ record.once_ratio || '0.00' }} / 次
    </template>
    <template #is_default="{ record }">
      {{ record.is_default ? '是' : '-' }}
    </template>
  </a-table>

  <!-- Midjourney -->
  <a-table
    v-if="spend.billing_items.includes('midjourney')"
    :columns="midjourneyPricingColumns"
    :data="midjourneyPricing"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #once_ratio="{ record }">
      ${{ record.once_ratio || '0.00' }} / 次
    </template>
  </a-table>

  <!-- 一次 -->
  <a-table
    v-if="spend.billing_items.includes('once')"
    :columns="oncePricingColumns"
    :data="oncePricing"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #once_ratio="{ record }">
      ${{ record.once_ratio || '0.00' }} / 次
    </template>
  </a-table>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { quotaConv } from '@/utils/common';
  import {
    Spend,
    TextSpend,
    CacheSpend,
    TextPricing,
    CachePricing,
    AudioPricing,
    ImagePricing,
    ImageGenerationPricing,
    VisionPricing,
    VideoPricing,
    SearchPricing,
    MidjourneyPricing,
    OncePricing,
  } from '@/api/common';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  const { t } = useI18n();

  const props = defineProps<{
    modelValue: Spend;
    modelType: number;
  }>();

  const spend = ref(props.modelValue);

  // 文本
  const textSpend = ref<TextSpend[]>([]);
  const textSpendColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.text'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('chat.label.input_tokens'),
          dataIndex: 'input_tokens',
          slotName: 'input_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('model.label.input_ratio'),
          dataIndex: 'input_ratio',
          slotName: 'input_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('chat.label.output_tokens'),
          dataIndex: 'output_tokens',
          slotName: 'output_tokens',
          align: 'center',
          width: 100,
        },
        {
          title: t('model.label.output_ratio'),
          dataIndex: 'output_ratio',
          slotName: 'output_ratio',
          align: 'center',
          width: 100,
        },
        {
          title: t('chat.label.spend_tokens'),
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
      title: t('model.columns.pricing.text_cache'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('chat.label.read_tokens'),
          dataIndex: 'read_tokens',
          slotName: 'read_tokens',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.read_ratio'),
          dataIndex: 'read_ratio',
          slotName: 'read_ratio',
          align: 'center',
          width: 200,
        },
        {
          title: t('chat.label.spend_tokens'),
          dataIndex: 'spend_tokens',
          slotName: 'spend_tokens',
          align: 'center',
          width: 200,
        },
      ],
    },
  ]);

  // 音频
  const audioPricing = ref<AudioPricing[]>([]);
  const audioPricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.audio'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('model.label.input_ratio'),
          dataIndex: 'input_ratio',
          slotName: 'input_ratio',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.output_ratio'),
          dataIndex: 'output_ratio',
          slotName: 'output_ratio',
          align: 'center',
          width: 200,
        },
      ],
    },
  ]);

  // 音频缓存
  const audioCachePricing = ref<CachePricing[]>([]);
  const audioCachePricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.audio_cache'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('model.label.read_ratio'),
          dataIndex: 'read_ratio',
          slotName: 'read_ratio',
          align: 'center',
          width: 200,
        },
      ],
    },
  ]);

  // 阶梯文本
  const tieredTextPricing = ref<TextPricing[]>([]);
  const tieredTextPricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.tiered_text'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('model.label.mode'),
          dataIndex: 'mode',
          slotName: 'mode',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.tiered.input_tokens'),
          dataIndex: 'gt',
          slotName: 'gt',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.tiered.input_ratio'),
          dataIndex: 'input_ratio',
          slotName: 'input_ratio',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.tiered.output_ratio'),
          dataIndex: 'output_ratio',
          slotName: 'output_ratio',
          align: 'center',
          width: 200,
        },
      ],
    },
  ]);

  // 阶梯文本缓存
  const tieredTextCachePricing = ref<CachePricing[]>([]);
  const tieredTextCachePricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.tiered_text_cache'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('model.label.mode'),
          dataIndex: 'mode',
          slotName: 'mode',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.tiered.input_tokens'),
          dataIndex: 'gt',
          slotName: 'gt',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.tiered.read_ratio'),
          dataIndex: 'read_ratio',
          slotName: 'read_ratio',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.tiered.write_ratio'),
          dataIndex: 'write_ratio',
          slotName: 'write_ratio',
          align: 'center',
          width: 200,
        },
      ],
    },
  ]);

  // 图像
  const imagePricing = ref<ImagePricing[]>([]);
  const imagePricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.image'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('model.label.input_ratio'),
          dataIndex: 'input_ratio',
          slotName: 'input_ratio',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.output_ratio'),
          dataIndex: 'output_ratio',
          slotName: 'output_ratio',
          align: 'center',
          width: 200,
        },
      ],
    },
  ]);

  // 图像生成
  const imageGenerationPricing = ref<ImageGenerationPricing[]>([]);
  const imageGenerationPricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.image_generation'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('model.label.image.generation.quality'),
          dataIndex: 'quality',
          slotName: 'quality',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.image.generation.width_height'),
          dataIndex: 'width',
          slotName: 'width',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.image.generation.once_ratio'),
          dataIndex: 'once_ratio',
          slotName: 'once_ratio',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.is_default'),
          dataIndex: 'is_default',
          slotName: 'is_default',
          align: 'center',
          width: 200,
        },
      ],
    },
  ]);

  // 图像缓存
  const imageCachePricing = ref<CachePricing[]>([]);
  const imageCachePricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.image_cache'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('model.label.read_ratio'),
          dataIndex: 'read_ratio',
          slotName: 'read_ratio',
          align: 'center',
          width: 200,
        },
      ],
    },
  ]);

  // 识图
  const visionPricing = ref<VisionPricing[]>([]);
  const visionPricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.vision'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('model.label.mode'),
          dataIndex: 'mode',
          slotName: 'mode',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.vision.once_ratio'),
          dataIndex: 'once_ratio',
          slotName: 'once_ratio',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.is_default'),
          dataIndex: 'is_default',
          slotName: 'is_default',
          align: 'center',
          width: 200,
        },
      ],
    },
  ]);

  // 视频
  const videoPricing = ref<VideoPricing[]>([]);
  const videoPricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.video'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('model.label.video.width_height'),
          dataIndex: 'width',
          slotName: 'width',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.video.once_ratio'),
          dataIndex: 'once_ratio',
          slotName: 'once_ratio',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.is_default'),
          dataIndex: 'is_default',
          slotName: 'is_default',
          align: 'center',
          width: 200,
        },
      ],
    },
  ]);

  // 搜索
  const searchPricing = ref<SearchPricing[]>([]);
  const searchPricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.search'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('model.label.search.context_size'),
          dataIndex: 'context_size',
          slotName: 'context_size',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.search.once_ratio'),
          dataIndex: 'once_ratio',
          slotName: 'once_ratio',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.is_default'),
          dataIndex: 'is_default',
          slotName: 'is_default',
          align: 'center',
          width: 200,
        },
      ],
    },
  ]);

  // Midjourney
  const midjourneyPricing = ref<MidjourneyPricing[]>([]);
  const midjourneyPricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.midjourney'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('model.label.midjourney.name'),
          dataIndex: 'name',
          slotName: 'name',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.midjourney.action'),
          dataIndex: 'action',
          slotName: 'action',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.midjourney.path'),
          dataIndex: 'path',
          slotName: 'path',
          align: 'center',
          width: 200,
        },
        {
          title: t('model.label.once_ratio'),
          dataIndex: 'once_ratio',
          slotName: 'once_ratio',
          align: 'center',
          width: 200,
        },
      ],
    },
  ]);

  // 一次
  const oncePricing = ref<OncePricing[]>([]);
  const oncePricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.once'),
      headerCellStyle: { background: '#ffffff' },
      children: [
        {
          title: t('model.label.once_ratio'),
          dataIndex: 'once_ratio',
          slotName: 'once_ratio',
          align: 'center',
          width: 200,
        },
      ],
    },
  ]);

  const handlePricing = () => {
    // 文本
    if (spend.value.billing_items.includes('text')) {
      textSpend.value[0] = spend.value.text;
    }

    // 文本缓存
    if (spend.value.billing_items.includes('text_cache')) {
      textCacheSpend.value[0] = spend.value.text_cache;
    }

    // 音频
    if (spend.value.billing_items.includes('audio')) {
      audioPricing.value[0] = spend.value.audio.pricing;
    }

    // 音频缓存
    if (spend.value.billing_items.includes('audio_cache')) {
      audioCachePricing.value[0] = spend.value.audio_cache.pricing;
    }

    // 文本缓存
    if (spend.value.billing_items.includes('tiered_text')) {
      tieredTextPricing.value[0] = spend.value.tiered_text.pricing;
    }

    // 阶梯文本缓存
    if (spend.value.billing_items.includes('tiered_text_cache')) {
      tieredTextCachePricing.value[0] = spend.value.tiered_text_cache.pricing;
    }

    // 图像
    if (spend.value.billing_items.includes('image')) {
      imagePricing.value[0] = spend.value.image.pricing;
    }

    // 图像生成
    if (spend.value.billing_items.includes('image_generation')) {
      imageGenerationPricing.value[0] = spend.value.image_generation.pricing;
    }

    // 图像缓存
    if (spend.value.billing_items.includes('image_cache')) {
      imageCachePricing.value[0] = spend.value.image_cache.pricing;
    }

    // 识图
    if (spend.value.billing_items.includes('vision')) {
      visionPricing.value[0] = spend.value.vision.pricing;
    }

    // 视频
    if (spend.value.billing_items.includes('video')) {
      videoPricing.value[0] = spend.value.video.pricing;
    }

    // 搜索
    if (spend.value.billing_items.includes('search')) {
      searchPricing.value[0] = spend.value.search.pricing;
    }

    // Midjourney
    if (spend.value.billing_items.includes('midjourney')) {
      midjourneyPricing.value[0] = spend.value.midjourney.pricing;
    }

    // 一次
    if (spend.value.billing_items.includes('once')) {
      oncePricing.value[0] = spend.value.once.pricing;
    }
  };

  watch(
    () => props.modelValue,
    (val) => {
      spend.value = val;
      handlePricing();
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
