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
            <a-form-item field="rps" :label="$t('user.label.rps')">
              <a-input-number
                v-model="formData.rps"
                :placeholder="$t('user.placeholder.rps')"
                :precision="0"
                :min="0"
                :max="9999999999999"
              />
            </a-form-item>
            <a-form-item field="rpm" :label="$t('user.label.rpm')">
              <a-input-number
                v-model="formData.rpm"
                :placeholder="$t('user.placeholder.rpm')"
                :precision="0"
                :min="0"
                :max="9999999999999"
              />
            </a-form-item>
            <a-form-item field="rpd" :label="$t('user.label.rpd')">
              <a-input-number
                v-model="formData.rpd"
                :placeholder="$t('user.placeholder.rpd')"
                :precision="0"
                :min="0"
                :max="9999999999999"
              />
            </a-form-item>
            <a-form-item field="tps" :label="$t('user.label.tps')">
              <a-input-number
                v-model="formData.tps"
                :placeholder="$t('user.placeholder.tps')"
                :precision="0"
                :min="0"
                :max="9999999999999"
              />
            </a-form-item>
            <a-form-item field="tpm" :label="$t('user.label.tpm')">
              <a-input-number
                v-model="formData.tpm"
                :placeholder="$t('user.placeholder.tpm')"
                :precision="0"
                :min="0"
                :max="9999999999999"
              />
            </a-form-item>
            <a-form-item field="tpd" :label="$t('user.label.tpd')">
              <a-input-number
                v-model="formData.tpd"
                :placeholder="$t('user.placeholder.tpd')"
                :precision="0"
                :min="0"
                :max="9999999999999"
              />
            </a-form-item>
            <a-form-item field="ips" :label="$t('user.label.ips')">
              <a-input-number
                v-model="formData.ips"
                :placeholder="$t('user.placeholder.ips')"
                :precision="0"
                :min="0"
                :max="9999999999999"
              />
            </a-form-item>
            <a-form-item field="ipm" :label="$t('user.label.ipm')">
              <a-input-number
                v-model="formData.ipm"
                :placeholder="$t('user.placeholder.ipm')"
                :precision="0"
                :min="0"
                :max="9999999999999"
              />
            </a-form-item>
            <a-form-item field="ipd" :label="$t('user.label.ipd')">
              <a-input-number
                v-model="formData.ipd"
                :placeholder="$t('user.placeholder.ipd')"
                :precision="0"
                :min="0"
                :max="9999999999999"
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
                  {{ $t('form.button.cancel') }}
                </a-button>
                <a-button type="primary" @click="submitForm">
                  {{ $t('form.button.submit') }}
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
    account: '',
    password: '',
    terminal: 'web',
    quota_expires_at: '',
    rps: ref(),
    rpm: ref(),
    rpd: ref(),
    tps: ref(),
    tpm: ref(),
    tpd: ref(),
    ips: ref(),
    ipm: ref(),
    ipd: ref(),
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
      formData.value.account = data.account;
      formData.value.quota_expires_at = data.quota_expires_at;
      formData.value.rps = data.rps;
      formData.value.rpm = data.rpm;
      formData.value.rpd = data.rpd;
      formData.value.tps = data.tps;
      formData.value.tpm = data.tpm;
      formData.value.tpd = data.tpd;
      formData.value.ips = data.ips;
      formData.value.ipm = data.ipm;
      formData.value.ipd = data.ipd;
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
