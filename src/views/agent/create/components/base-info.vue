<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 6 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      field="name"
      :label="$t('model.agent.label.name')"
      :rules="[
        {
          required: true,
          message: $t('model.agent.error.name.required'),
        },
        {
          match: /^.{1,20}$/,
          message: $t('model.agent.error.name.pattern'),
        },
      ]"
    >
      <a-input
        v-model="formData.name"
        :placeholder="$t('model.agent.placeholder.name')"
        allow-clear
      />
    </a-form-item>
    <a-form-item
      field="base_url"
      :label="$t('model.agent.label.baseUrl')"
      :rules="[
        {
          required: true,
          message: $t('model.agent.error.baseUrl.required'),
        },
      ]"
    >
      <a-input
        v-model="formData.base_url"
        :placeholder="$t('model.agent.placeholder.baseUrl')"
      />
    </a-form-item>
    <a-form-item field="path" :label="$t('model.agent.label.path')">
      <a-input
        v-model="formData.path"
        :placeholder="$t('model.agent.placeholder.path')"
      />
    </a-form-item>
    <a-form-item field="weight" :label="$t('model.agent.label.weight')">
      <a-input-number
        v-model="formData.weight"
        :precision="0"
        :min="0"
        :max="99999"
        :placeholder="$t('model.agent.placeholder.weight')"
      />
    </a-form-item>
    <a-form-item field="remark" :label="$t('model.agent.label.remark')">
      <a-textarea
        v-model="formData.remark"
        :placeholder="$t('model.agent.placeholder.remark')"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="onNextClick">
        {{ $t('model.agent.button.next') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { ModelAgentCreateBaseInfo } from '@/api/agent';

  const emits = defineEmits(['changeStep']);
  const formRef = ref<FormInstance>();
  const formData = ref<ModelAgentCreateBaseInfo>({
    name: '',
    base_url: '',
    path: '',
    weight: ref(),
    remark: '',
  });

  const onNextClick = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      emits('changeStep', 'forward', { ...formData.value });
    }
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
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
    width: 500px;
  }

  .form-content {
    padding: 8px 50px 0 30px;
  }
</style>
