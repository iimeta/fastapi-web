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
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </a-select>
    </a-form-item>
    <a-form-item field="is_limit_quota" :label="$t('app.label.isLimitQuota')">
      <a-switch v-model="formData.is_limit_quota" />
    </a-form-item>
    <a-form-item
      v-if="formData.is_limit_quota"
      field="quota"
      :label="$t('app.label.quota')"
      :rules="[
        {
          required: true,
          message: $t('app.error.quota.required'),
        },
      ]"
    >
      <a-input-number
        v-model="formData.quota"
        :placeholder="$t('app.placeholder.quota')"
        :precision="0"
        :min="0"
        :max="9999999999999"
      />
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
        :auto-size="{ minRows: 5, maxRows: 10 }"
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
        :auto-size="{ minRows: 5, maxRows: 10 }"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{ $t('app.button.prev') }}
        </a-button>
        <a-button type="primary" @click="onNextClick">
          {{ $t('app.button.next') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { AppCreateAdvanced } from '@/api/app';
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
  const formData = ref<AppCreateAdvanced>({
    models: [],
    is_limit_quota: false,
    quota: ref(),
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
