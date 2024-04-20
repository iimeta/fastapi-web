<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 5 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      field="billing_method"
      :label="$t('model.label.billingMethod')"
      :rules="[
        {
          required: true,
          message: $t('model.error.billingMethod.required'),
        },
      ]"
    >
      <a-space size="large">
        <a-radio v-model="formData.billing_method" value="1">倍率</a-radio>
        <a-radio v-model="formData.billing_method" value="2">固定额度</a-radio>
      </a-space>
    </a-form-item>
    <a-form-item
      v-if="formData.billing_method === '1'"
      field="prompt_ratio"
      :label="$t('model.label.promptRatio')"
      :rules="[
        {
          required: true,
          message: $t('model.error.promptRatio.required'),
        },
      ]"
    >
      <a-input-number
        v-model="formData.prompt_ratio"
        :min="0.001"
        :placeholder="$t('model.placeholder.promptRatio')"
      />
    </a-form-item>
    <a-form-item
      v-if="formData.billing_method === '1'"
      field="completion_ratio"
      :label="$t('model.label.completionRatio')"
      :rules="[
        {
          required: true,
          message: $t('model.error.completionRatio.required'),
        },
      ]"
    >
      <a-input-number
        v-model="formData.completion_ratio"
        :min="0.001"
        :placeholder="$t('model.placeholder.completionRatio')"
      />
    </a-form-item>
    <a-form-item
      v-if="formData.billing_method === '2'"
      field="fixed_quota"
      :label="$t('model.label.fixedQuota')"
      :rules="[
        {
          required: true,
          message: $t('model.error.fixedQuota.required'),
        },
      ]"
    >
      <a-input-number
        v-model="formData.fixed_quota"
        :min="0"
        :max="9999999999999"
        :placeholder="$t('model.placeholder.fixedQuota')"
      />
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
        <a-radio v-model="formData.data_format" value="1">统一格式</a-radio>
        <a-radio v-model="formData.data_format" value="2">官方格式</a-radio>
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
    <a-form-item field="model_forward" :label="$t('model.label.modelForward')">
      <a-switch v-model="formData.is_forward" @change="handleChange" />
    </a-form-item>
    <a-form-item
      v-if="formData.is_forward"
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
        @change="handleChange"
      >
        <a-option value="1">全部转发</a-option>
        <a-option value="2">按关键字</a-option>
      </a-select>
    </a-form-item>
    <a-form-item
      v-if="formData.is_forward && formData.forward_config.forward_rule === '1'"
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
        formData.is_forward && formData.forward_config.forward_rule === '2'
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
        style="width: 40%; margin-right: 5px"
      />
      <a-select
        v-model="formData.forward_config.target_models[index]"
        :placeholder="$t('model.placeholder.targetModel')"
        style="width: 40%"
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
        @click="handleAdd"
      >
        <icon-plus />
      </a-button>
      <a-button type="secondary" shape="circle" @click="handleDelete(index)">
        <icon-minus />
      </a-button>
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{ $t('model.button.prev') }}
        </a-button>
        <a-button type="primary" @click="onNextClick">
          {{ $t('model.button.next') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import useLoading from '@/hooks/loading';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import {
    ModelUpdateAdvanced,
    queryModelDetail,
    ModelDetailParams,
    queryModelList,
    ModelList,
  } from '@/api/model';
  import { queryModelAgentList, ModelAgentList } from '@/api/agent';

  const { setLoading } = useLoading(true);
  const route = useRoute();

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

  const emits = defineEmits(['changeStep']);
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
  const formData = ref<ModelUpdateAdvanced>({
    billing_method: '1',
    prompt_ratio: 1,
    completion_ratio: 1,
    fixed_quota: 1,
    data_format: '',
    is_public: true,
    is_enable_model_agent: false,
    model_agents: [],
    is_forward: false,
    forward_config: {
      forward_rule: '1',
      target_model: '',
      keywords: [],
      target_models: [],
    },
  });

  const handleAdd = () => {
    formData.value.forward_config.keywords.push('');
    formData.value.forward_config.target_models.push('');
  };

  const handleChange = () => {
    if (!formData.value.is_forward) {
      formData.value.forward_config.target_model = '';
      formData.value.forward_config.keywords = [];
      formData.value.forward_config.target_models = [];
    } else if (formData.value.forward_config.forward_rule === '2') {
      formData.value.forward_config.keywords = [''];
      formData.value.forward_config.target_models = [''];
      formData.value.forward_config.target_model = '';
    } else if (formData.value.forward_config.forward_rule === '1') {
      formData.value.forward_config.keywords = [];
      formData.value.forward_config.target_models = [];
    }
  };

  const handleDelete = (index: number) => {
    if (formData.value.forward_config.keywords.length > 1) {
      formData.value.forward_config.keywords.splice(index, 1);
      formData.value.forward_config.target_models.splice(index, 1);
    }
  };

  const getModelDetail = async (
    params: ModelDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelDetail(params);
      formData.value.billing_method = String(data.billing_method);
      formData.value.prompt_ratio = data.prompt_ratio;
      formData.value.completion_ratio = data.completion_ratio;
      formData.value.fixed_quota = data.fixed_quota;
      formData.value.data_format = String(data.data_format);
      formData.value.is_public = data.is_public;
      formData.value.is_enable_model_agent = data.is_enable_model_agent;
      formData.value.model_agents = data.model_agents;
      formData.value.is_forward = data.is_forward;
      formData.value.forward_config.forward_rule = String(
        data.forward_config.forward_rule
      );
      formData.value.forward_config.target_model =
        data.forward_config.target_model;
      formData.value.forward_config.keywords = data.forward_config.keywords;
      formData.value.forward_config.target_models =
        data.forward_config.target_models;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelDetail();

  const onNextClick = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      emits('changeStep', 'submit', { ...formData.value });
    }
  };
  const goPrev = () => {
    emits('changeStep', 'backward');
  };
</script>

<style scoped lang="less">
  .container {
    .keep-margin {
      margin-bottom: 20px;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 0;
    background-color: var(--color-bg-2);
  }

  .steps {
    margin-bottom: 36px;
  }

  .form {
    width: 540px;
  }

  .form-content {
    padding: 8px 50px 0 30px;
  }
</style>
