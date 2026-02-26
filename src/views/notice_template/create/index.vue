<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-notification />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('notice.menu') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{
        $t('notice.template.menu.create')
      }}</a-breadcrumb-item>
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
            :label-col-props="{ span: 3 }"
            :wrapper-col-props="{ span: 18 }"
          >
            <a-form-item
              field="name"
              :label="$t('notice.template.label.name')"
              :rules="[
                {
                  required: true,
                  message: $t('notice.template.placeholder.name'),
                },
              ]"
            >
              <a-input
                v-model="formData.name"
                :placeholder="$t('notice.template.placeholder.name')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="scenes"
              :label="$t('notice.template.label.scenes')"
              :rules="[
                {
                  required: true,
                  message: $t('notice.template.error.required.scenes'),
                },
              ]"
            >
              <a-space size="small" wrap>
                <a-checkbox
                  v-model="formData.scenes"
                  value="code"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.code') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="register"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.register') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="login"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.login') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="forget_password"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.forget_password') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="user_agreement"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.user_agreement') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="privacy_policy"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.privacy_policy') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="change_password"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.change_password') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="change_email"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.change_email') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="quota_recharge"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.quota_recharge') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="quota_warning"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.quota_warning') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="quota_exhaustion"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.quota_exhaustion') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="quota_expire_warning"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.quota_expire_warning') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="quota_expire"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.quota_expire') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="notice"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.notice') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="notice_register"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.notice_register') }}
                </a-checkbox>
                <a-checkbox
                  v-model="formData.scenes"
                  value="notice_login"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.notice_login') }}
                </a-checkbox>
              </a-space>
            </a-form-item>
            <a-form-item
              field="title"
              :label="$t('notice.template.label.title')"
              :rules="[
                {
                  required: true,
                  message: $t('notice.template.placeholder.title'),
                },
              ]"
            >
              <a-input
                v-model="formData.title"
                :placeholder="$t('notice.template.placeholder.title')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="content"
              :label="$t('notice.template.label.content')"
              :rules="[
                {
                  required: true,
                  message: $t('notice.template.placeholder.content'),
                },
              ]"
            >
              <Vditor v-model="formData.content" style="flex: 1" />
            </a-form-item>
            <a-form-item field="remark" :label="$t('common.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('placeholder.remark')"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'NoticeTemplateList',
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
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import {
    submitNoticeTemplateCreate,
    NoticeTemplate,
  } from '@/api/notice_template';
  import Vditor from '@/views/common/vditor.vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(false);

  const router = useRouter();
  const formRef = ref<FormInstance>();
  const formData = ref<NoticeTemplate>({
    name: '',
    scenes: [],
    title: '',
    content: '',
    channels: ['email'],
    is_popup: false,
    is_public: true,
    remark: '',
    status: 1,
  });

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitNoticeTemplateCreate(formData.value).then(() => {
          Message.success(t('success.create'));
          router.push({
            name: 'NoticeTemplateList',
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
    name: 'NoticeTemplateCreate',
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
        width: 100%;
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

  .scenes {
    width: 125px;
  }
</style>
