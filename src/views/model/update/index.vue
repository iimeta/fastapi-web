<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-common />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model.update') }}</a-breadcrumb-item>
    </a-breadcrumb>
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
            <a-divider orientation="left">{{
              $t('common.title.baseInfo')
            }}</a-divider>
            <a-form-item
              field="corp"
              :label="$t('model.label.corp')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.corp.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.corp"
                :placeholder="$t('model.placeholder.corp')"
                :scrollbar="false"
                allow-search
                @change="handleCorpChange"
              >
                <a-option
                  v-for="item in corps"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              field="name"
              :label="$t('model.label.name')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.name.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.name"
                :placeholder="$t('model.placeholder.name')"
              />
            </a-form-item>
            <a-form-item
              field="model"
              :label="$t('model.label.model')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.model.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.model"
                :placeholder="$t('model.placeholder.model')"
              />
            </a-form-item>
            <a-form-item
              field="type"
              :label="$t('model.label.type')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.type.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.type"
                :placeholder="$t('model.placeholder.type')"
                :scrollbar="false"
                allow-search
                @change="handleTypeChange"
              >
                <a-option value="1">{{ $t('dict.model_type.1') }}</a-option>
                <a-option value="2">{{ $t('dict.model_type.2') }}</a-option>
                <a-option value="3">{{ $t('dict.model_type.3') }}</a-option>
                <a-option value="4">{{ $t('dict.model_type.4') }}</a-option>
                <a-option value="5">{{ $t('dict.model_type.5') }}</a-option>
                <a-option value="6">{{ $t('dict.model_type.6') }}</a-option>
                <a-option value="100">{{ $t('dict.model_type.100') }}</a-option>
                <a-option value="101">{{ $t('dict.model_type.101') }}</a-option>
                <a-option value="102">{{ $t('dict.model_type.102') }}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="base_url" :label="$t('model.label.base_url')">
              <a-input
                v-model="formData.base_url"
                :placeholder="$t('model.placeholder.base_url')"
              />
            </a-form-item>
            <a-form-item field="path" :label="$t('model.label.path')">
              <a-input
                v-model="formData.path"
                :placeholder="$t('model.placeholder.path')"
              />
            </a-form-item>
            <a-form-item field="remark" :label="$t('model.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('model.placeholder.remark')"
              />
            </a-form-item>
            <a-divider orientation="left">{{
              $t('common.title.advanced')
            }}</a-divider>

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

            <!-- Midjourney额度 -->
            <a-form-item
              v-for="(midjourney_quotas, index) of formData.midjourney_quotas"
              v-show="isShowMidjourneyQuota"
              :key="index"
              :field="
                `midjourney_quotas[${index}].name` &&
                `midjourney_quotas[${index}].action` &&
                `midjourney_quotas[${index}].path` &&
                `midjourney_quotas[${index}].fixed_quota`
              "
              :label="`${index + 1}. ` + $t('model.label.midjourney_quotas')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.midjourney_quotas.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.midjourney_quotas[index].name"
                :placeholder="$t('model.placeholder.midjourney_quotas.name')"
                style="width: 95px; margin-right: 5px"
              />
              <a-input
                v-model="formData.midjourney_quotas[index].action"
                :placeholder="$t('model.placeholder.midjourney_quotas.action')"
                style="width: 102px; margin-right: 5px"
              />
              <a-input
                v-model="formData.midjourney_quotas[index].path"
                :placeholder="$t('model.placeholder.midjourney_quotas.path')"
                style="width: 138px; margin-right: 5px"
              />
              <a-input-number
                v-model="formData.midjourney_quotas[index].fixed_quota"
                :placeholder="
                  $t('model.placeholder.midjourney_quotas.fixed_quota')
                "
                style="width: 90px"
              />
              <a-button
                type="primary"
                shape="circle"
                style="margin: 0 10px 0 10px"
                @click="handleMidjourneyQuotaAdd()"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleMidjourneyQuotaDel(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              field="data_format"
              :label="$t('model.label.dataFormat')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.dataFormat.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-radio
                  v-model="formData.data_format"
                  value="1"
                  :default-checked="true"
                  >统一格式</a-radio
                >
                <!-- <a-radio v-model="formData.data_format" value="2"
                  >官方格式</a-radio
                > -->
              </a-space>
            </a-form-item>
            <a-form-item
              field="is_public"
              :label="$t('model.label.isPublic')"
              :rules="[
                {
                  required: true,
                },
              ]"
            >
              <a-switch v-model="formData.is_public" />
            </a-form-item>
            <a-form-item field="groups" :label="$t('model.label.groups')">
              <a-select
                v-model="formData.groups"
                :placeholder="$t('model.placeholder.groups')"
                :max-tag-count="5"
                :scrollbar="false"
                multiple
                allow-search
                allow-clear
              >
                <a-option
                  v-for="item in groups"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              field="is_enable_preset_config"
              :label="$t('model.label.is_enable_preset_config')"
            >
              <a-switch v-model="formData.is_enable_preset_config" />
            </a-form-item>
            <a-form-item
              v-if="formData.is_enable_preset_config"
              field="preset_config.is_support_system_role"
              :label="$t('model.label.preset_config.is_support_system_role')"
            >
              <a-switch
                v-model="formData.preset_config.is_support_system_role"
              />
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_preset_config &&
                formData.preset_config.is_support_system_role
              "
              field="preset_config.system_role_prompt"
              :label="$t('model.label.preset_config.system_role_prompt')"
            >
              <a-textarea
                v-model="formData.preset_config.system_role_prompt"
                :placeholder="
                  $t('model.placeholder.preset_config.system_role_prompt')
                "
                :auto-size="{ minRows: 5, maxRows: 10 }"
              />
            </a-form-item>
            <a-form-item
              v-if="formData.is_enable_preset_config"
              :field="`preset_config.min_tokens` && `preset_config.max_tokens`"
              :label="$t('model.label.preset_config.max_tokens.range')"
            >
              <a-input-number
                v-model="formData.preset_config.min_tokens"
                :placeholder="$t('model.placeholder.preset_config.min_tokens')"
                style="width: 260px; margin-right: 5px"
                :precision="0"
                :min="0"
                :max="2097152"
              />
              <a-input-number
                v-model="formData.preset_config.max_tokens"
                :placeholder="$t('model.placeholder.preset_config.max_tokens')"
                style="width: 260px"
                :precision="0"
                :min="0"
                :max="2097152"
              />
            </a-form-item>
            <a-form-item
              v-if="formData.is_enable_preset_config"
              field="preset_config.is_support_stream"
              :label="$t('model.label.preset_config.is_support_stream')"
            >
              <a-switch v-model="formData.preset_config.is_support_stream" />
            </a-form-item>
            <a-form-item
              field="is_enable_model_agent"
              :label="$t('model.label.isEnableModelAgent')"
            >
              <a-switch v-model="formData.is_enable_model_agent" />
            </a-form-item>
            <a-form-item
              v-if="formData.is_enable_model_agent"
              field="lb_strategy"
              :label="$t('model.label.lb_strategy')"
              :rules="[
                {
                  required: true,
                },
              ]"
            >
              <a-space size="large">
                <a-radio
                  v-model="formData.lb_strategy"
                  value="1"
                  :default-checked="true"
                >
                  轮询
                </a-radio>
                <a-radio v-model="formData.lb_strategy" value="2">权重</a-radio>
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="formData.is_enable_model_agent"
              field="model_agents"
              :label="$t('model.label.modelAgents')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.modelAgents.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.model_agents"
                :placeholder="$t('model.placeholder.modelAgents')"
                :max-tag-count="3"
                :scrollbar="false"
                multiple
                allow-search
                allow-clear
              >
                <a-option
                  v-for="item in modelAgents"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              field="model_forward"
              :label="$t('model.label.modelForward')"
            >
              <a-switch
                v-model="formData.is_enable_forward"
                @change="handleForwardRuleChange"
              />
            </a-form-item>
            <a-form-item
              v-if="formData.is_enable_forward"
              field="forward_config.forward_rule"
              :label="$t('model.label.forwardRule')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.forwardRule.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.forward_config.forward_rule"
                :placeholder="$t('model.placeholder.forwardRule')"
                :scrollbar="false"
                @change="handleForwardRuleChange"
              >
                <a-option value="1">全部转发</a-option>
                <a-option value="2">按关键字</a-option>
                <a-option value="3">内容长度</a-option>
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '3'
              "
              field="forward_config.content_length"
              :label="$t('model.label.content_length')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.content_length.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.forward_config.content_length"
                :placeholder="$t('model.placeholder.content_length')"
                :precision="0"
                :min="1"
                :max="9999999999999"
              />
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                (formData.forward_config.forward_rule === '1' ||
                  formData.forward_config.forward_rule === '3')
              "
              field="forward_config.target_model"
              :label="$t('model.label.targetModel')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.targetModel.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.forward_config.target_model"
                :placeholder="$t('model.placeholder.targetModel')"
                :scrollbar="false"
                allow-search
              >
                <a-option
                  v-for="item in models"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '2'
              "
              field="forward_config.match_rule"
              :label="$t('model.label.matchRule')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.matchRule.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-checkbox
                  v-model="formData.forward_config.match_rule"
                  value="1"
                  :default-checked="true"
                  >智能匹配</a-checkbox
                >
                <a-checkbox
                  v-model="formData.forward_config.match_rule"
                  value="2"
                  >正则匹配</a-checkbox
                >
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '2' &&
                formData.forward_config.match_rule.includes('1')
              "
              field="forward_config.decision_model"
              :label="$t('model.label.decisionModel')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.decisionModel.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.forward_config.decision_model"
                :placeholder="$t('model.placeholder.decisionModel')"
                :scrollbar="false"
                allow-search
              >
                <a-option
                  v-for="item in models"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              v-for="(keywords, index) of formData.forward_config.keywords"
              v-show="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '2'
              "
              :key="index"
              :field="
                `forward_config.keywords[${index}]` &&
                `forward_config.target_models[${index}]`
              "
              :label="`${index + 1}. ` + $t('model.label.keywords')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.keywordsAndtargetModel.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.forward_config.keywords[index]"
                :placeholder="$t('model.placeholder.keywords')"
                style="width: 45%; margin-right: 5px"
              />
              <a-select
                v-model="formData.forward_config.target_models[index]"
                :placeholder="$t('model.placeholder.targetModel')"
                :scrollbar="false"
                style="width: 40%"
                allow-search
              >
                <a-option
                  v-for="item in models"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
              <a-button
                type="primary"
                shape="circle"
                style="margin: 0 10px 0 10px"
                @click="handleKeywordsAdd"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleKeywordsDel(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              field="is_enable_fallback"
              :label="$t('model.label.is_enable_fallback')"
            >
              <a-switch v-model="formData.is_enable_fallback" />
            </a-form-item>
            <a-form-item
              v-if="formData.is_enable_fallback"
              field="fallback_config.model_agent"
              :label="$t('model.label.fallback_model_agent')"
              :rules="[
                {
                  required:
                    (!formData.fallback_config.model_agent &&
                      !formData.fallback_config.model) ||
                    !formData.fallback_config.model,
                  message: $t('model.error.fallback.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.fallback_config.model_agent"
                :placeholder="$t('model.placeholder.fallback_model_agent')"
                :scrollbar="false"
                allow-search
                allow-clear
              >
                <a-option
                  v-for="item in modelAgents"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="formData.is_enable_fallback"
              field="fallback_config.model"
              :label="$t('model.label.fallback_model')"
              :rules="[
                {
                  required:
                    (!formData.fallback_config.model_agent &&
                      !formData.fallback_config.model) ||
                    !formData.fallback_config.model_agent,
                  message: $t('model.error.fallback.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.fallback_config.model"
                :placeholder="$t('model.placeholder.fallback_model')"
                :scrollbar="false"
                allow-search
                allow-clear
              >
                <a-option
                  v-for="item in models"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'ModelList',
                    })
                  "
                >
                  {{ $t('button.cancel') }}
                </a-button>
                <a-button type="primary" @click="submitForm">
                  {{ $t('button.submit') }}
                </a-button>
              </div>
            </a-space>
          </a-form>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance } from 'vue';
  import useLoading from '@/hooks/loading';
  import { useRoute, useRouter } from 'vue-router';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { quotaConv, priceConv, ratioConv } from '@/utils/common';
  import {
    submitModelUpdate,
    ModelUpdate,
    queryModelDetail,
    ModelDetailParams,
    queryModelList,
    ModelList,
    GenerationQuota,
    VisionQuota,
    MidjourneyQuota,
    SearchQuota,
  } from '@/api/model';
  import { queryCorpList, CorpList } from '@/api/corp';
  import { queryModelAgentList, ModelAgentList } from '@/api/agent';
  import { queryGroupList, GroupList } from '@/api/group';

  const { loading, setLoading } = useLoading(true);
  const { proxy } = getCurrentInstance() as any;
  const route = useRoute();
  const router = useRouter();

  const corps = ref<CorpList[]>([]);
  const corpMap = new Map();
  const getCorpList = async () => {
    setLoading(true);
    try {
      const { data } = await queryCorpList();
      corps.value = data.items;
      for (let i = 0; i < corps.value.length; i += 1) {
        corpMap.set(corps.value[i].id, corps.value[i]);
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getCorpList();

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
  const formData = ref<ModelUpdate>({
    id: '',
    corp: '',
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
    data_format: '1',
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
    const corp = corpMap.get(formData.value.corp);
    if (formData.value.type === '2') {
      if (corp && corp.code === 'Midjourney') {
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
      if (corp && corp.code !== 'OpenAI') {
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

        await submitModelUpdate(formData.value).then(() => {
          proxy.$message.success('更新成功');
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

  const getModelDetail = async (
    params: ModelDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelDetail(params);
      formData.value.id = data.id;
      formData.value.corp = data.corp;
      formData.value.name = data.name;
      formData.value.model = data.model;
      formData.value.type = String(data.type);
      formData.value.base_url = data.base_url;
      formData.value.path = data.path;
      formData.value.remark = data.remark;
      formData.value.status = data.status;
      formData.value.data_format = String(data.data_format);
      formData.value.is_public = data.is_public;
      formData.value.groups = data.groups;
      formData.value.is_enable_preset_config = data.is_enable_preset_config;
      formData.value.preset_config = data.preset_config;
      formData.value.is_enable_model_agent = data.is_enable_model_agent;
      formData.value.lb_strategy = String(data.lb_strategy);
      formData.value.model_agents = data.model_agents;
      formData.value.is_enable_forward = data.is_enable_forward;

      if (data.text_quota) {
        formData.value.text_quota = data.text_quota;
        formData.value.text_quota.prompt_price = Number(
          priceConv(data.text_quota.prompt_ratio)
        );
        formData.value.text_quota.completion_price = Number(
          priceConv(data.text_quota.completion_ratio)
        );
        formData.value.text_quota.cached_price = Number(
          priceConv(data.text_quota.cached_ratio)
        );
        formData.value.text_quota.billing_method = String(
          formData.value.text_quota.billing_method
        );
      }

      if (data.image_quota) {
        isShowImageQuota.value =
          formData.value.type === '2' && data.corp_code !== 'Midjourney';

        if (!data.image_quota.generation_quotas) {
          data.image_quota.generation_quotas = [];
        }

        formData.value.image_quota = data.image_quota;
        formData.value.image_quota.billing_method = String(
          formData.value.image_quota.billing_method
        );

        for (
          let i = 0;
          i < formData.value.image_quota.generation_quotas.length;
          i += 1
        ) {
          if (formData.value.image_quota.generation_quotas[i].is_default) {
            formData.value.image_quota.generation_quotas[i].is_default = '1';
            break;
          }
        }

        formData.value.image_quota.text_price = Number(
          priceConv(data.image_quota.text_ratio)
        );
        formData.value.image_quota.input_price = Number(
          priceConv(data.image_quota.input_ratio)
        );
        formData.value.image_quota.output_price = Number(
          priceConv(data.image_quota.output_ratio)
        );
        formData.value.image_quota.cached_price = Number(
          priceConv(data.image_quota.cached_ratio)
        );
      }

      if (data.audio_quota) {
        isShowAudioQuota.value =
          formData.value.type === '5' || formData.value.type === '6';
        formData.value.audio_quota = data.audio_quota;
        formData.value.audio_quota.prompt_price = Number(
          priceConv(data.audio_quota.prompt_ratio)
        );
        formData.value.audio_quota.completion_price = Number(
          priceConv(data.audio_quota.completion_ratio)
        );
        formData.value.audio_quota.cached_price = Number(
          priceConv(data.audio_quota.cached_ratio)
        );
        formData.value.audio_quota.billing_method = String(
          formData.value.audio_quota.billing_method
        );
      }

      if (data.multimodal_quota) {
        isShowMultimodalTextQuota.value =
          formData.value.type === '100' && data.corp_code !== 'Midjourney';
        isShowMultimodalVisionQuota.value =
          formData.value.type === '100' && data.corp_code !== 'Midjourney';
        isShowSearchQuota.value =
          formData.value.type === '100' && data.corp_code === 'Google';
        isShowMultimodalSearchQuota.value =
          formData.value.type === '100' && data.corp_code === 'OpenAI';
        formData.value.multimodal_quota = data.multimodal_quota;
        formData.value.multimodal_quota.billing_rule = String(
          formData.value.multimodal_quota.billing_rule
        );
        formData.value.multimodal_quota.text_quota.prompt_price = Number(
          priceConv(data.multimodal_quota.text_quota.prompt_ratio)
        );
        formData.value.multimodal_quota.text_quota.completion_price = Number(
          priceConv(data.multimodal_quota.text_quota.completion_ratio)
        );
        formData.value.multimodal_quota.text_quota.cached_price = Number(
          priceConv(data.multimodal_quota.text_quota.cached_ratio)
        );
        formData.value.multimodal_quota.text_quota.billing_method = String(
          formData.value.multimodal_quota.text_quota.billing_method
        );

        if (formData.value.multimodal_quota.vision_quotas) {
          for (
            let i = 0;
            i < formData.value.multimodal_quota.vision_quotas.length;
            i += 1
          ) {
            if (formData.value.multimodal_quota.vision_quotas[i].is_default) {
              formData.value.multimodal_quota.vision_quotas[i].is_default = '1';
              break;
            }
          }
        } else {
          formData.value.multimodal_quota.vision_quotas = [];
        }

        if (formData.value.multimodal_quota.search_quotas) {
          for (
            let i = 0;
            i < formData.value.multimodal_quota.search_quotas.length;
            i += 1
          ) {
            if (formData.value.multimodal_quota.search_quotas[i].is_default) {
              formData.value.multimodal_quota.search_quotas[i].is_default = '1';
              break;
            }
          }
        } else {
          formData.value.multimodal_quota.search_quotas = [];
        }
      }

      if (data.realtime_quota) {
        isShowRealtimeQuota.value =
          formData.value.type === '101' && data.corp_code !== 'Midjourney';
        formData.value.realtime_quota = data.realtime_quota;
        formData.value.realtime_quota.text_quota.prompt_price = Number(
          priceConv(data.realtime_quota.text_quota.prompt_ratio)
        );
        formData.value.realtime_quota.text_quota.completion_price = Number(
          priceConv(data.realtime_quota.text_quota.completion_ratio)
        );
        formData.value.realtime_quota.text_quota.cached_price = Number(
          priceConv(data.realtime_quota.text_quota.cached_ratio)
        );
        formData.value.realtime_quota.audio_quota.prompt_price = Number(
          priceConv(data.realtime_quota.audio_quota.prompt_ratio)
        );
        formData.value.realtime_quota.audio_quota.completion_price = Number(
          priceConv(data.realtime_quota.audio_quota.completion_ratio)
        );
        formData.value.realtime_quota.audio_quota.cached_price = Number(
          priceConv(data.realtime_quota.audio_quota.cached_ratio)
        );
        formData.value.realtime_quota.audio_quota.completion_price = Number(
          priceConv(data.realtime_quota.audio_quota.completion_ratio)
        );
        formData.value.realtime_quota.text_quota.billing_method = String(
          formData.value.realtime_quota.text_quota.billing_method
        );
        formData.value.realtime_quota.audio_quota.billing_method = String(
          formData.value.realtime_quota.audio_quota.billing_method
        );
      }

      if (data.multimodal_audio_quota) {
        isShowMultimodalAudioQuota.value =
          formData.value.type === '102' && data.corp_code !== 'Midjourney';
        formData.value.multimodal_audio_quota = data.multimodal_audio_quota;
        formData.value.multimodal_audio_quota.text_quota.prompt_price = Number(
          priceConv(data.multimodal_audio_quota.text_quota.prompt_ratio)
        );
        formData.value.multimodal_audio_quota.text_quota.completion_price =
          Number(
            priceConv(data.multimodal_audio_quota.text_quota.completion_ratio)
          );
        formData.value.multimodal_audio_quota.text_quota.cached_price = Number(
          priceConv(data.multimodal_audio_quota.text_quota.cached_ratio)
        );
        formData.value.multimodal_audio_quota.audio_quota.prompt_price = Number(
          priceConv(data.multimodal_audio_quota.audio_quota.prompt_ratio)
        );
        formData.value.multimodal_audio_quota.audio_quota.completion_price =
          Number(
            priceConv(data.multimodal_audio_quota.audio_quota.completion_ratio)
          );
        formData.value.multimodal_audio_quota.audio_quota.cached_price = Number(
          priceConv(data.multimodal_audio_quota.audio_quota.cached_ratio)
        );
        formData.value.multimodal_audio_quota.text_quota.billing_method =
          String(
            formData.value.multimodal_audio_quota.text_quota.billing_method
          );
        formData.value.multimodal_audio_quota.audio_quota.billing_method =
          String(
            formData.value.multimodal_audio_quota.audio_quota.billing_method
          );
      }

      if (data.midjourney_quotas) {
        isShowMidjourneyQuota.value =
          formData.value.type === '2' && data.corp_code === 'Midjourney';
        formData.value.midjourney_quotas = data.midjourney_quotas;
      }

      if (data.forward_config) {
        if (data.forward_config.forward_rule) {
          formData.value.forward_config.forward_rule = String(
            data.forward_config.forward_rule
          );
        }
        if (data.forward_config.match_rule) {
          formData.value.forward_config.match_rule =
            data.forward_config.match_rule.map(String);
        }
        formData.value.forward_config.content_length =
          data.forward_config?.content_length;
        formData.value.forward_config.target_model =
          data.forward_config?.target_model;
        formData.value.forward_config.decision_model =
          data.forward_config?.decision_model;
        formData.value.forward_config.keywords = data.forward_config?.keywords;
        formData.value.forward_config.target_models =
          data.forward_config?.target_models;
      }
      formData.value.is_enable_fallback = data.is_enable_fallback;
      if (data.fallback_config) {
        formData.value.fallback_config.model_agent =
          data.fallback_config?.model_agent;
        formData.value.fallback_config.model = data.fallback_config?.model;
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelDetail();

  const handleCorpChange = () => {
    isShowImageQuota.value = false;
    isShowAudioQuota.value = false;
    isShowRealtimeQuota.value = false;
    isShowMultimodalAudioQuota.value = false;
    isShowMidjourneyQuota.value = false;
    isShowSearchQuota.value = false;
    isShowMultimodalSearchQuota.value = false;
    const corp = corpMap.get(formData.value.corp);
    if (corp && corp.code === 'Midjourney') {
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
      const corp = corpMap.get(formData.value.corp);
      if (corp && corp.code === 'Midjourney') {
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
      const corp = corpMap.get(formData.value.corp);

      isShowMultimodalTextQuota.value = true;
      isShowMultimodalVisionQuota.value = true;

      if (corp && (corp.code === 'OpenAI' || corp.name === 'OpenAI')) {
        isShowMultimodalSearchQuota.value = true;
      }

      if (formData.value.multimodal_quota.vision_quotas.length === 0) {
        const modes = ['auto', 'high', 'low'];
        for (let i = 0; i < modes.length; i += 1) {
          handleMultimodalVisionQuotaAdd(modes[i]);
        }
      }

      if (corp && (corp.code === 'Google' || corp.name === 'Google')) {
        isShowSearchQuota.value = true;
      }

      if (
        formData.value.multimodal_quota.search_quotas.length === 0 &&
        corp &&
        (corp.code === 'OpenAI' || corp.name === 'OpenAI')
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
    if (
      !formData.value.is_enable_forward &&
      formData.value.forward_config.keywords &&
      (formData.value.forward_config.keywords[0] === '' ||
        formData.value.forward_config.target_models[0] === '')
    ) {
      formData.value.forward_config.keywords = [];
      formData.value.forward_config.target_models = [];
    } else if (
      formData.value.forward_config.forward_rule === '2' &&
      (!formData.value.forward_config.keywords ||
        formData.value.forward_config.keywords.length === 0)
    ) {
      formData.value.forward_config.keywords = [''];
      formData.value.forward_config.target_models = [''];
    } else if (
      formData.value.forward_config.forward_rule === '1' ||
      formData.value.forward_config.forward_rule === '3'
    ) {
      if (
        formData.value.forward_config.keywords &&
        (formData.value.forward_config.keywords[0] === '' ||
          formData.value.forward_config.target_models[0] === '')
      ) {
        formData.value.forward_config.keywords = [];
        formData.value.forward_config.target_models = [];
      }
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
    name: 'ModelUpdate',
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
