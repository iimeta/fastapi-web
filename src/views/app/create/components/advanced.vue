<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 6 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      field="models"
      :label="$t('app.label.models')"
      :rules="[
        {
          required: false,
        },
      ]"
    >
      <a-select
        v-model="formData.models"
        :placeholder="$t('app.placeholder.models')"
        :max-tag-count="3"
        multiple
        allow-clear
      >
        <a-option
          v-for="item in models"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </a-select>
    </a-form-item>
    <a-form-item
      field="ip_whitelist"
      :label="$t('app.label.ip_whitelist')"
      :rules="[
        {
          required: false,
        },
      ]"
    >
      <a-textarea
        v-model="formData.ip_whitelist"
        :placeholder="$t('app.placeholder.ip_whitelist')"
        :auto-size="{ minRows: 5 }"
      />
    </a-form-item>
    <a-form-item
      field="ip_blacklist"
      :label="$t('app.label.ip_blacklist')"
      :rules="[
        {
          required: false,
        },
      ]"
    >
      <a-textarea
        v-model="formData.ip_blacklist"
        :placeholder="$t('app.placeholder.ip_blacklist')"
        :auto-size="{ minRows: 5 }"
      />
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
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { AppAdvanced } from '@/api/app';

  const emits = defineEmits(['changeStep']);
  const models = [
    {
      value: 'beijing',
      label: 'Beijing',
    },
    {
      value: 'shanghai',
      label: 'Shanghai',
    },
    {
      value: 'guangzhou',
      label: 'Guangzhou',
    },
    {
      value: 'chengdu',
      label: 'Chengdu',
    },
  ];

  const formRef = ref<FormInstance>();
  const formData = ref<AppAdvanced>({
    models: [],
    ip_whitelist: '',
    ip_blacklist: '',
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
