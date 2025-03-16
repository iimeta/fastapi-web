<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-user />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.user') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.user.update') }}</a-breadcrumb-item>
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
              field="name"
              :label="$t('user.label.name')"
              :rules="[
                {
                  required: true,
                  message: $t('user.error.name.required'),
                },
                {
                  match: /^.{1,30}$/,
                  message: $t('user.error.name.pattern'),
                },
              ]"
            >
              <a-input
                v-model="formData.name"
                :placeholder="$t('user.placeholder.name')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="email"
              :label="$t('user.label.email')"
              :rules="[
                {
                  required: true,
                  message: $t('user.error.email.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.email"
                :placeholder="$t('user.placeholder.email')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="account"
              :label="$t('user.label.account')"
              :rules="[
                {
                  required: true,
                  message: $t('user.error.account.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.account"
                :placeholder="$t('user.placeholder.account')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="password"
              :label="$t('user.label.password')"
              :rules="[
                {
                  match: /^.{6,}$/,
                  message: $t('user.error.password.pattern'),
                },
              ]"
            >
              <a-input
                v-model="formData.password"
                :placeholder="$t('user.update.placeholder.password')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="quota_expires_at"
              :label="$t('user.label.quota_expires_at')"
            >
              <a-date-picker
                v-model="formData.quota_expires_at"
                :placeholder="$t('user.placeholder.quota_expires_at')"
                :time-picker-props="{ defaultValue: '23:59:59' }"
                :disabled-date="(current) => dayjs(current).isBefore(dayjs())"
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
            <a-form-item field="remark" :label="$t('user.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('user.placeholder.remark')"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'UserList',
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
  import dayjs from 'dayjs';
  import {
    submitUserUpdate,
    UserUpdate,
    UserDetailParams,
    queryUserDetail,
  } from '@/api/admin_user';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { useRouter, useRoute } from 'vue-router';

  const { proxy } = getCurrentInstance() as any;

  const { loading, setLoading } = useLoading(false);
  const route = useRoute();
  const router = useRouter();
  const formRef = ref<FormInstance>();
  const formData = ref<UserUpdate>({
    id: '',
    name: '',
    email: '',
    account: '',
    password: '',
    terminal: 'web',
    quota_expires_at: '',
    remark: '',
    status: 1,
  });

  const getUserDetail = async (
    params: UserDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryUserDetail(params);
      formData.value.id = data.id;
      formData.value.name = data.name;
      formData.value.email = data.email;
      formData.value.account = data.account;
      formData.value.quota_expires_at = data.quota_expires_at;
      formData.value.remark = data.remark;
      formData.value.status = data.status;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getUserDetail();

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitUserUpdate(formData.value).then(() => {
          proxy.$message.success('更新成功');
          router.push({
            name: 'UserList',
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
    name: 'UserUpdate',
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
