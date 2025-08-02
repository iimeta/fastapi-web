<template>
  <div id="vditor" class="vditor-preview"></div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';

  const vditor = ref();

  const props = defineProps<{
    modelValue: string;
  }>();

  const emit = defineEmits<(e: 'update:modelValue', value: string) => void>();

  const options = {
    width: '50vw',
    height: '50vh',
    placeholder: '请输入内容',
    cache: {
      enable: false,
    },
    focus: () => {
      emit('update:modelValue', vditor.value.getValue());
    },
    blur: () => {
      emit('update:modelValue', vditor.value.getValue());
    },
  };

  onMounted(() => {
    vditor.value = new Vditor('vditor', options);
  });

  watch(
    () => props.modelValue,
    (value) => {
      if (value !== vditor.value?.getValue()) {
        vditor.value?.destroy();
        vditor.value = new Vditor('vditor', options);
        vditor.value.setValue(value);
      }
    }
  );

  const userAttribute = [
    {
      label: '用户ID',
      value: '{{.user.user_id}}',
    },
    {
      label: '姓名',
      value: '{{.user.name}}',
    },
    {
      label: '邮箱',
      value: '{{.user.email}}',
    },
    {
      label: '手机号',
      value: '{{.user.phone}}',
    },
    {
      label: '剩余额度',
      value: '{{.user.quota}}',
    },
    {
      label: '已用额度',
      value: '{{.user.used_quota}}',
    },
    {
      label: '额度过期时间',
      value: '{{.user.quota_expires_at}}',
    },
    {
      label: '预警阈值',
      value: '{{.user.warning_threshold}}',
    },
    {
      label: '过期预警阈值',
      value: '{{.user.expire_warning_threshold}}',
    },
  ];

  const resellerAttribute = [
    {
      label: '用户ID',
      value: '{{.reseller.user_id}}',
    },
    {
      label: '姓名',
      value: '{{.reseller.name}}',
    },
    {
      label: '邮箱',
      value: '{{.reseller.email}}',
    },
    {
      label: '手机号',
      value: '{{.reseller.phone}}',
    },
    {
      label: '剩余额度',
      value: '{{.reseller.quota}}',
    },
    {
      label: '已用额度',
      value: '{{.reseller.used_quota}}',
    },
    {
      label: '额度过期时间',
      value: '{{.reseller.quota_expires_at}}',
    },
    {
      label: '预警阈值',
      value: '{{.reseller.warning_threshold}}',
    },
    {
      label: '过期预警阈值',
      value: '{{.reseller.expire_warning_threshold}}',
    },
  ];

  const siteAttribute = [
    {
      label: '域名',
      value: '{{.site.domain}}',
    },
    {
      label: '标题',
      value: '{{.site.title}}',
    },
    {
      label: 'Logo',
      value: '{{.site.logo}}',
    },
    {
      label: '版权信息',
      value: '{{.site.copyright}}',
    },
    {
      label: '跳转URL',
      value: '{{.site.jump_url}}',
    },
    {
      label: 'ICP备案',
      value: '{{.site.icp_beian}}',
    },
    {
      label: '公安备案',
      value: '{{.site.ga_beian}}',
    },
    {
      label: '注册欢迎语',
      value: '{{.site.register_welcome}}',
    },
  ];
</script>

<script lang="ts">
  export default {
    name: 'Vditor',
  };
</script>

<style scoped lang="less">
  .container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }
</style>
