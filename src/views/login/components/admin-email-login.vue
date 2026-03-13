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
    <a-form-item field="email" hide-label>
      <a-input
        v-model="form.email"
        :placeholder="$t('login.email.placeholder.email')"
        allow-clear
      />
    </a-form-item>
    <a-form-item field="captcha" hide-label>
      <a-input
        v-model="form.captcha"
        class="admin-email-login-captcha-input"
        :placeholder="$t('login.email.placeholder.captcha')"
        :max-length="6"
        allow-clear
      />
      <a-button
        class="captcha-btn"
        :loading="captchaLoading"
        :disabled="captchaDisable"
        @click="handleSendCaptcha"
      >
        {{ captchaBtnName }}
      </a-button>
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
  import { ref, toRefs, reactive, computed, getCurrentInstance } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { ValidatedError, Message } from '@arco-design/web-vue';
  import { useUserStore } from '@/store';
  import { getCaptcha } from '@/api/auth';
  import { querySysConfig, SysConfigDetail } from '@/api/sys_config';

  const { proxy } = getCurrentInstance() as any;
  const { t } = useI18n();
  const router = useRouter();
  const userStore = useUserStore();
  const loading = ref(false);
  const captchaLoading = ref(false);
  const captchaDisable = ref(false);

  defineEmits(['toggleForget']);

  const captchaTime = ref(60);
  const captchaTimer = ref();
  const captchaBtnNameKey = ref('login.captcha.get');
  const captchaBtnName = computed(() => t(captchaBtnNameKey.value));
  const data = reactive({
    form: {
      email: '',
      captcha: '',
      terminal: 'web',
      channel: 'login',
    },
    rules: {
      email: [
        { required: true, message: t('login.email.error.required.email') },
      ],
      captcha: [
        { required: true, message: t('login.email.error.required.captcha') },
      ],
    },
  });
  const { form, rules } = toRefs(data);

  /**
   * 重置验证码
   */
  const resetCaptcha = () => {
    window.clearInterval(captchaTimer.value);
    captchaTime.value = 60;
    captchaBtnNameKey.value = 'login.captcha.get';
    captchaDisable.value = false;
  };

  /**
   * 发送验证码
   */
  const handleSendCaptcha = () => {
    if (captchaLoading.value) return;
    proxy.$refs.formRef.validateField('email', (valid: any) => {
      if (!valid) {
        captchaLoading.value = true;
        captchaBtnNameKey.value = 'login.captcha.ing';
        getCaptcha({
          email: form.value.email,
          action: 'login',
          channel: 'admin',
          domain: window.location.hostname,
          path: window.location.pathname,
        })
          .then(() => {
            captchaLoading.value = false;
            captchaDisable.value = true;
            captchaBtnNameKey.value = `${t(
              'login.captcha.get'
            )}(${(captchaTime.value -= 1)}s)`;
            captchaTimer.value = window.setInterval(() => {
              captchaTime.value -= 1;
              captchaBtnNameKey.value = `${t('login.captcha.get')}(${
                captchaTime.value
              }s)`;
              if (captchaTime.value <= 0) {
                resetCaptcha();
              }
            }, 1000);
          })
          .catch(() => {
            resetCaptcha();
            captchaLoading.value = false;
          });
      }
    });
  };

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
          account: values.email,
          code: values.captcha,
          terminal: 'web',
          channel: 'admin',
          method: 'code',
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
        .catch(() => {
          form.value.captcha = '';
        })
        .finally(() => {
          loading.value = false;
        });
    }
  };

  const sysConfig = ref<SysConfigDetail>({
    user_login_register: { email_register: true },
  } as SysConfigDetail);
  querySysConfig({
    domain: window.location.hostname,
    path: window.location.pathname,
  }).then((res) => {
    sysConfig.value = res.data;
  });
</script>

<script lang="ts">
  export default {
    name: 'AdminEmailLogin',
  };
</script>

<style lang="less" scoped>
  @import '../style/login-form-shared.less';

  .login-form {
    margin-top: 16px;

    .admin-email-login-captcha-input {
      flex: 1 1;
    }

    .captcha-btn {
      height: 40px;
      margin-left: 12px;
      min-width: 98px;
      border-radius: 4px;
    }

    .arco-btn-secondary:not(.arco-btn-disabled) {
      background-color: #f6f8fa;
      border: 1px solid #dde2e9;
      color: #41464f;
    }
    .arco-btn-secondary:not(.arco-btn-disabled):hover {
      background-color: transparent;
      border: 1px solid rgb(var(--primary-6));
    }

    .btn {
      border-radius: 4px;
      box-shadow: 0 0 0 1px #05f, 0 2px 1px rgba(0, 0, 0, 0.15);
      font-size: 14px;
      font-weight: 500;
      height: 40px;
      line-height: 22px;
      margin: 20px 0 12px;
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
  .login-email-title {
    color: var(--color-text-3);
    font-size: 14px;
    padding-left: 5px;
  }
</style>
