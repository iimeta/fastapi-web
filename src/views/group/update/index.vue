<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <lucide-combine />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('group.menu') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('group.menu.update') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-spin :loading="loading" class="group-form-full-width">
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
            <a-divider orientation="left">
              {{ $t('common.title.base_info') }}
            </a-divider>

            <!-- 时段规则 -->
            <TimeRules
              ref="timeRulesRef"
              v-model="formData.time_rules"
              layout="two-line"
            />

            <a-form-item
              field="billing_methods"
              :label="$t('common.billing_methods')"
              :rules="[
                {
                  required: true,
                  message: $t('placeholder.billing_methods'),
                },
              ]"
            >
              <a-space size="large">
                <a-checkbox v-model="formData.billing_methods" :value="1">
                  {{ $t('dict.billing_methods.1') }}
                </a-checkbox>
                <a-checkbox v-model="formData.billing_methods" :value="2">
                  {{ $t('dict.billing_methods.2') }}
                </a-checkbox>
              </a-space>
            </a-form-item>
            <a-form-item
              field="name"
              :label="$t('group.label.name')"
              :rules="[
                {
                  required: true,
                  message: $t('group.placeholder.name'),
                },
              ]"
            >
              <a-input
                v-model="formData.name"
                :placeholder="$t('group.placeholder.name')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-if="!formData.is_default"
              field="weight"
              :label="$t('group.label.weight')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.required.weight'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.weight"
                :placeholder="$t('group.placeholder.weight')"
                :precision="0"
                :min="1"
                :max="99999"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="models"
              :label="$t('common.model')"
              :rules="[
                {
                  required: true,
                  message: $t('placeholder.model'),
                },
              ]"
            >
              <model-select
                v-model="formData.models"
                :placeholder="$t('placeholder.model')"
              />
              />
            </a-form-item>
            <a-form-item
              field="is_public"
              :label="$t('common.public')"
              :rules="[
                {
                  required: true,
                },
              ]"
            >
              <a-switch v-model="formData.is_public" />
            </a-form-item>
            <a-form-item field="is_default" :label="$t('common.default')">
              <a-switch v-model="formData.is_default" />
            </a-form-item>
            <a-form-item
              field="remark"
              :label="$t('group.label.remark')"
              :rules="[
                {
                  required: false,
                },
              ]"
            >
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('group.placeholder.remark')"
              />
            </a-form-item>

            <a-divider orientation="left">
              {{ $t('common.title.advanced') }}
            </a-divider>

            <a-form-item
              field="is_enable_model_agent"
              :label="$t('common.enable_model_agent')"
            >
              <a-switch v-model="formData.is_enable_model_agent" />
            </a-form-item>
            <a-form-item
              v-if="formData.is_enable_model_agent"
              field="lb_strategy"
              :label="$t('common.lb_strategy')"
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
                  {{ $t('dict.lb_strategy.1') }}
                </a-radio>
                <a-radio v-model="formData.lb_strategy" value="2">
                  {{ $t('dict.lb_strategy.2') }}
                </a-radio>
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="formData.is_enable_model_agent"
              field="model_agents"
              :label="$t('common.model_agents')"
              :rules="[
                {
                  required: true,
                  message: $t('placeholder.model_agents'),
                },
              ]"
            >
              <a-select
                v-model="formData.model_agents"
                :placeholder="$t('placeholder.model_agents')"
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
              field="is_limit_quota"
              :label="$t('common.limit_quota')"
            >
              <a-switch v-model="formData.is_limit_quota" />
            </a-form-item>
            <a-form-item
              v-if="formData.is_limit_quota"
              field="quota"
              :label="$t('common.quota')"
              :rules="[
                {
                  required: true,
                  message: $t('placeholder.quota'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.quota"
                :placeholder="$t('placeholder.quota')"
                :min="0.000001"
                :max="9999999999999"
                :parser="parsePrice"
                allow-clear
              >
                <template #prefix> {{ appStore.getCurrencySymbol }} </template>
              </a-input-number>
            </a-form-item>
            <a-form-item v-if="formData.is_limit_quota">
              <a-radio-group type="button" @change="handleQuotaQuickChange">
                <a-radio :value="1000"> <Quota :model-value="1000" /> </a-radio>
                <a-radio :value="2000"> <Quota :model-value="2000" /> </a-radio>
                <a-radio :value="5000"> <Quota :model-value="5000" /> </a-radio>
                <a-radio :value="10000">
                  <Quota :model-value="10000" />
                </a-radio>
                <a-radio :value="20000">
                  <Quota :model-value="20000" />
                </a-radio>
                <a-radio :value="50000"
                  ><Quota :model-value="50000" />
                </a-radio>
                <a-radio :value="100000">
                  <Quota :model-value="100000" />
                </a-radio>
                <a-radio :value="200000">
                  <Quota :model-value="200000" />
                </a-radio>
                <a-radio :value="500000">
                  <Quota :model-value="500000" />
                </a-radio>
                <a-radio
                  :value="1000000"
                  class="group-form-quota-radio--compact"
                >
                  <Quota :model-value="1000000" />
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="formData.is_limit_quota"
              field="is_cycle_reset_quota"
              :label="$t('common.cycle_reset')"
            >
              <a-switch v-model="formData.is_cycle_reset_quota" />
            </a-form-item>
            <a-form-item
              v-if="formData.is_cycle_reset_quota && formData.is_limit_quota"
              field="reset_quota"
              :label="$t('common.reset_quota')"
              :rules="[
                {
                  required: true,
                  message: $t('placeholder.reset_quota'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.reset_quota"
                :placeholder="$t('placeholder.reset_quota')"
                :min="0.000001"
                :max="9999999999999"
                :parser="parsePrice"
                allow-clear
              >
                <template #prefix> {{ appStore.getCurrencySymbol }} </template>
              </a-input-number>
            </a-form-item>
            <a-form-item
              v-if="formData.is_cycle_reset_quota && formData.is_limit_quota"
            >
              <a-radio-group
                type="button"
                @change="handleResetQuotaQuickChange"
              >
                <a-radio :value="1000"> <Quota :model-value="1000" /> </a-radio>
                <a-radio :value="2000"> <Quota :model-value="2000" /> </a-radio>
                <a-radio :value="5000"> <Quota :model-value="5000" /> </a-radio>
                <a-radio :value="10000">
                  <Quota :model-value="10000" />
                </a-radio>
                <a-radio :value="20000">
                  <Quota :model-value="20000" />
                </a-radio>
                <a-radio :value="50000"
                  ><Quota :model-value="50000" />
                </a-radio>
                <a-radio :value="100000">
                  <Quota :model-value="100000" />
                </a-radio>
                <a-radio :value="200000">
                  <Quota :model-value="200000" />
                </a-radio>
                <a-radio :value="500000">
                  <Quota :model-value="500000" />
                </a-radio>
                <a-radio
                  :value="1000000"
                  class="group-form-quota-radio--compact"
                >
                  <Quota :model-value="1000000" />
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="formData.is_cycle_reset_quota && formData.is_limit_quota"
              field="cycle_period"
              :label="$t('common.cycle_period')"
              :rules="[
                {
                  required: true,
                  message: $t('placeholder.cycle_period'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.cycle_period"
                :placeholder="$t('placeholder.cycle_period')"
                :precision="0"
                :min="1"
                allow-clear
              >
                <template #append>
                  <a-radio-group v-model="formData.period_unit" type="button">
                    <a-radio value="hour"> {{ $t('unit.hour') }} </a-radio>
                    <a-radio value="day"> {{ $t('unit.day') }} </a-radio>
                  </a-radio-group>
                  <a-radio-group v-model="formData.reset_mode" type="button">
                    <a-radio value="natural">
                      {{ $t('dict.reset_mode.natural') }}
                    </a-radio>
                    <a-radio value="relative">
                      {{ $t('dict.reset_mode.relative') }}
                    </a-radio>
                  </a-radio-group>
                </template>
              </a-input-number>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_cycle_reset_quota &&
                formData.is_limit_quota &&
                formData.period_unit === 'hour'
              "
            >
              <a-radio-group
                type="button"
                @change="handleCyclePeriodQuickChange"
              >
                <a-radio :value="1">
                  1<span class="hour">{{ $t('unit.hour') }}</span>
                </a-radio>
                <a-radio :value="3">
                  3<span class="hour">{{ $t('unit.hour') }}</span>
                </a-radio>
                <a-radio :value="5">
                  5<span class="hour">{{ $t('unit.hour') }}</span>
                </a-radio>
                <a-radio :value="8">
                  8<span class="hour">{{ $t('unit.hour') }}</span>
                </a-radio>
                <a-radio :value="12">
                  12<span class="hour">{{ $t('unit.hour') }}</span>
                </a-radio>
                <a-radio :value="24">
                  24<span class="hour">{{ $t('unit.hour') }}</span>
                </a-radio>
                <a-radio :value="48">
                  48<span class="hour">{{ $t('unit.hour') }}</span>
                </a-radio>
                <a-radio :value="72">
                  72<span class="hour">{{ $t('unit.hour') }}</span>
                </a-radio>
                <a-radio :value="120">
                  120<span class="hour">{{ $t('unit.hour') }}</span>
                </a-radio>
                <a-radio :value="168">
                  168<span class="hour">{{ $t('unit.hour') }}</span>
                </a-radio>
                <a-radio :value="720">
                  720<span
                    class="group-form-hour-label group-form-hour-label--wide"
                    >{{ $t('unit.hour') }}</span
                  >
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_cycle_reset_quota &&
                formData.is_limit_quota &&
                formData.period_unit === 'day'
              "
            >
              <a-radio-group
                type="button"
                @change="handleCyclePeriodQuickChange"
              >
                <a-radio :value="1">
                  1<span class="day">{{ $t('unit.day') }}</span>
                </a-radio>
                <a-radio :value="2">
                  2<span class="day">{{ $t('unit.day') }}</span>
                </a-radio>
                <a-radio :value="3">
                  3<span class="day">{{ $t('unit.day') }}</span>
                </a-radio>
                <a-radio :value="5">
                  5<span class="day">{{ $t('unit.day') }}</span>
                </a-radio>
                <a-radio :value="7">
                  7<span class="day">{{ $t('unit.day') }}</span>
                </a-radio>
                <a-radio :value="10">
                  10<span class="day">{{ $t('unit.day') }}</span>
                </a-radio>
                <a-radio :value="15">
                  15<span class="day">{{ $t('unit.day') }}</span>
                </a-radio>
                <a-radio :value="20">
                  20<span class="day">{{ $t('unit.day') }}</span>
                </a-radio>
                <a-radio :value="30">
                  30<span class="day">{{ $t('unit.day') }}</span>
                </a-radio>
                <a-radio :value="31">
                  31<span class="day">{{ $t('unit.day') }}</span>
                </a-radio>
                <a-radio :value="60">
                  60<span class="day">{{ $t('unit.day') }}</span>
                </a-radio>
                <a-radio :value="90">
                  90<span class="day">{{ $t('unit.day') }}</span>
                </a-radio>
                <a-radio :value="180">
                  180<span
                    class="group-form-day-label group-form-day-label--wide"
                    >{{ $t('unit.day') }}</span
                  >
                </a-radio>
                <a-radio :value="365">
                  365<span
                    class="group-form-day-label group-form-day-label--wide"
                    >{{ $t('unit.day') }}</span
                  >
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              field="model_forward"
              :label="$t('group.label.is_enable_forward')"
            >
              <a-switch
                v-model="formData.is_enable_forward"
                @change="handleForwardRuleChange"
              />
            </a-form-item>
            <a-form-item
              v-if="formData.is_enable_forward"
              field="forward_config.forward_rule"
              :label="$t('group.label.forward_rule')"
              :rules="[
                {
                  required: true,
                  message: $t('group.placeholder.forward_rule'),
                },
              ]"
            >
              <a-select
                v-model="formData.forward_config.forward_rule"
                :placeholder="$t('group.placeholder.forward_rule')"
                :scrollbar="false"
                @change="handleForwardRuleChange"
              >
                <a-option value="1">{{ $t('dict.forward_rule.1') }}</a-option>
                <a-option value="2">{{ $t('dict.forward_rule.2') }}</a-option>
                <a-option value="3">{{ $t('dict.forward_rule.3') }}</a-option>
                <a-option value="4">{{ $t('dict.forward_rule.4') }}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '1'
              "
              field="forward_config.forward_mode"
              :label="$t('group.label.forward_mode')"
              :rules="[
                {
                  required: true,
                },
              ]"
            >
              <a-space size="large">
                <a-radio
                  v-model="formData.forward_config.forward_mode"
                  :value="1"
                  default-checked="true"
                >
                  {{ $t('dict.forward_mode.1') }}
                </a-radio>
                <a-radio
                  v-model="formData.forward_config.forward_mode"
                  :value="2"
                >
                  {{ $t('dict.forward_mode.2') }}
                </a-radio>
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '3'
              "
              field="forward_config.content_length"
              :label="$t('group.label.content_length')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.required.content_length'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.forward_config.content_length"
                :placeholder="$t('group.placeholder.content_length')"
                :precision="0"
                :min="1"
                :max="9999999999999"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '4'
              "
              field="forward_config.used_quota"
              :label="$t('common.quota')"
              :rules="[
                {
                  required: true,
                  message: $t('placeholder.quota'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.forward_config.used_quota"
                :placeholder="$t('placeholder.quota')"
                :min="0.000001"
                :max="9999999999999"
                :parser="parsePrice"
                allow-clear
              >
                <template #prefix> {{ appStore.getCurrencySymbol }} </template>
              </a-input-number>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '4'
              "
            >
              <a-radio-group type="button" @change="handleUsedQuotaQuickChange">
                <a-radio :value="1000"> <Quota :model-value="1000" /> </a-radio>
                <a-radio :value="2000"> <Quota :model-value="2000" /> </a-radio>
                <a-radio :value="5000"> <Quota :model-value="5000" /> </a-radio>
                <a-radio :value="10000">
                  <Quota :model-value="10000" />
                </a-radio>
                <a-radio :value="20000">
                  <Quota :model-value="20000" />
                </a-radio>
                <a-radio :value="50000"
                  ><Quota :model-value="50000" />
                </a-radio>
                <a-radio :value="100000">
                  <Quota :model-value="100000" />
                </a-radio>
                <a-radio :value="200000">
                  <Quota :model-value="200000" />
                </a-radio>
                <a-radio :value="500000">
                  <Quota :model-value="500000" />
                </a-radio>
                <a-radio
                  :value="1000000"
                  class="group-form-quota-radio--compact"
                >
                  <Quota :model-value="1000000" />
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                ((formData.forward_config.forward_rule === '1' &&
                  formData.forward_config.forward_mode === 1) ||
                  formData.forward_config.forward_rule === '3' ||
                  formData.forward_config.forward_rule === '4')
              "
              field="forward_config.target_model"
              :label="$t('group.label.target_model')"
              :rules="[
                {
                  required: true,
                  message: $t('group.placeholder.target_model'),
                },
              ]"
            >
              <a-select
                v-model="formData.forward_config.target_model"
                :placeholder="$t('group.placeholder.target_model')"
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
                formData.forward_config.forward_rule === '1' &&
                formData.forward_config.forward_mode === 2
              "
              field="forward_config.target_models"
              :label="$t('group.label.target_model')"
              :rules="[
                {
                  required: true,
                  message: $t('group.placeholder.target_model'),
                },
              ]"
            >
              <a-select
                v-model="formData.forward_config.target_models"
                :placeholder="$t('group.placeholder.target_model')"
                :max-tag-count="5"
                :scrollbar="false"
                multiple
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
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '2'
              "
              field="forward_config.match_rule"
              :label="$t('group.label.match_rule')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.required.match_rule'),
                },
              ]"
            >
              <a-space size="large">
                <a-checkbox
                  v-model="formData.forward_config.match_rule"
                  value="1"
                  :default-checked="true"
                >
                  {{ $t('dict.match_rule.1') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.forward_config.match_rule"
                  value="2"
                >
                  {{ $t('dict.match_rule.2') }}
                </a-checkbox>
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '2' &&
                formData.forward_config.match_rule.includes('1')
              "
              field="forward_config.decision_model"
              :label="$t('group.label.decision_model')"
              :rules="[
                {
                  required: true,
                  message: $t('group.placeholder.decision_model'),
                },
              ]"
            >
              <a-select
                v-model="formData.forward_config.decision_model"
                :placeholder="$t('group.placeholder.decision_model')"
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
              v-for="(_, index) of formData.forward_config?.keywords"
              v-show="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '2'
              "
              :key="index"
              :field="
                `forward_config.keywords[${index}]` &&
                `forward_config.target_models[${index}]`
              "
              :label="`${index + 1}. ` + $t('group.label.keywords')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.required.keywords_target_model'),
                },
              ]"
            >
              <a-input
                v-model="formData.forward_config.keywords[index]"
                :placeholder="$t('group.placeholder.keywords')"
                class="group-form-keyword-input"
              />
              <a-select
                v-model="formData.forward_config.target_models[index]"
                :placeholder="$t('group.placeholder.target_model')"
                :scrollbar="false"
                class="group-form-keyword-model-select"
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
                class="group-form-keyword-add-btn"
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
            <a-form-item field="expires_at" :label="$t('common.expires_at')">
              <a-date-picker
                v-model="formData.expires_at"
                :placeholder="$t('placeholder.expires_at')"
                :time-picker-props="{ defaultValue: '23:59:59' }"
                :disabled-date="disabledDate"
                allow-clear
                class="group-form-date-picker"
                show-time
                :shortcuts="[
                  {
                    label: '1',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(1, 'day'),
                  },
                  {
                    label: '7',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(7, 'day'),
                  },
                  {
                    label: '15',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(15, 'day'),
                  },
                  {
                    label: '30',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(30, 'day'),
                  },
                  {
                    label: '90',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(90, 'day'),
                  },
                  {
                    label: '180',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(180, 'day'),
                  },
                  {
                    label: '365',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(365, 'day'),
                  },
                ]"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'GroupList',
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
  import dayjs from 'dayjs';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAppStore } from '@/store';
  import { disabledDate, parsePrice } from '@/utils/common';
  import {
    submitGroupUpdate,
    GroupUpdate,
    GroupDetailParams,
    queryGroupDetail,
  } from '@/api/group';
  import { queryModelList, ModelList } from '@/api/model';
  import ModelSelect from '@/components/model-select/index.vue';
  import { queryModelAgentList, ModelAgentList } from '@/api/model_agent';
  import TimeRules from '@/views/common/time_rules.vue';
  import Quota from '@/views/common/quota.vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(false);
  const cardBodyStyle = {
    padding: '0 20px 20px 20px',
  };

  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();

  const models = ref<ModelList[]>([]);
  const getModelList = async () => {
    try {
      const { data } = await queryModelList();
      models.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getModelList();

  const modelAgents = ref<ModelAgentList[]>([]);
  const getModelAgentList = async () => {
    try {
      const { data } = await queryModelAgentList();
      modelAgents.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getModelAgentList();

  const formRef = ref<FormInstance>();
  const formData = ref<GroupUpdate>({
    name: '',
    time_rules: [],
    billing_methods: [1, 2],
    models: [],
    is_default: false,
    is_public: true,
    weight: ref(),
    expires_at: '',
    remark: '',
    status: 1,
    is_enable_model_agent: false,
    lb_strategy: '1',
    model_agents: [],
    is_limit_quota: false,
    quota: ref(),
    is_cycle_reset_quota: false,
    reset_quota: ref(),
    cycle_period: ref(),
    period_unit: 'day',
    reset_mode: 'natural',
    is_enable_forward: false,
    forward_config: {
      forward_rule: '1',
      forward_mode: 1,
      match_rule: ['2'],
      target_model: '',
      decision_model: '',
      keywords: [],
      target_models: [],
      content_length: ref(),
      used_quota: ref(),
    },
  });

  const timeRulesRef = ref();

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    const timeRulesRes = await timeRulesRef.value?.validate();
    if (!res && !timeRulesRes) {
      setLoading(true);
      try {
        await submitGroupUpdate(formData.value).then(() => {
          Message.success(t('success.update'));
          router.push({
            name: 'GroupList',
          });
        });
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    }
  };

  const getGroupDetail = async (
    params: GroupDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryGroupDetail(params);
      formData.value.id = data.id;
      formData.value.name = data.name;
      formData.value.time_rules = data.time_rules || [];
      formData.value.billing_methods = data.billing_methods || [1, 2];
      formData.value.models = data.models;
      formData.value.is_default = data.is_default || false;
      formData.value.is_public = data.is_public || false;
      formData.value.weight = data.weight;
      formData.value.expires_at = data.expires_at;
      formData.value.remark = data.remark;
      formData.value.status = data.status;
      formData.value.is_enable_model_agent = data.is_enable_model_agent;
      formData.value.lb_strategy = String(data.lb_strategy);
      formData.value.model_agents = data.model_agents;
      formData.value.is_limit_quota = data.is_limit_quota;
      formData.value.quota = data.quota;
      formData.value.is_cycle_reset_quota = data.is_cycle_reset_quota;
      formData.value.reset_quota = data.reset_quota;
      formData.value.cycle_period = data.cycle_period;
      formData.value.period_unit = data.period_unit || 'day';
      formData.value.reset_mode = data.reset_mode || 'natural';
      formData.value.is_enable_forward = data.is_enable_forward;
      formData.value.forward_config = data.forward_config;
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
        formData.value.forward_config.forward_mode =
          data.forward_config?.forward_mode || 1;
        formData.value.forward_config.content_length =
          data.forward_config?.content_length;
        formData.value.forward_config.target_model =
          data.forward_config?.target_model;
        formData.value.forward_config.decision_model =
          data.forward_config?.decision_model;
        formData.value.forward_config.keywords = data.forward_config?.keywords;
        formData.value.forward_config.target_models =
          data.forward_config?.target_models;
        formData.value.forward_config.used_quota =
          data.forward_config?.used_quota;
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getGroupDetail();

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.quota = quota;
  };

  const handleUsedQuotaQuickChange = (quota: number) => {
    formData.value.forward_config.used_quota = quota;
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
      formData.value.forward_config.forward_rule === '3' ||
      formData.value.forward_config.forward_rule === '4'
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

  const handleResetQuotaQuickChange = (quota: number) => {
    formData.value.reset_quota = quota;
  };

  const handleCyclePeriodQuickChange = (cyclePeriod: number) => {
    formData.value.cycle_period = cyclePeriod;
  };
</script>

<script lang="ts">
  export default {
    name: 'GroupUpdate',
  };
</script>

<style scoped lang="less">
  @import '../style/group-form-shared.less';

  // 公共骨架已由 page-form.less 全局提供
  // 表单共享样式已由 group-form-shared.less 提供
</style>
