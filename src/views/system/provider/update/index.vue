<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-settings />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.sys') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.provider.update') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-spin :loading="loading" style="width: 100%">
      <a-card
        class="general-card"
        :body-style="{ padding: '0 20px 20px 20px' }"
        :bordered="false"
      >
        <div class="wrapper">
          <a-form
            ref="formRef"
            :model="formData"
            class="form"
            :label-col-props="{ span: 4 }"
            :wrapper-col-props="{ span: 18 }"
          >
            <a-form-item
              field="name"
              :label="$t('provider.label.name')"
              :rules="[
                {
                  required: true,
                  message: $t('provider.error.name.required'),
                },
                {
                  match: /^.{1,100}$/,
                  message: $t('provider.error.name.pattern'),
                },
              ]"
            >
              <a-select
                v-model="formData.name"
                :placeholder="$t('provider.placeholder.name')"
                :options="nameOptions"
                :scrollbar="false"
                allow-search
                allow-clear
                allow-create
              />
            </a-form-item>
            <a-form-item
              field="code"
              :label="$t('provider.label.code')"
              :rules="[
                {
                  required: true,
                  message: $t('provider.error.code.required'),
                },
                {
                  match: /^.{1,100}$/,
                  message: $t('provider.error.code.pattern'),
                },
              ]"
            >
              <a-select
                v-model="formData.code"
                :placeholder="$t('provider.placeholder.code')"
                :options="codeOptions"
                :scrollbar="false"
                allow-search
                allow-clear
                allow-create
              />
            </a-form-item>
            <a-form-item field="sort" :label="$t('provider.label.sort')">
              <a-input-number
                v-model="formData.sort"
                :placeholder="$t('provider.placeholder.sort')"
                :precision="0"
                :min="-10"
                :max="999"
              />
            </a-form-item>
            <a-form-item
              field="is_public"
              :label="$t('provider.label.is_public')"
            >
              <a-switch v-model="formData.is_public" />
            </a-form-item>
            <a-form-item field="remark" :label="$t('provider.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('provider.placeholder.remark')"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'ProviderList',
                    })
                  "
                >
                  {{ $t('button.cancel') }}
                </a-button>
                <a-button type="primary" @click="submitForm">
                  {{ $t('button.submit') }}
                </a-button>
              </div>
            </a-space>
          </a-form>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    submitProviderUpdate,
    ProviderUpdate,
    queryProviderDetail,
    ProviderDetailParams,
  } from '@/api/provider';
  import { FormInstance } from '@arco-design/web-vue';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { useRouter, useRoute } from 'vue-router';

  const { loading, setLoading } = useLoading(false);
  const { proxy } = getCurrentInstance() as any;
  const { t } = useI18n();

  const router = useRouter();
  const route = useRoute();
  const formRef = ref<FormInstance>();
  const formData = ref<ProviderUpdate>({
    id: '',
    name: '',
    code: '',
    sort: 0,
    is_public: true,
    remark: '',
    status: 1,
  });

  const nameOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('provider.dict.name.OpenAI'),
      value: t('provider.dict.name.OpenAI'),
    },
    {
      label: t('provider.dict.name.Anthropic'),
      value: t('provider.dict.name.Anthropic'),
    },
    {
      label: t('provider.dict.name.Google'),
      value: t('provider.dict.name.Google'),
    },
    {
      label: t('provider.dict.name.Azure'),
      value: t('provider.dict.name.Azure'),
    },
    {
      label: t('provider.dict.name.DeepSeek'),
      value: t('provider.dict.name.DeepSeek'),
    },
    {
      label: t('provider.dict.name.Baidu'),
      value: t('provider.dict.name.Baidu'),
    },
    {
      label: t('provider.dict.name.Aliyun'),
      value: t('provider.dict.name.Aliyun'),
    },
    {
      label: t('provider.dict.name.Xfyun'),
      value: t('provider.dict.name.Xfyun'),
    },
    {
      label: t('provider.dict.name.ZhipuAI'),
      value: t('provider.dict.name.ZhipuAI'),
    },
    {
      label: t('provider.dict.name.VolcEngine'),
      value: t('provider.dict.name.VolcEngine'),
    },
    {
      label: t('provider.dict.name.360AI'),
      value: t('provider.dict.name.360AI'),
    },
    {
      label: t('provider.dict.name.Midjourney'),
      value: t('provider.dict.name.Midjourney'),
    },
    {
      label: t('provider.dict.name.FastAPI'),
      value: t('provider.dict.name.FastAPI'),
    },
  ]);

  const codeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('provider.dict.code.OpenAI'),
      value: t('provider.dict.code.OpenAI'),
    },
    {
      label: t('provider.dict.code.Anthropic'),
      value: t('provider.dict.code.Anthropic'),
    },
    {
      label: t('provider.dict.code.Google'),
      value: t('provider.dict.code.Google'),
    },
    {
      label: t('provider.dict.code.Azure'),
      value: t('provider.dict.code.Azure'),
    },
    {
      label: t('provider.dict.code.DeepSeek'),
      value: t('provider.dict.code.DeepSeek'),
    },
    {
      label: t('provider.dict.code.DeepSeek-Baidu'),
      value: t('provider.dict.code.DeepSeek-Baidu'),
    },
    {
      label: t('provider.dict.code.Baidu'),
      value: t('provider.dict.code.Baidu'),
    },
    {
      label: t('provider.dict.code.Aliyun'),
      value: t('provider.dict.code.Aliyun'),
    },
    {
      label: t('provider.dict.code.Xfyun'),
      value: t('provider.dict.code.Xfyun'),
    },
    {
      label: t('provider.dict.code.ZhipuAI'),
      value: t('provider.dict.code.ZhipuAI'),
    },
    {
      label: t('provider.dict.code.VolcEngine'),
      value: t('provider.dict.code.VolcEngine'),
    },
    {
      label: t('provider.dict.code.Doubao'),
      value: t('provider.dict.code.Doubao'),
    },
    {
      label: t('provider.dict.code.360AI'),
      value: t('provider.dict.code.360AI'),
    },
    {
      label: t('provider.dict.code.AWSClaude'),
      value: t('provider.dict.code.AWSClaude'),
    },
    {
      label: t('provider.dict.code.GCPClaude'),
      value: t('provider.dict.code.GCPClaude'),
    },
    {
      label: t('provider.dict.code.GCPGemini'),
      value: t('provider.dict.code.GCPGemini'),
    },
    {
      label: t('provider.dict.code.Midjourney'),
      value: t('provider.dict.code.Midjourney'),
    },
    {
      label: t('provider.dict.code.FastAPI'),
      value: t('provider.dict.code.FastAPI'),
    },
  ]);

  const getProviderDetail = async (
    params: ProviderDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryProviderDetail(params);
      formData.value.id = data.id;
      formData.value.name = data.name;
      formData.value.code = data.code;
      formData.value.sort = data.sort;
      formData.value.is_public = data.is_public;
      formData.value.remark = data.remark;
      formData.value.status = data.status;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getProviderDetail();

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitProviderUpdate(formData.value).then(() => {
          proxy.$message.success('更新成功');
          router.push({
            name: 'ProviderList',
          });
        });
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'ProviderUpdate',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 10px 20px 10px;
  }

  .container-breadcrumb {
    margin: 6px 0;
    :deep(.arco-breadcrumb-item) {
      color: rgb(var(--gray-6));
      &:last-child {
        color: rgb(var(--gray-8));
      }
    }
  }

  .general-card {
    &:first-child {
      padding-top: 61px;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-bg-2);
    :deep(.arco-form) {
      .arco-form-item {
        width: 888px;
        &:first-child {
          margin-top: 20px;
        }
      }
    }
  }

  .form {
    align-items: center;
  }

  .submit-btn {
    width: 300px;
    display: flex;
    button {
      flex: 1;
      margin: 20px 30px;
    }
  }
</style>
