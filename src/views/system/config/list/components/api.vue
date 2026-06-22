<template>
  <div class="list-wrap config-list-wrap">
    <a-row class="list-row" :gutter="24">
      <a-col
        v-for="item in sysConfigItems"
        :key="item.action"
        :xs="12"
        :sm="12"
        :md="12"
        :lg="8"
        :xl="8"
        :xxl="6"
        class="list-col"
      >
        <div class="card-wrap">
          <a-card
            :title="item.title"
            :bordered="false"
            :header-style="configCardHeaderStyle"
            :body-style="configCardBodyStyle"
          >
            <template #extra>
              <a-switch
                v-if="item.open !== undefined"
                v-model="item.open"
                @change="sysConfigChangeStatus(item)"
              />
            </template>
            <a-card-meta>
              <template #description>
                {{ item.desc }}
                <a-descriptions
                  :data="item.data"
                  layout="inline-horizontal"
                  :column="2"
                />
              </template>
            </a-card-meta>
            <template #actions>
              <a-button v-if="item.reset" @click="resetHandle(item)">
                {{ $t('button.reset') }}
              </a-button>
              <a-button
                v-if="item.refresh"
                status="success"
                @click="refreshHandle(item)"
              >
                {{ $t('button.refresh') }}
              </a-button>
              <a-button
                v-if="item.config"
                type="primary"
                @click="configHandle(item)"
              >
                {{ $t('button.config') }}
              </a-button>
            </template>
            <template #skeleton>
              <a-skeleton :animation="true">
                <a-skeleton-line
                  :widths="['50%', '50%', '100%', '40%']"
                  :rows="4"
                />
                <a-skeleton-line :widths="['40%']" :rows="1" />
              </a-skeleton>
            </template>
          </a-card>
        </div>
      </a-col>
    </a-row>

    <a-modal
      v-model:visible="configVisible"
      :title="$t(configTitle)"
      :width="
        configFormData.action === 'base'
          ? 588
          : configFormData.action === 'log'
          ? 728
          : configFormData.action === 'model_agent_session_keep'
          ? 1080
          : 728
      "
      :body-style="configModalBodyStyle"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form ref="configForm" :model="configFormData" auto-label-width>
        <a-form-item
          v-if="configFormData.action === 'base'"
          field="base.err_retry"
          :label="$t('sys.config.label.base.err_retry')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.base.err_retry'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.base.err_retry"
            :placeholder="$t('sys.config.placeholder.base.err_retry')"
            allow-clear
          >
            <template #append> {{ $t('unit.once') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'base'"
          field="base.model_key_err_disable"
          :label="$t('sys.config.label.base.model_key_err_disable')"
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.error.required.base.model_key_err_disable'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.base.model_key_err_disable"
            :placeholder="
              $t('sys.config.placeholder.base.model_key_err_disable')
            "
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.once') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'base'"
          field="base.model_agent_err_disable"
          :label="$t('sys.config.label.base.model_agent_err_disable')"
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.error.required.base.model_agent_err_disable'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.base.model_agent_err_disable"
            :placeholder="
              $t('sys.config.placeholder.base.model_agent_err_disable')
            "
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.once') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'base'"
          field="base.model_agent_key_err_disable"
          :label="$t('sys.config.label.base.model_agent_key_err_disable')"
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.error.required.base.model_agent_key_err_disable'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.base.model_agent_key_err_disable"
            :placeholder="
              $t('sys.config.placeholder.base.model_agent_key_err_disable')
            "
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.once') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'base'"
          field="base.short_timeout"
          :label="$t('sys.config.label.base.short_timeout')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.base.short_timeout'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.base.short_timeout"
            :placeholder="$t('sys.config.placeholder.base.short_timeout')"
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.second') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'base'"
          field="base.long_timeout"
          :label="$t('sys.config.label.base.long_timeout')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.base.long_timeout'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.base.long_timeout"
            :placeholder="$t('sys.config.placeholder.base.long_timeout')"
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.second') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'base'"
          field="base.allow_request_abort"
          :label="$t('sys.config.label.base.allow_request_abort')"
        >
          <a-switch v-model="configFormData.base.allow_request_abort" />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'log'"
          field="log.text_records"
          :label="$t('sys.config.label.log.text_records')"
        >
          <a-space size="large">
            <a-checkbox
              v-model="configFormData.log.text_records"
              value="prompt"
            >
              {{ $t('sys.config.dict.text_records.prompt') }}
            </a-checkbox>
            <a-checkbox
              v-model="configFormData.log.text_records"
              value="completion"
            >
              {{ $t('sys.config.dict.text_records.completion') }}
            </a-checkbox>
            <a-checkbox
              v-model="configFormData.log.text_records"
              value="messages"
            >
              {{ $t('sys.config.dict.text_records.messages') }}
            </a-checkbox>
            <a-checkbox v-model="configFormData.log.text_records" value="image">
              {{ $t('sys.config.dict.text_records.image') }}
            </a-checkbox>
            <a-checkbox v-model="configFormData.log.text_records" value="audio">
              {{ $t('sys.config.dict.text_records.audio') }}
            </a-checkbox>
          </a-space>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'log'"
          field="log.text_reserve"
          :label="$t('sys.config.label.log.text_reserve')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.log.text_reserve'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.log.text_reserve"
            :placeholder="$t('sys.config.placeholder.log.text_reserve')"
            :precision="0"
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.day') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'log'"
          field="log.image_reserve"
          :label="$t('sys.config.label.log.image_reserve')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.log.image_reserve'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.log.image_reserve"
            :placeholder="$t('sys.config.placeholder.log.image_reserve')"
            :precision="0"
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.day') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'log'"
          field="log.audio_reserve"
          :label="$t('sys.config.label.log.audio_reserve')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.log.audio_reserve'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.log.audio_reserve"
            :placeholder="$t('sys.config.placeholder.log.audio_reserve')"
            :precision="0"
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.day') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'log'"
          field="log.video_reserve"
          :label="$t('sys.config.label.log.video_reserve')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.log.video_reserve'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.log.video_reserve"
            :placeholder="$t('sys.config.placeholder.log.video_reserve')"
            :precision="0"
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.day') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'log'"
          field="log.file_reserve"
          :label="$t('sys.config.label.log.file_reserve')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.log.file_reserve'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.log.file_reserve"
            :placeholder="$t('sys.config.placeholder.log.file_reserve')"
            :precision="0"
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.day') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'log'"
          field="log.batch_reserve"
          :label="$t('sys.config.label.log.batch_reserve')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.log.batch_reserve'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.log.batch_reserve"
            :placeholder="$t('sys.config.placeholder.log.batch_reserve')"
            :precision="0"
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.day') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'log'"
          field="log.general_reserve"
          :label="$t('sys.config.label.log.general_reserve')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.log.general_reserve'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.log.general_reserve"
            :placeholder="$t('sys.config.placeholder.log.general_reserve')"
            :precision="0"
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.day') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'log'"
          field="log.status"
          :label="$t('sys.config.label.log.status')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.log.status'),
            },
          ]"
        >
          <a-space size="large">
            <a-checkbox v-model="configFormData.log.status" :value="1">
              {{ $t('log.dict.status.1') }}
            </a-checkbox>
            <a-checkbox v-model="configFormData.log.status" :value="2">
              {{ $t('log.dict.status.2') }}
            </a-checkbox>
            <a-checkbox v-model="configFormData.log.status" :value="3">
              {{ $t('log.dict.status.3') }}
            </a-checkbox>
            <a-checkbox v-model="configFormData.log.status" :value="-1">
              {{ $t('log.dict.status.-1') }}
            </a-checkbox>
          </a-space>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'log'"
          field="log.cron"
          :label="$t('sys.config.label.log.cron')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.placeholder.cron'),
            },
          ]"
        >
          <a-input
            v-model="configFormData.log.cron"
            :placeholder="$t('sys.config.placeholder.cron')"
            allow-clear
          />
        </a-form-item>
        <template v-if="configFormData.action === 'log'">
          <a-divider orientation="left">
            {{ $t('sys.config.label.log.privacy') }}
          </a-divider>
          <a-form-item :label="$t('sys.config.dict.privacy_category.request')">
            <a-space size="large">
              <a-checkbox
                v-model="configFormData.log.privacy.is_enable_request"
              >
                {{ $t('sys.config.label.log.privacy_enable') }}
              </a-checkbox>
              <a-checkbox
                v-model="configFormData.log.privacy.is_default_enable_request"
              >
                {{ $t('sys.config.label.log.privacy_default_enable') }}
              </a-checkbox>
            </a-space>
          </a-form-item>
          <a-form-item
            v-for="(item, index) of configFormData.log.privacy
              .request_privacy_fields"
            :key="`request-${index}`"
            :field="
              `log.privacy.request_privacy_fields[${index}].key` &&
              `log.privacy.request_privacy_fields[${index}].label`
            "
            :label="`${index + 1}. `"
            :rules="[
              {
                required: true,
                message: $t('sys.config.error.required.log.privacy_fields'),
              },
            ]"
            :label-col-style="fieldLabelColStyle"
          >
            <a-input
              v-model="item.key"
              :placeholder="$t('sys.config.placeholder.log.privacy_field_key')"
              allow-clear
              class="field-input field-input-privacy-key"
            />
            <a-input
              v-model="item.label"
              :placeholder="
                $t('sys.config.placeholder.log.privacy_field_label')
              "
              allow-clear
              class="field-input field-input-privacy-label"
            />
            <a-input
              v-model="item.description"
              :placeholder="
                $t('sys.config.placeholder.log.privacy_field_description')
              "
              allow-clear
              class="field-input field-input-privacy-description"
            />
            <a-switch v-model="item.enabled" class="field-input" />
            <a-button
              type="primary"
              shape="circle"
              class="field-action-button"
              @click="handlePrivacyFieldAdd('request')"
            >
              <icon-plus />
            </a-button>
            <a-button
              type="secondary"
              shape="circle"
              @click="handlePrivacyFieldDel('request', index)"
            >
              <icon-minus />
            </a-button>
          </a-form-item>

          <a-form-item :label="$t('sys.config.dict.privacy_category.response')">
            <a-space size="large">
              <a-checkbox
                v-model="configFormData.log.privacy.is_enable_response"
              >
                {{ $t('sys.config.label.log.privacy_enable') }}
              </a-checkbox>
              <a-checkbox
                v-model="configFormData.log.privacy.is_default_enable_response"
              >
                {{ $t('sys.config.label.log.privacy_default_enable') }}
              </a-checkbox>
            </a-space>
          </a-form-item>
          <a-form-item
            v-for="(item, index) of configFormData.log.privacy
              .response_privacy_fields"
            :key="`response-${index}`"
            :field="
              `log.privacy.response_privacy_fields[${index}].key` &&
              `log.privacy.response_privacy_fields[${index}].label`
            "
            :label="`${index + 1}. `"
            :rules="[
              {
                required: true,
                message: $t('sys.config.error.required.log.privacy_fields'),
              },
            ]"
            :label-col-style="fieldLabelColStyle"
          >
            <a-input
              v-model="item.key"
              :placeholder="$t('sys.config.placeholder.log.privacy_field_key')"
              allow-clear
              class="field-input field-input-privacy-key"
            />
            <a-input
              v-model="item.label"
              :placeholder="
                $t('sys.config.placeholder.log.privacy_field_label')
              "
              allow-clear
              class="field-input field-input-privacy-label"
            />
            <a-input
              v-model="item.description"
              :placeholder="
                $t('sys.config.placeholder.log.privacy_field_description')
              "
              allow-clear
              class="field-input field-input-privacy-description"
            />
            <a-switch v-model="item.enabled" class="field-input" />
            <a-button
              type="primary"
              shape="circle"
              class="field-action-button"
              @click="handlePrivacyFieldAdd('response')"
            >
              <icon-plus />
            </a-button>
            <a-button
              type="secondary"
              shape="circle"
              @click="handlePrivacyFieldDel('response', index)"
            >
              <icon-minus />
            </a-button>
          </a-form-item>

          <a-form-item :label="$t('sys.config.dict.privacy_category.resource')">
            <a-space size="large">
              <a-checkbox
                v-model="configFormData.log.privacy.is_enable_resource"
              >
                {{ $t('sys.config.label.log.privacy_enable') }}
              </a-checkbox>
              <a-checkbox
                v-model="configFormData.log.privacy.is_default_enable_resource"
              >
                {{ $t('sys.config.label.log.privacy_default_enable') }}
              </a-checkbox>
            </a-space>
          </a-form-item>
          <a-form-item
            v-for="(item, index) of configFormData.log.privacy
              .resource_privacy_fields"
            :key="`resource-${index}`"
            :field="
              `log.privacy.resource_privacy_fields[${index}].key` &&
              `log.privacy.resource_privacy_fields[${index}].label`
            "
            :label="`${index + 1}. `"
            :rules="[
              {
                required: true,
                message: $t('sys.config.error.required.log.privacy_fields'),
              },
            ]"
            :label-col-style="fieldLabelColStyle"
          >
            <a-input
              v-model="item.key"
              :placeholder="$t('sys.config.placeholder.log.privacy_field_key')"
              allow-clear
              class="field-input field-input-privacy-key"
            />
            <a-input
              v-model="item.label"
              :placeholder="
                $t('sys.config.placeholder.log.privacy_field_label')
              "
              allow-clear
              class="field-input field-input-privacy-label"
            />
            <a-input
              v-model="item.description"
              :placeholder="
                $t('sys.config.placeholder.log.privacy_field_description')
              "
              allow-clear
              class="field-input field-input-privacy-description"
            />
            <a-switch v-model="item.enabled" class="field-input" />
            <a-button
              type="primary"
              shape="circle"
              class="field-action-button"
              @click="handlePrivacyFieldAdd('resource')"
            >
              <icon-plus />
            </a-button>
            <a-button
              type="secondary"
              shape="circle"
              @click="handlePrivacyFieldDel('resource', index)"
            >
              <icon-minus />
            </a-button>
          </a-form-item>

          <a-form-item :label="$t('sys.config.dict.privacy_category.network')">
            <a-space size="large">
              <a-checkbox
                v-model="configFormData.log.privacy.is_enable_network"
              >
                {{ $t('sys.config.label.log.privacy_enable') }}
              </a-checkbox>
              <a-checkbox
                v-model="configFormData.log.privacy.is_default_enable_network"
              >
                {{ $t('sys.config.label.log.privacy_default_enable') }}
              </a-checkbox>
            </a-space>
          </a-form-item>
          <a-form-item
            v-for="(item, index) of configFormData.log.privacy
              .network_privacy_fields"
            :key="`network-${index}`"
            :field="
              `log.privacy.network_privacy_fields[${index}].key` &&
              `log.privacy.network_privacy_fields[${index}].label`
            "
            :label="`${index + 1}. `"
            :rules="[
              {
                required: true,
                message: $t('sys.config.error.required.log.privacy_fields'),
              },
            ]"
            :label-col-style="fieldLabelColStyle"
          >
            <a-input
              v-model="item.key"
              :placeholder="$t('sys.config.placeholder.log.privacy_field_key')"
              allow-clear
              class="field-input field-input-privacy-key"
            />
            <a-input
              v-model="item.label"
              :placeholder="
                $t('sys.config.placeholder.log.privacy_field_label')
              "
              allow-clear
              class="field-input field-input-privacy-label"
            />
            <a-input
              v-model="item.description"
              :placeholder="
                $t('sys.config.placeholder.log.privacy_field_description')
              "
              allow-clear
              class="field-input field-input-privacy-description"
            />
            <a-switch v-model="item.enabled" class="field-input" />
            <a-button
              type="primary"
              shape="circle"
              class="field-action-button"
              @click="handlePrivacyFieldAdd('network')"
            >
              <icon-plus />
            </a-button>
            <a-button
              type="secondary"
              shape="circle"
              @click="handlePrivacyFieldDel('network', index)"
            >
              <icon-minus />
            </a-button>
          </a-form-item>
        </template>
        <a-form-item
          v-for="(item, index) of configFormData.auto_disabled_error.errors"
          v-show="configFormData.action === 'auto_disabled_error'"
          :key="index"
          :field="`auto_disabled_error.errors[${index}]`"
          :label="`${index + 1}. `"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.errors'),
            },
          ]"
          :label-col-style="fieldLabelColStyle"
        >
          <a-input
            v-model="configFormData.auto_disabled_error.errors[index]"
            :placeholder="$t('sys.config.placeholder.errors')"
            allow-clear
            class="field-input field-input-wide"
          />
          <a-button
            type="primary"
            shape="circle"
            class="field-action-button"
            @click="handleAutoDisabledErrorAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleAutoDisabledErrorDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
        <a-form-item
          v-for="(item, index) of configFormData.auto_enable_error
            .enable_errors"
          v-show="configFormData.action === 'auto_enable_error'"
          :key="index"
          :field="
            `auto_enable_error.enable_errors[${index}].cron` &&
            `auto_enable_error.enable_errors[${index}].enable_time` &&
            `auto_enable_error.enable_errors[${index}].error`
          "
          :label="`${index + 1}.`"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.auto_enable_error'),
            },
          ]"
          :label-col-style="fieldLabelColStyle"
        >
          <a-input
            v-model="configFormData.auto_enable_error.enable_errors[index].cron"
            :placeholder="
              $t('sys.config.placeholder.auto_enable_error.enable_errors.cron')
            "
            allow-clear
            class="field-input field-input-cron"
          />
          <a-input-number
            v-model="
              configFormData.auto_enable_error.enable_errors[index].enable_time
            "
            :placeholder="
              $t(
                'sys.config.placeholder.auto_enable_error.enable_errors.enable_time'
              )
            "
            allow-clear
            class="field-input field-input-enable-time"
          >
            <template #append> {{ $t('unit.second') }} </template>
          </a-input-number>
          <a-input
            v-model="
              configFormData.auto_enable_error.enable_errors[index].error
            "
            :placeholder="$t('sys.config.placeholder.errors')"
            allow-clear
            class="field-input field-input-error"
          />
          <a-button
            type="primary"
            shape="circle"
            class="field-action-button"
            @click="handleAutoEnableErrorAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleAutoEnableErrorDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
        <a-form-item
          v-for="(item, index) of configFormData.auto_retry_error.errors"
          v-show="configFormData.action === 'auto_retry_error'"
          :key="index"
          :field="`auto_retry_error.errors[${index}]`"
          :label="`${index + 1}. `"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.errors'),
            },
          ]"
          :label-col-style="fieldLabelColStyle"
        >
          <a-input
            v-model="configFormData.auto_retry_error.errors[index]"
            :placeholder="$t('sys.config.placeholder.errors')"
            allow-clear
            class="field-input field-input-wide"
          />
          <a-button
            type="primary"
            shape="circle"
            class="field-action-button"
            @click="handleAutoRetryErrorAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleAutoRetryErrorDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
        <a-form-item
          v-for="(item, index) of configFormData.not_retry_error.errors"
          v-show="configFormData.action === 'not_retry_error'"
          :key="index"
          :field="`not_retry_error.errors[${index}]`"
          :label="`${index + 1}. `"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.errors'),
            },
          ]"
          :label-col-style="fieldLabelColStyle"
        >
          <a-input
            v-model="configFormData.not_retry_error.errors[index]"
            :placeholder="$t('sys.config.placeholder.errors')"
            allow-clear
            class="field-input field-input-wide"
          />
          <a-button
            type="primary"
            shape="circle"
            class="field-action-button"
            @click="handleNotRetryErrorAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleNotRetryErrorDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
        <a-form-item
          v-for="(item, index) of configFormData.not_shield_error.errors"
          v-show="configFormData.action === 'not_shield_error'"
          :key="index"
          :field="`not_shield_error.errors[${index}]`"
          :label="`${index + 1}. `"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.errors'),
            },
          ]"
          :label-col-style="fieldLabelColStyle"
        >
          <a-input
            v-model="configFormData.not_shield_error.errors[index]"
            :placeholder="$t('sys.config.placeholder.errors')"
            allow-clear
            class="field-input field-input-wide"
          />
          <a-button
            type="primary"
            shape="circle"
            class="field-action-button"
            @click="handleNotShieldErrorAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleNotShieldErrorDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
        <a-form-item
          v-for="(item, index) of configFormData.service_unavailable
            .ip_whitelist"
          v-show="configFormData.action === 'service_unavailable'"
          :key="index"
          :field="`service_unavailable.ip_whitelist[${index}]`"
          :label="`${index + 1}. ` + $t('common.ip_whitelist')"
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.error.required.service_unavailable.ip_whitelist'
              ),
            },
          ]"
          :label-col-style="fieldLabelColStyle"
        >
          <a-input
            v-model="configFormData.service_unavailable.ip_whitelist[index]"
            :placeholder="
              $t('sys.config.placeholder.service_unavailable.ip_whitelist')
            "
            allow-clear
            class="field-input field-input-ip"
          />
          <a-button
            type="primary"
            shape="circle"
            class="field-action-button"
            @click="handleServiceUnavailableAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleServiceUnavailableDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
        <a-form-item
          v-for="(item, index) of configFormData.general_api.ip_whitelist"
          v-show="configFormData.action === 'general_api'"
          :key="index"
          :field="`general_api.ip_whitelist[${index}]`"
          :label="`${index + 1}. ` + $t('common.ip_whitelist')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.general_api.ip_whitelist'),
            },
          ]"
          :label-col-style="fieldLabelColStyle"
        >
          <a-input
            v-model="configFormData.general_api.ip_whitelist[index]"
            :placeholder="$t('sys.config.placeholder.general_api.ip_whitelist')"
            allow-clear
            class="field-input field-input-ip"
          />
          <a-button
            type="primary"
            shape="circle"
            class="field-action-button"
            @click="handleGeneralApiAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleGeneralApiDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'model_agent_session_keep'"
          field="model_agent_session_keep.mode"
          :label="$t('sys.config.label.session_keep_mode')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-radio-group v-model="configFormData.model_agent_session_keep.mode">
            <a-radio value="rule">
              {{ $t('sys.config.label.session_keep_mode_rule') }}
            </a-radio>
            <a-radio value="user">
              {{ $t('sys.config.label.session_keep_mode_user') }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-for="(rule, ruleIndex) in configFormData.model_agent_session_keep
            .rules"
          v-show="
            configFormData.action === 'model_agent_session_keep' &&
            configFormData.model_agent_session_keep.mode === 'rule'
          "
          :key="ruleIndex"
          :label="`${ruleIndex + 1}.`"
          :label-col-style="fieldLabelColStyle"
        >
          <div class="rule-row-wrap">
            <div class="rule-row">
              <a-input
                v-model="rule.name"
                :placeholder="
                  $t('sys.config.placeholder.session_keep_rule_name')
                "
                allow-clear
                class="field-input field-input-rule-name"
              />
              <a-select
                v-model="rule.transform"
                :placeholder="
                  $t('sys.config.label.session_keep_rule_transform')
                "
                allow-clear
                class="field-input"
                style="flex: none; width: 15%; margin-right: 5px"
              >
                <a-option value="none">none</a-option>
                <a-option value="md5">md5</a-option>
                <a-option value="prefix:8">prefix:8</a-option>
                <a-option value="prefix:16">prefix:16</a-option>
              </a-select>
              <a-input
                v-model="rule.model_regex_str"
                :placeholder="
                  $t('sys.config.placeholder.session_keep_rule_model_regex')
                "
                allow-clear
                class="field-input field-input-rule-regex"
                @change="
                  rule.model_regex = rule.model_regex_str
                    ? rule.model_regex_str
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s)
                    : []
                "
              />
              <a-input
                v-model="rule.path_regex_str"
                :placeholder="
                  $t('sys.config.placeholder.session_keep_rule_path_regex')
                "
                allow-clear
                class="field-input field-input-rule-regex"
                @change="
                  rule.path_regex = rule.path_regex_str
                    ? rule.path_regex_str
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s)
                    : []
                "
              />
            </div>
            <div>
              <div
                v-for="(src, srcIndex) in rule.key_sources"
                :key="srcIndex"
                style="
                  display: flex;
                  align-items: center;
                  margin-right: 10px;
                  margin-bottom: 5px;
                "
              >
                <a-select
                  v-model="src.type"
                  style="width: 18.2%; margin-right: 5px"
                >
                  <a-option value="body">body</a-option>
                  <a-option value="header">header</a-option>
                </a-select>
                <a-input
                  v-model="src.key"
                  :placeholder="
                    $t(
                      'sys.config.placeholder.session_keep_rule_key_source_key'
                    )
                  "
                  allow-clear
                  style="width: 70%; margin-right: 8px"
                />
                <a-button
                  type="primary"
                  shape="circle"
                  size="small"
                  style="margin-right: 5px"
                  @click="rule.key_sources.push({ type: 'body', key: '' })"
                >
                  <icon-plus />
                </a-button>
                <a-button
                  type="secondary"
                  shape="circle"
                  size="small"
                  @click="rule.key_sources.splice(srcIndex, 1)"
                >
                  <icon-minus />
                </a-button>
              </div>
              <a-button
                v-if="!rule.key_sources.length"
                type="text"
                size="small"
                @click="rule.key_sources.push({ type: 'body', key: '' })"
              >
                <icon-plus />
                {{ $t('sys.config.label.session_keep_rule_add_key_source') }}
              </a-button>
            </div>
          </div>
          <div class="rule-actions">
            <a-button
              type="primary"
              shape="circle"
              class="field-action-button"
              @click="
                configFormData.model_agent_session_keep.rules.push({
                  name: '',
                  model_regex: [],
                  model_regex_str: '',
                  path_regex: [],
                  path_regex_str: '',
                  key_sources: [{ type: 'body', key: '' }],
                  transform: 'none',
                })
              "
            >
              <icon-plus />
            </a-button>
            <a-button
              type="secondary"
              shape="circle"
              @click="
                configFormData.model_agent_session_keep.rules.splice(
                  ruleIndex,
                  1
                )
              "
            >
              <icon-minus />
            </a-button>
          </div>
        </a-form-item>
        <a-form-item
          v-if="
            configFormData.action === 'model_agent_session_keep' &&
            configFormData.model_agent_session_keep.mode === 'rule' &&
            (!configFormData.model_agent_session_keep.rules ||
              configFormData.model_agent_session_keep.rules.length === 0)
          "
          :label="$t('sys.config.label.session_keep_rules')"
        >
          <a-button
            type="dashed"
            long
            @click="
              configFormData.model_agent_session_keep.rules.push({
                name: '',
                model_regex: [],
                model_regex_str: '',
                path_regex: [],
                path_regex_str: '',
                key_sources: [{ type: 'body', key: '' }],
                transform: 'none',
              })
            "
          >
            <icon-plus />
            {{ $t('sys.config.label.session_keep_rule_add') }}
          </a-button>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'model_agent_session_keep'"
          field="model_agent_session_keep.ttl"
          :label="$t('sys.config.label.session_keep_ttl')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.placeholder.session_keep_ttl'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.model_agent_session_keep.ttl"
            :min="1"
            allow-clear
            :placeholder="$t('sys.config.placeholder.session_keep_ttl')"
          >
            <template #append> {{ $t('unit.second') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'model_agent_session_keep'"
          field="model_agent_session_keep.fail_ttl"
          :label="$t('sys.config.label.session_keep_fail_ttl')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.placeholder.session_keep_fail_ttl'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.model_agent_session_keep.fail_ttl"
            :min="1"
            allow-clear
            :placeholder="$t('sys.config.placeholder.session_keep_fail_ttl')"
          >
            <template #append> {{ $t('unit.second') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'model_agent_session_keep'"
          field="model_agent_session_keep.fail_switch_threshold"
          :label="$t('sys.config.label.session_keep_fail_switch_threshold')"
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.placeholder.session_keep_fail_switch_threshold'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="
              configFormData.model_agent_session_keep.fail_switch_threshold
            "
            :min="1"
            allow-clear
            :placeholder="
              $t('sys.config.placeholder.session_keep_fail_switch_threshold')
            "
          >
            <template #append> {{ $t('unit.once') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'model_agent_session_keep'"
          field="model_agent_session_keep.user_limit"
          :label="$t('sys.config.label.session_keep_user_limit')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.placeholder.session_keep_user_limit'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.model_agent_session_keep.user_limit"
            :min="1"
            allow-clear
            :placeholder="$t('sys.config.placeholder.session_keep_user_limit')"
          >
            <template #append> {{ $t('unit.item') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'model_agent_session_keep'"
          field="model_agent_session_keep.agent_limit"
          :label="$t('sys.config.label.session_keep_agent_limit')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.placeholder.session_keep_agent_limit'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.model_agent_session_keep.agent_limit"
            :min="1"
            allow-clear
            :placeholder="$t('sys.config.placeholder.session_keep_agent_limit')"
          >
            <template #append> {{ $t('unit.item') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'model_agent_session_keep'"
          field="model_agent_session_keep.global_limit"
          :label="$t('sys.config.label.session_keep_global_limit')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.placeholder.session_keep_global_limit'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.model_agent_session_keep.global_limit"
            :min="1"
            allow-clear
            :placeholder="
              $t('sys.config.placeholder.session_keep_global_limit')
            "
          >
            <template #append> {{ $t('unit.item') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="
            configFormData.action === 'model_agent_session_keep' &&
            configFormData.model_agent_session_keep.mode === 'rule'
          "
          field="model_agent_session_keep.enable_system_prompt_hash"
          :label="$t('sys.config.label.session_keep_enable_system_prompt_hash')"
        >
          <a-switch
            v-model="
              configFormData.model_agent_session_keep.enable_system_prompt_hash
            "
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'image_storage'"
          field="image_storage.cron"
          :label="$t('sys.config.label.cron')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.placeholder.cron'),
            },
          ]"
        >
          <a-input
            v-model="configFormData.image_storage.cron"
            :placeholder="$t('sys.config.placeholder.cron')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'image_storage'"
          field="image_storage.lock_minutes"
          :label="$t('sys.config.label.lock_minutes')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.placeholder.image_storage.lock_minutes'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.image_storage.lock_minutes"
            :placeholder="
              $t('sys.config.placeholder.image_storage.lock_minutes')
            "
            :precision="0"
            :min="1"
            allow-clear
          >
            <template #append> {{ $t('unit.minute') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'image_storage'"
          field="image_storage.download_timeout"
          :label="$t('sys.config.label.image_storage.download_timeout')"
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.placeholder.image_storage.download_timeout'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.image_storage.download_timeout"
            :placeholder="
              $t('sys.config.placeholder.image_storage.download_timeout')
            "
            :precision="0"
            :min="1"
            allow-clear
          >
            <template #append> {{ $t('unit.second') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'image_storage'"
          field="image_storage.retry_count"
          :label="$t('sys.config.label.image_storage.retry_count')"
        >
          <a-input-number
            v-model="configFormData.image_storage.retry_count"
            :placeholder="
              $t('sys.config.placeholder.image_storage.retry_count')
            "
            :precision="0"
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.once') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'image_storage'"
          field="image_storage.storage_dir"
          :label="$t('sys.config.label.image_storage.storage_dir')"
        >
          <a-input
            v-model="configFormData.image_storage.storage_dir"
            :placeholder="
              $t('sys.config.placeholder.image_storage.storage_dir')
            "
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'image_storage'"
          field="image_storage.storage_base_url"
          :label="$t('sys.config.label.image_storage.storage_base_url')"
        >
          <a-input
            v-model="configFormData.image_storage.storage_base_url"
            :placeholder="
              $t('sys.config.placeholder.image_storage.storage_base_url')
            "
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'image_storage'"
          field="image_storage.storage_expires_at"
          :label="$t('sys.config.label.image_storage.storage_expires_at')"
        >
          <a-input-number
            v-model="configFormData.image_storage.storage_expires_at"
            :placeholder="
              $t('sys.config.placeholder.image_storage.storage_expires_at')
            "
            :precision="0"
            :min="1"
            allow-clear
          >
            <template #append> {{ $t('unit.minute') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'image_storage'"
          field="image_storage.storage_expired_delete"
          :label="$t('sys.config.label.image_storage.storage_expired_delete')"
        >
          <a-switch
            v-model="configFormData.image_storage.storage_expired_delete"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import useLoading from '@/hooks/loading';
  import { FormInstance, Message, Modal } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import {
    LogPrivacy,
    PrivacyLogFieldOption,
    SysConfigItem,
    SysConfigUpdate,
    submitSysConfigUpdate,
    submitSysConfigReset,
    submitSysConfigRefresh,
    submitSysConfigChangeStatus,
  } from '@/api/sys_config';
  import { useSysConfig } from '../composables/use-sys-config';

  const { setLoading } = useLoading(true);
  const { t } = useI18n();
  const { data: sysConfigData, refresh: refreshSysConfig } = useSysConfig();

  const configCardHeaderStyle = {
    padding: '16px',
  };
  const configCardBodyStyle = {
    padding: '0px 16px',
  };
  const configModalBodyStyle = {
    padding: '20px 20px 0 20px',
    maxHeight: '520px',
  };
  const fieldLabelColStyle = {
    padding: '0 16px 2px 0',
  };

  const configVisible = ref(false);
  const configTitle = ref('');
  const configForm = ref<FormInstance>();
  const configFormData = ref<SysConfigUpdate>({
    base: {},
    log: {},
    auto_disabled_error: {},
    auto_enable_error: {},
    auto_retry_error: {},
    not_retry_error: {},
    not_shield_error: {},
    service_unavailable: {},
    general_api: {},
    model_agent_session_keep: {},
    image_storage: {},
  } as SysConfigUpdate);

  const defaultLogPrivacy = (): LogPrivacy => ({
    is_enable_request: true,
    is_default_enable_request: false,
    request_privacy_fields: [],
    is_enable_response: true,
    is_default_enable_response: false,
    response_privacy_fields: [],
    is_enable_resource: true,
    is_default_enable_resource: false,
    resource_privacy_fields: [],
    is_enable_network: true,
    is_default_enable_network: false,
    network_privacy_fields: [],
  });

  const getPrivacyFields = (category: string): PrivacyLogFieldOption[] => {
    const privacy = configFormData.value.log?.privacy;
    switch (category) {
      case 'request':
        return privacy.request_privacy_fields;
      case 'response':
        return privacy.response_privacy_fields;
      case 'resource':
        return privacy.resource_privacy_fields;
      case 'network':
        return privacy.network_privacy_fields;
      default:
        return [];
    }
  };

  const configHandle = async (sysConfigItem: SysConfigItem) => {
    if (sysConfigItem.action === 'log') {
      normalizeLogPrivacy();
    }
    if (
      sysConfigItem.action === 'auto_disabled_error' &&
      configFormData.value.auto_disabled_error.errors.length === 0
    ) {
      handleAutoDisabledErrorAdd();
    }
    if (
      sysConfigItem.action === 'auto_enable_error' &&
      configFormData.value.auto_enable_error.enable_errors.length === 0
    ) {
      handleAutoEnableErrorAdd();
    }
    if (
      sysConfigItem.action === 'auto_retry_error' &&
      configFormData.value.auto_retry_error.errors.length === 0
    ) {
      handleAutoRetryErrorAdd();
    }
    if (
      sysConfigItem.action === 'not_retry_error' &&
      configFormData.value.not_retry_error.errors.length === 0
    ) {
      handleNotRetryErrorAdd();
    }
    if (
      sysConfigItem.action === 'not_shield_error' &&
      configFormData.value.not_shield_error.errors.length === 0
    ) {
      handleNotShieldErrorAdd();
    }
    if (
      sysConfigItem.action === 'service_unavailable' &&
      configFormData.value.service_unavailable.ip_whitelist.length === 0
    ) {
      handleServiceUnavailableAdd();
    }
    if (
      sysConfigItem.action === 'general_api' &&
      configFormData.value.general_api.ip_whitelist.length === 0
    ) {
      handleGeneralApiAdd();
    }
    if (sysConfigItem.action === 'model_agent_session_keep') {
      if (!configFormData.value.model_agent_session_keep.rules) {
        configFormData.value.model_agent_session_keep.rules = [];
      }
      if (!configFormData.value.model_agent_session_keep.mode) {
        configFormData.value.model_agent_session_keep.mode = 'user';
      }
      configFormData.value.model_agent_session_keep.rules.forEach(
        (rule: any) => {
          if (!rule.key_sources) rule.key_sources = [];
          if (!rule.model_regex) rule.model_regex = [];
          if (!rule.path_regex) rule.path_regex = [];
          rule.model_regex_str = rule.model_regex.join(', ');
          rule.path_regex_str = rule.path_regex.join(', ');
        }
      );
    }
    configTitle.value = t(`sys.config.item.title.${sysConfigItem.action}`);
    configFormData.value.action = sysConfigItem.action;
    configVisible.value = true;
  };

  const resetHandle = async (sysConfigItem: SysConfigItem) => {
    Modal.warning({
      title: t('modal.warning.title'),
      titleAlign: 'center',
      content: `${t('sys.config.placeholder.are_you_sure')}${
        sysConfigItem.action !== 'reset_api_error' ? t('button.reset') : ''
      }${t(`sys.config.item.title.${sysConfigItem.action}`)}?`,
      okText: t('button.ok'),
      cancelText: t('button.cancel'),
      hideCancel: false,
      onOk: () => {
        sysConfigReset(sysConfigItem);
      },
    });
  };

  const refreshHandle = async (sysConfigItem: SysConfigItem) => {
    Modal.warning({
      title: t('modal.warning.title'),
      titleAlign: 'center',
      content: `${t('sys.config.placeholder.are_you_sure')}${t(
        `sys.config.item.title.${sysConfigItem.action}`
      )}?`,
      okText: t('button.ok'),
      cancelText: t('button.cancel'),
      hideCancel: false,
      onOk: () => {
        sysConfigRefresh(sysConfigItem);
      },
    });
  };

  const handleBeforeOk = async (done: any) => {
    const res = await configForm.value?.validate();
    if (res) {
      configVisible.value = true;
      done(false);
      return;
    }

    setLoading(true);
    try {
      await submitSysConfigUpdate(configFormData.value);
      done();
      Message.success(t('success.operate'));
      refreshSysConfig();
    } catch (err) {
      done(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    configVisible.value = false;
    if (
      configFormData.value.auto_disabled_error.errors.length > 0 &&
      !configFormData.value.auto_disabled_error.errors[
        configFormData.value.auto_disabled_error.errors.length - 1
      ]
    ) {
      handleAutoDisabledErrorDel(
        configFormData.value.auto_disabled_error.errors.length - 1
      );
    }
    if (
      configFormData.value.auto_enable_error.enable_errors.length > 0 &&
      (!configFormData.value.auto_enable_error.enable_errors[
        configFormData.value.auto_enable_error.enable_errors.length - 1
      ].enable_time ||
        !configFormData.value.auto_enable_error.enable_errors[
          configFormData.value.auto_enable_error.enable_errors.length - 1
        ].cron ||
        !configFormData.value.auto_enable_error.enable_errors[
          configFormData.value.auto_enable_error.enable_errors.length - 1
        ].error)
    ) {
      handleAutoEnableErrorDel(
        configFormData.value.auto_enable_error.enable_errors.length - 1
      );
    }
    if (
      configFormData.value.auto_retry_error.errors.length > 0 &&
      !configFormData.value.auto_retry_error.errors[
        configFormData.value.auto_retry_error.errors.length - 1
      ]
    ) {
      handleAutoRetryErrorDel(
        configFormData.value.auto_retry_error.errors.length - 1
      );
    }
    if (
      configFormData.value.not_retry_error.errors.length > 0 &&
      !configFormData.value.not_retry_error.errors[
        configFormData.value.not_retry_error.errors.length - 1
      ]
    ) {
      handleNotRetryErrorDel(
        configFormData.value.not_retry_error.errors.length - 1
      );
    }
    if (
      configFormData.value.not_shield_error.errors.length > 0 &&
      !configFormData.value.not_shield_error.errors[
        configFormData.value.not_shield_error.errors.length - 1
      ]
    ) {
      handleNotShieldErrorDel(
        configFormData.value.not_shield_error.errors.length - 1
      );
    }
    if (
      configFormData.value.service_unavailable.ip_whitelist.length > 0 &&
      !configFormData.value.service_unavailable.ip_whitelist[
        configFormData.value.service_unavailable.ip_whitelist.length - 1
      ]
    ) {
      handleServiceUnavailableDel(
        configFormData.value.service_unavailable.ip_whitelist.length - 1
      );
    }
    if (
      configFormData.value.general_api.ip_whitelist.length > 0 &&
      !configFormData.value.general_api.ip_whitelist[
        configFormData.value.general_api.ip_whitelist.length - 1
      ]
    ) {
      handleGeneralApiDel(
        configFormData.value.general_api.ip_whitelist.length - 1
      );
    }
  };

  const sysConfigReset = async (sysConfigItem: SysConfigItem) => {
    setLoading(true);
    try {
      await submitSysConfigReset({
        action: sysConfigItem.action,
      });
      Message.success(t('success.operate'));
      refreshSysConfig();
    } finally {
      setLoading(false);
    }
  };

  const sysConfigRefresh = async (sysConfigItem: SysConfigItem) => {
    setLoading(true);
    try {
      await submitSysConfigRefresh({
        action: sysConfigItem.action,
      });
      Message.success(t('success.operate'));
      refreshSysConfig();
    } finally {
      setLoading(false);
    }
  };

  const sysConfigChangeStatus = async (sysConfigItem: SysConfigItem) => {
    setLoading(true);
    try {
      await submitSysConfigChangeStatus({
        action: sysConfigItem.action,
        open: sysConfigItem.open || false,
      });
      Message.success(t('success.operate'));
      refreshSysConfig();
    } finally {
      setLoading(false);
    }
  };

  const sysConfigItems = ref<SysConfigItem[]>({} as SysConfigItem[]);

  watch(
    sysConfigData,
    (data) => {
      if (!data) return;
      configFormData.value.base = data.base;
      configFormData.value.log = data.log;
      normalizeLogPrivacy();
      configFormData.value.auto_disabled_error = data.auto_disabled_error;
      configFormData.value.auto_enable_error = data.auto_enable_error;
      configFormData.value.auto_retry_error = data.auto_retry_error;
      configFormData.value.not_retry_error = data.not_retry_error;
      configFormData.value.not_shield_error = data.not_shield_error;
      configFormData.value.service_unavailable = data.service_unavailable;
      configFormData.value.general_api = data.general_api;
      configFormData.value.model_agent_session_keep =
        data.model_agent_session_keep;
      configFormData.value.image_storage = data.image_storage;
      sysConfigItems.value = [
        {
          action: 'base',
          title: t('sys.config.item.title.base'),
          desc: t('sys.config.item.desc.base'),
          config: true,
          reset: true,
        },
        {
          action: 'log',
          title: t('sys.config.item.title.log'),
          desc: t('sys.config.item.desc.log'),
          open: configFormData.value.log.open,
          config: true,
          reset: true,
        },
        {
          action: 'image_storage',
          title: t('sys.config.item.title.image_storage'),
          desc: t('sys.config.item.desc.image_storage'),
          open: configFormData.value.image_storage.open,
          config: true,
          reset: true,
        },
        {
          action: 'model_agent_session_keep',
          title: t('sys.config.item.title.model_agent_session_keep'),
          desc: t('sys.config.item.desc.model_agent_session_keep'),
          open: configFormData.value.model_agent_session_keep.open,
          config: true,
          reset: true,
        },
        {
          action: 'auto_disabled_error',
          title: t('sys.config.item.title.auto_disabled_error'),
          desc: t('sys.config.item.desc.auto_disabled_error'),
          open: configFormData.value.auto_disabled_error.open,
          config: true,
          reset: true,
        },
        {
          action: 'auto_enable_error',
          title: t('sys.config.item.title.auto_enable_error'),
          desc: t('sys.config.item.desc.auto_enable_error'),
          open: configFormData.value.auto_enable_error.open,
          config: true,
          reset: true,
        },
        {
          action: 'auto_retry_error',
          title: t('sys.config.item.title.auto_retry_error'),
          desc: t('sys.config.item.desc.auto_retry_error'),
          open: configFormData.value.auto_retry_error.open,
          config: true,
          reset: true,
        },
        {
          action: 'not_retry_error',
          title: t('sys.config.item.title.not_retry_error'),
          desc: t('sys.config.item.desc.not_retry_error'),
          open: configFormData.value.not_retry_error.open,
          config: true,
          reset: true,
        },
        {
          action: 'not_shield_error',
          title: t('sys.config.item.title.not_shield_error'),
          desc: t('sys.config.item.desc.not_shield_error'),
          open: configFormData.value.not_shield_error.open,
          config: true,
          reset: true,
        },
        {
          action: 'reset_api_error',
          title: t('sys.config.item.title.reset_api_error'),
          desc: t('sys.config.item.desc.reset_api_error'),
          reset: true,
        },
        {
          action: 'refresh_api_cache',
          title: t('sys.config.item.title.refresh_api_cache'),
          desc: t('sys.config.item.desc.refresh_api_cache'),
          refresh: true,
        },
        {
          action: 'service_unavailable',
          title: t('sys.config.item.title.service_unavailable'),
          desc: t('sys.config.item.desc.service_unavailable'),
          open: configFormData.value.service_unavailable.open,
          config: true,
          reset: true,
        },
        {
          action: 'general_api',
          title: t('sys.config.item.title.general_api'),
          desc: t('sys.config.item.desc.general_api'),
          open: configFormData.value.general_api.open,
          config: true,
          reset: true,
        },
      ];
    },
    { immediate: true }
  );

  const handleAutoDisabledErrorAdd = () => {
    configFormData.value.auto_disabled_error.errors.push('');
  };

  const handleAutoDisabledErrorDel = (index: number) => {
    configFormData.value.auto_disabled_error.errors.splice(index, 1);
  };

  const handleAutoEnableErrorAdd = () => {
    configFormData.value.auto_enable_error.enable_errors.push({
      cron: '',
      enable_time: ref(),
      error: '',
    });
  };

  const handleAutoEnableErrorDel = (index: number) => {
    if (configFormData.value.auto_enable_error.enable_errors.length > 1) {
      configFormData.value.auto_enable_error.enable_errors.splice(index, 1);
    }
  };

  const handleAutoRetryErrorAdd = () => {
    configFormData.value.auto_retry_error.errors.push('');
  };

  const handleAutoRetryErrorDel = (index: number) => {
    configFormData.value.auto_retry_error.errors.splice(index, 1);
  };

  const handleNotRetryErrorAdd = () => {
    configFormData.value.not_retry_error.errors.push('');
  };

  const handleNotRetryErrorDel = (index: number) => {
    configFormData.value.not_retry_error.errors.splice(index, 1);
  };

  const handleNotShieldErrorAdd = () => {
    configFormData.value.not_shield_error.errors.push('');
  };

  const handleNotShieldErrorDel = (index: number) => {
    configFormData.value.not_shield_error.errors.splice(index, 1);
  };

  const handleServiceUnavailableAdd = () => {
    configFormData.value.service_unavailable.ip_whitelist.push('');
  };

  const handleServiceUnavailableDel = (index: number) => {
    configFormData.value.service_unavailable.ip_whitelist.splice(index, 1);
  };

  const handleGeneralApiAdd = () => {
    configFormData.value.general_api.ip_whitelist.push('');
  };

  const handleGeneralApiDel = (index: number) => {
    configFormData.value.general_api.ip_whitelist.splice(index, 1);
  };

  const normalizeLogPrivacy = () => {
    configFormData.value.log.privacy = {
      ...defaultLogPrivacy(),
      ...(configFormData.value.log.privacy || {}),
    };
    configFormData.value.log.privacy.request_privacy_fields =
      configFormData.value.log.privacy.request_privacy_fields || [];
    configFormData.value.log.privacy.response_privacy_fields =
      configFormData.value.log.privacy.response_privacy_fields || [];
    configFormData.value.log.privacy.resource_privacy_fields =
      configFormData.value.log.privacy.resource_privacy_fields || [];
    configFormData.value.log.privacy.network_privacy_fields =
      configFormData.value.log.privacy.network_privacy_fields || [];
  };

  const handlePrivacyFieldAdd = (category: string) => {
    const fields = getPrivacyFields(category);
    fields.push({
      key: '',
      label: '',
      description: '',
      log_types: [],
      enabled: true,
      sort: fields.length + 1,
    });
  };

  const handlePrivacyFieldDel = (category: string, index: number) => {
    const fields = getPrivacyFields(category);
    if (fields.length > 1) {
      fields.splice(index, 1);
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'API',
  };
</script>

<style scoped lang="less">
  @import '../style/config-card-shared.less';

  .config-list-wrap {
    margin-top: 10px;
  }

  .field-input {
    margin-right: 5px;
  }

  .field-input-wide {
    width: 86%;
  }

  .field-input-cron {
    width: 20%;
  }

  .field-input-enable-time {
    width: 22%;
  }

  .field-input-error {
    width: 42%;
  }

  .field-input-ip {
    width: 84%;
  }

  .field-input-privacy-key {
    width: 25%;
  }

  .field-input-privacy-label {
    width: 25%;
  }

  .field-input-privacy-description {
    width: 28%;
  }

  .field-action-button {
    margin-right: 5px;
  }

  .field-input-rule-name {
    flex: none;
    width: 18%;
  }

  .field-input-rule-regex {
    flex: none;
    width: 32%;
  }

  .rule-row-wrap {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 5px;
  }

  .rule-row {
    display: flex;
    align-items: center;
  }

  .rule-actions {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-left: 10px;
    flex-shrink: 0;
  }
</style>
