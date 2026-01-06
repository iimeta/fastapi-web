<template>
  <a-list-item-meta>
    <template #avatar>
      <a-typography-paragraph>
        {{ $t('userCenter.securitySettings.email.label') }}
      </a-typography-paragraph>
    </template>
    <template #description>
      <div class="tip">
        {{ $t('userCenter.securitySettings.email.tip') }}
      </div>
      <div class="content">
        <a-typography-paragraph v-if="userStore.email">
          {{ userStore.email }}
        </a-typography-paragraph>
        <a-typography-paragraph v-else class="tip">
          {{ $t('userCenter.securitySettings.email.content') }}
        </a-typography-paragraph>
      </div>
      <div class="operation">
        <a-link
          :title="$t('userCenter.securitySettings.button.update')"
          @click="toUpdate"
        >
          {{ $t('userCenter.securitySettings.button.update') }}
        </a-link>
      </div>
    </template>
  </a-list-item-meta>

  <a-modal
    :title="$t('userCenter.securitySettings.updateEmail.modal.title')"
    :visible="visible"
    :mask-closable="false"
    :esc-to-close="false"
    @ok="handleUpdate"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="form" :rules="rules" size="large">
      <a-form-item
        :label="$t('userCenter.securitySettings.updateEmail.form.label.email')"
        field="email"
      >
        <a-input
          v-model="form.email"
          :placeholder="
            $t('userCenter.securitySettings.updateEmail.form.placeholder.email')
          "
          allow-clear
        />
      </a-form-item>
      <a-form-item
        :label="
          $t('userCenter.securitySettings.updateEmail.form.label.captcha')
        "
        field="code"
      >
        <a-input
          v-model="form.code"
          :placeholder="
            $t('userCenter.securitySettings.form.placeholder.captcha')
          "
          :max-length="6"
          allow-clear
          style="width: 80%"
        />
        <a-button
          :loading="captchaLoading"
          type="primary"
          :disabled="captchaDisable"
          class="captcha-btn"
          @click="handleSendCaptcha"
        >
          {{ captchaBtnName }}
        </a-button>
      </a-form-item>
      <a-form-item
        :label="
          $t(
            'userCenter.securitySettings.updateEmail.form.label.currentPassword'
          )
        "
        field="password"
      >
        <a-input-password
          v-model="form.password"
          :placeholder="
            $t(
              'userCenter.securitySettings.updateEmail.form.placeholder.currentPassword'
            )
          "
          :max-length="32"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import { getCaptcha } from '@/api/auth';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  import { changeEmail, ChangeEmailData } from '@/api/user-center';

  const { t } = useI18n();
  const userStore = useUserStore();
  const formRef = ref();
  const captchaTime = ref(60);
  const captchaTimer = ref();
  const captchaLoading = ref(false);
  const captchaDisable = ref(false);
  const visible = ref(false);
  const captchaBtnNameKey = ref('userCenter.securitySettings.captcha.get');
  const captchaBtnName = computed(() => t(captchaBtnNameKey.value));

  // 表单数据
  const form = reactive<ChangeEmailData>({
    email: '',
    code: '',
    password: '',
  });
  // 表单验证规则
  const rules = computed((): Record<string, FieldRule[]> => {
    return {
      newEmail: [
        {
          required: true,
          message: t(
            'userCenter.securitySettings.updateEmail.form.error.required.newEmail'
          ),
        },
        {
          type: 'email',
          message: t(
            'userCenter.securitySettings.updateEmail.form.error.match.newEmail'
          ),
        },
      ],
      captcha: [
        {
          required: true,
          message: t('userCenter.securitySettings.form.error.required.captcha'),
        },
      ],
      currentPassword: [
        {
          required: true,
          message: t(
            'userCenter.securitySettings.updateEmail.form.error.required.currentPassword'
          ),
        },
      ],
    };
  });

  /**
   * 重置验证码
   */
  const resetCaptcha = () => {
    window.clearInterval(captchaTimer.value);
    captchaTime.value = 60;
    captchaBtnNameKey.value = 'userCenter.securitySettings.captcha.get';
    captchaDisable.value = false;
  };

  /**
   * 发送验证码
   */
  const handleSendCaptcha = () => {
    if (captchaLoading.value) return;
    formRef.value.validateField('newEmail', (valid: any) => {
      if (!valid) {
        captchaLoading.value = true;
        captchaBtnNameKey.value = 'userCenter.securitySettings.captcha.ing';
        getCaptcha({
          email: form.email,
          action: 'change_email',
          channel: userStore.role,
          domain: window.location.hostname,
        })
          .then((res) => {
            captchaLoading.value = false;
            captchaDisable.value = true;
            captchaBtnNameKey.value = `${t(
              'userCenter.securitySettings.captcha.get'
            )}(${(captchaTime.value -= 1)}s)`;
            captchaTimer.value = window.setInterval(() => {
              captchaTime.value -= 1;
              captchaBtnNameKey.value = `${t(
                'userCenter.securitySettings.captcha.get'
              )}(${captchaTime.value}s)`;
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
   * 取消
   */
  const handleCancel = () => {
    visible.value = false;
    formRef.value.resetFields();
    resetCaptcha();
  };

  /**
   * 修改
   */
  const handleUpdate = () => {
    formRef.value.validate((valid: any) => {
      if (!valid) {
        changeEmail({
          email: form.email,
          code: form.code,
          password: form.password,
        }).then(() => {
          handleCancel();
          userStore.info();
          Message.success(t('userCenter.basicInfo.form.save.success'));
        });
      }
    });
  };

  /**
   * 打开修改对话框
   */
  const toUpdate = () => {
    visible.value = true;
  };
</script>

<style scoped lang="less">
  .captcha-btn {
    margin-left: 5px;
  }
</style>
