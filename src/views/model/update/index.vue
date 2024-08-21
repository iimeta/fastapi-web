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
              $t('model.title.baseInfo')
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
                allow-search
                @change="handleTypeChange"
              >
                <a-option value="1">文生文</a-option>
                <a-option value="2">文生图</a-option>
                <a-option value="3">图生文</a-option>
                <a-option value="4">图生图</a-option>
                <a-option value="5">文生语音</a-option>
                <a-option value="6">语音生文</a-option>
                <a-option value="100">多模态</a-option>
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
              $t('model.title.advanced')
            }}</a-divider>
            <a-form-item
              v-if="!isShowMultimodalTextQuota"
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
                  :disabled="formData.type === '2'"
                  >倍率</a-radio
                >
                <a-radio v-model="formData.text_quota.billing_method" value="2"
                  >固定额度</a-radio
                >
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="
                !isShowMultimodalTextQuota &&
                formData.text_quota.billing_method === '1'
              "
              field="text_quota.prompt_ratio"
              :label="$t('model.label.promptRatio')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.promptRatio.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.text_quota.prompt_ratio"
                :min="0.001"
                :placeholder="$t('model.placeholder.promptRatio')"
                style="width: 90%; margin-right: 5px"
              />
              <div> ${{ priceConv(formData.text_quota.prompt_ratio) }}/k </div>
            </a-form-item>
            <a-form-item
              v-if="
                !isShowMultimodalTextQuota &&
                formData.text_quota.billing_method === '1' &&
                formData.type !== '5'
              "
              field="text_quota.completion_ratio"
              :label="$t('model.label.completionRatio')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.completionRatio.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.text_quota.completion_ratio"
                :min="0.001"
                :placeholder="$t('model.placeholder.completionRatio')"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{ priceConv(formData.text_quota.completion_ratio) }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                !isShowMultimodalTextQuota &&
                formData.text_quota.billing_method === '2' &&
                formData.type !== '2'
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
                :min="0"
                :max="9999999999999"
                :placeholder="$t('model.placeholder.fixedQuota')"
              />
            </a-form-item>
            <a-form-item
              v-for="(image_quotas, index) of formData.image_quotas"
              v-show="isShowImageQuota"
              :key="index"
              :field="
                `image_quotas[${index}].width` &&
                `image_quotas[${index}].height` &&
                `image_quotas[${index}].fixed_quota`
              "
              :label="`${index + 1}. ` + $t('model.label.image_quotas')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.image_quotas.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.image_quotas[index].width"
                :placeholder="$t('model.placeholder.image_quotas.width')"
                style="width: 118px; margin-right: 5px"
              />
              ×
              <a-input-number
                v-model="formData.image_quotas[index].height"
                :placeholder="$t('model.placeholder.image_quotas.height')"
                style="width: 118px; margin-left: 5px; margin-right: 5px"
              />
              <a-input-number
                v-model="formData.image_quotas[index].fixed_quota"
                :placeholder="$t('model.placeholder.image_quotas.fixed_quota')"
                style="width: 118px; margin-right: 5px"
              />
              <a-radio
                v-model="formData.image_quotas[index].is_default"
                value="1"
                style="width: 60px"
                @change="handleImageQuotaIsDefaultChange(index)"
                >默认</a-radio
              >
              <a-button
                type="primary"
                shape="circle"
                style="margin: 0 10px 0 10px"
                @click="handleImageQuotaAdd()"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleImageQuotaDel(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
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
              v-if="
                isShowMultimodalTextQuota &&
                formData.multimodal_quota.text_quota.billing_method === '1'
              "
              field="multimodal_quota.text_quota.prompt_ratio"
              :label="$t('model.label.promptRatio')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.promptRatio.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.multimodal_quota.text_quota.prompt_ratio"
                :min="0.001"
                :placeholder="$t('model.placeholder.promptRatio')"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  priceConv(formData.multimodal_quota.text_quota.prompt_ratio)
                }}/k
              </div>
            </a-form-item>
            <a-form-item
              v-if="
                isShowMultimodalTextQuota &&
                formData.multimodal_quota.text_quota.billing_method === '1'
              "
              field="multimodal_quota.text_quota.completion_ratio"
              :label="$t('model.label.completionRatio')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.completionRatio.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.multimodal_quota.text_quota.completion_ratio"
                :min="0.001"
                :placeholder="$t('model.placeholder.completionRatio')"
                style="width: 90%; margin-right: 5px"
              />
              <div>
                ${{
                  priceConv(
                    formData.multimodal_quota.text_quota.completion_ratio
                  )
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
                :min="0"
                :max="9999999999999"
                :placeholder="$t('model.placeholder.fixedQuota')"
              />
            </a-form-item>
            <a-form-item
              v-for="(image_quotas, index) of formData.multimodal_quota
                .image_quotas"
              v-show="isShowMultimodalImageQuota"
              :key="index"
              :field="
                `multimodal_quota.image_quotas[${index}].mode` &&
                `multimodal_quota.image_quotas[${index}].fixed_quota`
              "
              :label="`${index + 1}. ` + $t('model.label.image_mode_quotas')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.image_mode_quotas.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.multimodal_quota.image_quotas[index].mode"
                :placeholder="$t('model.placeholder.image_quotas.mode')"
                style="width: 185px; margin-right: 5px"
              />
              <a-input-number
                v-model="
                  formData.multimodal_quota.image_quotas[index].fixed_quota
                "
                :placeholder="$t('model.placeholder.image_quotas.fixed_quota')"
                style="width: 185px; margin-right: 5px"
              />
              <a-radio
                v-model="
                  formData.multimodal_quota.image_quotas[index].is_default
                "
                value="1"
                style="width: 60px"
                @change="handleMultimodalImageQuotaIsDefaultChange(index)"
                >默认</a-radio
              >
              <a-button
                type="primary"
                shape="circle"
                style="margin: 0 10px 0 10px"
                @click="handleMultimodalImageQuotaAdd()"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleMultimodalImageQuotaDel(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
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
                :min="0"
                :max="2097152"
              />
              <a-input-number
                v-model="formData.preset_config.max_tokens"
                :placeholder="$t('model.placeholder.preset_config.max_tokens')"
                style="width: 260px"
                :min="0"
                :max="2097152"
              />
            </a-form-item>
            <a-form-item
              field="is_enable_model_agent"
              :label="$t('model.label.isEnableModelAgent')"
            >
              <a-switch v-model="formData.is_enable_model_agent" />
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
                :min="1"
                :max="9999999999999"
                :placeholder="$t('model.placeholder.content_length')"
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
              field="fallback_config.fallback_model"
              :label="$t('model.label.fallback_model')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.fallback_model.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.fallback_config.fallback_model"
                :placeholder="$t('model.placeholder.fallback_model')"
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
                  {{ $t('form.button.cancel') }}
                </a-button>
                <a-button type="primary" @click="submitForm">
                  {{ $t('form.button.submit') }}
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
  import { priceConv } from '@/utils/common';
  import {
    submitModelUpdate,
    ModelUpdate,
    queryModelDetail,
    ModelDetailParams,
    queryModelList,
    ModelList,
    ImageQuota,
    MidjourneyQuota,
  } from '@/api/model';
  import { queryCorpList, CorpList } from '@/api/corp';
  import { queryModelAgentList, ModelAgentList } from '@/api/agent';

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

  const formRef = ref<FormInstance>();
  const formData = ref<ModelUpdate>({
    id: '',
    corp: '',
    name: '',
    model: '',
    type: '',
    base_url: '',
    path: '',
    remark: '',
    status: 1,
    is_enable_preset_config: false,
    preset_config: {
      is_support_system_role: true,
      system_role_prompt: '',
      min_tokens: ref(),
      max_tokens: ref(),
    },
    text_quota: {
      billing_method: '1',
      prompt_ratio: 1,
      completion_ratio: 1,
      fixed_quota: 1,
    },
    image_quotas: [],
    multimodal_quota: {
      text_quota: {
        billing_method: '1',
        prompt_ratio: 1,
        completion_ratio: 1,
        fixed_quota: 1,
      },
      image_quotas: [],
    },
    midjourney_quotas: [],
    data_format: '',
    is_public: true,
    is_enable_model_agent: false,
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
      fallback_model: '',
    },
  });

  const submitForm = async () => {
    if (formData.value.type === '2') {
      const corp = corpMap.get(formData.value.corp);
      if (corp && corp.code === 'Midjourney') {
        formData.value.image_quotas = [];
        formData.value.multimodal_quota.image_quotas = [];
      } else {
        formData.value.multimodal_quota.image_quotas = [];
        formData.value.midjourney_quotas = [];
      }
    } else if (formData.value.type === '100') {
      formData.value.image_quotas = [];
      formData.value.midjourney_quotas = [];
    } else {
      formData.value.image_quotas = [];
      formData.value.multimodal_quota.image_quotas = [];
      formData.value.midjourney_quotas = [];
    }

    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
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
      formData.value.is_enable_preset_config = data.is_enable_preset_config;
      formData.value.preset_config = data.preset_config;
      formData.value.is_enable_model_agent = data.is_enable_model_agent;
      formData.value.model_agents = data.model_agents;
      formData.value.is_enable_forward = data.is_enable_forward;

      if (data.text_quota) {
        formData.value.text_quota = data.text_quota;
        formData.value.text_quota.billing_method = String(
          formData.value.text_quota.billing_method
        );
      }

      if (data.image_quotas) {
        isShowImageQuota.value =
          formData.value.type === '2' && data.corp_code !== 'Midjourney';
        formData.value.image_quotas = data.image_quotas;

        for (let i = 0; i < formData.value.image_quotas.length; i += 1) {
          if (formData.value.image_quotas[i].is_default) {
            formData.value.image_quotas[i].is_default = '1';
            break;
          }
        }
      }

      if (data.multimodal_quota) {
        isShowMultimodalTextQuota.value =
          formData.value.type === '100' && data.corp_code !== 'Midjourney';
        isShowMultimodalImageQuota.value =
          formData.value.type === '100' && data.corp_code !== 'Midjourney';
        formData.value.multimodal_quota = data.multimodal_quota;
        formData.value.multimodal_quota.text_quota.billing_method = String(
          formData.value.multimodal_quota.text_quota.billing_method
        );

        if (formData.value.multimodal_quota.image_quotas) {
          for (
            let i = 0;
            i < formData.value.multimodal_quota.image_quotas.length;
            i += 1
          ) {
            if (formData.value.multimodal_quota.image_quotas[i].is_default) {
              formData.value.multimodal_quota.image_quotas[i].is_default = '1';
              break;
            }
          }
        } else {
          formData.value.multimodal_quota.image_quotas = [];
        }
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
        formData.value.fallback_config.fallback_model =
          data.fallback_config?.fallback_model;
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelDetail();

  const handleCorpChange = () => {
    isShowMidjourneyQuota.value = false;
    isShowImageQuota.value = false;
    const corp = corpMap.get(formData.value.corp);
    if (corp && corp.code === 'Midjourney') {
      handleMidjourneyQuota();
      return;
    }
    handleTypeChange();
  };

  const isShowImageQuota = ref(false);
  const isShowMultimodalTextQuota = ref(false);
  const isShowMultimodalImageQuota = ref(false);
  const isShowMidjourneyQuota = ref(false);

  const handleTypeChange = () => {
    isShowImageQuota.value = false;
    isShowMultimodalTextQuota.value = false;
    isShowMultimodalImageQuota.value = false;
    isShowMidjourneyQuota.value = false;
    formData.value.text_quota.billing_method = '1';

    if (formData.value.type === '2') {
      const corp = corpMap.get(formData.value.corp);
      if (corp && corp.code === 'Midjourney') {
        handleMidjourneyQuota();
        return;
      }

      isShowImageQuota.value = true;
      formData.value.text_quota.billing_method = '2';
      if (formData.value.image_quotas.length === 0) {
        const widths = [256, 512, 1024, 1024, 1792];
        const heights = [256, 512, 1024, 1792, 1024];
        for (let i = 0; i < widths.length; i += 1) {
          handleImageQuotaAdd(widths[i], heights[i]);
        }
      }
    } else if (formData.value.type === '100') {
      isShowMultimodalTextQuota.value = true;
      isShowMultimodalImageQuota.value = true;

      if (formData.value.multimodal_quota.image_quotas.length === 0) {
        const modes = ['auto', 'high', 'low'];
        for (let i = 0; i < modes.length; i += 1) {
          handleMultimodalImageQuotaAdd(modes[i]);
        }
      }
    }
  };

  const handleImageQuotaAdd = (w?: number, h?: number) => {
    const imageQuota: ImageQuota = {
      width: w,
      height: h,
      fixed_quota: ref(),
      is_default: formData.value.image_quotas.length === 0 ? '1' : '',
    };
    formData.value.image_quotas.push(imageQuota);
  };

  const handleImageQuotaDel = (index: number) => {
    if (formData.value.image_quotas.length > 1) {
      if (formData.value.image_quotas[index].is_default === '1') {
        formData.value.image_quotas[index === 0 ? 1 : 0].is_default = '1';
      }
      formData.value.image_quotas.splice(index, 1);
    }
  };

  const handleImageQuotaIsDefaultChange = (index: number) => {
    for (let i = 0; i < formData.value.image_quotas.length; i += 1) {
      if (i === index) {
        formData.value.image_quotas[i].is_default = '1';
      } else {
        formData.value.image_quotas[i].is_default = '';
      }
    }
  };

  const handleMultimodalImageQuotaAdd = (m?: string) => {
    const imageQuota: ImageQuota = {
      mode: m,
      fixed_quota: ref(),
      is_default:
        formData.value.multimodal_quota.image_quotas.length === 0 ? '1' : '',
    };
    formData.value.multimodal_quota.image_quotas.push(imageQuota);
  };

  const handleMultimodalImageQuotaDel = (index: number) => {
    if (formData.value.multimodal_quota.image_quotas.length > 1) {
      if (
        formData.value.multimodal_quota.image_quotas[index].is_default === '1'
      ) {
        formData.value.multimodal_quota.image_quotas[
          index === 0 ? 1 : 0
        ].is_default = '1';
      }
      formData.value.multimodal_quota.image_quotas.splice(index, 1);
    }
  };

  const handleMultimodalImageQuotaIsDefaultChange = (index: number) => {
    for (
      let i = 0;
      i < formData.value.multimodal_quota.image_quotas.length;
      i += 1
    ) {
      if (i === index) {
        formData.value.multimodal_quota.image_quotas[i].is_default = '1';
      } else {
        formData.value.multimodal_quota.image_quotas[i].is_default = '';
      }
    }
  };

  const handleMidjourneyQuota = () => {
    isShowImageQuota.value = false;
    isShowMidjourneyQuota.value = true;
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
