<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 6 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      field="corp"
      :label="$t('app.label.corp')"
      :rules="[
        {
          required: true,
          message: $t('app.error.corp.required'),
        },
      ]"
    >
      <a-select
        v-model="formData.corp"
        :placeholder="$t('app.placeholder.corp')"
      >
        <a-option value="OpenAI">OpenAI</a-option>
        <a-option value="Baidu">百度</a-option>
        <a-option value="Xfyun">科大讯飞</a-option>
        <a-option value="Aliyun">阿里云</a-option>
      </a-select>
    </a-form-item>
    <a-form-item
      field="key"
      :label="$t('app.label.app')"
      :rules="[
        {
          required: true,
          message: $t('app.error.app.required'),
        },
      ]"
    >
      <a-textarea
        v-model="formData.key"
        :placeholder="$t('app.placeholder.app')"
        :auto-size="{ minRows: 5 }"
      />
    </a-form-item>
    <a-form-item
      field="remark"
      :label="$t('app.label.remark')"
      :rules="[
        {
          required: false,
        },
      ]"
    >
      <a-textarea
        v-model="formData.remark"
        :placeholder="$t('app.placeholder.remark')"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="onNextClick">
        {{ $t('app.button.next') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { AppBaseInfo } from '@/api/app';

  const emits = defineEmits(['changeStep']);
  const formRef = ref<FormInstance>();
  const formData = ref<AppBaseInfo>({
    corp: '',
    app: '',
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
