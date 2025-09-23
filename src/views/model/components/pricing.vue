<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 4 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      field="billing_rule"
      :label="$t('model.label.billing_rule')"
      :rules="[
        {
          required: true,
          message: $t('model.error.billing_rule.required'),
        },
      ]"
      style="margin-bottom: 12px"
    >
      <a-space size="large">
        <a-radio
          v-model="formData.billing_rule"
          :value="1"
          style="margin-right: 30px"
        >
          按官方
        </a-radio>
        <a-radio v-model="formData.billing_rule" :value="2"> 按系统 </a-radio>
      </a-space>
    </a-form-item>
    <a-form-item
      field="billing_methods"
      :label="$t('model.label.billing_methods')"
      :rules="[
        {
          required: true,
          message: $t('model.error.billing_methods.required'),
        },
      ]"
      style="margin-bottom: 20px"
    >
      <a-space size="large">
        <a-checkbox
          v-model="formData.billing_methods"
          :value="1"
          style="margin-right: 44px"
        >
          按量
        </a-checkbox>
        <a-checkbox
          v-model="formData.billing_methods"
          :value="2"
          @change="handleBillingMethodsChange"
        >
          按次
        </a-checkbox>
      </a-space>
    </a-form-item>
    <a-form-item
      field="billing_items"
      :label="$t('model.label.billing_items')"
      :rules="[
        {
          required: true,
          message: $t('model.error.billing_items.required'),
        },
      ]"
      style="width: 1088px; margin-bottom: 0"
    >
      <a-space size="small" wrap>
        <a-checkbox
          v-model="formData.billing_items"
          value="text"
          class="billing-items"
          @change="handleBillingItemsChange"
        >
          {{ t('model.dict.billing_items.text') }}
        </a-checkbox>
        <a-checkbox
          v-model="formData.billing_items"
          value="text_cache"
          class="billing-items"
          @change="handleBillingItemsChange"
        >
          {{ t('model.dict.billing_items.text_cache') }}
        </a-checkbox>
        <a-checkbox
          v-model="formData.billing_items"
          value="tiered_text"
          class="billing-items"
          @change="handleBillingItemsChange"
        >
          {{ t('model.dict.billing_items.tiered_text') }}
        </a-checkbox>
        <a-checkbox
          v-model="formData.billing_items"
          value="tiered_text_cache"
          class="billing-items"
          @change="handleBillingItemsChange"
        >
          {{ t('model.dict.billing_items.tiered_text_cache') }}
        </a-checkbox>
        <a-checkbox
          v-model="formData.billing_items"
          value="image"
          class="billing-items"
          @change="handleBillingItemsChange"
        >
          {{ t('model.dict.billing_items.image') }}
        </a-checkbox>
        <a-checkbox
          v-model="formData.billing_items"
          value="image_generation"
          class="billing-items"
          @change="handleBillingItemsChange"
        >
          {{ t('model.dict.billing_items.image_generation') }}
        </a-checkbox>
        <a-checkbox
          v-model="formData.billing_items"
          value="image_cache"
          class="billing-items"
          @change="handleBillingItemsChange"
        >
          {{ t('model.dict.billing_items.image_cache') }}
        </a-checkbox>
        <a-checkbox
          v-model="formData.billing_items"
          value="audio"
          class="billing-items"
          @change="handleBillingItemsChange"
        >
          {{ t('model.dict.billing_items.audio') }}
        </a-checkbox>
        <a-checkbox
          v-model="formData.billing_items"
          value="audio_cache"
          class="billing-items"
          @change="handleBillingItemsChange"
        >
          {{ t('model.dict.billing_items.audio_cache') }}
        </a-checkbox>
        <a-checkbox
          v-model="formData.billing_items"
          value="vision"
          class="billing-items"
          @change="handleBillingItemsChange"
        >
          {{ t('model.dict.billing_items.vision') }}
        </a-checkbox>
        <a-checkbox
          v-model="formData.billing_items"
          value="search"
          class="billing-items"
          @change="handleBillingItemsChange"
        >
          {{ t('model.dict.billing_items.search') }}
        </a-checkbox>
        <a-checkbox
          v-model="formData.billing_items"
          value="midjourney"
          class="billing-items"
          @change="handleBillingItemsChange"
        >
          {{ t('model.dict.billing_items.midjourney') }}
        </a-checkbox>
        <a-checkbox
          v-if="formData.billing_methods.includes(2)"
          v-model="formData.billing_items"
          value="once"
          class="billing-items"
          @change="handleBillingItemsChange"
        >
          {{ t('model.dict.billing_items.once') }}
        </a-checkbox>
      </a-space>
    </a-form-item>

    <a-tabs
      v-model:activeKey="activeKey"
      position="right"
      type="line"
      style="width: 1088px"
    >
      <!-- 文本 -->
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
            class="input"
          >
            <template #append> / M </template>
          </a-input-number>
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
            class="input"
          >
            <template #append> / M </template>
          </a-input-number>
        </a-form-item>
      </a-tab-pane>

      <!-- 文本缓存 -->
      <a-tab-pane
        v-if="formData.billing_items.includes('text_cache')"
        key="text_cache"
        :title="$t('model.dict.billing_items.text_cache')"
      >
        <a-form-item
          field="text_cache.read_ratio"
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
            class="input"
          >
            <template #append> / M </template>
          </a-input-number>
        </a-form-item>
      </a-tab-pane>

      <!-- 阶梯文本 -->
      <a-tab-pane
        v-if="formData.billing_items.includes('tiered_text')"
        key="tiered_text"
        :title="$t('model.dict.billing_items.tiered_text')"
      >
        <a-form-item
          v-for="(_, index) of formData.tiered_text"
          :key="index"
          :field="
            `tiered_text[${index}].mode` &&
            `tiered_text[${index}].input_gt` &&
            `tiered_text[${index}].input_lte` &&
            `tiered_text[${index}].input_ratio` &&
            `tiered_text[${index}].output_ratio`
          "
          :label="`${index + 1}. ` + $t('model.label.tiered_text')"
          :rules="[
            {
              required: true,
              message: $t('model.error.tiered_text.required'),
            },
          ]"
        >
          <a-select
            v-model="formData.tiered_text[index].mode"
            :placeholder="$t('model.placeholder.tiered_mode')"
            :options="modeOptions"
            style="width: 95px; margin-right: 5px"
          />
          <a-input-number
            v-model="formData.tiered_text[index].input_gt"
            :placeholder="$t('model.placeholder.tiered_input_gt')"
            style="width: 128px; margin-right: 5px"
          >
            <template #append> / k </template>
          </a-input-number>
          <a-input-number
            v-model="formData.tiered_text[index].input_lte"
            :placeholder="$t('model.placeholder.tiered_input_lte')"
            style="width: 138px; margin-right: 5px"
          >
            <template #append> / k </template>
          </a-input-number>
          <a-input-number
            v-model="formData.tiered_text[index].input_ratio"
            :placeholder="$t('model.placeholder.tiered_input_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="width: 150px; margin-right: 5px"
          >
            <template #append> / M </template>
          </a-input-number>
          <a-input-number
            v-model="formData.tiered_text[index].output_ratio"
            :placeholder="$t('model.placeholder.tiered_output_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="width: 150px"
          >
            <template #append> / M </template>
          </a-input-number>
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 10px"
            @click="handleTieredTextPricingAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleTieredTextPricingDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
      </a-tab-pane>

      <!-- 阶梯文本缓存 -->
      <a-tab-pane
        v-if="formData.billing_items.includes('tiered_text_cache')"
        key="tiered_text_cache"
        :title="$t('model.dict.billing_items.tiered_text_cache')"
      >
        <a-form-item
          v-for="(_, index) of formData.tiered_text_cache"
          :key="index"
          :field="
            `tiered_text_cache[${index}].mode` &&
            `tiered_text_cache[${index}].input_gt` &&
            `tiered_text_cache[${index}].input_lte` &&
            `tiered_text_cache[${index}].read_ratio` &&
            `tiered_text_cache[${index}].write_ratio`
          "
          :label="`${index + 1}. ` + $t('model.label.tiered_text_cache')"
          :rules="[
            {
              required: true,
              message: $t('model.error.tiered_text_cache.required'),
            },
          ]"
        >
          <a-select
            v-model="formData.tiered_text_cache[index].mode"
            :placeholder="$t('model.placeholder.tiered_mode')"
            :options="modeOptions"
            style="width: 95px; margin-right: 5px"
          />
          <a-input-number
            v-model="formData.tiered_text_cache[index].input_gt"
            :placeholder="$t('model.placeholder.tiered_input_gt')"
            style="width: 128px; margin-right: 5px"
          >
            <template #append> / k </template>
          </a-input-number>
          <a-input-number
            v-model="formData.tiered_text_cache[index].input_lte"
            :placeholder="$t('model.placeholder.tiered_input_lte')"
            style="width: 138px; margin-right: 5px"
          >
            <template #append> / k </template>
          </a-input-number>
          <a-input-number
            v-model="formData.tiered_text_cache[index].read_ratio"
            :placeholder="$t('model.placeholder.tiered_cache_read_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="width: 150px; margin-right: 5px"
          >
            <template #append> / M </template>
          </a-input-number>
          <a-input-number
            v-model="formData.tiered_text_cache[index].write_ratio"
            :placeholder="$t('model.placeholder.tiered_cache_write_ratio')"
            :min="0.000001"
            :max="9999999999999"
            style="width: 150px"
          >
            <template #append> / M </template>
          </a-input-number>
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 10px"
            @click="handleTieredTextCachePricingAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleTieredTextCachePricingDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
      </a-tab-pane>

      <!-- 图像 -->
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
            class="input"
          >
            <template #append> / M </template>
          </a-input-number>
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
            class="input"
          >
            <template #append> / M </template>
          </a-input-number>
        </a-form-item>
      </a-tab-pane>

      <!-- 图像生成 -->
      <a-tab-pane
        v-if="formData.billing_items.includes('image_generation')"
        key="image_generation"
        :title="$t('model.dict.billing_items.image_generation')"
      >
        <a-form-item
          v-for="(_, index) of formData.image_generation.length"
          :key="index"
          :field="
            `image_generation[${index}].quality` &&
            `image_generation[${index}].width` &&
            `image_generation[${index}].height` &&
            `image_generation[${index}].once_ratio`
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
            style="width: 135px; margin-right: 5px"
          />
          <a-input-number
            v-model="formData.image_generation[index].width"
            :placeholder="$t('model.placeholder.image_generation.width')"
            style="width: 145px; margin-right: 5px"
          />
          ×
          <a-input-number
            v-model="formData.image_generation[index].height"
            :placeholder="$t('model.placeholder.image_generation.height')"
            style="width: 145px; margin-left: 5px; margin-right: 5px"
          />
          <a-input-number
            v-model="formData.image_generation[index].once_ratio"
            :placeholder="$t('model.placeholder.image_generation.once_ratio')"
            style="width: 168px; margin-right: 5px"
          >
            <template #append> / 张 </template>
          </a-input-number>
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
            style="margin: 0 10px 0 2px"
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

      <!-- 图像缓存 -->
      <a-tab-pane
        v-if="formData.billing_items.includes('image_cache')"
        key="image_cache"
        :title="$t('model.dict.billing_items.image_cache')"
      >
        <a-form-item
          field="image_cache.read_ratio"
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
            class="input"
          >
            <template #append> / M </template>
          </a-input-number>
        </a-form-item>
      </a-tab-pane>

      <!-- 识图 -->
      <a-tab-pane
        v-if="formData.billing_items.includes('vision')"
        key="vision"
        :title="$t('model.dict.billing_items.vision')"
      >
        <a-form-item
          v-for="(_, index) of formData.vision"
          :key="index"
          :field="`vision[${index}].mode` && `vision[${index}].once_ratio`"
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
            style="width: 310px; margin-right: 5px"
          />
          <a-input-number
            v-model="formData.vision[index].once_ratio"
            :placeholder="$t('model.placeholder.vision.once_ratio')"
            style="width: 309px; margin-right: 5px"
          >
            <template #append> / 张 </template>
          </a-input-number>
          <a-radio
            v-model="formData.vision[index].is_default"
            value="1"
            style="width: 60px"
            @change="handleVisionPricingIsDefaultChange(index)"
            >默认</a-radio
          >
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 2px"
            @click="handleVisionPricingAdd('')"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleVisionPricingDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
      </a-tab-pane>

      <!-- 音频 -->
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
            class="input"
          >
            <template #append> / M </template>
          </a-input-number>
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
            class="input"
          >
            <template #append> / min </template>
          </a-input-number>
        </a-form-item>
      </a-tab-pane>

      <!-- 音频缓存 -->
      <a-tab-pane
        v-if="formData.billing_items.includes('audio_cache')"
        key="audio_cache"
        :title="$t('model.dict.billing_items.audio_cache')"
      >
        <a-form-item
          field="audio_cache.read_ratio"
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
            class="input"
          >
            <template #append> / M </template>
          </a-input-number>
        </a-form-item>
      </a-tab-pane>

      <!-- 搜索 -->
      <a-tab-pane
        v-if="formData.billing_items.includes('search')"
        key="search"
        :title="$t('model.dict.billing_items.search')"
      >
        <a-form-item
          v-for="(_, index) of formData.search"
          :key="index"
          :field="
            `search[${index}].search_context_size` &&
            `search[${index}].once_ratio`
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
            style="width: 310px; margin-right: 5px"
          />
          <a-input-number
            v-model="formData.search[index].once_ratio"
            :placeholder="$t('model.placeholder.search.once_ratio')"
            style="width: 309px; margin-right: 5px"
          >
            <template #append> / 次 </template>
          </a-input-number>
          <a-radio
            v-model="formData.search[index].is_default"
            value="1"
            style="width: 60px"
            @change="handleSearchPricingIsDefaultChange(index)"
            >默认</a-radio
          >
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 2px"
            @click="handleSearchPricingAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleSearchPricingDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
      </a-tab-pane>

      <!-- Midjourney -->
      <a-tab-pane
        v-if="formData.billing_items.includes('midjourney')"
        key="midjourney"
        :title="$t('model.dict.billing_items.midjourney')"
      >
        <a-form-item
          v-for="(_, index) of formData.midjourney"
          :key="index"
          :field="
            `midjourney[${index}].name` &&
            `midjourney[${index}].action` &&
            `midjourney[${index}].path` &&
            `midjourney[${index}].once_ratio`
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
            style="width: 165px; margin-right: 5px"
          />
          <a-input
            v-model="formData.midjourney[index].action"
            :placeholder="$t('model.placeholder.midjourney.action')"
            style="width: 165px; margin-right: 5px"
          />
          <a-input
            v-model="formData.midjourney[index].path"
            :placeholder="$t('model.placeholder.midjourney.path')"
            style="width: 168px; margin-right: 5px"
          />
          <a-input-number
            v-model="formData.midjourney[index].once_ratio"
            :placeholder="$t('model.placeholder.midjourney.once_ratio')"
            style="width: 168px"
          >
            <template #append> / 次 </template>
          </a-input-number>
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

      <!-- 一次 -->
      <a-tab-pane
        v-if="formData.billing_items.includes('once')"
        key="once"
        :title="$t('model.dict.billing_items.once')"
      >
        <a-form-item
          field="once.once_ratio"
          :label="$t('model.label.once_ratio')"
          :rules="[
            {
              required: true,
              message: $t('model.error.once_ratio.required'),
            },
          ]"
        >
          <a-input-number
            v-model="formData.once.once_ratio"
            :placeholder="$t('model.placeholder.once_ratio')"
            :min="0.000001"
            :max="9999999999999"
            class="input"
          >
            <template #append> / 次 </template>
          </a-input-number>
        </a-form-item>
      </a-tab-pane>
    </a-tabs>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import {
    Pricing,
    TextPricing,
    CachePricing,
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
      label: t('model.dict.billing_items.vision'),
      value: 'vision',
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
      label: t('model.dict.billing_items.search'),
      value: 'search',
    },
    {
      label: t('model.dict.billing_items.midjourney'),
      value: 'midjourney',
    },
    {
      label: t('model.dict.billing_items.once'),
      value: 'once',
    },
  ];

  const modeOptions = [
    {
      label: t('model.dict.mode.all'),
      value: 'all',
    },
    {
      label: t('model.dict.mode.thinking'),
      value: 'thinking',
    },
    {
      label: t('model.dict.mode.non_thinking'),
      value: 'non_thinking',
    },
  ];

  watch(
    () => props.modelValue,
    (val) => {
      formData.value = val;
    },
    { deep: true, immediate: true }
  );

  const validate = async () => {
    return formRef.value?.validate();
  };

  defineExpose({ validate });

  const activeKey = ref('text');
  const lastLength = ref(0);

  const handleBillingItemsChange = () => {
    if (!formData.value.billing_items.includes('once')) {
      formData.value.billing_methods = formData.value.billing_methods.filter(
        (item) => item !== 2
      );
    }

    if (formData.value.billing_items.includes(activeKey.value)) {
      if (formData.value.billing_items.length > lastLength.value) {
        activeKey.value =
          formData.value.billing_items[formData.value.billing_items.length - 1];
      }
      lastLength.value = formData.value.billing_items.length;
      return;
    }

    lastLength.value = formData.value.billing_items.length;

    for (let i = 0; i < billingItems.length; i += 1) {
      if (formData.value.billing_items.includes(billingItems[i].value)) {
        activeKey.value = billingItems[i].value;
        return;
      }
    }
  };

  const handleBillingMethodsChange = () => {
    if (formData.value.billing_methods.includes(2)) {
      if (!formData.value.billing_items.includes('once')) {
        formData.value.billing_items.push('once');
      }
    } else {
      formData.value.billing_items = formData.value.billing_items.filter(
        (item) => item !== 'once'
      );
    }
    handleBillingItemsChange();
  };

  const handleTieredTextPricingAdd = (
    m?: string,
    gt?: number,
    lte?: number
  ) => {
    const textPricing: TextPricing = {
      mode: m,
      input_gt: gt,
      input_lte: lte,
      input_ratio: ref(),
      output_ratio: ref(),
    };
    formData.value.tiered_text.push(textPricing);
  };

  const handleTieredTextPricingDel = (index: number) => {
    if (formData.value.tiered_text.length > 1) {
      formData.value.tiered_text.splice(index, 1);
    }
  };

  const handleTieredTextCachePricingAdd = (
    m?: string,
    gt?: number,
    lte?: number
  ) => {
    const cachePricing: CachePricing = {
      mode: m,
      input_gt: gt,
      input_lte: lte,
      read_ratio: ref(),
      write_ratio: ref(),
    };
    formData.value.tiered_text_cache.push(cachePricing);
  };

  const handleTieredTextCachePricingDel = (index: number) => {
    if (formData.value.tiered_text_cache.length > 1) {
      formData.value.tiered_text_cache.splice(index, 1);
    }
  };

  const handleImageGenerationPricingAdd = (
    q?: string,
    w?: number,
    h?: number
  ) => {
    const imageGenerationPricing: ImageGenerationPricing = {
      quality: q,
      width: w,
      height: h,
      once_ratio: ref(),
      is_default: formData.value.image_generation.length === 0 ? '1' : '',
    };
    formData.value.image_generation.push(imageGenerationPricing);
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

  const handleVisionPricingAdd = (m: string) => {
    const visionPricing: VisionPricing = {
      mode: m,
      once_ratio: ref(),
      is_default: formData.value.vision.length === 0 ? '1' : '',
    };
    formData.value.vision.push(visionPricing);
  };

  const handleVisionPricingDel = (index: number) => {
    if (formData.value.vision.length > 1) {
      if (formData.value.vision[index].is_default === '1') {
        formData.value.vision[index === 0 ? 1 : 0].is_default = '1';
      }
      formData.value.vision.splice(index, 1);
    }
  };

  const handleVisionPricingIsDefaultChange = (index: number) => {
    for (let i = 0; i < formData.value.vision.length; i += 1) {
      if (i === index) {
        formData.value.vision[i].is_default = '1';
      } else {
        formData.value.vision[i].is_default = '';
      }
    }
  };

  const handleSearchPricingAdd = (s?: string) => {
    const searchPricing: SearchPricing = {
      search_context_size: s,
      once_ratio: ref(),
      is_default: formData.value.search.length === 0 ? '1' : '',
    };
    formData.value.search.push(searchPricing);
  };

  const handleSearchPricingDel = (index: number) => {
    if (formData.value.search.length > 1) {
      if (formData.value.search[index].is_default === '1') {
        formData.value.search[index === 0 ? 1 : 0].is_default = '1';
      }
      formData.value.search.splice(index, 1);
    }
  };

  const handleSearchPricingIsDefaultChange = (index: number) => {
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
      once_ratio: ref(),
    };
    formData.value.midjourney.push(midjourneyPricing);
  };

  const handleMidjourneyPricingDel = (index: number) => {
    if (formData.value.midjourney.length > 1) {
      formData.value.midjourney.splice(index, 1);
    }
  };

  const inputGt = [0, 0, 128, 200, 256];
  const inputLte = [128, 200, 256, 1024, 1024];
  for (let i = 0; i < inputGt.length; i += 1) {
    handleTieredTextPricingAdd('all', inputGt[i], inputLte[i]);
    handleTieredTextCachePricingAdd('all', inputGt[i], inputLte[i]);
  }

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
    handleVisionPricingAdd(modes[i]);
  }

  const searchContextSizes = ['medium', 'high', 'low'];
  for (let i = 0; i < searchContextSizes.length; i += 1) {
    handleSearchPricingAdd(searchContextSizes[i]);
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

  .billing-items {
    width: 115px;
  }

  :deep(.arco-tabs-nav-vertical) {
    margin-top: 20px;
  }

  .input {
    width: 762px;
  }
</style>
