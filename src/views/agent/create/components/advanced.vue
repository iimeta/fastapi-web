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
      :label="$t('model.agent.label.models')"
      :rules="[
        {
          required: false,
        },
      ]"
    >
      <a-select
        v-model="formData.models"
        :placeholder="$t('model.agent.placeholder.models')"
        :max-tag-count="3"
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
    <a-form-item field="key" :label="$t('model.agent.label.key')">
      <a-textarea
        v-model="formData.key"
        :placeholder="$t('model.agent.placeholder.key')"
        :auto-size="{ minRows: 5, maxRows: 10 }"
      />
    </a-form-item>
    <a-form-item
      field="is_agents_only"
      :label="$t('model.agent.label.isAgentsOnly')"
    >
      <a-switch v-model="formData.is_agents_only" />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{ $t('model.agent.button.prev') }}
        </a-button>
        <a-button type="primary" @click="onNextClick">
          {{ $t('model.agent.button.next') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { ModelAgentCreateAdvanced } from '@/api/agent';
  import { queryModelList, ModelList } from '@/api/model';

  const { setLoading } = useLoading(true);

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

  const formRef = ref<FormInstance>();
  const formData = ref<ModelAgentCreateAdvanced>({
    models: [],
    key: '',
    is_agents_only: true,
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
    width: 650px;
  }

  .form-content {
    padding: 8px 50px 0 30px;
  }
</style>
