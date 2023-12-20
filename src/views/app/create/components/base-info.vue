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
      :label="$t('app.label.name')"
      :rules="[
        {
          required: true,
          message: $t('app.error.name.required'),
        },
        {
          match: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/,
          message: $t('app.error.name.pattern'),
        },
      ]"
    >
      <a-input
        v-model="formData.name"
        :placeholder="$t('app.placeholder.name')"
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
