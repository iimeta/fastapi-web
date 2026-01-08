<template>
  <a-list-item-meta>
    <template #avatar>
      <a-typography-paragraph>
        {{ $t('user.center.label.password') }}
      </a-typography-paragraph>
    </template>
    <template #description>
      <div class="tip">
        {{ $t('user.center.tip.password') }}
      </div>
      <div class="content">
        <a-typography-paragraph>
          {{ $t('user.center.content.has_been_set') }}
        </a-typography-paragraph>
      </div>
      <div class="operation">
        <a-link :title="$t('button.update')" @click="toUpdate">
          {{ $t('button.update') }}
        </a-link>
      </div>
    </template>
  </a-list-item-meta>

  <a-modal
    :title="$t('user.center.title.update_pwd')"
    :visible="visible"
    :mask-closable="false"
    :esc-to-close="false"
    @ok="handleUpdate"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="form" :rules="rules" size="large">
      <a-form-item
        :label="$t('user.center.label.password')"
        field="oldPassword"
      >
        <a-input-password
          v-model="form.oldPassword"
          :placeholder="$t('user.center.form.placeholder.current_password')"
          :max-length="32"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        :label="$t('user.center.form.label.new_password')"
        field="newPassword"
      >
        <a-input-password
          v-model="form.newPassword"
          :placeholder="$t('user.center.form.placeholder.new_password')"
          :max-length="32"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        :label="$t('user.center.form.label.re_password')"
        field="rePassword"
      >
        <a-input-password
          v-model="form.rePassword"
          :placeholder="$t('user.center.form.placeholder.re_password')"
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
  import { changePassword } from '@/api/user-center';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';

  const { t } = useI18n();
  const userStore = useUserStore();
  const formRef = ref();
  const visible = ref(false);

  // 表单数据
  const form = reactive({
    oldPassword: '',
    newPassword: '',
    rePassword: '',
  });
  // 表单验证规则
  const rules = computed((): Record<string, FieldRule[]> => {
    return {
      oldPassword: [
        {
          required: true,
          message: t('user.center.form.placeholder.current_password'),
        },
      ],
      newPassword: [
        {
          required: true,
          message: t('user.center.form.error.required.new_password'),
        },
        {
          match: /^(?=.*\d)(?=.*[a-z]).{6,32}$/,
          message: t('user.center.form.placeholder.new_password'),
        },
        {
          validator: (value: string, callback: (arg?: string) => void) => {
            if (value === form.oldPassword) {
              callback(t('user.center.form.error.validator.new_password'));
            } else {
              callback();
            }
          },
        },
      ],
      rePassword: [
        {
          required: true,
          message: t('user.center.form.placeholder.re_password'),
        },
        {
          validator: (value: string, callback: (arg?: string) => void) => {
            if (value !== form.newPassword) {
              callback(t('user.center.form.error.validator.re_password'));
            } else {
              callback();
            }
          },
        },
      ],
    };
  });

  /**
   * 取消
   */
  const handleCancel = () => {
    visible.value = false;
    formRef.value.resetFields();
  };

  /**
   * 修改
   */
  const handleUpdate = () => {
    formRef.value.validate((valid: any) => {
      if (!valid) {
        changePassword({
          old_password: form.oldPassword,
          new_password: form.newPassword,
        }).then(() => {
          userStore.info();
          handleCancel();
          Message.success(t('success.update'));
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

<script lang="ts">
  export default {
    name: 'UpdatePwd',
  };
</script>

<style scoped lang="less"></style>
