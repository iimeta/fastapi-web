<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-notification />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.notice') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{
        $t(
          route.query.action
            ? 'menu.notice.template.create'
            : 'menu.notice.template.update'
        )
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
                  message: $t('notice.template.error.name.required'),
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
                  message: $t('notice.template.error.scenes.required'),
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
                  value="login"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.login') }}
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
                  value="forget_password"
                  class="scenes"
                >
                  {{ $t('notice.template.dict.scenes.forget_password') }}
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
              </a-space>
            </a-form-item>
            <a-form-item
              field="channels"
              :label="$t('notice.template.label.channels')"
              :rules="[
                {
                  required: true,
                  message: $t('notice.template.error.channels.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-checkbox
                  v-model="formData.channels"
                  value="web"
                  :default-checked="true"
                >
                  {{ $t('notice.template.dict.channels.web') }}
                </a-checkbox>
                <a-checkbox v-model="formData.channels" value="email">
                  {{ $t('notice.template.dict.channels.email') }}
                </a-checkbox>
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="formData.channels.includes('web')"
              field="is_popup"
              :label="$t('notice.template.label.is_popup')"
            >
              <a-switch v-model="formData.is_popup" />
            </a-form-item>
            <a-form-item
              field="is_public"
              :label="$t('notice.template.label.is_public')"
            >
              <a-switch v-model="formData.is_public" />
            </a-form-item>
            <a-form-item
              field="title"
              :label="$t('notice.template.label.title')"
              :rules="[
                {
                  required: true,
                  message: $t('notice.template.error.title.required'),
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
                  message: $t('notice.template.error.content.required'),
                },
              ]"
            >
              <AiEditor
                v-model="formData.content"
                style="flex: 1; height: 1024px"
              />
            </a-form-item>
            <a-form-item
              field="remark"
              :label="$t('notice.template.label.remark')"
            >
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('notice.template.placeholder.remark')"
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
  import { ref, getCurrentInstance } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import dayjs from 'dayjs';
  import {
    submitNoticeTemplateCreate,
    submitNoticeTemplateUpdate,
    NoticeTemplate,
    queryNoticeTemplateDetail,
    NoticeTemplateDetailParams,
  } from '@/api/notice_template';
  import { UserList, queryUserList } from '@/api/admin_user';
  import { ResellerList, queryResellerList } from '@/api/admin_reseller';
  import AiEditor from '@/views/common/aieditor.vue';

  const { proxy } = getCurrentInstance() as any;
  const { loading, setLoading } = useLoading(false);

  const router = useRouter();
  const route = useRoute();
  const formRef = ref<FormInstance>();
  const formData = ref<NoticeTemplate>({
    id: '',
    name: '',
    scenes: [],
    title: '',
    content: '',
    channels: [],
    is_popup: false,
    is_public: true,
    remark: '',
    status: 1,
  });

  const users = ref<UserList[]>([]);

  const getUserList = async () => {
    setLoading(true);
    try {
      const { data } = await queryUserList();
      users.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getUserList();

  const resellers = ref<ResellerList[]>([]);

  const getResellerList = async () => {
    setLoading(true);
    try {
      const { data } = await queryResellerList();
      resellers.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getResellerList();

  const getNoticeTemplateDetail = async (
    params: NoticeTemplateDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryNoticeTemplateDetail(params);
      formData.value.id = data.id;
      formData.value.name = data.name;
      formData.value.scenes = data.scenes;
      formData.value.title = data.title;
      formData.value.content = data.content;
      formData.value.channels = data.channels;
      formData.value.is_popup = data.is_popup;
      formData.value.is_public = data.is_public;
      formData.value.remark = data.remark;
      formData.value.status = data.status;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getNoticeTemplateDetail();

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        if (route.query.action) {
          await submitNoticeTemplateCreate(formData.value).then(() => {
            proxy.$message.success('新增成功');
            router.push({
              name: 'NoticeTemplateList',
            });
          });
        } else {
          await submitNoticeTemplateUpdate(formData.value).then(() => {
            proxy.$message.success('更新成功');
            router.push({
              name: 'NoticeTemplateList',
            });
          });
        }
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
    name: 'NoticeTemplateUpdate',
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
