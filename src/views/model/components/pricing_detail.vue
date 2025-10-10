<template>
  <!-- 文本 -->
  <a-table
    v-if="pricing.billing_items.includes('text')"
    :columns="textPricingColumns"
    :data="textPricing"
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

  <!-- 文本缓存 -->
  <a-table
    v-if="
      pricing.billing_items.includes('text_cache') &&
      !pricing.billing_items.includes('text')
    "
    :columns="textCachePricingColumns"
    :data="textCachePricing"
    :pagination="false"
    :bordered="false"
    style="margin-bottom: 15px"
  >
    <template #read_ratio="{ record }">
      ${{ record.read_ratio || '0.00' }} / M
    </template>
  </a-table>

  <!-- 音频 -->
  <a-table
    v-if="pricing.billing_items.includes('audio')"
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
    v-if="
      pricing.billing_items.includes('audio_cache') &&
      !pricing.billing_items.includes('audio')
    "
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
    v-if="pricing.billing_items.includes('tiered_text')"
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
    v-if="pricing.billing_items.includes('tiered_text_cache')"
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
    v-if="pricing.billing_items.includes('image')"
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
    v-if="pricing.billing_items.includes('image_generation')"
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
    v-if="
      pricing.billing_items.includes('image_cache') &&
      !pricing.billing_items.includes('image')
    "
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
    v-if="pricing.billing_items.includes('vision')"
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
    v-if="pricing.billing_items.includes('video')"
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
    v-if="pricing.billing_items.includes('search')"
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
    v-if="pricing.billing_items.includes('midjourney')"
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
    v-if="pricing.billing_items.includes('once')"
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
  import {
    Pricing,
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
    modelValue: Pricing;
    modelType: number;
  }>();

  const pricing = ref(props.modelValue);

  // 文本
  const textPricing = ref<TextPricing[]>([]);
  const textPricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.text'),
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

  // 文本缓存
  const textCachePricing = ref<CachePricing[]>([]);
  const textCachePricingColumns = ref<TableColumnData[]>([
    {
      title: t('model.columns.pricing.text_cache'),
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
    if (pricing.value.billing_items.includes('text')) {
      textPricing.value[0] = pricing.value.text;
    }

    if (
      textPricingColumns.value[0].children &&
      textPricingColumns.value[0].children.length > 2
    ) {
      textPricingColumns.value[0].children.splice(2, 1);
    }

    // 文本缓存
    if (pricing.value.billing_items.includes('text_cache')) {
      textCachePricing.value[0] = pricing.value.text_cache;

      if (pricing.value.billing_items.includes('text')) {
        textPricing.value[0].read_ratio = pricing.value.text_cache.read_ratio;
        if (textPricingColumns.value[0].children) {
          textPricingColumns.value[0].children.push({
            title: t('model.label.read_ratio'),
            dataIndex: 'read_ratio',
            slotName: 'read_ratio',
            align: 'center',
            width: 200,
          });
        }
      }
    }

    // 音频
    if (pricing.value.billing_items.includes('audio')) {
      audioPricing.value[0] = pricing.value.audio;
    }

    if (
      audioPricingColumns.value[0].children &&
      audioPricingColumns.value[0].children.length > 2
    ) {
      audioPricingColumns.value[0].children.splice(2, 1);
    }

    // 音频缓存
    if (pricing.value.billing_items.includes('audio_cache')) {
      audioCachePricing.value[0] = pricing.value.audio_cache;

      if (pricing.value.billing_items.includes('audio')) {
        audioPricing.value[0].read_ratio = pricing.value.audio_cache.read_ratio;
        if (audioPricingColumns.value[0].children) {
          audioPricingColumns.value[0].children.push({
            title: t('model.label.read_ratio'),
            dataIndex: 'read_ratio',
            slotName: 'read_ratio',
            align: 'center',
            width: 200,
          });
        }
      }
    }

    // 阶梯文本
    if (pricing.value.billing_items.includes('tiered_text')) {
      tieredTextPricing.value = pricing.value.tiered_text;
    }

    // 阶梯文本缓存
    if (pricing.value.billing_items.includes('tiered_text_cache')) {
      tieredTextCachePricing.value = pricing.value.tiered_text_cache;
    }

    // 图像
    if (pricing.value.billing_items.includes('image')) {
      imagePricing.value[0] = pricing.value.image;
    }

    if (
      imagePricingColumns.value[0].children &&
      imagePricingColumns.value[0].children.length > 2
    ) {
      imagePricingColumns.value[0].children.splice(2, 1);
    }

    // 图像生成
    if (pricing.value.billing_items.includes('image_generation')) {
      imageGenerationPricing.value = pricing.value.image_generation;
    }

    // 图像缓存
    if (pricing.value.billing_items.includes('image_cache')) {
      imageCachePricing.value[0] = pricing.value.image_cache;

      if (pricing.value.billing_items.includes('image')) {
        imagePricing.value[0].read_ratio = pricing.value.image_cache.read_ratio;
        if (imagePricingColumns.value[0].children) {
          imagePricingColumns.value[0].children.push({
            title: t('model.label.read_ratio'),
            dataIndex: 'read_ratio',
            slotName: 'read_ratio',
            align: 'center',
            width: 200,
          });
        }
      }
    }

    // 识图
    if (pricing.value.billing_items.includes('vision')) {
      visionPricing.value = pricing.value.vision;
    }

    // 视频
    if (pricing.value.billing_items.includes('video')) {
      videoPricing.value = pricing.value.video;
    }

    // 搜索
    if (pricing.value.billing_items.includes('search')) {
      searchPricing.value = pricing.value.search;
    }

    // Midjourney
    if (pricing.value.billing_items.includes('midjourney')) {
      midjourneyPricing.value = pricing.value.midjourney;
    }

    // 一次
    if (pricing.value.billing_items.includes('once')) {
      oncePricing.value[0] = pricing.value.once;
    }
  };

  watch(
    () => props.modelValue,
    (val) => {
      pricing.value = val;
      handlePricing();
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'PricingDetail',
  };
</script>

<style scoped lang="less"></style>
