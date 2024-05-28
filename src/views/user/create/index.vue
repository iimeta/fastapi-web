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
      <a-card class="general-card" :bordered="false">
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
            </a-form-item>
            <a-form-item field="remark" :label="$t('user.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('user.placeholder.remark')"
              />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'UserList',
                    })
                  "
                >
                  {{ $t('user.button.cancel') }}
                </a-button>
                <a-button type="primary" @click="submitForm">
                  {{ $t('user.button.submit') }}
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { submitUserCreate, UserCreate } from '@/api/admin_user';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const formRef = ref<FormInstance>();
  const formData = ref<UserCreate>({
    name: '',
    account: '',
    password: '',
    terminal: 'web',
    quota: ref(),
    remark: '',
  });

  const { loading, setLoading } = useLoading(false);
  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitUserCreate(formData.value).then(() => {
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
    name: 'UserCreate',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 10px 20px 10px;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 0;
    background-color: var(--color-bg-2);
    :deep(.arco-form) {
      .arco-form-item {
        &:last-child {
          margin-top: 20px;
        }
      }
    }
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
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 0;
    background-color: var(--color-bg-2);
  }
  .form {
    width: 500px;
  }
</style>
