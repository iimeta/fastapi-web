<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 5 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      field="billing_items"
      :label="$t('model.label.pricing.billing_items')"
      :rules="[
        {
          required: true,
          message: $t('model.error.pricing.billing_items.required'),
        },
      ]"
      style="width: 928px"
    >
      <a-space size="large">
        <a-checkbox-group
          v-model="formData.billing_items"
          :options="billingItems"
        />
      </a-space>
    </a-form-item>
    <a-tabs position="right" type="line" style="width: 828px">
      <a-tab-pane
        v-if="formData.billing_items.includes('text')"
        key="text"
        :title="$t('model.dict.billing_items.text')"
      >
        <a-form-item
          field="text.input_ratio"
          :label="$t('model.label.input_ratio')"
          :rules="[
            {
              required: true,
              message: $t('model.error.input_ratio.required'),
            },
          ]"
        >
          <a-input-number
            v-model="formData.text.input_ratio"
            :placeholder="$t('model.placeholder.input_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="width: 85%; margin-right: 5px"
          />
          <div> ${{ formData.text.input_ratio || '0.00' }} / M </div>
        </a-form-item>
        <a-form-item
          field="text.output_ratio"
          :label="$t('model.label.output_ratio')"
          :rules="[
            {
              required: true,
              message: $t('model.error.output_ratio.required'),
            },
          ]"
        >
          <a-input-number
            v-model="formData.text.output_ratio"
            :placeholder="$t('model.placeholder.output_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="width: 85%; margin-right: 5px"
          />
          <div> ${{ formData.text.output_ratio || '0.00' }} / M </div>
        </a-form-item>
      </a-tab-pane>
      <a-tab-pane
        v-if="formData.billing_items.includes('text_cache')"
        key="text_cache"
        :title="$t('model.dict.billing_items.text_cache')"
      >
        <a-form-item
          field="text.read_ratio"
          :label="$t('model.label.read_ratio')"
          :rules="[
            {
              required: true,
              message: $t('model.error.read_ratio.required'),
            },
          ]"
        >
          <a-input-number
            v-model="formData.text_cache.read_ratio"
            :placeholder="$t('model.placeholder.read_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="margin-right: 5px"
          />
          <div> ${{ formData.text_cache.read_ratio || '0.00' }} / M </div>
        </a-form-item>
      </a-tab-pane>
      <a-tab-pane
        v-if="formData.billing_items.includes('tiered_text')"
        key="tiered_text"
        :title="$t('model.dict.billing_items.tiered_text')"
      >
        <a-form-item
          field="text.input_ratio"
          :label="$t('model.label.input_ratio')"
          :rules="[
            {
              required: true,
              message: $t('model.error.input_ratio.required'),
            },
          ]"
        >
          <a-input-number
            v-model="formData.text.input_ratio"
            :placeholder="$t('model.placeholder.input_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="margin-right: 5px"
          />
          <div> ${{ formData.text.input_ratio || '0.00' }} / M </div>
        </a-form-item>
        <a-form-item
          field="text.output_ratio"
          :label="$t('model.label.output_ratio')"
          :rules="[
            {
              required: true,
              message: $t('model.error.output_ratio.required'),
            },
          ]"
        >
          <a-input-number
            v-model="formData.text.output_ratio"
            :placeholder="$t('model.placeholder.output_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="margin-right: 5px"
          />
          <div> ${{ formData.text.output_ratio || '0.00' }} / M </div>
        </a-form-item>
      </a-tab-pane>
      <a-tab-pane
        v-if="formData.billing_items.includes('tiered_text_cache')"
        key="tiered_text_cache"
        :title="$t('model.dict.billing_items.tiered_text_cache')"
      >
        <a-form-item
          field="text.read_ratio"
          :label="$t('model.label.read_ratio')"
          :rules="[
            {
              required: true,
              message: $t('model.error.read_ratio.required'),
            },
          ]"
        >
          <a-input-number
            v-model="formData.tiered_text_cache[0].read_ratio"
            :placeholder="$t('model.placeholder.read_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="margin-right: 5px"
          />
          <div> ${{ formData.tiered_text_cache[0] || '0.00' }} / M </div>
        </a-form-item>
      </a-tab-pane>
      <a-tab-pane
        v-if="formData.billing_items.includes('image')"
        key="image"
        :title="$t('model.dict.billing_items.image')"
      >
        <a-form-item
          field="image.input_ratio"
          :label="$t('model.label.input_ratio')"
          :rules="[
            {
              required: true,
              message: $t('model.error.input_ratio.required'),
            },
          ]"
        >
          <a-input-number
            v-model="formData.image.input_ratio"
            :placeholder="$t('model.placeholder.input_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="width: 90%; margin-right: 5px"
          />
          <div> ${{ formData.image.input_ratio || '0.00' }} / M </div>
        </a-form-item>
        <a-form-item
          field="image.output_ratio"
          :label="$t('model.label.output_ratio')"
          :rules="[
            {
              required: true,
              message: $t('model.error.output_ratio.required'),
            },
          ]"
        >
          <a-input-number
            v-model="formData.image.output_ratio"
            :placeholder="$t('model.placeholder.output_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="width: 90%; margin-right: 5px"
          />
          <div> ${{ formData.image.output_ratio || '0.00' }} / M </div>
        </a-form-item>
      </a-tab-pane>
      <a-tab-pane
        v-if="formData.billing_items.includes('image_generation')"
        key="image_generation"
        :title="$t('model.dict.billing_items.image_generation')"
      >
        <a-form-item
          v-for="(generation, index) of formData.image_generation"
          :key="index"
          :field="
            `image_generation[${index}].quality` &&
            `image_generation[${index}].width` &&
            `image_generation[${index}].height` &&
            `image_generation[${index}].fixed_quota`
          "
          :label="`${index + 1}. ` + $t('model.label.image_generation')"
          :rules="[
            {
              required: true,
              message: $t('model.error.image_generation.required'),
            },
          ]"
        >
          <a-input
            v-model="formData.image_generation[index].quality"
            :placeholder="$t('model.placeholder.image_generation.quality')"
            style="width: 88px; margin-right: 5px"
          />
          <a-input-number
            v-model="formData.image_generation[index].width"
            :placeholder="$t('model.placeholder.image_generation.width')"
            style="width: 78px; margin-right: 5px"
          />
          ×
          <a-input-number
            v-model="formData.image_generation[index].height"
            :placeholder="$t('model.placeholder.image_generation.height')"
            style="width: 78px; margin-left: 5px; margin-right: 5px"
          />
          <a-input-number
            v-model="formData.image_generation[index].fixed_quota"
            :placeholder="$t('model.placeholder.image_generation.fixed_quota')"
            style="width: 118px; margin-right: 5px"
          />
          <a-radio
            v-model="formData.image_generation[index].is_default"
            value="1"
            style="width: 60px"
            @change="handleImageGenerationPricingIsDefaultChange(index)"
            >默认</a-radio
          >
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 10px"
            @click="handleImageGenerationPricingAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleImageGenerationPricingDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
      </a-tab-pane>
      <a-tab-pane
        v-if="formData.billing_items.includes('image_cache')"
        key="image_cache"
        :title="$t('model.dict.billing_items.image_cache')"
      >
        <a-form-item
          field="image.read_ratio"
          :label="$t('model.label.read_ratio')"
          :rules="[
            {
              required: true,
              message: $t('model.error.read_ratio.required'),
            },
          ]"
        >
          <a-input-number
            v-model="formData.image_cache.read_ratio"
            :placeholder="$t('model.placeholder.read_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="width: 90%; margin-right: 5px"
          />
          <div> ${{ formData.image_cache.read_ratio || '0.00' }} / M </div>
        </a-form-item>
      </a-tab-pane>
      <a-tab-pane
        v-if="formData.billing_items.includes('audio')"
        key="audio"
        :title="$t('model.dict.billing_items.audio')"
      >
        <a-form-item
          field="audio.input_ratio"
          :label="$t('model.label.input_ratio')"
          :rules="[
            {
              required: true,
              message: $t('model.error.input_ratio.required'),
            },
          ]"
        >
          <a-input-number
            v-model="formData.audio.input_ratio"
            :placeholder="$t('model.placeholder.input_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="width: 90%; margin-right: 5px"
          />
          <div> ${{ formData.audio.input_ratio || '0.00' }} / M </div>
        </a-form-item>
        <a-form-item
          field="audio.output_ratio"
          :label="$t('model.label.output_ratio')"
          :rules="[
            {
              required: true,
              message: $t('model.error.output_ratio.required'),
            },
          ]"
        >
          <a-input-number
            v-model="formData.audio.output_ratio"
            :placeholder="$t('model.placeholder.output_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="width: 90%; margin-right: 5px"
          />
          <div> ${{ formData.audio.output_ratio || '0.00' }}/min </div>
        </a-form-item>
      </a-tab-pane>
      <a-tab-pane
        v-if="formData.billing_items.includes('audio_cache')"
        key="audio_cache"
        :title="$t('model.dict.billing_items.audio_cache')"
      >
        <a-form-item
          field="realtime.audio.read_ratio"
          :label="$t('model.label.read_ratio')"
          :rules="[
            {
              required: true,
              message: $t('model.error.read_ratio.required'),
            },
          ]"
        >
          <a-input-number
            v-model="formData.audio_cache.read_ratio"
            :placeholder="$t('model.placeholder.read_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="width: 90%; margin-right: 5px"
          />
          <div> ${{ formData.audio_cache.read_ratio || '0.00' }} / M </div>
        </a-form-item>
      </a-tab-pane>
      <a-tab-pane
        v-if="formData.billing_items.includes('vision')"
        key="vision"
        :title="$t('model.dict.billing_items.vision')"
      >
        <a-form-item
          v-for="(vision, index) of formData.vision"
          :key="index"
          :field="`vision[${index}].mode` && `vision[${index}].fixed_quota`"
          :label="`${index + 1}. ` + $t('model.label.vision')"
          :rules="[
            {
              required: true,
              message: $t('model.error.vision.required'),
            },
          ]"
        >
          <a-input
            v-model="formData.vision[index].mode"
            :placeholder="$t('model.placeholder.vision.mode')"
            style="width: 185px; margin-right: 5px"
          />
          <a-input-number
            v-model="formData.vision[index].fixed_quota"
            :placeholder="$t('model.placeholder.vision.fixed_quota')"
            style="width: 185px; margin-right: 5px"
          />
          <a-radio
            v-model="formData.vision[index].is_default"
            value="1"
            style="width: 60px"
            @change="handleMultimodalVisionPricingIsDefaultChange(index)"
            >默认</a-radio
          >
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 10px"
            @click="handleMultimodalVisionPricingAdd('')"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleMultimodalVisionPricingDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
      </a-tab-pane>
      <a-tab-pane
        v-if="formData.billing_items.includes('search')"
        key="search"
        :title="$t('model.dict.billing_items.search')"
      >
        <a-form-item
          v-for="(search, index) of formData.search"
          :key="index"
          :field="
            `search[${index}].search_context_size` &&
            `search[${index}].fixed_quota`
          "
          :label="`${index + 1}. ` + $t('model.label.search')"
          :rules="[
            {
              required: true,
              message: $t('model.error.search.required'),
            },
          ]"
        >
          <a-input
            v-model="formData.search[index].search_context_size"
            :placeholder="$t('model.placeholder.search.search_context_size')"
            style="width: 185px; margin-right: 5px"
          />
          <a-input-number
            v-model="formData.search[index].fixed_quota"
            :placeholder="$t('model.placeholder.search.fixed_quota')"
            style="width: 185px; margin-right: 5px"
          />
          <a-radio
            v-model="formData.search[index].is_default"
            value="1"
            style="width: 60px"
            @change="handleMultimodalSearchPricingIsDefaultChange(index)"
            >默认</a-radio
          >
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 10px"
            @click="handleMultimodalSearchPricingAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleMultimodalSearchPricingDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
      </a-tab-pane>
      <a-tab-pane
        v-if="formData.billing_items.includes('midjourney')"
        key="midjourney"
        :title="$t('model.dict.billing_items.midjourney')"
      >
        <a-form-item
          v-for="(midjourney, index) of formData.midjourney"
          :key="index"
          :field="
            `midjourney[${index}].name` &&
            `midjourney[${index}].action` &&
            `midjourney[${index}].path` &&
            `midjourney[${index}].fixed_quota`
          "
          :label="`${index + 1}. ` + $t('model.label.midjourney')"
          :rules="[
            {
              required: true,
              message: $t('model.error.midjourney.required'),
            },
          ]"
        >
          <a-input
            v-model="formData.midjourney[index].name"
            :placeholder="$t('model.placeholder.midjourney.name')"
            style="width: 95px; margin-right: 5px"
          />
          <a-input
            v-model="formData.midjourney[index].action"
            :placeholder="$t('model.placeholder.midjourney.action')"
            style="width: 102px; margin-right: 5px"
          />
          <a-input
            v-model="formData.midjourney[index].path"
            :placeholder="$t('model.placeholder.midjourney.path')"
            style="width: 138px; margin-right: 5px"
          />
          <a-input-number
            v-model="formData.midjourney[index].fixed_quota"
            :placeholder="$t('model.placeholder.midjourney.fixed_quota')"
            style="width: 90px"
          />
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 10px"
            @click="handleMidjourneyPricingAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleMidjourneyPricingDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
      </a-tab-pane>
    </a-tabs>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import {
    Pricing,
    ImageGenerationPricing,
    VisionPricing,
    SearchPricing,
    MidjourneyPricing,
  } from '@/api/common';

  const { t } = useI18n();

  const props = defineProps<{
    modelValue: Pricing;
  }>();

  const formRef = ref<FormInstance>();
  const formData = ref(props.modelValue);

  const handleImageGenerationPricingAdd = (
    q?: string,
    w?: number,
    h?: number
  ) => {
    const generationPricing: ImageGenerationPricing = {
      quality: q,
      width: w,
      height: h,
      fixed_quota: ref(),
      is_default: formData.value.image_generation.length === 0 ? '1' : '',
    };
    formData.value.image_generation.push(generationPricing);
  };

  const handleImageGenerationPricingDel = (index: number) => {
    if (formData.value.image_generation.length > 1) {
      if (formData.value.image_generation[index].is_default === '1') {
        formData.value.image_generation[index === 0 ? 1 : 0].is_default = '1';
      }
      formData.value.image_generation.splice(index, 1);
    }
  };

  const handleImageGenerationPricingIsDefaultChange = (index: number) => {
    for (let i = 0; i < formData.value.image_generation.length; i += 1) {
      if (i === index) {
        formData.value.image_generation[i].is_default = '1';
      } else {
        formData.value.image_generation[i].is_default = '';
      }
    }
  };

  const handleMultimodalVisionPricingAdd = (m: string) => {
    const visionPricing: VisionPricing = {
      mode: m,
      fixed_quota: ref(),
      is_default: formData.value.vision.length === 0 ? '1' : '',
    };
    formData.value.vision.push(visionPricing);
  };

  const handleMultimodalVisionPricingDel = (index: number) => {
    if (formData.value.vision.length > 1) {
      if (formData.value.vision[index].is_default === '1') {
        formData.value.vision[index === 0 ? 1 : 0].is_default = '1';
      }
      formData.value.vision.splice(index, 1);
    }
  };

  const handleMultimodalVisionPricingIsDefaultChange = (index: number) => {
    for (let i = 0; i < formData.value.vision.length; i += 1) {
      if (i === index) {
        formData.value.vision[i].is_default = '1';
      } else {
        formData.value.vision[i].is_default = '';
      }
    }
  };

  const handleMultimodalSearchPricingAdd = (s?: string) => {
    const searchPricing: SearchPricing = {
      search_context_size: s,
      fixed_quota: ref(),
      is_default: formData.value.search.length === 0 ? '1' : '',
    };
    formData.value.search.push(searchPricing);
  };

  const handleMultimodalSearchPricingDel = (index: number) => {
    if (formData.value.search.length > 1) {
      if (formData.value.search[index].is_default === '1') {
        formData.value.search[index === 0 ? 1 : 0].is_default = '1';
      }
      formData.value.search.splice(index, 1);
    }
  };

  const handleMultimodalSearchPricingIsDefaultChange = (index: number) => {
    for (let i = 0; i < formData.value.search.length; i += 1) {
      if (i === index) {
        formData.value.search[i].is_default = '1';
      } else {
        formData.value.search[i].is_default = '';
      }
    }
  };

  const handleMidjourneyPricingAdd = (n?: string, a?: string, p?: string) => {
    const midjourneyPricing: MidjourneyPricing = {
      name: n,
      action: a,
      path: p,
      fixed_quota: ref(),
    };
    formData.value.midjourney.push(midjourneyPricing);
  };

  const handleMidjourneyPricingDel = (index: number) => {
    if (formData.value.midjourney.length > 1) {
      formData.value.midjourney.splice(index, 1);
    }
  };

  const billingItems = [
    {
      label: t('model.dict.billing_items.text'),
      value: 'text',
    },
    {
      label: t('model.dict.billing_items.text_cache'),
      value: 'text_cache',
    },
    {
      label: t('model.dict.billing_items.tiered_text'),
      value: 'tiered_text',
    },
    {
      label: t('model.dict.billing_items.tiered_text_cache'),
      value: 'tiered_text_cache',
    },
    {
      label: t('model.dict.billing_items.image'),
      value: 'image',
    },
    {
      label: t('model.dict.billing_items.image_generation'),
      value: 'image_generation',
    },
    {
      label: t('model.dict.billing_items.image_cache'),
      value: 'image_cache',
    },
    {
      label: t('model.dict.billing_items.audio'),
      value: 'audio',
    },
    {
      label: t('model.dict.billing_items.audio_cache'),
      value: 'audio_cache',
    },
    {
      label: t('model.dict.billing_items.vision'),
      value: 'vision',
    },
    {
      label: t('model.dict.billing_items.search'),
      value: 'search',
    },
    {
      label: t('model.dict.billing_items.midjourney'),
      value: 'midjourney',
    },
  ];

  const qualities = [
    'high',
    'high',
    'high',
    'medium',
    'medium',
    'medium',
    'low',
    'low',
    'low',
  ];
  const widths = [1024, 1024, 1536, 1024, 1024, 1536, 1024, 1024, 1536];
  const heights = [1024, 1536, 1024, 1024, 1536, 1024, 1024, 1536, 1024];
  for (let i = 0; i < qualities.length; i += 1) {
    handleImageGenerationPricingAdd(qualities[i], widths[i], heights[i]);
  }

  const modes = ['auto', 'high', 'low'];
  for (let i = 0; i < modes.length; i += 1) {
    handleMultimodalVisionPricingAdd(modes[i]);
  }

  const searchContextSizes = ['medium', 'high', 'low'];
  for (let i = 0; i < searchContextSizes.length; i += 1) {
    handleMultimodalSearchPricingAdd(searchContextSizes[i]);
  }

  const names = [
    '绘图',
    '放大',
    '变换',
    '强变换',
    '弱变换',
    '描述',
    '混图',
    '重绘',
    '局部重绘',
    '变焦',
    '自定义变焦',
    '平移',
    '缩词',
    '窗口',
    '换脸',
    '任务',
  ];
  const actions = [
    'IMAGINE',
    'UPSCALE',
    'VARIATION',
    'HIGH_VARIATION',
    'LOW_VARIATION',
    'DESCRIBE',
    'BLEND',
    'REROLL',
    'INPAINT',
    'ZOOM',
    'CUSTOM_ZOOM',
    'PAN',
    'SHORTEN',
    'MODAL',
    'SWAP_FACE',
    'TASK',
  ];
  const paths = [
    '/submit/imagine',
    '/submit/change',
    '/submit/change',
    '/submit/action',
    '/submit/action',
    '/submit/describe',
    '/submit/blend',
    '/submit/action',
    '/submit/action',
    '/submit/action',
    '/submit/action',
    '/submit/action',
    '/submit/shorten',
    '/submit/modal',
    '/insight-face/swap',
    '/task/*',
  ];
  for (let i = 0; i < names.length; i += 1) {
    handleMidjourneyPricingAdd(names[i], actions[i], paths[i]);
  }
</script>

<script lang="ts">
  export default {
    name: 'Pricing',
  };
</script>

<style scoped lang="less">
  .form {
    align-items: center;
  }

  :deep(.arco-checkbox-group .arco-checkbox) {
    margin-right: 8px;
    margin-bottom: 8px;
    width: 158px;
  }
</style>
