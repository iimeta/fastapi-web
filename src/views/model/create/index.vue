<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-common />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model.create') }}</a-breadcrumb-item>
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
            :label-col-props="{ span: 4 }"
            :wrapper-col-props="{ span: 18 }"
          >
            <a-divider orientation="left">
              {{ $t('common.title.base_info') }}
            </a-divider>
            <a-form-item
              field="provider_id"
              :label="$t('model.label.provider')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.provider.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.provider_id"
                :placeholder="$t('model.placeholder.provider')"
                :scrollbar="false"
                allow-search
                style="width: 762px"
              >
                <a-option
                  v-for="item in providers"
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
                class="input"
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
                class="input"
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
                style="width: 762px"
              >
                <a-option value="1">{{ $t('dict.model_type.1') }}</a-option>
                <a-option value="2">{{ $t('dict.model_type.2') }}</a-option>
                <a-option value="3">{{ $t('dict.model_type.3') }}</a-option>
                <a-option value="4">{{ $t('dict.model_type.4') }}</a-option>
                <a-option value="5">{{ $t('dict.model_type.5') }}</a-option>
                <a-option value="6">{{ $t('dict.model_type.6') }}</a-option>
                <a-option value="7">{{ $t('dict.model_type.7') }}</a-option>
                <a-option value="8">{{ $t('dict.model_type.8') }}</a-option>
                <a-option value="100">{{ $t('dict.model_type.100') }}</a-option>
                <a-option value="101">{{ $t('dict.model_type.101') }}</a-option>
                <a-option value="102">{{ $t('dict.model_type.102') }}</a-option>
                <a-option value="103">{{ $t('dict.model_type.103') }}</a-option>
                <a-option value="10000">
                  {{ $t('dict.model_type.10000') }}
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="base_url" :label="$t('model.label.base_url')">
              <a-input
                v-model="formData.base_url"
                :placeholder="$t('model.placeholder.base_url')"
                class="input"
              />
            </a-form-item>
            <a-form-item field="path" :label="$t('model.label.path')">
              <a-input
                v-model="formData.path"
                :placeholder="$t('model.placeholder.path')"
                class="input"
              />
            </a-form-item>
            <a-form-item field="remark" :label="$t('model.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('model.placeholder.remark')"
                class="input"
              />
            </a-form-item>

            <a-divider orientation="left">
              {{ $t('common.title.advanced') }}
            </a-divider>

            <!-- 定价 -->
            <Pricing
              ref="pricingRef"
              v-model="formData.pricing"
              :model-type="formData.type"
            />

            <a-form-item
              field="request_data_format"
              :label="$t('model.label.request_data_format')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.request_data_format.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-radio
                  v-model="formData.request_data_format"
                  value="1"
                  :default-checked="true"
                >
                  统一格式
                </a-radio>
                <a-radio v-model="formData.request_data_format" value="2">
                  官方格式
                </a-radio>
              </a-space>
            </a-form-item>
            <a-form-item
              field="response_data_format"
              :label="$t('model.label.response_data_format')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.response_data_format.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-radio
                  v-model="formData.response_data_format"
                  value="1"
                  :default-checked="true"
                >
                  统一格式
                </a-radio>
                <a-radio v-model="formData.response_data_format" value="2">
                  官方格式
                </a-radio>
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
              field="groups"
              :label="$t('model.label.groups')"
              :rules="[
                {
                  required: !formData.is_public,
                  message: $t('model.error.groups.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.groups"
                :placeholder="
                  $t(
                    formData.is_public
                      ? 'model.placeholder.create.groups'
                      : 'model.placeholder.groups'
                  )
                "
                :max-tag-count="5"
                :scrollbar="false"
                multiple
                allow-search
                allow-clear
                style="width: 762px"
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
                class="input"
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
                style="width: 378px; margin-right: 5px"
                :precision="0"
                :min="0"
                :max="2097152"
              />
              <a-input-number
                v-model="formData.preset_config.max_tokens"
                :placeholder="$t('model.placeholder.preset_config.max_tokens')"
                style="width: 379px"
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
              :label="$t('model.label.model_agents')"
              :rules="[
                {
                  required: true,
                  message: $t('model.error.modelAgents.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.model_agents"
                :placeholder="$t('model.placeholder.model_agents')"
                :max-tag-count="5"
                :scrollbar="false"
                multiple
                allow-search
                allow-clear
                style="width: 762px"
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
                style="width: 762px"
                @change="handleForwardRuleChange"
              >
                <a-option value="1">{{ $t('dict.forward_rule.1') }}</a-option>
                <a-option value="2">{{ $t('dict.forward_rule.2') }}</a-option>
                <a-option value="3">{{ $t('dict.forward_rule.3') }}</a-option>
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
                class="input"
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
                style="width: 762px"
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
                style="width: 762px"
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
                style="width: 373px; margin-right: 5px"
              />
              <a-select
                v-model="formData.forward_config.target_models[index]"
                :placeholder="$t('model.placeholder.targetModel')"
                :scrollbar="false"
                style="width: 300px"
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
                style="width: 762px"
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
                style="width: 762px"
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
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { useRouter } from 'vue-router';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import {
    Model,
    submitModelCreate,
    queryModelList,
    ModelList,
  } from '@/api/model';
  import { queryProviderList, ProviderList } from '@/api/provider';
  import { queryModelAgentList, ModelAgentList } from '@/api/model_agent';
  import { queryGroupList, GroupList } from '@/api/group';
  import Pricing from '../components/pricing.vue';

  const { loading, setLoading } = useLoading(false);

  const { t } = useI18n();
  const router = useRouter();

  const providers = ref<ProviderList[]>([]);
  const providerMap = new Map();
  const getProviderList = async () => {
    try {
      const { data } = await queryProviderList();
      providers.value = data.items;
      for (let i = 0; i < providers.value.length; i += 1) {
        providerMap.set(providers.value[i].id, providers.value[i]);
      }
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getProviderList();

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

  const groups = ref<GroupList[]>([]);
  const getGroupList = async () => {
    try {
      const { data } = await queryGroupList();
      groups.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getGroupList();

  const formRef = ref<FormInstance>();
  const formData = ref<Model>({
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
    pricing: {
      billing_rule: 1,
      billing_methods: [1],
      billing_items: [],
      text: [],
      text_cache: [],
      tiered_text: [],
      tiered_text_cache: [],
      image: {
        input_ratio: ref(),
        output_ratio: ref(),
      },
      image_generation: [],
      image_cache: {
        read_ratio: ref(),
      },
      vision: [],
      audio: {
        input_ratio: ref(),
        output_ratio: ref(),
      },
      audio_cache: {
        read_ratio: ref(),
      },
      video: {
        input_ratio: ref(),
        output_ratio: ref(),
      },
      video_generation: [],
      video_cache: {
        read_ratio: ref(),
      },
      search: [],
      midjourney: [],
      once: {
        once_ratio: ref(),
      },
    },
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

  // 定价
  const pricingRef = ref();

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      // 定价
      const pricingRes = await pricingRef.value?.validate();
      if (pricingRes) {
        Message.warning(t('model.error.pricing.required'));
        return;
      }
      setLoading(true);
      try {
        await submitModelCreate(formData.value).then(() => {
          Message.success(t('success.create'));
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
        width: 1088px;
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

  .input {
    width: 762px;
  }
</style>
