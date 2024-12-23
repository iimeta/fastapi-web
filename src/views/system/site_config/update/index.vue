<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-settings />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.sys') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.site.config.update') }}</a-breadcrumb-item>
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
            :label-col-props="{ span: 5 }"
            :wrapper-col-props="{ span: 18 }"
          >
            <a-form-item
              field="domain"
              :label="$t('site.config.label.domain')"
              :rules="[
                {
                  required: true,
                  message: $t('site.config.error.domain.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.domain"
                :placeholder="$t('site.config.placeholder.domain')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="title"
              :label="$t('site.config.label.title')"
              :rules="[
                {
                  required: true,
                  message: $t('site.config.error.title.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.title"
                :placeholder="$t('site.config.placeholder.title')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="logo"
              :label="$t('site.config.label.logo')"
              :rules="[
                {
                  required: true,
                  message: $t('site.config.error.logo.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.logo"
                :placeholder="$t('site.config.placeholder.logo')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="favicon"
              :label="$t('site.config.label.favicon')"
              :rules="[
                {
                  required: true,
                  message: $t('site.config.error.favicon.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.favicon"
                :placeholder="$t('site.config.placeholder.favicon')"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="avatar" :label="$t('site.config.label.avatar')">
              <a-input
                v-model="formData.avatar"
                :placeholder="$t('site.config.placeholder.avatar')"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="bg_img" :label="$t('site.config.label.bg_img')">
              <a-input
                v-model="formData.bg_img"
                :placeholder="$t('site.config.placeholder.bg_img')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="copyright"
              :label="$t('site.config.label.copyright')"
            >
              <a-input
                v-model="formData.copyright"
                :placeholder="$t('site.config.placeholder.copyright')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="jump_url"
              :label="$t('site.config.label.jump_url')"
            >
              <a-input
                v-model="formData.jump_url"
                :placeholder="$t('site.config.placeholder.jump_url')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="keywords"
              :label="$t('site.config.label.keywords')"
            >
              <a-input
                v-model="formData.keywords"
                :placeholder="$t('site.config.placeholder.keywords')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="description"
              :label="$t('site.config.label.description')"
            >
              <a-input
                v-model="formData.description"
                :placeholder="$t('site.config.placeholder.description')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="icp_beian"
              :label="$t('site.config.label.icp_beian')"
            >
              <a-input
                v-model="formData.icp_beian"
                :placeholder="$t('site.config.placeholder.icp_beian')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="ga_beian"
              :label="$t('site.config.label.ga_beian')"
            >
              <a-input
                v-model="formData.ga_beian"
                :placeholder="$t('site.config.placeholder.ga_beian')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="register_tips"
              :label="$t('site.config.label.register_tips')"
            >
              <a-input
                v-model="formData.register_tips"
                :placeholder="$t('site.config.placeholder.register_tips')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips"
              field="grant_quota"
              :label="$t('site.config.label.grant_quota')"
            >
              <a-input-number
                v-model="formData.grant_quota"
                :placeholder="$t('site.config.placeholder.grant_quota')"
                :precision="0"
                :min="0"
                :max="9999999999999"
                style="width: 492px; margin-right: 10px"
                allow-clear
              />
              <div>
                ${{
                  formData.grant_quota ? quotaConv(formData.grant_quota) : '0'
                }}</div
              >
            </a-form-item>
            <a-form-item v-if="!formData.register_tips">
              <a-radio-group
                type="button"
                @change="handleQuotaQuickChange as any"
              >
                <a-radio :value="1"> $1 </a-radio>
                <a-radio :value="5"> $5 </a-radio>
                <a-radio :value="10"> $10 </a-radio>
                <a-radio :value="20"> $20 </a-radio>
                <a-radio :value="50"> $50 </a-radio>
                <a-radio :value="100"> $100 </a-radio>
                <a-radio :value="200"> $200 </a-radio>
                <a-radio :value="500"> $500 </a-radio>
                <a-radio :value="1000"> $1000 </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips"
              field="quota_expires_at"
              :label="$t('site.config.label.quota_expires_at')"
            >
              <a-input-number
                v-model="formData.quota_expires_at"
                :placeholder="$t('site.config.placeholder.quota_expires_at')"
                :min="1"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="support_email_suffix"
              :label="$t('site.config.label.support_email_suffix')"
            >
              <a-input
                v-model="formData.support_email_suffix"
                :placeholder="
                  $t('site.config.placeholder.support_email_suffix')
                "
                allow-clear
              />
            </a-form-item>
            <a-form-item field="host" :label="$t('site.config.label.host')">
              <a-input
                v-model="formData.host"
                :placeholder="$t('site.config.placeholder.host')"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="port" :label="$t('site.config.label.port')">
              <a-input-number
                v-model="formData.port"
                :placeholder="$t('site.config.placeholder.port')"
                :min="1"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="user_name"
              :label="$t('site.config.label.user_name')"
            >
              <a-input
                v-model="formData.user_name"
                :placeholder="$t('site.config.placeholder.user_name')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="password"
              :label="$t('site.config.label.password')"
            >
              <a-input
                v-model="formData.password"
                :placeholder="$t('site.config.placeholder.password')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="from_name"
              :label="$t('site.config.label.from_name')"
            >
              <a-input
                v-model="formData.from_name"
                :placeholder="$t('site.config.placeholder.from_name')"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="remark" :label="$t('site.config.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('site.config.placeholder.remark')"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'SiteConfig',
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
  import { ref, getCurrentInstance } from 'vue';
  import useLoading from '@/hooks/loading';
  import { quotaConv } from '@/utils/common';
  import {
    submitSiteConfigUpdate,
    SiteConfigUpdate,
    querySiteConfigDetail,
    SiteConfigDetailParams,
  } from '@/api/site_config';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { useRouter, useRoute } from 'vue-router';

  const { proxy } = getCurrentInstance() as any;

  const router = useRouter();
  const route = useRoute();
  const formRef = ref<FormInstance>();
  const formData = ref<SiteConfigUpdate>({
    id: '',
    domain: '',
    title: '',
    logo: '',
    favicon: '',
    avatar: '',
    bg_img: '',
    copyright: '',
    jump_url: '',
    keywords: '',
    description: '',
    icp_beian: '',
    ga_beian: '',
    register_tips: '',
    grant_quota: ref(),
    quota_expires_at: ref(),
    support_email_suffix: ref(),
    host: '',
    port: ref(),
    user_name: '',
    password: '',
    from_name: '',
    remark: '',
    status: 1,
  });

  const { loading, setLoading } = useLoading(false);
  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        if (formData.value.support_email_suffix) {
          formData.value.support_email_suffix =
            formData.value.support_email_suffix.split(',');
        }
        await submitSiteConfigUpdate(formData.value).then(() => {
          proxy.$message.success('更新成功');
          router.push({
            name: 'SiteConfig',
          });
        });
      } catch (err) {
        if (formData.value.support_email_suffix) {
          formData.value.support_email_suffix =
            formData.value.support_email_suffix.join(',');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const getSiteConfigDetail = async (
    params: SiteConfigDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await querySiteConfigDetail(params);
      formData.value.id = data.id;
      formData.value.domain = data.domain;
      formData.value.title = data.title;
      formData.value.logo = data.logo;
      formData.value.favicon = data.favicon;
      formData.value.avatar = data.avatar;
      formData.value.bg_img = data.bg_img;
      formData.value.copyright = data.copyright;
      formData.value.jump_url = data.jump_url;
      formData.value.keywords = data.keywords;
      formData.value.description = data.description;
      formData.value.icp_beian = data.icp_beian;
      formData.value.ga_beian = data.ga_beian;
      formData.value.register_tips = data.register_tips;
      formData.value.grant_quota = data.grant_quota;
      formData.value.quota_expires_at = data.quota_expires_at;
      formData.value.support_email_suffix = data.support_email_suffix.join(',');
      formData.value.host = data.host;
      formData.value.port = data.port;
      formData.value.user_name = data.user_name;
      formData.value.password = data.password;
      formData.value.from_name = data.from_name;
      formData.value.remark = data.remark;
      formData.value.status = data.status;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getSiteConfigDetail();

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.grant_quota = quota * 500000;
  };
</script>

<script lang="ts">
  export default {
    name: 'SiteConfigUpdate',
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
        width: 700px;
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
