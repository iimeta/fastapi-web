<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 5 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item field="models" :label="$t('app.label.models')">
      <a-select
        v-model="formData.models"
        :placeholder="$t('app.placeholder.models')"
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
        style="margin-right: 10px"
      />
      <div> ${{ formData.quota ? quotaConv(formData.quota) : '0' }}</div>
    </a-form-item>
    <a-form-item v-if="formData.is_limit_quota">
      <a-radio-group type="button" @change="handleQuotaQuickChange as any">
        <a-radio :value="1"> $1 </a-radio>
        <a-radio :value="5"> $5 </a-radio>
        <a-radio :value="10"> $10 </a-radio>
        <a-radio :value="20"> $20 </a-radio>
        <a-radio :value="100"> $100 </a-radio>
        <a-radio :value="500"> $500 </a-radio>
        <a-radio :value="1000"> $1000 </a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      v-if="formData.is_limit_quota"
      field="quota_expires_at"
      :label="$t('app.label.quota_expires_at')"
    >
      <a-date-picker
        v-model="formData.quota_expires_at"
        :placeholder="$t('app.placeholder.quota_expires_at')"
        :time-picker-props="{ defaultValue: '23:59:59' }"
        :disabled-date="(current:Date) => dayjs(current).isBefore(dayjs())"
        style="width: 100%"
        show-time
        :shortcuts="[
          {
            label: '1',
            value: () => dayjs().add(1, 'day'),
          },
          {
            label: '7',
            value: () => dayjs().add(7, 'day'),
          },
          {
            label: '15',
            value: () => dayjs().add(15, 'day'),
          },
          {
            label: '30',
            value: () => dayjs().add(30, 'day'),
          },
          {
            label: '90',
            value: () => dayjs().add(90, 'day'),
          },
          {
            label: '180',
            value: () => dayjs().add(180, 'day'),
          },
          {
            label: '365',
            value: () => dayjs().add(365, 'day'),
          },
        ]"
      />
    </a-form-item>
    <a-form-item field="ip_whitelist" :label="$t('app.label.ip_whitelist')">
      <a-textarea
        v-model="formData.ip_whitelist"
        :placeholder="$t('app.placeholder.ip_whitelist')"
        :auto-size="{ minRows: 5, maxRows: 10 }"
      />
    </a-form-item>
    <a-form-item field="ip_blacklist" :label="$t('app.label.ip_blacklist')">
      <a-textarea
        v-model="formData.ip_blacklist"
        :placeholder="$t('app.placeholder.ip_blacklist')"
        :auto-size="{ minRows: 5, maxRows: 10 }"
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
  import { useRoute } from 'vue-router';
  import useLoading from '@/hooks/loading';
  import dayjs from 'dayjs';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { quotaConv } from '@/utils/common';
  import {
    AppUpdateAdvanced,
    queryAppDetail,
    AppDetailParams,
  } from '@/api/app';
  import { queryModelList, ModelList } from '@/api/model';

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

  const formRef = ref<FormInstance>();
  const formData = ref<AppUpdateAdvanced>({
    models: [],
    is_limit_quota: false,
    quota: ref(),
    quota_expires_at: '',
    ip_whitelist: '',
    ip_blacklist: '',
  });

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.quota = quota * 500000;
  };

  const getAppDetail = async (
    params: AppDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryAppDetail(params);
      formData.value.models = data.models;
      formData.value.is_limit_quota = data.is_limit_quota;
      formData.value.quota = data.quota;
      formData.value.quota_expires_at = data.quota_expires_at;
      formData.value.ip_whitelist = data?.ip_whitelist?.join('\n') || '';
      formData.value.ip_blacklist = data?.ip_blacklist?.join('\n') || '';
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getAppDetail();

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
