<template>
  <div
    class="root"
    :style="{
      backgroundImage: `url(${appStore.getBgImg})`,
      backgroundSize: '100% 100%',
    }"
  >
    <div class="logo">
      <img alt="logo" :src="appStore.getLogo" />
      <div class="logo-text">{{ appStore.getTitle }}</div>
    </div>
    <div class="container">
      <div class="left-banner"></div>
      <div class="login-card change-password-card">
        <div class="title">{{ $t('login.change_password.title') }}</div>
        <div class="subtitle">{{ $t('login.change_password.subtitle') }}</div>
        <a-form
          :model="form"
          :rules="rules"
          layout="vertical"
          size="large"
          class="change-password-form"
          @submit="handleSubmit"
        >
          <a-form-item field="oldPassword" hide-label>
            <a-input-password
              v-model="form.oldPassword"
              :placeholder="$t('login.change_password.placeholder.old')"
              :max-length="32"
              allow-clear
            />
          </a-form-item>
          <a-form-item field="newPassword" hide-label>
            <a-input-password
              v-model="form.newPassword"
              :placeholder="$t('login.change_password.placeholder.new')"
              :max-length="32"
              allow-clear
            />
          </a-form-item>
          <a-form-item field="rePassword" hide-label>
            <a-input-password
              v-model="form.rePassword"
              :placeholder="$t('login.change_password.placeholder.confirm')"
              :max-length="32"
              allow-clear
            />
          </a-form-item>
          <a-button
            class="btn"
            type="primary"
            html-type="submit"
            :loading="loading"
          >
            {{ $t('login.change_password.button') }}
          </a-button>
          <div class="back">
            <a-link @click="handleBack">
              {{ $t('login.change_password.back') }}
            </a-link>
          </div>
        </a-form>
      </div>
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { FieldRule, Message, ValidatedError } from '@arco-design/web-vue';
  import { useAppStore, useUserStore } from '@/store';
  import { changePassword } from '@/api/user-center';
  import Footer from '@/components/footer/index.vue';

  const { t } = useI18n();
  const router = useRouter();
  const appStore = useAppStore();
  const userStore = useUserStore();

  const loading = ref(false);

  const form = reactive({
    oldPassword: '',
    newPassword: '',
    rePassword: '',
  });

  const rules = computed((): Record<string, FieldRule[]> => {
    return {
      oldPassword: [
        {
          required: true,
          message: t('login.change_password.error.required.old'),
        },
      ],
      newPassword: [
        {
          required: true,
          message: t('login.change_password.error.required.new'),
        },
        {
          match: /^(?=.*\d)(?=.*[a-z]).{6,32}$/,
          message: t('login.change_password.error.format.new'),
        },
        {
          validator: (value: string, callback: (arg?: string) => void) => {
            if (value === form.oldPassword) {
              callback(t('login.change_password.error.validator.new'));
            } else {
              callback();
            }
          },
        },
      ],
      rePassword: [
        {
          required: true,
          message: t('login.change_password.error.required.confirm'),
        },
        {
          validator: (value: string, callback: (arg?: string) => void) => {
            if (value !== form.newPassword) {
              callback(t('login.change_password.error.validator.confirm'));
            } else {
              callback();
            }
          },
        },
      ],
    };
  });

  const gotoLogin = async (notifyServer = false) => {
    const { role } = userStore;
    if (notifyServer) {
      await userStore.logout();
    } else {
      userStore.logoutCallBack();
    }
    if (role === 'reseller') {
      router.replace({ name: 'reseller' });
    } else if (role === 'admin') {
      router.replace({
        path: `/${localStorage.getItem('adminPath') || 'admin'}`,
      });
    } else {
      router.replace({ name: 'login' });
    }
  };

  const handleSubmit = ({
    errors,
  }: {
    errors: Record<string, ValidatedError> | undefined;
  }) => {
    if (loading.value) return;
    if (errors) return;

    loading.value = true;
    changePassword({
      old_password: form.oldPassword,
      new_password: form.newPassword,
    })
      .then(() => {
        Message.success(t('login.change_password.success'));
        gotoLogin();
      })
      .catch(() => {
        // 错误信息由拦截器统一提示
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const handleBack = () => {
    gotoLogin(true);
  };
</script>

<script lang="ts">
  export default {
    name: 'ChangePassword',
  };
</script>

<style lang="less" scoped>
  @import '@/assets/style/tokens.less';
  @import './style/login-page-shared.less';

  .change-password-card {
    .subtitle {
      color: @text-secondary-color;
      font-size: 13px;
      line-height: 20px;
      padding: 8px 5px 0;
    }
  }

  .change-password-form {
    margin-top: 24px;

    .btn {
      border-radius: 4px;
      box-shadow: 0 0 0 1px #05f, 0 2px 1px rgba(0, 0, 0, 0.15);
      font-size: 14px;
      font-weight: 500;
      height: 40px;
      width: 100%;
    }

    .back {
      margin-top: 16px;
      text-align: center;
    }
  }
</style>
