<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 6 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
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
        :min="1"
        :placeholder="$t('model.placeholder.promptRatio')"
      />
    </a-form-item>
    <a-form-item
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
        :min="1"
        :placeholder="$t('model.placeholder.completionRatio')"
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
        <a-radio
          v-model="formData.data_format"
          value="1"
          :default-checked="true"
          >统一格式</a-radio
        >
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
  import useLoading from '@/hooks/loading';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { ModelCreateAdvanced } from '@/api/model';
  import { queryModelAgentList, ModelAgentList } from '@/api/agent';

  const { setLoading } = useLoading(true);

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
  const formData = ref<ModelCreateAdvanced>({
    prompt_ratio: 1,
    completion_ratio: 1,
    data_format: '1',
    is_enable_model_agent: false,
    model_agents: [],
    is_public: true,
  });

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
