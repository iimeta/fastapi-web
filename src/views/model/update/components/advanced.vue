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
      field="base_url"
      :label="$t('model.label.baseUrl')"
      :rules="[
        {
          required: false,
        },
      ]"
    >
      <a-input
        v-model="formData.base_url"
        :placeholder="$t('model.placeholder.baseUrl')"
      />
    </a-form-item>
    <a-form-item
      field="path"
      :label="$t('model.label.path')"
      :rules="[
        {
          required: false,
        },
      ]"
    >
      <a-input
        v-model="formData.path"
        :placeholder="$t('model.placeholder.path')"
      />
    </a-form-item>
    <a-form-item
      field="proxy"
      :label="$t('model.label.proxy')"
      :rules="[
        {
          required: false,
        },
      ]"
    >
      <a-input
        v-model="formData.proxy"
        :placeholder="$t('model.placeholder.proxy')"
      />
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
  } from '@/api/model';

  const { setLoading } = useLoading(true);
  const route = useRoute();

  const emits = defineEmits(['changeStep']);

  const formRef = ref<FormInstance>();
  const formData = ref<ModelUpdateAdvanced>({
    prompt_ratio: 1,
    completion_ratio: 1,
    data_format: '',
    base_url: '',
    path: '',
    proxy: '',
    is_public: true,
  });

  const getModelDetail = async (
    params: ModelDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelDetail(params);
      formData.value.prompt_ratio = data.prompt_ratio;
      formData.value.completion_ratio = data.completion_ratio;
      formData.value.data_format = data.data_format;
      formData.value.base_url = data.base_url;
      formData.value.path = data.path;
      formData.value.proxy = data.proxy;
      formData.value.is_public = data.is_public;
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
