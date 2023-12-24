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
      :label="$t('key.label.corp')"
      :rules="[
        {
          required: true,
          message: $t('key.error.corp.required'),
        },
      ]"
    >
      <a-select
        v-model="formData.corp"
        :placeholder="$t('key.placeholder.corp')"
      >
        <a-option value="OpenAI">OpenAI</a-option>
        <a-option value="Baidu">百度</a-option>
        <a-option value="Xfyun">科大讯飞</a-option>
        <a-option value="Aliyun">阿里云</a-option>
      </a-select>
    </a-form-item>
    <a-form-item
      field="key"
      :label="$t('key.label.key')"
      :rules="[
        {
          required: true,
          message: $t('key.error.key.required'),
        },
      ]"
    >
      <a-textarea
        v-model="formData.key"
        :placeholder="$t('key.placeholder.key')"
        :auto-size="{ minRows: 5 }"
      />
    </a-form-item>
    <a-form-item
      field="remark"
      :label="$t('key.label.remark')"
      :rules="[
        {
          required: false,
        },
      ]"
    >
      <a-textarea
        v-model="formData.remark"
        :placeholder="$t('key.placeholder.remark')"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="onNextClick">
        {{ $t('key.button.next') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import useLoading from '@/hooks/loading';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import {
    KeyUpdateBaseInfo,
    queryKeyDetail,
    KeyDetailParams,
  } from '@/api/key';

  const { setLoading } = useLoading(false);
  const route = useRoute();

  const emits = defineEmits(['changeStep']);
  const formRef = ref<FormInstance>();
  const formData = ref<KeyUpdateBaseInfo>({
    id: '',
    corp: '',
    key: '',
    remark: '',
  });

  const getKeyDetail = async (
    params: KeyDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryKeyDetail(params);
      formData.value.id = data.id;
      formData.value.corp = data.corp;
      formData.value.key = data.key;
      formData.value.remark = data.remark;
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
