<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-user />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.user') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.user.create') }}</a-breadcrumb-item>
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
                  required: true,
                  message: $t('user.error.password.required'),
                },
                {
                  match: /^.{6,}$/,
                  message: $t('user.error.password.pattern'),
                },
              ]"
            >
              <a-input
                v-model="formData.password"
                :placeholder="$t('user.placeholder.password')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="quota"
              :label="$t('user.label.quota')"
              :rules="[
                {
                  required: true,
                  message: $t('user.error.quota.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.quota"
                :placeholder="$t('user.placeholder.quota')"
                :precision="0"
                :min="-9999999999999"
                :max="9999999999999"
              />
              <div style="margin-left: 10px">
                ${{ formData.quota ? quotaConv(formData.quota) : '0' }}</div
              >
            </a-form-item>
            <a-form-item>
              <a-radio-group
                type="button"
                @change="handleQuotaQuickChange as any"
              >
                <a-radio :value="1"> $1 </a-radio>
                <a-radio :value="2"> $2 </a-radio>
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
              field="quota_expires_at"
              :label="$t('user.label.quota_expires_at')"
            >
              <a-date-picker
                v-model="formData.quota_expires_at"
                :placeholder="$t('user.placeholder.quota_expires_at')"
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
            <!-- <a-form-item field="rps" :label="$t('user.label.rps')">
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
            </a-form-item> -->
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
  import dayjs from 'dayjs';
  import { quotaConv } from '@/utils/common';
  import { submitUserCreate, UserCreate } from '@/api/admin_user';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { useRouter } from 'vue-router';

  const { proxy } = getCurrentInstance() as any;

  const router = useRouter();
  const formRef = ref<FormInstance>();
  const formData = ref<UserCreate>({
    name: '',
    account: '',
    password: '',
    terminal: 'web',
    quota: ref(),
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
  });

  const { loading, setLoading } = useLoading(false);
  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitUserCreate(formData.value).then(() => {
          proxy.$message.success('新建成功');
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
  const handleQuotaQuickChange = (quota: number) => {
    formData.value.quota = quota * 500000;
  };
</script>

<script lang="ts">
  export default {
    name: 'UserCreate',
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
