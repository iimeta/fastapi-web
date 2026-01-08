<template>
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
    size="large"
    class="form"
  >
    <a-form-item :label="$t('user.center.label.name')" field="name">
      <a-input
        v-model="form.name"
        :placeholder="$t('user.center.form.placeholder.name')"
        :max-length="30"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button :loading="loading" type="primary" @click="handleSave">
          {{ $t('button.save') }}
        </a-button>
        <a-button @click="handleReset">
          {{ $t('button.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, toRefs } from 'vue';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import { UpdateInfoData, updateInfo } from '@/api/user-center';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';

  const { t } = useI18n();
  const formRef = ref();
  const userStore = useUserStore();
  const loading = ref(false);

  const data = reactive({
    // 表单数据
    form: {
      name: userStore.name,
    } as UpdateInfoData,
    // 表单验证规则
    rules: computed((): Record<string, FieldRule[]> => {
      return {
        name: [
          {
            required: true,
            message: t('user.center.form.placeholder.name'),
          },
        ],
      };
    }),
  });
  const { form, rules } = toRefs(data);

  /**
   * 保存
   */
  const handleSave = () => {
    if (loading.value) return;
    formRef.value.validate((valid: any) => {
      if (!valid) {
        loading.value = true;
        updateInfo({
          name: form.value.name,
        })
          .then(() => {
            userStore.info();
            Message.success(t('success.save'));
          })
          .finally(() => {
            loading.value = false;
          });
      }
    });
  };

  /**
   * 重置
   */
  const handleReset = () => {
    formRef.value.resetFields();
  };
</script>

<script lang="ts">
  export default {
    name: 'BasicInformation',
  };
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
  }
</style>
