<template>
  <div class="container">
    <a-spin :loading="loading" style="width: 100%">
      <a-card
        class="general-card"
        :body-style="{ padding: '0 20px 20px 20px' }"
        :bordered="false"
      >
        <div class="wrapper">
          <a-form
            ref="formRef"
            :model="formData"
            class="form"
            :label-col-props="{ span: 5 }"
            :wrapper-col-props="{ span: 18 }"
          >
            <!-- 文本额度 -->
            <a-form-item
              v-if="
                !isShowMultimodalTextQuota &&
                !isShowAudioQuota &&
                !isShowRealtimeQuota &&
                !isShowMultimodalAudioQuota &&
                !isShowImageQuota
              "
              field="text_quota.billing_method"
              :label="$t('model.label.billingMethod')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.billingMethod.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-radio
                  v-model="formData.text_quota.billing_method"
                  value="1"
                  :default-checked="true"
                >
                  倍率
                </a-radio>
                <a-radio v-model="formData.text_quota.billing_method" value="2">
                  固定额度
                </a-radio>
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="
                !isShowMultimodalTextQuota &&
                !isShowAudioQuota &&
                !isShowRealtimeQuota &&
                !isShowMultimodalAudioQuota &&
                !isShowImageQuota &&
                formData.text_quota.billing_method === '1'
              "
              field="text_quota.prompt_price"
              :label="$t('model.label.prompt_price')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.prompt_price.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.text_quota.prompt_price"
                :placeholder="$t('model.placeholder.prompt_price')"
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div> ${{ formData.text_quota.prompt_price || '0.00' }}/k </div>
            </a-form-item>
            <a-form-item
              v-if="
                !isShowMultimodalTextQuota &&
                !isShowAudioQuota &&
                !isShowRealtimeQuota &&
                !isShowMultimodalAudioQuota &&
                !isShowImageQuota &&
                formData.text_quota.billing_method === '1'
              "
              field="text_quota.completion_price"
              :label="$t('model.label.completion_price')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.completion_price.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.text_quota.completion_price"
                :placeholder="$t('model.placeholder.completion_price')"
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{ formData.text_quota.completion_price || '0.00' }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                !isShowMultimodalTextQuota &&
                !isShowAudioQuota &&
                !isShowRealtimeQuota &&
                !isShowMultimodalAudioQuota &&
                !isShowImageQuota &&
                formData.text_quota.billing_method === '1'
              "
              field="text_quota.cached_price"
              :label="$t('model.label.cached_price')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.cached_price.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.text_quota.cached_price"
                :placeholder="$t('model.placeholder.cached_price')"
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div> ${{ formData.text_quota.cached_price || '0.00' }}/k </div>
            </a-form-item>
            <a-form-item
              v-if="
                !isShowMultimodalTextQuota &&
                !isShowAudioQuota &&
                !isShowRealtimeQuota &&
                !isShowMultimodalAudioQuota &&
                !isShowImageQuota &&
                formData.text_quota.billing_method === '2'
              "
              field="text_quota.fixed_quota"
              :label="$t('model.label.fixedQuota')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.fixedQuota.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.text_quota.fixed_quota"
                :placeholder="$t('model.placeholder.fixedQuota')"
                :precision="0"
                :min="0"
                :max="9999999999999"
                style="width: 86%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.text_quota.fixed_quota
                    ? quotaConv(formData.text_quota.fixed_quota)
                    : '0.00'
                }}/次
              </div>
            </a-form-item>

            <!-- 绘图额度 -->
            <a-form-item
              v-if="isShowImageQuota"
              field="image_quota.billing_method"
              :label="$t('model.label.billingMethod')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.billingMethod.required'),
                },
              ]"
              @change="handleImageQuotaBillingMethodChange"
            >
              <a-space size="large">
                <a-radio
                  v-model="formData.image_quota.billing_method"
                  value="1"
                  :default-checked="true"
                >
                  倍率
                </a-radio>
                <a-radio
                  v-model="formData.image_quota.billing_method"
                  value="2"
                >
                  固定额度
                </a-radio>
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="
                isShowImageQuota && formData.image_quota.billing_method === '2'
              "
              field="image_quota.fixed_quota"
              :label="$t('model.label.fixedQuota')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.fixedQuota.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.image_quota.fixed_quota"
                :placeholder="$t('model.placeholder.fixedQuota')"
                :precision="0"
                :min="0"
                :max="9999999999999"
                style="width: 86%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.image_quota.fixed_quota
                    ? quotaConv(formData.image_quota.fixed_quota)
                    : '0.00'
                }}/次
              </div>
            </a-form-item>
            <a-form-item
              v-for="(generation_quotas, index) of formData.image_quota
                .generation_quotas"
              v-show="
                isShowImageQuota && formData.image_quota.billing_method === '1'
              "
              :key="index"
              :field="
                `image_quota.generation_quotas[${index}].quality` &&
                `image_quota.generation_quotas[${index}].width` &&
                `image_quota.generation_quotas[${index}].height` &&
                `image_quota.generation_quotas[${index}].fixed_quota`
              "
              :label="
                `${index + 1}. ` + $t('model.label.image_generation_quotas')
              "
              :rules="[
                {
                  required: true,
                  message: $t('model.error.image_generation_quotas.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.image_quota.generation_quotas[index].quality"
                :placeholder="
                  $t('model.placeholder.image_generation_quotas.quality')
                "
                style="width: 88px; margin-right: 5px"
              />
              <a-input-number
                v-model="formData.image_quota.generation_quotas[index].width"
                :placeholder="
                  $t('model.placeholder.image_generation_quotas.width')
                "
                style="width: 78px; margin-right: 5px"
              />
              ×
              <a-input-number
                v-model="formData.image_quota.generation_quotas[index].height"
                :placeholder="
                  $t('model.placeholder.image_generation_quotas.height')
                "
                style="width: 78px; margin-left: 5px; margin-right: 5px"
              />
              <a-input-number
                v-model="
                  formData.image_quota.generation_quotas[index].fixed_quota
                "
                :placeholder="
                  $t('model.placeholder.image_generation_quotas.fixed_quota')
                "
                style="width: 118px; margin-right: 5px"
              />
              <a-radio
                v-model="
                  formData.image_quota.generation_quotas[index].is_default
                "
                value="1"
                style="width: 60px"
                @change="handleImageGenerationQuotaIsDefaultChange(index)"
                >默认</a-radio
              >
              <a-button
                type="primary"
                shape="circle"
                style="margin: 0 10px 0 10px"
                @click="handleImageGenerationQuotaAdd()"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleImageGenerationQuotaDel(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              v-if="
                isShowImageQuota && formData.image_quota.billing_method === '1'
              "
              field="image_quota.text_price"
              :label="$t('model.label.image_quota.text_price')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.image_quota.text_price.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.image_quota.text_price"
                :placeholder="$t('model.placeholder.image_quota.text_price')"
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div> ${{ formData.image_quota.text_price || '0.00' }}/k </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowImageQuota && formData.image_quota.billing_method === '1'
              "
              field="image_quota.input_price"
              :label="$t('model.label.image_quota.input_price')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.image_quota.input_price.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.image_quota.input_price"
                :placeholder="$t('model.placeholder.image_quota.input_price')"
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div> ${{ formData.image_quota.input_price || '0.00' }}/k </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowImageQuota && formData.image_quota.billing_method === '1'
              "
              field="image_quota.output_price"
              :label="$t('model.label.image_quota.output_price')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.image_quota.output_price.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.image_quota.output_price"
                :placeholder="$t('model.placeholder.image_quota.output_price')"
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div> ${{ formData.image_quota.output_price || '0.00' }}/k </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowImageQuota && formData.image_quota.billing_method === '1'
              "
              field="image_quota.cached_price"
              :label="$t('model.label.image_quota.cached_price')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.image_quota.cached_price.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.image_quota.cached_price"
                :placeholder="$t('model.placeholder.image_quota.cached_price')"
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div> ${{ formData.image_quota.cached_price || '0.00' }}/k </div>
            </a-form-item>

            <!-- 音频额度 -->
            <a-form-item
              v-if="isShowAudioQuota"
              field="audio_quota.billing_method"
              :label="$t('model.label.billingMethod')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.billingMethod.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-radio
                  v-model="formData.audio_quota.billing_method"
                  value="1"
                  :default-checked="true"
                  >倍率</a-radio
                >
                <a-radio v-model="formData.audio_quota.billing_method" value="2"
                  >固定额度</a-radio
                >
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="
                isShowAudioQuota &&
                formData.audio_quota.billing_method === '1' &&
                formData.type != '6'
              "
              field="audio_quota.prompt_price"
              :label="$t('model.label.prompt_price')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.prompt_price.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.audio_quota.prompt_price"
                :placeholder="$t('model.placeholder.prompt_price')"
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div> ${{ formData.audio_quota.prompt_price || '0.00' }}/k </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowAudioQuota &&
                formData.audio_quota.billing_method === '1' &&
                formData.type != '5'
              "
              field="audio_quota.completion_price"
              :label="$t('model.label.completion_price')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.completion_price.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.audio_quota.completion_price"
                :placeholder="$t('model.placeholder.completion_price')"
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{ formData.audio_quota.completion_price || '0.00' }}/min
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowAudioQuota &&
                formData.audio_quota.billing_method === '2' &&
                formData.type !== '2'
              "
              field="audio_quota.fixed_quota"
              :label="$t('model.label.fixedQuota')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.fixedQuota.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.audio_quota.fixed_quota"
                :placeholder="$t('model.placeholder.fixedQuota')"
                :precision="0"
                :min="0"
                :max="9999999999999"
                style="width: 86%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.audio_quota.fixed_quota
                    ? quotaConv(formData.audio_quota.fixed_quota)
                    : '0.00'
                }}/次
              </div>
            </a-form-item>

            <!-- 多模态额度 -->
            <a-form-item
              v-if="isShowMultimodalTextQuota"
              field="multimodal_quota.text_quota.billing_method"
              :label="$t('model.label.billingMethod')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.billingMethod.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-radio
                  v-model="formData.multimodal_quota.text_quota.billing_method"
                  value="1"
                  :default-checked="true"
                  >倍率</a-radio
                >
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="isShowMultimodalTextQuota"
              field="multimodal_quota.billing_rule"
              :label="$t('model.label.billing_rule')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.billing_rule.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-radio
                  v-model="formData.multimodal_quota.billing_rule"
                  value="1"
                  :default-checked="true"
                >
                  按官方
                </a-radio>
                <a-radio
                  v-model="formData.multimodal_quota.billing_rule"
                  value="2"
                >
                  按系统
                </a-radio>
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="
                isShowMultimodalTextQuota &&
                formData.multimodal_quota.text_quota.billing_method === '1'
              "
              field="multimodal_quota.text_quota.prompt_price"
              :label="$t('model.label.prompt_price')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.prompt_price.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.multimodal_quota.text_quota.prompt_price"
                :placeholder="$t('model.placeholder.prompt_price')"
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.multimodal_quota.text_quota.prompt_price || '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowMultimodalTextQuota &&
                formData.multimodal_quota.text_quota.billing_method === '1'
              "
              field="multimodal_quota.text_quota.completion_price"
              :label="$t('model.label.completion_price')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.completion_price.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.multimodal_quota.text_quota.completion_price"
                :placeholder="$t('model.placeholder.completion_price')"
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.multimodal_quota.text_quota.completion_price ||
                  '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowMultimodalTextQuota &&
                formData.multimodal_quota.text_quota.billing_method === '1'
              "
              field="multimodal_quota.text_quota.cached_price"
              :label="$t('model.label.cached_price')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.cached_price.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.multimodal_quota.text_quota.cached_price"
                :placeholder="$t('model.placeholder.cached_price')"
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.multimodal_quota.text_quota.cached_price || '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowMultimodalTextQuota &&
                formData.multimodal_quota.text_quota.billing_method === '2'
              "
              field="multimodal_quota.text_quota.fixed_quota"
              :label="$t('model.label.fixedQuota')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.fixedQuota.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.multimodal_quota.text_quota.fixed_quota"
                :placeholder="$t('model.placeholder.fixedQuota')"
                :precision="0"
                :min="0"
                :max="9999999999999"
                style="width: 86%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.multimodal_quota.text_quota.fixed_quota
                    ? quotaConv(
                        formData.multimodal_quota.text_quota.fixed_quota
                      )
                    : '0.00'
                }}/次
              </div>
            </a-form-item>
            <a-form-item
              v-for="(vision_quotas, index) of formData.multimodal_quota
                .vision_quotas"
              v-show="isShowMultimodalVisionQuota"
              :key="index"
              :field="
                `multimodal_quota.vision_quotas[${index}].mode` &&
                `multimodal_quota.vision_quotas[${index}].fixed_quota`
              "
              :label="`${index + 1}. ` + $t('model.label.vision_quotas')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.vision_quotas.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.multimodal_quota.vision_quotas[index].mode"
                :placeholder="$t('model.placeholder.vision_quotas.mode')"
                style="width: 185px; margin-right: 5px"
              />
              <a-input-number
                v-model="
                  formData.multimodal_quota.vision_quotas[index].fixed_quota
                "
                :placeholder="$t('model.placeholder.vision_quotas.fixed_quota')"
                style="width: 185px; margin-right: 5px"
              />
              <a-radio
                v-model="
                  formData.multimodal_quota.vision_quotas[index].is_default
                "
                value="1"
                style="width: 60px"
                @change="handleMultimodalVisionQuotaIsDefaultChange(index)"
                >默认</a-radio
              >
              <a-button
                type="primary"
                shape="circle"
                style="margin: 0 10px 0 10px"
                @click="handleMultimodalVisionQuotaAdd('')"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleMultimodalVisionQuotaDel(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              v-if="isShowSearchQuota"
              field="multimodal_quota.search_quota"
              :label="$t('model.label.search_quota')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.search_quota.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.multimodal_quota.search_quota"
                :placeholder="$t('model.placeholder.search_quota')"
                :precision="0"
                :min="0"
                :max="9999999999999"
                style="width: 86%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.multimodal_quota.search_quota
                    ? quotaConv(formData.multimodal_quota.search_quota)
                    : '0.00'
                }}/次
              </div>
            </a-form-item>
            <a-form-item
              v-for="(search_quotas, index) of formData.multimodal_quota
                .search_quotas"
              v-show="isShowMultimodalSearchQuota"
              :key="index"
              :field="
                `multimodal_quota.search_quotas[${index}].search_context_size` &&
                `multimodal_quota.search_quotas[${index}].fixed_quota`
              "
              :label="`${index + 1}. ` + $t('model.label.search_quotas')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.search_quotas.required'),
                },
              ]"
            >
              <a-input
                v-model="
                  formData.multimodal_quota.search_quotas[index]
                    .search_context_size
                "
                :placeholder="
                  $t('model.placeholder.search_quotas.search_context_size')
                "
                style="width: 185px; margin-right: 5px"
              />
              <a-input-number
                v-model="
                  formData.multimodal_quota.search_quotas[index].fixed_quota
                "
                :placeholder="$t('model.placeholder.search_quotas.fixed_quota')"
                style="width: 185px; margin-right: 5px"
              />
              <a-radio
                v-model="
                  formData.multimodal_quota.search_quotas[index].is_default
                "
                value="1"
                style="width: 60px"
                @change="handleMultimodalSearchQuotaIsDefaultChange(index)"
                >默认</a-radio
              >
              <a-button
                type="primary"
                shape="circle"
                style="margin: 0 10px 0 10px"
                @click="handleMultimodalSearchQuotaAdd()"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleMultimodalSearchQuotaDel(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>

            <!-- 多模态实时额度 -->
            <a-form-item
              v-if="isShowRealtimeQuota"
              field="realtime_quota.text_quota.billing_method"
              :label="$t('model.label.billingMethod')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.billingMethod.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-radio
                  v-model="formData.realtime_quota.text_quota.billing_method"
                  value="1"
                  :default-checked="true"
                  >倍率</a-radio
                >
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="
                isShowRealtimeQuota &&
                formData.realtime_quota.text_quota.billing_method === '1'
              "
              field="realtime_quota.text_quota.prompt_price"
              :label="$t('model.label.realtime_quota.text_quota.prompt_price')"
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.realtime_quota.text_quota.prompt_price.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="formData.realtime_quota.text_quota.prompt_price"
                :placeholder="
                  $t('model.placeholder.realtime_quota.text_quota.prompt_price')
                "
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.realtime_quota.text_quota.prompt_price || '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowRealtimeQuota &&
                formData.realtime_quota.text_quota.billing_method === '1'
              "
              field="realtime_quota.text_quota.completion_price"
              :label="
                $t('model.label.realtime_quota.text_quota.completion_price')
              "
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.realtime_quota.text_quota.completion_price.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="formData.realtime_quota.text_quota.completion_price"
                :placeholder="
                  $t(
                    'model.placeholder.realtime_quota.text_quota.completion_price'
                  )
                "
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.realtime_quota.text_quota.completion_price || '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowRealtimeQuota &&
                formData.realtime_quota.text_quota.billing_method === '1'
              "
              field="realtime_quota.text_quota.cached_price"
              :label="$t('model.label.realtime_quota.text_quota.cached_price')"
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.realtime_quota.text_quota.cached_price.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="formData.realtime_quota.text_quota.cached_price"
                :placeholder="
                  $t('model.placeholder.realtime_quota.text_quota.cached_price')
                "
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.realtime_quota.text_quota.cached_price || '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowRealtimeQuota &&
                formData.realtime_quota.text_quota.billing_method === '2'
              "
              field="realtime_quota.text_quota.fixed_quota"
              :label="$t('model.label.realtime_quota.text_quota.fixedQuota')"
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.realtime_quota.text_quota.fixedQuota.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="formData.realtime_quota.text_quota.fixed_quota"
                :placeholder="
                  $t('model.placeholder.realtime_quota.text_quota.fixedQuota')
                "
                :precision="0"
                :min="0"
                :max="9999999999999"
                style="width: 86%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.realtime_quota.text_quota.fixed_quota
                    ? quotaConv(formData.realtime_quota.text_quota.fixed_quota)
                    : '0.00'
                }}/次
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowRealtimeQuota &&
                formData.realtime_quota.audio_quota.billing_method === '1'
              "
              field="realtime_quota.audio_quota.prompt_price"
              :label="$t('model.label.realtime_quota.audio_quota.prompt_price')"
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.realtime_quota.audio_quota.prompt_price.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="formData.realtime_quota.audio_quota.prompt_price"
                :placeholder="
                  $t(
                    'model.placeholder.realtime_quota.audio_quota.prompt_price'
                  )
                "
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.realtime_quota.audio_quota.prompt_price || '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowRealtimeQuota &&
                formData.realtime_quota.audio_quota.billing_method === '1'
              "
              field="realtime_quota.audio_quota.completion_price"
              :label="
                $t('model.label.realtime_quota.audio_quota.completion_price')
              "
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.realtime_quota.audio_quota.completion_price.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="formData.realtime_quota.audio_quota.completion_price"
                :placeholder="
                  $t(
                    'model.placeholder.realtime_quota.audio_quota.completion_price'
                  )
                "
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.realtime_quota.audio_quota.completion_price ||
                  '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowRealtimeQuota &&
                formData.realtime_quota.audio_quota.billing_method === '1'
              "
              field="realtime_quota.audio_quota.cached_price"
              :label="$t('model.label.realtime_quota.audio_quota.cached_price')"
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.realtime_quota.audio_quota.cached_price.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="formData.realtime_quota.audio_quota.cached_price"
                :placeholder="
                  $t(
                    'model.placeholder.realtime_quota.audio_quota.cached_price'
                  )
                "
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.realtime_quota.audio_quota.cached_price || '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowRealtimeQuota &&
                formData.realtime_quota.audio_quota.billing_method === '2'
              "
              field="realtime_quota.audio_quota.fixed_quota"
              :label="$t('model.label.realtime_quota.audio_quota.fixedQuota')"
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.realtime_quota.audio_quota.fixedQuota.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="formData.realtime_quota.audio_quota.fixed_quota"
                :placeholder="
                  $t('model.placeholder.realtime_quota.audio_quota.fixedQuota')
                "
                :precision="0"
                :min="0"
                :max="9999999999999"
                style="width: 86%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.realtime_quota.audio_quota.fixed_quota
                    ? quotaConv(formData.realtime_quota.audio_quota.fixed_quota)
                    : '0.00'
                }}/次
              </div>
            </a-form-item>

            <!-- 多模态语音额度 -->
            <a-form-item
              v-if="isShowMultimodalAudioQuota"
              field="multimodal_audio_quota.text_quota.billing_method"
              :label="$t('model.label.billingMethod')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.billingMethod.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-radio
                  v-model="
                    formData.multimodal_audio_quota.text_quota.billing_method
                  "
                  value="1"
                  :default-checked="true"
                  >倍率</a-radio
                >
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="
                isShowMultimodalAudioQuota &&
                formData.multimodal_audio_quota.text_quota.billing_method ===
                  '1'
              "
              field="multimodal_audio_quota.text_quota.prompt_price"
              :label="
                $t('model.label.multimodal_audio_quota.text_quota.prompt_price')
              "
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.multimodal_audio_quota.text_quota.prompt_price.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="
                  formData.multimodal_audio_quota.text_quota.prompt_price
                "
                :placeholder="
                  $t(
                    'model.placeholder.multimodal_audio_quota.text_quota.prompt_price'
                  )
                "
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.multimodal_audio_quota.text_quota.prompt_price ||
                  '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowMultimodalAudioQuota &&
                formData.multimodal_audio_quota.text_quota.billing_method ===
                  '1'
              "
              field="multimodal_audio_quota.text_quota.completion_price"
              :label="
                $t(
                  'model.label.multimodal_audio_quota.text_quota.completion_price'
                )
              "
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.multimodal_audio_quota.text_quota.completion_price.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="
                  formData.multimodal_audio_quota.text_quota.completion_price
                "
                :placeholder="
                  $t(
                    'model.placeholder.multimodal_audio_quota.text_quota.completion_price'
                  )
                "
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.multimodal_audio_quota.text_quota.completion_price ||
                  '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowMultimodalAudioQuota &&
                formData.multimodal_audio_quota.text_quota.billing_method ===
                  '1'
              "
              field="multimodal_audio_quota.text_quota.cached_price"
              :label="
                $t('model.label.multimodal_audio_quota.text_quota.cached_price')
              "
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.multimodal_audio_quota.text_quota.cached_price.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="
                  formData.multimodal_audio_quota.text_quota.cached_price
                "
                :placeholder="
                  $t(
                    'model.placeholder.multimodal_audio_quota.text_quota.cached_price'
                  )
                "
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.multimodal_audio_quota.text_quota.cached_price ||
                  '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowMultimodalAudioQuota &&
                formData.multimodal_audio_quota.text_quota.billing_method ===
                  '2'
              "
              field="multimodal_audio_quota.text_quota.fixed_quota"
              :label="
                $t('model.label.multimodal_audio_quota.text_quota.fixedQuota')
              "
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.multimodal_audio_quota.text_quota.fixedQuota.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="formData.multimodal_audio_quota.text_quota.fixed_quota"
                :placeholder="
                  $t(
                    'model.placeholder.multimodal_audio_quota.text_quota.fixedQuota'
                  )
                "
                :precision="0"
                :min="0"
                :max="9999999999999"
                style="width: 86%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.multimodal_audio_quota.text_quota.fixed_quota
                    ? quotaConv(
                        formData.multimodal_audio_quota.text_quota.fixed_quota
                      )
                    : '0.00'
                }}/次
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowMultimodalAudioQuota &&
                formData.multimodal_audio_quota.audio_quota.billing_method ===
                  '1'
              "
              field="multimodal_audio_quota.audio_quota.prompt_price"
              :label="
                $t(
                  'model.label.multimodal_audio_quota.audio_quota.prompt_price'
                )
              "
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.multimodal_audio_quota.audio_quota.prompt_price.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="
                  formData.multimodal_audio_quota.audio_quota.prompt_price
                "
                :placeholder="
                  $t(
                    'model.placeholder.multimodal_audio_quota.audio_quota.prompt_price'
                  )
                "
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.multimodal_audio_quota.audio_quota.prompt_price ||
                  '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowMultimodalAudioQuota &&
                formData.multimodal_audio_quota.audio_quota.billing_method ===
                  '1'
              "
              field="multimodal_audio_quota.audio_quota.completion_price"
              :label="
                $t(
                  'model.label.multimodal_audio_quota.audio_quota.completion_price'
                )
              "
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.multimodal_audio_quota.audio_quota.completion_price.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="
                  formData.multimodal_audio_quota.audio_quota.completion_price
                "
                :placeholder="
                  $t(
                    'model.placeholder.multimodal_audio_quota.audio_quota.completion_price'
                  )
                "
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.multimodal_audio_quota.audio_quota
                    .completion_price || '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowMultimodalAudioQuota &&
                formData.multimodal_audio_quota.audio_quota.billing_method ===
                  '1'
              "
              field="multimodal_audio_quota.audio_quota.cached_price"
              :label="
                $t(
                  'model.label.multimodal_audio_quota.audio_quota.cached_price'
                )
              "
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.multimodal_audio_quota.audio_quota.cached_price.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="
                  formData.multimodal_audio_quota.audio_quota.cached_price
                "
                :placeholder="
                  $t(
                    'model.placeholder.multimodal_audio_quota.audio_quota.cached_price'
                  )
                "
                :min="0.000001"
                :max="9999999999999"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.multimodal_audio_quota.audio_quota.cached_price ||
                  '0.00'
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowMultimodalAudioQuota &&
                formData.multimodal_audio_quota.audio_quota.billing_method ===
                  '2'
              "
              field="multimodal_audio_quota.audio_quota.fixed_quota"
              :label="
                $t('model.label.multimodal_audio_quota.audio_quota.fixedQuota')
              "
              :rules="[
                {
                  required: true,
                  message: $t(
                    'model.error.multimodal_audio_quota.audio_quota.fixedQuota.required'
                  ),
                },
              ]"
            >
              <a-input-number
                v-model="
                  formData.multimodal_audio_quota.audio_quota.fixed_quota
                "
                :placeholder="
                  $t(
                    'model.placeholder.multimodal_audio_quota.audio_quota.fixedQuota'
                  )
                "
                :precision="0"
                :min="0"
                :max="9999999999999"
                style="width: 86%; margin-right: 5px"
              />
              <div>
                ${{
                  formData.multimodal_audio_quota.audio_quota.fixed_quota
                    ? quotaConv(
                        formData.multimodal_audio_quota.audio_quota.fixed_quota
                      )
                    : '0.00'
                }}/次
              </div>
            </a-form-item>
          </a-form>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance } from 'vue';
  import useLoading from '@/hooks/loading';
  import { useRouter } from 'vue-router';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { quotaConv, ratioConv } from '@/utils/common';
  import {
    submitModelCreate,
    ModelCreate,
    queryModelList,
    ModelList,
    GenerationQuota,
    VisionQuota,
    MidjourneyQuota,
    SearchQuota,
  } from '@/api/model';
  import { queryProviderList, ProviderList } from '@/api/provider';
  import { queryModelAgentList, ModelAgentList } from '@/api/agent';
  import { queryGroupList, GroupList } from '@/api/group';

  const { loading, setLoading } = useLoading(false);
  const { proxy } = getCurrentInstance() as any;
  const router = useRouter();

  const providers = ref<ProviderList[]>([]);
  const providerMap = new Map();
  const getProviderList = async () => {
    setLoading(true);
    try {
      const { data } = await queryProviderList();
      providers.value = data.items;
      for (let i = 0; i < providers.value.length; i += 1) {
        providerMap.set(providers.value[i].id, providers.value[i]);
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getProviderList();

  const models = ref<ModelList[]>([]);
  const getModelList = async () => {
    setLoading(true);
    try {
      const { data } = await queryModelList();
      models.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelList();

  const modelAgents = ref<ModelAgentList[]>([]);
  const getModelAgentList = async () => {
    setLoading(true);
    try {
      const { data } = await queryModelAgentList();
      modelAgents.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelAgentList();

  const groups = ref<GroupList[]>([]);
  const getGroupList = async () => {
    try {
      const { data } = await queryGroupList();
      groups.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getGroupList();

  const formRef = ref<FormInstance>();
  const formData = ref<ModelCreate>({
    provider_id: '',
    name: '',
    model: '',
    type: '1',
    base_url: '',
    path: '',
    remark: '',
    is_enable_preset_config: false,
    preset_config: {
      is_support_system_role: true,
      system_role_prompt: '',
      min_tokens: ref(),
      max_tokens: ref(),
      is_support_stream: true,
    },
    text_quota: {
      billing_method: '1',
      prompt_ratio: 1,
      completion_ratio: 1,
      cached_ratio: 1,
      fixed_quota: ref(),
      prompt_price: ref(),
      completion_price: ref(),
      cached_price: ref(),
    },
    image_quota: {
      billing_method: '1',
      generation_quotas: [],
      text_ratio: 1,
      input_ratio: 1,
      output_ratio: 1,
      cached_ratio: 1,
      fixed_quota: ref(),
      text_price: ref(),
      input_price: ref(),
      output_price: ref(),
      cached_price: ref(),
    },
    audio_quota: {
      billing_method: '1',
      prompt_ratio: 1,
      completion_ratio: 1,
      cached_ratio: 1,
      fixed_quota: ref(),
      prompt_price: ref(),
      completion_price: ref(),
      cached_price: ref(),
    },
    multimodal_quota: {
      billing_rule: '1',
      text_quota: {
        billing_method: '1',
        prompt_ratio: 1,
        completion_ratio: 1,
        cached_ratio: 1,
        fixed_quota: ref(),
        prompt_price: ref(),
        completion_price: ref(),
        cached_price: ref(),
      },
      vision_quotas: [],
      search_quota: ref(),
      search_quotas: [],
    },
    realtime_quota: {
      text_quota: {
        billing_method: '1',
        prompt_ratio: 1,
        completion_ratio: 1,
        cached_ratio: 1,
        fixed_quota: ref(),
        prompt_price: ref(),
        completion_price: ref(),
        cached_price: ref(),
      },
      audio_quota: {
        billing_method: '1',
        prompt_ratio: 1,
        completion_ratio: 1,
        cached_ratio: 1,
        fixed_quota: ref(),
        prompt_price: ref(),
        completion_price: ref(),
        cached_price: ref(),
      },
      fixed_quota: ref(),
    },
    multimodal_audio_quota: {
      text_quota: {
        billing_method: '1',
        prompt_ratio: 1,
        completion_ratio: 1,
        cached_ratio: 1,
        fixed_quota: ref(),
        prompt_price: ref(),
        completion_price: ref(),
        cached_price: ref(),
      },
      audio_quota: {
        billing_method: '1',
        prompt_ratio: 1,
        completion_ratio: 1,
        cached_ratio: 1,
        fixed_quota: ref(),
        prompt_price: ref(),
        completion_price: ref(),
        cached_price: ref(),
      },
      fixed_quota: ref(),
    },
    midjourney_quotas: [],
    request_data_format: '1',
    response_data_format: '1',
    is_public: true,
    groups: [],
    is_enable_model_agent: true,
    lb_strategy: '1',
    model_agents: [],
    is_enable_forward: false,
    forward_config: {
      forward_rule: '1',
      match_rule: ['2'],
      target_model: '',
      decision_model: '',
      keywords: [],
      target_models: [],
      content_length: ref(),
    },
    is_enable_fallback: false,
    fallback_config: {
      model_agent: '',
      model: '',
    },
  });

  const submitForm = async () => {
    if (!formData.value.is_enable_forward) {
      formData.value.forward_config.forward_rule = '';
      formData.value.forward_config.match_rule = [];
      formData.value.forward_config.target_model = '';
      formData.value.forward_config.keywords = [];
      formData.value.forward_config.target_models = [];
      formData.value.forward_config.content_length = ref();
    }

    if (
      formData.value.forward_config.forward_rule === '1' ||
      formData.value.forward_config.forward_rule === '3'
    ) {
      formData.value.forward_config.keywords = [];
      formData.value.forward_config.target_models = [];
    }

    const provider = providerMap.get(formData.value.provider_id);
    if (formData.value.type === '2') {
      if (provider && provider.code === 'Midjourney') {
        formData.value.image_quota.generation_quotas = [];
        formData.value.multimodal_quota.vision_quotas = [];
      } else {
        formData.value.multimodal_quota.vision_quotas = [];
        formData.value.midjourney_quotas = [];
        if (formData.value.image_quota.billing_method === '2') {
          formData.value.image_quota.generation_quotas = [];
        }
      }
    } else if (formData.value.type === '100') {
      formData.value.image_quota.generation_quotas = [];
      formData.value.midjourney_quotas = [];
      if (provider && provider.code !== 'OpenAI') {
        formData.value.multimodal_quota.search_quotas = [];
      }
    } else {
      formData.value.image_quota.generation_quotas = [];
      formData.value.multimodal_quota.vision_quotas = [];
      formData.value.midjourney_quotas = [];
      formData.value.multimodal_quota.search_quotas = [];
    }

    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        if (formData.value.text_quota.prompt_price) {
          formData.value.text_quota.prompt_ratio = ratioConv(
            formData.value.text_quota.prompt_price
          );
        }

        if (formData.value.text_quota.completion_price) {
          formData.value.text_quota.completion_ratio = ratioConv(
            formData.value.text_quota.completion_price
          );
        }

        if (formData.value.text_quota.cached_price) {
          formData.value.text_quota.cached_ratio = ratioConv(
            formData.value.text_quota.cached_price
          );
        }

        if (formData.value.image_quota.text_price) {
          formData.value.image_quota.text_ratio = ratioConv(
            formData.value.image_quota.text_price
          );
        }

        if (formData.value.image_quota.input_price) {
          formData.value.image_quota.input_ratio = ratioConv(
            formData.value.image_quota.input_price
          );
        }

        if (formData.value.image_quota.output_price) {
          formData.value.image_quota.output_ratio = ratioConv(
            formData.value.image_quota.output_price
          );
        }

        if (formData.value.image_quota.cached_price) {
          formData.value.image_quota.cached_ratio = ratioConv(
            formData.value.image_quota.cached_price
          );
        }

        if (formData.value.audio_quota.prompt_price) {
          formData.value.audio_quota.prompt_ratio = ratioConv(
            formData.value.audio_quota.prompt_price
          );
        }

        if (formData.value.audio_quota.completion_price) {
          formData.value.audio_quota.completion_ratio = ratioConv(
            formData.value.audio_quota.completion_price
          );
        }

        if (formData.value.audio_quota.cached_price) {
          formData.value.audio_quota.cached_ratio = ratioConv(
            formData.value.audio_quota.cached_price
          );
        }

        if (formData.value.multimodal_quota.text_quota.prompt_price) {
          formData.value.multimodal_quota.text_quota.prompt_ratio = ratioConv(
            formData.value.multimodal_quota.text_quota.prompt_price
          );
        }

        if (formData.value.multimodal_quota.text_quota.completion_price) {
          formData.value.multimodal_quota.text_quota.completion_ratio =
            ratioConv(
              formData.value.multimodal_quota.text_quota.completion_price
            );
        }

        if (formData.value.multimodal_quota.text_quota.cached_price) {
          formData.value.multimodal_quota.text_quota.cached_ratio = ratioConv(
            formData.value.multimodal_quota.text_quota.cached_price
          );
        }

        if (formData.value.realtime_quota.text_quota.prompt_price) {
          formData.value.realtime_quota.text_quota.prompt_ratio = ratioConv(
            formData.value.realtime_quota.text_quota.prompt_price
          );
        }

        if (formData.value.realtime_quota.text_quota.completion_price) {
          formData.value.realtime_quota.text_quota.completion_ratio = ratioConv(
            formData.value.realtime_quota.text_quota.completion_price
          );
        }

        if (formData.value.realtime_quota.text_quota.cached_price) {
          formData.value.realtime_quota.text_quota.cached_ratio = ratioConv(
            formData.value.realtime_quota.text_quota.cached_price
          );
        }

        if (formData.value.realtime_quota.audio_quota.prompt_price) {
          formData.value.realtime_quota.audio_quota.prompt_ratio = ratioConv(
            formData.value.realtime_quota.audio_quota.prompt_price
          );
        }

        if (formData.value.realtime_quota.audio_quota.completion_price) {
          formData.value.realtime_quota.audio_quota.completion_ratio =
            ratioConv(
              formData.value.realtime_quota.audio_quota.completion_price
            );
        }

        if (formData.value.realtime_quota.audio_quota.cached_price) {
          formData.value.realtime_quota.audio_quota.cached_ratio = ratioConv(
            formData.value.realtime_quota.audio_quota.cached_price
          );
        }

        if (formData.value.multimodal_audio_quota.text_quota.prompt_price) {
          formData.value.multimodal_audio_quota.text_quota.prompt_ratio =
            ratioConv(
              formData.value.multimodal_audio_quota.text_quota.prompt_price
            );
        }

        if (formData.value.multimodal_audio_quota.text_quota.completion_price) {
          formData.value.multimodal_audio_quota.text_quota.completion_ratio =
            ratioConv(
              formData.value.multimodal_audio_quota.text_quota.completion_price
            );
        }

        if (formData.value.multimodal_audio_quota.text_quota.cached_price) {
          formData.value.multimodal_audio_quota.text_quota.cached_ratio =
            ratioConv(
              formData.value.multimodal_audio_quota.text_quota.cached_price
            );
        }

        if (formData.value.multimodal_audio_quota.audio_quota.prompt_price) {
          formData.value.multimodal_audio_quota.audio_quota.prompt_ratio =
            ratioConv(
              formData.value.multimodal_audio_quota.audio_quota.prompt_price
            );
        }

        if (
          formData.value.multimodal_audio_quota.audio_quota.completion_price
        ) {
          formData.value.multimodal_audio_quota.audio_quota.completion_ratio =
            ratioConv(
              formData.value.multimodal_audio_quota.audio_quota.completion_price
            );
        }

        if (formData.value.multimodal_audio_quota.audio_quota.cached_price) {
          formData.value.multimodal_audio_quota.audio_quota.cached_ratio =
            ratioConv(
              formData.value.multimodal_audio_quota.audio_quota.cached_price
            );
        }

        await submitModelCreate(formData.value).then(() => {
          proxy.$message.success('新建成功');
          router.push({
            name: 'ModelList',
          });
        });
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProviderChange = () => {
    isShowImageQuota.value = false;
    isShowAudioQuota.value = false;
    isShowRealtimeQuota.value = false;
    isShowMultimodalAudioQuota.value = false;
    isShowMidjourneyQuota.value = false;
    isShowSearchQuota.value = false;
    isShowMultimodalSearchQuota.value = false;
    const provider = providerMap.get(formData.value.provider_id);
    if (provider && provider.code === 'Midjourney') {
      handleMidjourneyQuota();
      return;
    }
    handleTypeChange();
  };

  const isShowImageQuota = ref(false);
  const isShowAudioQuota = ref(false);
  const isShowMultimodalTextQuota = ref(false);
  const isShowMultimodalVisionQuota = ref(false);
  const isShowRealtimeQuota = ref(false);
  const isShowMultimodalAudioQuota = ref(false);
  const isShowMidjourneyQuota = ref(false);
  const isShowSearchQuota = ref(false);
  const isShowMultimodalSearchQuota = ref(false);

  const handleTypeChange = () => {
    isShowImageQuota.value = false;
    isShowAudioQuota.value = false;
    isShowMultimodalTextQuota.value = false;
    isShowMultimodalVisionQuota.value = false;
    isShowRealtimeQuota.value = false;
    isShowMultimodalAudioQuota.value = false;
    isShowMidjourneyQuota.value = false;
    isShowSearchQuota.value = false;
    isShowMultimodalSearchQuota.value = false;
    formData.value.text_quota.billing_method = '1';

    if (formData.value.type === '2') {
      const provider = providerMap.get(formData.value.provider_id);
      if (provider && provider.code === 'Midjourney') {
        handleMidjourneyQuota();
        return;
      }

      isShowImageQuota.value = true;
      if (formData.value.image_quota.generation_quotas.length === 0) {
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
          'hd',
          'hd',
          'hd',
          'standard',
          'standard',
          'standard',
        ];
        const widths = [
          1024, 1024, 1536, 1024, 1024, 1536, 1024, 1024, 1536, 1024, 1024,
          1792, 1024, 1024, 1792,
        ];
        const heights = [
          1024, 1536, 1024, 1024, 1536, 1024, 1024, 1536, 1024, 1024, 1792,
          1024, 1024, 1792, 1024,
        ];
        for (let i = 0; i < qualities.length; i += 1) {
          handleImageGenerationQuotaAdd(qualities[i], widths[i], heights[i]);
        }
      }
    } else if (formData.value.type === '5' || formData.value.type === '6') {
      isShowAudioQuota.value = true;
    } else if (formData.value.type === '100') {
      const provider = providerMap.get(formData.value.provider_id);

      isShowMultimodalTextQuota.value = true;
      isShowMultimodalVisionQuota.value = true;

      if (
        provider &&
        (provider.code === 'OpenAI' || provider.name === 'OpenAI')
      ) {
        isShowMultimodalSearchQuota.value = true;
      }

      if (formData.value.multimodal_quota.vision_quotas.length === 0) {
        const modes = ['auto', 'high', 'low'];
        for (let i = 0; i < modes.length; i += 1) {
          handleMultimodalVisionQuotaAdd(modes[i]);
        }
      }

      if (
        provider &&
        (provider.code === 'Google' || provider.name === 'Google')
      ) {
        isShowSearchQuota.value = true;
      }

      if (
        formData.value.multimodal_quota.search_quotas.length === 0 &&
        provider &&
        (provider.code === 'OpenAI' || provider.name === 'OpenAI')
      ) {
        const searchContextSizes = ['medium', 'high', 'low'];
        for (let i = 0; i < searchContextSizes.length; i += 1) {
          handleMultimodalSearchQuotaAdd(searchContextSizes[i]);
        }
      }
    } else if (formData.value.type === '101') {
      isShowRealtimeQuota.value = true;
    } else if (formData.value.type === '102') {
      isShowMultimodalAudioQuota.value = true;
    }
  };

  const handleImageQuotaBillingMethodChange = () => {
    if (
      formData.value.image_quota.billing_method === '1' &&
      formData.value.image_quota.generation_quotas.length === 0
    ) {
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
        'hd',
        'hd',
        'hd',
        'standard',
        'standard',
        'standard',
      ];
      const widths = [
        1024, 1024, 1536, 1024, 1024, 1536, 1024, 1024, 1536, 1024, 1024, 1792,
        1024, 1024, 1792,
      ];
      const heights = [
        1024, 1536, 1024, 1024, 1536, 1024, 1024, 1536, 1024, 1024, 1792, 1024,
        1024, 1792, 1024,
      ];
      for (let i = 0; i < qualities.length; i += 1) {
        handleImageGenerationQuotaAdd(qualities[i], widths[i], heights[i]);
      }
    } else {
      formData.value.image_quota.generation_quotas = [];
    }
  };

  const handleImageGenerationQuotaAdd = (
    q?: string,
    w?: number,
    h?: number
  ) => {
    const generationQuota: GenerationQuota = {
      quality: q,
      width: w,
      height: h,
      fixed_quota: ref(),
      is_default:
        formData.value.image_quota.generation_quotas.length === 0 ? '1' : '',
    };
    formData.value.image_quota.generation_quotas.push(generationQuota);
  };

  const handleImageGenerationQuotaDel = (index: number) => {
    if (formData.value.image_quota.generation_quotas.length > 1) {
      if (
        formData.value.image_quota.generation_quotas[index].is_default === '1'
      ) {
        formData.value.image_quota.generation_quotas[
          index === 0 ? 1 : 0
        ].is_default = '1';
      }
      formData.value.image_quota.generation_quotas.splice(index, 1);
    }
  };

  const handleImageGenerationQuotaIsDefaultChange = (index: number) => {
    for (
      let i = 0;
      i < formData.value.image_quota.generation_quotas.length;
      i += 1
    ) {
      if (i === index) {
        formData.value.image_quota.generation_quotas[i].is_default = '1';
      } else {
        formData.value.image_quota.generation_quotas[i].is_default = '';
      }
    }
  };

  const handleMultimodalVisionQuotaAdd = (m: string) => {
    const visionQuota: VisionQuota = {
      mode: m,
      fixed_quota: ref(),
      is_default:
        formData.value.multimodal_quota.vision_quotas.length === 0 ? '1' : '',
    };
    formData.value.multimodal_quota.vision_quotas.push(visionQuota);
  };

  const handleMultimodalVisionQuotaDel = (index: number) => {
    if (formData.value.multimodal_quota.vision_quotas.length > 1) {
      if (
        formData.value.multimodal_quota.vision_quotas[index].is_default === '1'
      ) {
        formData.value.multimodal_quota.vision_quotas[
          index === 0 ? 1 : 0
        ].is_default = '1';
      }
      formData.value.multimodal_quota.vision_quotas.splice(index, 1);
    }
  };

  const handleMultimodalVisionQuotaIsDefaultChange = (index: number) => {
    for (
      let i = 0;
      i < formData.value.multimodal_quota.vision_quotas.length;
      i += 1
    ) {
      if (i === index) {
        formData.value.multimodal_quota.vision_quotas[i].is_default = '1';
      } else {
        formData.value.multimodal_quota.vision_quotas[i].is_default = '';
      }
    }
  };

  const handleMultimodalSearchQuotaAdd = (s?: string) => {
    const searchQuota: SearchQuota = {
      search_context_size: s,
      fixed_quota: ref(),
      is_default:
        formData.value.multimodal_quota.search_quotas.length === 0 ? '1' : '',
    };
    formData.value.multimodal_quota.search_quotas.push(searchQuota);
  };

  const handleMultimodalSearchQuotaDel = (index: number) => {
    if (formData.value.multimodal_quota.search_quotas.length > 1) {
      if (
        formData.value.multimodal_quota.search_quotas[index].is_default === '1'
      ) {
        formData.value.multimodal_quota.search_quotas[
          index === 0 ? 1 : 0
        ].is_default = '1';
      }
      formData.value.multimodal_quota.search_quotas.splice(index, 1);
    }
  };

  const handleMultimodalSearchQuotaIsDefaultChange = (index: number) => {
    for (
      let i = 0;
      i < formData.value.multimodal_quota.search_quotas.length;
      i += 1
    ) {
      if (i === index) {
        formData.value.multimodal_quota.search_quotas[i].is_default = '1';
      } else {
        formData.value.multimodal_quota.search_quotas[i].is_default = '';
      }
    }
  };

  const handleMidjourneyQuota = () => {
    isShowImageQuota.value = false;
    isShowAudioQuota.value = false;
    isShowMultimodalTextQuota.value = false;
    isShowMultimodalVisionQuota.value = false;
    isShowRealtimeQuota.value = false;
    isShowMultimodalAudioQuota.value = false;
    isShowMidjourneyQuota.value = true;
    isShowSearchQuota.value = false;
    isShowMultimodalSearchQuota.value = false;
    formData.value.type = '2';
    formData.value.text_quota.billing_method = '2';
    if (formData.value.midjourney_quotas.length === 0) {
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
        handleMidjourneyQuotaAdd(names[i], actions[i], paths[i]);
      }
    }
  };

  const handleMidjourneyQuotaAdd = (n?: string, a?: string, p?: string) => {
    const midjourneyQuota: MidjourneyQuota = {
      name: n,
      action: a,
      path: p,
      fixed_quota: ref(),
    };
    formData.value.midjourney_quotas.push(midjourneyQuota);
  };

  const handleMidjourneyQuotaDel = (index: number) => {
    if (formData.value.midjourney_quotas.length > 1) {
      formData.value.midjourney_quotas.splice(index, 1);
    }
  };

  const handleForwardRuleChange = () => {
    if (!formData.value.is_enable_forward) {
      formData.value.forward_config.target_model = '';
      formData.value.forward_config.keywords = [];
      formData.value.forward_config.target_models = [];
      formData.value.forward_config.content_length = ref();
    } else if (formData.value.forward_config.forward_rule === '2') {
      formData.value.forward_config.keywords = [''];
      formData.value.forward_config.target_models = [''];
      formData.value.forward_config.target_model = '';
      formData.value.forward_config.content_length = ref();
    } else if (
      formData.value.forward_config.forward_rule === '1' ||
      formData.value.forward_config.forward_rule === '3'
    ) {
      formData.value.forward_config.keywords = [];
      formData.value.forward_config.target_models = [];
    }
  };

  const handleKeywordsAdd = () => {
    formData.value.forward_config.keywords.push('');
    formData.value.forward_config.target_models.push('');
  };

  const handleKeywordsDel = (index: number) => {
    if (formData.value.forward_config.keywords.length > 1) {
      formData.value.forward_config.keywords.splice(index, 1);
      formData.value.forward_config.target_models.splice(index, 1);
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'ModelCreate',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 10px 20px 10px;
  }

  .container-breadcrumb {
    margin: 6px 0;
    :deep(.arco-breadcrumb-item) {
      color: rgb(var(--gray-6));
      &:last-child {
        color: rgb(var(--gray-8));
      }
    }
  }

  .general-card {
    &:first-child {
      padding-top: 20px;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-bg-2);
    :deep(.arco-form) {
      .arco-form-item {
        width: 700px;
        &:first-child {
          margin-top: 20px;
        }
      }
    }
  }

  .form {
    align-items: center;
  }

  .arco-divider-horizontal.arco-divider-with-text {
    margin: 20px 0 30px 0;
  }

  .arco-divider-horizontal {
    min-width: 97%;
    max-width: 97%;
    margin-bottom: 30px;
    &:first-child {
      margin-top: 20px;
      margin-bottom: 40px;
    }
  }

  .submit-btn {
    width: 300px;
    display: flex;
    button {
      flex: 1;
      margin: 20px 30px;
    }
  }
</style>
