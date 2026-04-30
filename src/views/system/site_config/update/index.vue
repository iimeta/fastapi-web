<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <lucide-settings />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('sys.menu') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('site.config.menu.update') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-spin :loading="loading" class="site-config-form-full-width">
      <a-card
        class="general-card"
        :body-style="cardBodyStyle"
        :bordered="false"
      >
        <div class="wrapper">
          <a-form
            ref="formRef"
            :model="formData"
            class="form"
            :label-col-props="{ span: 4 }"
            :wrapper-col-props="{ span: 18 }"
          >
            <a-form-item
              field="domain"
              :label="$t('site.config.label.domain')"
              :rules="[
                {
                  required: true,
                  message: $t('site.config.error.required.domain'),
                },
              ]"
            >
              <a-input
                v-model="formData.domain"
                :placeholder="$t('site.config.placeholder.domain')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="title"
              :label="$t('site.config.label.title')"
              :rules="[
                {
                  required: true,
                  message: $t('site.config.placeholder.title'),
                },
              ]"
            >
              <a-input
                v-model="formData.title"
                :placeholder="$t('site.config.placeholder.title')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="logo"
              :label="$t('site.config.label.logo')"
              :rules="[
                {
                  required: true,
                  message: $t('site.config.error.required.logo'),
                },
              ]"
            >
              <a-input
                v-model="formData.logo"
                :placeholder="$t('site.config.placeholder.logo')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="favicon"
              :label="$t('site.config.label.favicon')"
              :rules="[
                {
                  required: true,
                  message: $t('site.config.error.required.favicon'),
                },
              ]"
            >
              <a-input
                v-model="formData.favicon"
                :placeholder="$t('site.config.placeholder.favicon')"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="avatar" :label="$t('site.config.label.avatar')">
              <a-input
                v-model="formData.avatar"
                :placeholder="$t('site.config.placeholder.avatar')"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="bg_img" :label="$t('site.config.label.bg_img')">
              <a-input
                v-model="formData.bg_img"
                :placeholder="$t('site.config.placeholder.bg_img')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="copyright"
              :label="$t('site.config.label.copyright')"
            >
              <a-input
                v-model="formData.copyright"
                :placeholder="$t('site.config.placeholder.copyright')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="jump_url"
              :label="$t('site.config.label.jump_url')"
            >
              <a-input
                v-model="formData.jump_url"
                :placeholder="$t('site.config.placeholder.jump_url')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="keywords"
              :label="$t('site.config.label.keywords')"
            >
              <a-input
                v-model="formData.keywords"
                :placeholder="$t('site.config.placeholder.keywords')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="description"
              :label="$t('site.config.label.description')"
            >
              <a-input
                v-model="formData.description"
                :placeholder="$t('site.config.placeholder.description')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="icp_beian"
              :label="$t('site.config.label.icp_beian')"
            >
              <a-input
                v-model="formData.icp_beian"
                :placeholder="$t('site.config.placeholder.icp_beian')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="ga_beian"
              :label="$t('site.config.label.ga_beian')"
            >
              <a-input
                v-model="formData.ga_beian"
                :placeholder="$t('site.config.placeholder.ga_beian')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="register_tips"
              :label="$t('site.config.label.register_tips')"
            >
              <a-input
                v-model="formData.register_tips"
                :placeholder="$t('site.config.placeholder.register_tips')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips"
              field="invite_code_required"
              :label="$t('site.config.label.invite_code_required')"
            >
              <a-switch v-model="formData.invite_code_required" />
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips"
              field="invite_enabled"
              :label="$t('site.config.label.invite_enabled')"
            >
              <a-switch v-model="formData.invite_enabled" />
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips && formData.invite_enabled"
              field="invite_reward_quota"
              :label="$t('site.config.label.invite_reward_quota')"
            >
              <a-input-number
                v-model="formData.invite_reward_quota"
                :placeholder="$t('site.config.placeholder.invite_reward_quota')"
                :min="0"
                :max="9999999999999"
                :parser="parsePrice"
                allow-clear
              >
                <template #prefix> {{ appStore.getCurrencySymbol }} </template>
              </a-input-number>
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips && formData.invite_enabled"
              field="invitee_grant_quota"
              :label="$t('site.config.label.invitee_grant_quota')"
            >
              <a-input-number
                v-model="formData.invitee_grant_quota"
                :placeholder="$t('site.config.placeholder.invitee_grant_quota')"
                :min="0"
                :max="9999999999999"
                :parser="parsePrice"
                allow-clear
              >
                <template #prefix> {{ appStore.getCurrencySymbol }} </template>
              </a-input-number>
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips && formData.invite_enabled"
              field="invite_min_apply_quota"
              :label="$t('site.config.label.invite_min_apply_quota')"
            >
              <a-input-number
                v-model="formData.invite_min_apply_quota"
                :placeholder="
                  $t('site.config.placeholder.invite_min_apply_quota')
                "
                :min="0"
                :max="9999999999999"
                :parser="parsePrice"
                allow-clear
              >
                <template #prefix> {{ appStore.getCurrencySymbol }} </template>
              </a-input-number>
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips && formData.invite_enabled"
              field="invite_daily_limit"
              :label="$t('site.config.label.invite_daily_limit')"
            >
              <a-input-number
                v-model="formData.invite_daily_limit"
                :placeholder="$t('site.config.placeholder.invite_daily_limit')"
                :precision="0"
                :min="0"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips && formData.invite_enabled"
              field="invite_total_limit"
              :label="$t('site.config.label.invite_total_limit')"
            >
              <a-input-number
                v-model="formData.invite_total_limit"
                :placeholder="$t('site.config.placeholder.invite_total_limit')"
                :precision="0"
                :min="0"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips && formData.invite_enabled"
              field="invite_invalid_code_action"
              :label="$t('site.config.label.invite_invalid_code_action')"
            >
              <a-select
                v-model="formData.invite_invalid_code_action"
                :placeholder="
                  $t('site.config.placeholder.invite_invalid_code_action')
                "
              >
                <a-option value="allow_register">
                  {{
                    $t(
                      'site.config.option.invite_invalid_code_action.allow_register'
                    )
                  }}
                </a-option>
                <a-option value="block_register">
                  {{
                    $t(
                      'site.config.option.invite_invalid_code_action.block_register'
                    )
                  }}
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips && formData.invite_enabled"
              field="invite_recharge_rebate_enabled"
              :label="$t('site.config.label.invite_recharge_rebate_enabled')"
            >
              <a-switch v-model="formData.invite_recharge_rebate_enabled" />
            </a-form-item>
            <a-form-item
              v-if="
                !formData.register_tips &&
                formData.invite_enabled &&
                formData.invite_recharge_rebate_enabled
              "
              field="invite_recharge_rebate_first_enabled"
              :label="$t('site.config.label.invite_recharge_rebate_first')"
            >
              <a-switch
                v-model="formData.invite_recharge_rebate_first_enabled"
              />
              <a-select
                v-model="formData.invite_recharge_rebate_first_type"
                style="width: 20%; margin-left: 12px"
              >
                <a-option value="percent">
                  {{ $t('site.config.option.rebate_type.percent') }}
                </a-option>
                <a-option value="fixed">
                  {{ $t('site.config.option.rebate_type.fixed') }}
                </a-option>
              </a-select>
              <a-input-number
                v-if="formData.invite_recharge_rebate_first_type === 'percent'"
                v-model="formData.invite_recharge_rebate_first_rate"
                :placeholder="
                  $t('site.config.placeholder.invite_recharge_rebate_rate')
                "
                :min="0"
                :max="100"
                :precision="2"
                allow-clear
                style="width: 72%; margin-left: 5px"
              >
                <template #append>%</template>
              </a-input-number>
              <a-input-number
                v-else
                v-model="formData.invite_recharge_rebate_first_quota"
                :placeholder="
                  $t('site.config.placeholder.invite_recharge_rebate_quota')
                "
                :min="0"
                :max="9999999999999"
                :parser="parsePrice"
                allow-clear
                style="width: 72%; margin-left: 5px"
              >
                <template #prefix> {{ appStore.getCurrencySymbol }} </template>
              </a-input-number>
            </a-form-item>
            <a-form-item
              v-if="
                !formData.register_tips &&
                formData.invite_enabled &&
                formData.invite_recharge_rebate_enabled
              "
              field="invite_recharge_rebate_second_enabled"
              :label="$t('site.config.label.invite_recharge_rebate_second')"
            >
              <a-switch
                v-model="formData.invite_recharge_rebate_second_enabled"
              />
              <a-select
                v-model="formData.invite_recharge_rebate_second_type"
                style="width: 20%; margin-left: 12px"
              >
                <a-option value="percent">
                  {{ $t('site.config.option.rebate_type.percent') }}
                </a-option>
                <a-option value="fixed">
                  {{ $t('site.config.option.rebate_type.fixed') }}
                </a-option>
              </a-select>
              <a-input-number
                v-if="formData.invite_recharge_rebate_second_type === 'percent'"
                v-model="formData.invite_recharge_rebate_second_rate"
                :placeholder="
                  $t('site.config.placeholder.invite_recharge_rebate_rate')
                "
                :min="0"
                :max="100"
                :precision="2"
                allow-clear
                style="width: 72%; margin-left: 5px"
              >
                <template #append>%</template>
              </a-input-number>
              <a-input-number
                v-else
                v-model="formData.invite_recharge_rebate_second_quota"
                :placeholder="
                  $t('site.config.placeholder.invite_recharge_rebate_quota')
                "
                :min="0"
                :max="9999999999999"
                :parser="parsePrice"
                allow-clear
                style="width: 72%; margin-left: 5px"
              >
                <template #prefix> {{ appStore.getCurrencySymbol }} </template>
              </a-input-number>
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips && formData.invite_enabled"
              field="invite_rule_text"
              :label="$t('site.config.label.invite_rule_text')"
            >
              <a-textarea
                v-model="formData.invite_rule_text"
                :placeholder="$t('site.config.placeholder.invite_rule_text')"
                :auto-size="{ minRows: 3, maxRows: 20 }"
              />
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips"
              field="grant_quota"
              :label="$t('site.config.label.grant_quota')"
            >
              <a-input-number
                v-model="formData.grant_quota"
                :placeholder="$t('site.config.placeholder.grant_quota')"
                :min="0.000001"
                :max="9999999999999"
                :parser="parsePrice"
                allow-clear
              >
                <template #prefix> {{ appStore.getCurrencySymbol }} </template>
              </a-input-number>
            </a-form-item>
            <a-form-item v-if="!formData.register_tips">
              <a-radio-group type="button" @change="handleQuotaQuickChange">
                <a-radio :value="5"> <Quota :model-value="5" /> </a-radio>
                <a-radio :value="10"> <Quota :model-value="10" /> </a-radio>
                <a-radio :value="20"> <Quota :model-value="20" /> </a-radio>
                <a-radio :value="50"> <Quota :model-value="50" /> </a-radio>
                <a-radio :value="100"> <Quota :model-value="100" /> </a-radio>
                <a-radio :value="200"> <Quota :model-value="200" /> </a-radio>
                <a-radio :value="300"> <Quota :model-value="300" /> </a-radio>
                <a-radio :value="500"> <Quota :model-value="500" /> </a-radio>
                <a-radio :value="1000"> <Quota :model-value="1000" /> </a-radio>
                <a-radio :value="2000"> <Quota :model-value="2000" /> </a-radio>
                <a-radio :value="5000"> <Quota :model-value="5000" /> </a-radio>
                <a-radio
                  :value="10000"
                  class="site-config-form-quota-radio--compact"
                >
                  <Quota :model-value="10000" />
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips"
              field="quota_expires_at"
              :label="$t('site.config.label.quota_expires_at')"
            >
              <a-input-number
                v-model="formData.quota_expires_at"
                :placeholder="$t('site.config.placeholder.quota_expires_at')"
                :precision="0"
                :min="1"
                allow-clear
              >
                <template #append> {{ $t('unit.minute') }} </template>
              </a-input-number>
            </a-form-item>
            <a-form-item
              field="support_email_suffix"
              :label="$t('site.config.label.support_email_suffix')"
            >
              <a-input
                v-model="formData.support_email_suffix"
                :placeholder="
                  $t('site.config.placeholder.support_email_suffix')
                "
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="register_welcome"
              :label="$t('site.config.label.register_welcome')"
            >
              <a-textarea
                v-model="formData.register_welcome"
                :placeholder="$t('site.config.placeholder.register_welcome')"
                :auto-size="{ minRows: 3, maxRows: 20 }"
              />
            </a-form-item>
            <a-form-item
              field="default_language"
              :label="$t('site.config.label.default_language')"
            >
              <a-select
                v-model="formData.default_language"
                :placeholder="$t('site.config.placeholder.default_language')"
                :scrollbar="false"
                allow-search
                allow-clear
              >
                <a-option value="zh-CN">
                  {{ $t('dict.language.zh-CN') }}
                </a-option>
                <a-option value="zh-TW">
                  {{ $t('dict.language.zh-TW') }}
                </a-option>
                <a-option value="en-US">
                  {{ $t('dict.language.en-US') }}
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item
              field="currency_symbol"
              :label="$t('site.config.label.currency_symbol')"
            >
              <a-select
                v-model="formData.currency_symbol"
                :placeholder="$t('site.config.placeholder.currency_symbol')"
                :scrollbar="false"
                allow-search
                allow-clear
                allow-create
              >
                <a-option value="¥"> ¥ </a-option>
                <a-option value="$"> $ </a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="host" :label="$t('site.config.label.host')">
              <a-input
                v-model="formData.host"
                :placeholder="$t('site.config.placeholder.host')"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="port" :label="$t('site.config.label.port')">
              <a-input-number
                v-model="formData.port"
                :placeholder="$t('site.config.placeholder.port')"
                :precision="0"
                :min="1"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="user_name"
              :label="$t('site.config.label.user_name')"
            >
              <a-input
                v-model="formData.user_name"
                :placeholder="$t('site.config.placeholder.user_name')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="password"
              :label="$t('site.config.label.password')"
            >
              <a-input
                v-model="formData.password"
                :placeholder="$t('site.config.placeholder.password')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="from_name"
              :label="$t('site.config.label.from_name')"
            >
              <a-input
                v-model="formData.from_name"
                :placeholder="$t('site.config.placeholder.from_name')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="carousel1_title"
              :label="$t('site.config.label.carousel1_title')"
            >
              <a-input
                v-model="formData.carousel1_title"
                :placeholder="$t('site.config.placeholder.carousel1_title')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-for="(carousels, index) of formData.carousels1"
              :key="index"
              :label="`${index + 1}. ` + $t('site.config.label.carousels1')"
            >
              <a-input
                v-model="formData.carousels1[index].image_url"
                :placeholder="
                  $t('site.config.placeholder.carousels1.image_url')
                "
                class="site-config-form-pair-input"
              />
              <a-input
                v-model="formData.carousels1[index].jump_url"
                :placeholder="$t('site.config.placeholder.carousels1.jump_url')"
                class="site-config-form-pair-target"
              />
              <a-button
                type="primary"
                shape="circle"
                class="site-config-form-pair-add-btn"
                @click="handleCarousels1Add()"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleCarousels1Del(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              field="carousel2_title"
              :label="$t('site.config.label.carousel2_title')"
            >
              <a-input
                v-model="formData.carousel2_title"
                :placeholder="$t('site.config.placeholder.carousel2_title')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-for="(carousels, index) of formData.carousels2"
              :key="index"
              :label="`${index + 1}. ` + $t('site.config.label.carousels2')"
            >
              <a-input
                v-model="formData.carousels2[index].image_url"
                :placeholder="
                  $t('site.config.placeholder.carousels2.image_url')
                "
                class="site-config-form-pair-input"
              />
              <a-input
                v-model="formData.carousels2[index].jump_url"
                :placeholder="$t('site.config.placeholder.carousels2.jump_url')"
                class="site-config-form-pair-target"
              />
              <a-button
                type="primary"
                shape="circle"
                class="site-config-form-pair-add-btn"
                @click="handleCarousels2Add()"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleCarousels2Del(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              field="announcement_title"
              :label="$t('site.config.label.announcement_title')"
            >
              <a-input
                v-model="formData.announcement_title"
                :placeholder="$t('site.config.placeholder.announcement_title')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="announcement_more_url"
              :label="$t('site.config.label.announcement_more_url')"
            >
              <a-input
                v-model="formData.announcement_more_url"
                :placeholder="
                  $t('site.config.placeholder.announcement_more_url')
                "
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-for="(announcements, index) of formData.announcements"
              :key="index"
              :label="`${index + 1}. ` + $t('site.config.label.announcements')"
            >
              <a-input
                v-model="formData.announcements[index].content"
                :placeholder="
                  $t('site.config.placeholder.announcements.content')
                "
                class="site-config-form-pair-input"
              />
              <a-input
                v-model="formData.announcements[index].jump_url"
                :placeholder="
                  $t('site.config.placeholder.announcements.jump_url')
                "
                class="site-config-form-pair-target"
              />
              <a-button
                type="primary"
                shape="circle"
                class="site-config-form-pair-add-btn"
                @click="handleAnnouncementsAdd()"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleAnnouncementsDel(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              field="document_title"
              :label="$t('site.config.label.document_title')"
            >
              <a-input
                v-model="formData.document_title"
                :placeholder="$t('site.config.placeholder.document_title')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="document_more_url"
              :label="$t('site.config.label.document_more_url')"
            >
              <a-input
                v-model="formData.document_more_url"
                :placeholder="$t('site.config.placeholder.document_more_url')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-for="(documents, index) of formData.documents"
              :key="index"
              :label="`${index + 1}. ` + $t('site.config.label.documents')"
            >
              <a-input
                v-model="formData.documents[index].title"
                :placeholder="$t('site.config.placeholder.documents.title')"
                class="site-config-form-pair-input"
              />
              <a-input
                v-model="formData.documents[index].jump_url"
                :placeholder="$t('site.config.placeholder.documents.jump_url')"
                class="site-config-form-pair-target"
              />
              <a-button
                type="primary"
                shape="circle"
                class="site-config-form-pair-add-btn"
                @click="handleDocumentsAdd()"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleDocumentsDel(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              field="recharge_tips"
              :label="$t('site.config.label.recharge_tips')"
            >
              <a-input
                v-model="formData.recharge_tips"
                :placeholder="$t('site.config.placeholder.recharge_tips')"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="remark" :label="$t('common.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('placeholder.remark')"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'SiteConfig',
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
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { useAppStore } from '@/store';
  import { parsePrice } from '@/utils/common';
  import {
    submitSiteConfigUpdate,
    SiteConfigUpdate,
    querySiteConfigDetail,
    SiteConfigDetailParams,
    Carousel,
    Announcement,
    Document,
  } from '@/api/site_config';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import { useRouter, useRoute } from 'vue-router';
  import Quota from '@/views/common/quota.vue';

  const { t } = useI18n();
  const appStore = useAppStore();

  const router = useRouter();
  const route = useRoute();
  const formRef = ref<FormInstance>();
  const formData = ref<SiteConfigUpdate>({
    id: '',
    domain: '',
    title: '',
    logo: '',
    favicon: '',
    avatar: '',
    bg_img: '',
    copyright: '',
    jump_url: '',
    keywords: '',
    description: '',
    icp_beian: '',
    ga_beian: '',
    register_tips: '',
    grant_quota: ref(),
    invite_enabled: false,
    invite_code_required: false,
    invite_reward_quota: ref(),
    invitee_grant_quota: ref(),
    invite_min_apply_quota: ref(),
    invite_daily_limit: undefined,
    invite_total_limit: undefined,
    invite_rule_text: '',
    invite_invalid_code_action: 'block_register',
    invite_recharge_rebate_enabled: false,
    invite_recharge_rebate_first_enabled: false,
    invite_recharge_rebate_first_type: 'percent',
    invite_recharge_rebate_first_rate: undefined,
    invite_recharge_rebate_first_quota: undefined,
    invite_recharge_rebate_second_enabled: false,
    invite_recharge_rebate_second_type: 'percent',
    invite_recharge_rebate_second_rate: undefined,
    invite_recharge_rebate_second_quota: undefined,
    quota_expires_at: ref(),
    support_email_suffix: ref(),
    register_welcome: '',
    default_language: '',
    currency_symbol: '',
    host: '',
    port: ref(),
    user_name: '',
    password: '',
    from_name: '',
    carousel1_title: '',
    carousels1: [],
    carousel2_title: '',
    carousels2: [],
    announcement_title: '',
    announcement_more_url: '',
    announcements: [],
    document_title: '',
    document_more_url: '',
    documents: [],
    recharge_tips: '',
    remark: '',
    status: 1,
  });

  const { loading, setLoading } = useLoading(false);
  const cardBodyStyle = { padding: '0 20px 20px 20px' };
  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        if (formData.value.support_email_suffix) {
          formData.value.support_email_suffix =
            formData.value.support_email_suffix.split(',');
        }

        const carousels1RemoveIndexes: number[] = [];
        formData.value.carousels1.forEach((item, index) => {
          if (!item.image_url && !item.jump_url) {
            carousels1RemoveIndexes.push(index);
          }
        });

        carousels1RemoveIndexes.reverse().forEach((item) => {
          formData.value.carousels1.splice(item, 1);
        });

        const carousels2RemoveIndexes: number[] = [];
        formData.value.carousels2.forEach((item, index) => {
          if (!item.image_url && !item.jump_url) {
            carousels2RemoveIndexes.push(index);
          }
        });

        carousels2RemoveIndexes.reverse().forEach((item) => {
          formData.value.carousels2.splice(item, 1);
        });

        const announcementsRemoveIndexes: number[] = [];
        formData.value.announcements.forEach((item, index) => {
          if (!item.content && !item.jump_url) {
            announcementsRemoveIndexes.push(index);
          }
        });

        announcementsRemoveIndexes.reverse().forEach((item) => {
          formData.value.announcements.splice(item, 1);
        });

        const documentsRemoveIndexes: number[] = [];
        formData.value.documents.forEach((item, index) => {
          if (!item.title && !item.jump_url) {
            documentsRemoveIndexes.push(index);
          }
        });

        documentsRemoveIndexes.reverse().forEach((item) => {
          formData.value.documents.splice(item, 1);
        });

        await submitSiteConfigUpdate(formData.value).then(() => {
          Message.success(t('success.update'));
          router.push({
            name: 'SiteConfig',
          });
        });
      } catch (err) {
        if (formData.value.support_email_suffix) {
          formData.value.support_email_suffix =
            formData.value.support_email_suffix.join(',');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const getSiteConfigDetail = async (
    params: SiteConfigDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await querySiteConfigDetail(params);
      formData.value.id = data.id;
      formData.value.domain = data.domain;
      formData.value.title = data.title;
      formData.value.logo = data.logo;
      formData.value.favicon = data.favicon;
      formData.value.avatar = data.avatar;
      formData.value.bg_img = data.bg_img;
      formData.value.copyright = data.copyright;
      formData.value.jump_url = data.jump_url;
      formData.value.keywords = data.keywords;
      formData.value.description = data.description;
      formData.value.icp_beian = data.icp_beian;
      formData.value.ga_beian = data.ga_beian;
      formData.value.register_tips = data.register_tips;
      formData.value.grant_quota = data.grant_quota;
      formData.value.invite_enabled = Boolean(data.invite_enabled);
      formData.value.invite_code_required = Boolean(data.invite_code_required);
      formData.value.invite_reward_quota = data.invite_reward_quota;
      formData.value.invitee_grant_quota = data.invitee_grant_quota;
      formData.value.invite_min_apply_quota = data.invite_min_apply_quota;
      formData.value.invite_daily_limit = data.invite_daily_limit;
      formData.value.invite_total_limit = data.invite_total_limit;
      formData.value.invite_rule_text = data.invite_rule_text;
      formData.value.invite_invalid_code_action =
        data.invite_invalid_code_action || 'block_register';
      formData.value.invite_recharge_rebate_enabled = Boolean(
        data.invite_recharge_rebate_enabled
      );
      formData.value.invite_recharge_rebate_first_enabled = Boolean(
        data.invite_recharge_rebate_first_enabled
      );
      formData.value.invite_recharge_rebate_first_type =
        data.invite_recharge_rebate_first_type || 'percent';
      formData.value.invite_recharge_rebate_first_rate =
        data.invite_recharge_rebate_first_rate;
      formData.value.invite_recharge_rebate_first_quota =
        data.invite_recharge_rebate_first_quota;
      formData.value.invite_recharge_rebate_second_enabled = Boolean(
        data.invite_recharge_rebate_second_enabled
      );
      formData.value.invite_recharge_rebate_second_type =
        data.invite_recharge_rebate_second_type || 'percent';
      formData.value.invite_recharge_rebate_second_rate =
        data.invite_recharge_rebate_second_rate;
      formData.value.invite_recharge_rebate_second_quota =
        data.invite_recharge_rebate_second_quota;
      formData.value.quota_expires_at = data.quota_expires_at;
      formData.value.support_email_suffix =
        data.support_email_suffix?.join(',');
      formData.value.register_welcome = data.register_welcome;
      formData.value.default_language = data.default_language;
      formData.value.currency_symbol = data.currency_symbol;
      formData.value.host = data.host;
      formData.value.port = data.port;
      formData.value.user_name = data.user_name;
      formData.value.password = data.password;
      formData.value.from_name = data.from_name;
      formData.value.carousel1_title = data.carousel1_title;
      formData.value.carousels1 = data.carousels1;
      formData.value.carousel2_title = data.carousel2_title;
      formData.value.carousels2 = data.carousels2;
      formData.value.announcement_title = data.announcement_title;
      formData.value.announcement_more_url = data.announcement_more_url;
      formData.value.announcements = data.announcements;
      formData.value.document_title = data.document_title;
      formData.value.document_more_url = data.document_more_url;
      formData.value.documents = data.documents;
      formData.value.recharge_tips = data.recharge_tips;
      formData.value.remark = data.remark;
      formData.value.status = data.status;

      if (
        !formData.value.carousels1 ||
        formData.value.carousels1.length === 0
      ) {
        formData.value.carousels1 = [];
        handleCarousels1Add();
      }

      if (
        !formData.value.carousels2 ||
        formData.value.carousels2.length === 0
      ) {
        formData.value.carousels2 = [];
        handleCarousels2Add();
      }

      if (
        !formData.value.announcements ||
        formData.value.announcements.length === 0
      ) {
        formData.value.announcements = [];
        handleAnnouncementsAdd();
      }

      if (!formData.value.documents || formData.value.documents.length === 0) {
        formData.value.documents = [];
        handleDocumentsAdd();
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getSiteConfigDetail();

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.grant_quota = quota;
  };

  const handleCarousels1Add = () => {
    const carousel: Carousel = {
      image_url: '',
      jump_url: '',
    };
    formData.value.carousels1.push(carousel);
  };

  const handleCarousels1Del = (index: number) => {
    formData.value.carousels1.splice(index, 1);
  };

  const handleCarousels2Add = () => {
    const carousel: Carousel = {
      image_url: '',
      jump_url: '',
    };
    formData.value.carousels2.push(carousel);
  };

  const handleCarousels2Del = (index: number) => {
    formData.value.carousels2.splice(index, 1);
  };

  const handleAnnouncementsAdd = () => {
    const carousel: Announcement = {
      content: '',
      jump_url: '',
    };
    formData.value.announcements.push(carousel);
  };

  const handleAnnouncementsDel = (index: number) => {
    formData.value.announcements.splice(index, 1);
  };

  const handleDocumentsAdd = () => {
    const document: Document = {
      title: '',
      jump_url: '',
    };
    formData.value.documents.push(document);
  };

  const handleDocumentsDel = (index: number) => {
    formData.value.documents.splice(index, 1);
  };
</script>

<script lang="ts">
  export default {
    name: 'SiteConfigUpdate',
  };
</script>

<style scoped lang="less">
  @import '../style/site-config-form-shared.less';

  // 公共骨架与通用 Arco 覆写已由 page-form.less / arco-overrides.less 全局提供
  // 表单共享样式已由 site-config-form-shared.less 提供
</style>
