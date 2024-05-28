<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 5 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      field="corp"
      :label="$t('model.label.corp')"
      :rules="[
        {
          required: true,
          message: $t('model.error.corp.required'),
        },
      ]"
    >
      <a-select
        v-model="formData.corp"
        :placeholder="$t('model.placeholder.corp')"
        allow-search
      >
        <a-option
          v-for="item in corps"
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
        allow-search
      >
        <a-option value="1">文生文</a-option>
        <a-option value="2">文生图</a-option>
        <a-option value="3">图生文</a-option>
        <a-option value="4">图生图</a-option>
        <a-option value="100">多模态</a-option>
      </a-select>
    </a-form-item>
    <a-form-item field="base_url" :label="$t('model.label.base_url')">
      <a-input
        v-model="formData.base_url"
        :placeholder="$t('model.placeholder.base_url')"
      />
    </a-form-item>
    <a-form-item field="path" :label="$t('model.label.path')">
      <a-input
        v-model="formData.path"
        :placeholder="$t('model.placeholder.path')"
      />
    </a-form-item>
    <a-form-item field="prompt" :label="$t('model.label.prompt')">
      <a-textarea
        v-model="formData.prompt"
        :placeholder="$t('model.placeholder.prompt')"
      />
    </a-form-item>
    <a-form-item field="remark" :label="$t('model.label.remark')">
      <a-textarea
        v-model="formData.remark"
        :placeholder="$t('model.placeholder.remark')"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="onNextClick">
        {{ $t('model.button.next') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { ModelCreateBaseInfo } from '@/api/model';
  import { queryCorpList, CorpList } from '@/api/corp';

  const { setLoading } = useLoading(true);

  const emits = defineEmits(['changeStep']);
  const formRef = ref<FormInstance>();
  const formData = ref<ModelCreateBaseInfo>({
    corp: '',
    name: '',
    model: '',
    type: '1',
    base_url: '',
    path: '',
    prompt: '',
    remark: '',
  });

  const corps = ref<CorpList[]>([]);

  const getCorpList = async () => {
    setLoading(true);
    try {
      const { data } = await queryCorpList();
      corps.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getCorpList();

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
