<template>
  <div class="sub-title">{{ $t('login.form.forget.title') }}</div>
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    layout="vertical"
    size="large"
    class="login-form"
    @submit="handleRegister"
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
        :placeholder="$t('login.email.placeholder.captcha')"
        :max-length="6"
        allow-clear
        style="flex: 1 1"
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
    <a-form-item field="password" hide-label>
      <a-input-password
        v-model="form.password"
        :placeholder="$t('login.account.placeholder.password')"
        allow-clear
      />
    </a-form-item>
    <a-button class="btn" :loading="loading" type="primary" html-type="submit"
      >{{ $t('forget.button') }}
    </a-button>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, toRefs, reactive, computed, getCurrentInstance } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { ValidatedError, Message } from '@arco-design/web-vue';
  import { getCaptcha, forget } from '@/api/auth';

  const { proxy } = getCurrentInstance() as any;
  const { t } = useI18n();
  const router = useRouter();
  const loading = ref(false);
  const captchaLoading = ref(false);
  const captchaDisable = ref(false);
  const captchaTime = ref(60);
  const captchaTimer = ref();
  const captchaBtnNameKey = ref('login.captcha.get');
  const captchaBtnName = computed(() => t(captchaBtnNameKey.value));
  const data = reactive({
    form: {
      email: '',
      password: '',
      captcha: '',
    },
    rules: {
      email: [
        { required: true, message: t('login.email.error.required.email') },
      ],
      password: [
        { required: true, message: t('login.email.error.required.password') },
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
          action: 'forget_password',
          channel: 'reseller',
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
   * 找回密码
   *
   * @param errors 表单验证错误
   * @param values 表单数据
   */
  const handleRegister = ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      loading.value = true;
      forget({
        account: values.email,
        password: values.password,
        terminal: 'web',
        channel: 'reseller',
        code: values.captcha,
        domain: window.location.hostname,
        path: window.location.pathname,
      })
        .then(() => {
          Message.success(t('forget.success'));
          router.go(0);
        })
        .catch(() => {
          form.value.captcha = '';
        })
        .finally(() => {
          loading.value = false;
        });
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'ResellerForget',
  };
</script>

<style lang="less" scoped>
  .login-form {
    box-sizing: border-box;
    padding: 0 5px;
    margin-top: 24px;
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
  }
  .sub-title {
    color: var(--color-text-2);
    font-size: 18px;
    margin: 20px 0px 0px 10px;
  }
</style>
