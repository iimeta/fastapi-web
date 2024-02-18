<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 4 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      field="models"
      :label="$t('key.label.models')"
      :rules="[
        {
          required: false,
        },
      ]"
    >
      <a-select
        v-model="formData.models"
        :placeholder="$t('key.placeholder.models')"
        :max-tag-count="3"
        multiple
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
    <a-form-item field="model_agents" :label="$t('key.label.modelAgents')">
      <a-select
        v-model="formData.model_agents"
        :placeholder="$t('key.placeholder.modelAgents')"
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
    <a-form-item field="is_agents_only" :label="$t('key.label.isAgentsOnly')">
      <a-switch v-model="formData.is_agents_only" />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{ $t('key.button.prev') }}
        </a-button>
        <a-button type="primary" @click="onNextClick">
          {{ $t('key.button.next') }}
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
    KeyUpdateAdvanced,
    queryKeyDetail,
    KeyDetailParams,
  } from '@/api/key';
  import { queryModelList, ModelList } from '@/api/model';
  import { queryModelAgentList, ModelAgentList } from '@/api/agent';

  const { setLoading } = useLoading(true);
  const route = useRoute();

  const emits = defineEmits(['changeStep']);
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
  const formData = ref<KeyUpdateAdvanced>({
    models: [],
    model_agents: [],
    is_agents_only: false,
  });

  const getKeyDetail = async (
    params: KeyDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryKeyDetail(params);
      formData.value.models = data.models;
      formData.value.model_agents = data.model_agents;
      formData.value.is_agents_only = data.is_agents_only;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getKeyDetail();

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
    width: 650px;
  }

  .form-content {
    padding: 8px 50px 0 30px;
  }
</style>
