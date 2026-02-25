<template>
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    layout="vertical"
    size="large"
    class="login-form"
    @submit="handleLogin"
  >
    <a-form-item field="username" hide-label>
      <a-input
        v-model="form.username"
        :placeholder="$t('login.admin.account.placeholder.username')"
        allow-clear
      />
    </a-form-item>
    <a-form-item field="password" hide-label>
      <a-input-password
        v-model="form.password"
        :placeholder="$t('login.account.placeholder.password')"
        allow-clear
      />
    </a-form-item>
    <div class="forget-password">
      <span class="action-link" @click="$emit('toggleForget')">{{
        $t('login.form.forget')
      }}</span>
    </div>
    <a-button class="btn" :loading="loading" type="primary" html-type="submit"
      >{{ $t('login.button') }}
    </a-button>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, toRefs, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  import { ValidatedError, Message } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';

  const { t } = useI18n();
  const router = useRouter();
  const userStore = useUserStore();
  const loading = ref(false);

  defineEmits(['toggleForget']);

  const data = reactive({
    form: {
      username: '',
      password: '',
      captcha: '',
      uuid: '',
    },
    rules: {
      username: [
        {
          required: true,
          message: t('login.admin.account.error.required.username'),
        },
      ],
      password: [
        { required: true, message: t('login.account.error.required.password') },
      ],
      captcha: [
        { required: true, message: t('login.account.error.required.captcha') },
      ],
    },
  });

  const { form, rules } = toRefs(data);

  /**
   * 登录
   *
   * @param errors 表单验证错误
   * @param values 表单数据
   */
  const handleLogin = ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      loading.value = true;
      userStore
        .login({
          account: values.username,
          password: values.password,
          terminal: 'web',
          channel: 'admin',
          method: 'account',
          domain: window.location.hostname,
          path: window.location.pathname,
        })
        .then(() => {
          window.localStorage.setItem('userRole', 'admin');
          const { redirect, ...othersQuery } = router.currentRoute.value.query;
          router.push({
            name: (redirect as string) || 'Workplace',
            query: {
              ...othersQuery,
            },
          });
          Message.success(t('login.success'));
        })
        .catch(() => {})
        .finally(() => {
          loading.value = false;
        });
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'AdminAccountLogin',
  };
</script>

<style lang="less" scoped>
  .login-form {
    box-sizing: border-box;
    padding: 0 5px;
    margin-top: 16px;
    .arco-input-wrapper,
    :deep(.arco-select-view-single) {
      background-color: var(--color-bg-white);
      border: 1px solid var(--color-border-3);
      height: 40px;
      border-radius: 4px;
      font-size: 13px;
    }
    .arco-input-wrapper.arco-input-error {
      background-color: var(--color-danger-light-1);
      border-color: var(--color-danger-light-4);
    }

    .btn {
      border-radius: 4px;
      box-shadow: 0 0 0 1px #05f, 0 2px 1px rgba(0, 0, 0, 0.15);
      font-size: 14px;
      font-weight: 500;
      height: 40px;
      line-height: 22px;
      margin: 21px 0 11px;
      width: 100%;
    }

    .forget-password {
      display: flex;
      justify-content: flex-end;
      .action-link {
        color: rgb(var(--primary-6));
        cursor: pointer;
        font-size: 14px;
      }
      .action-link:hover {
        color: rgb(var(--primary-5));
      }
    }
  }
</style>
