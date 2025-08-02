<template>
  <div class="main">
    <div id="vditor" class="content"></div>
    <div class="attribute">
      <a-descriptions title="用户属性" :column="{ xs: 1, md: 2, lg: 3 }">
        <a-descriptions-item
          v-for="(item, index) of userAttribute"
          :key="index"
          :label="item.label"
        >
          <a-tag>{{ item.value }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>

      <a-descriptions title="代理商属性" :column="{ xs: 1, md: 2, lg: 3 }">
        <a-descriptions-item
          v-for="(item, index) of resellerAttribute"
          :key="index"
          :label="item.label"
        >
          <a-tag>{{ item.value }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>

      <a-descriptions title="站点属性" :column="{ xs: 1, md: 3, lg: 4 }">
        <a-descriptions-item
          v-for="(item, index) of siteAttribute"
          :key="index"
          :label="item.label"
        >
          <a-tag>{{ item.value }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onUnmounted } from 'vue';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';

  const props = defineProps<{
    modelValue: string;
  }>();

  const emit = defineEmits<(e: 'update:modelValue', value: string) => void>();

  const vditor = ref<Vditor | null>(null);

  const options = {
    mode: 'wysiwyg' as 'wysiwyg' | 'sv' | 'ir',
    height: '60vh',
    placeholder: '请输入内容',
    cache: {
      enable: false,
    },
    toolbar: [
      'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      'link',
      '|',
      'list',
      'ordered-list',
      'check',
      'outdent',
      'indent',
      '|',
      'quote',
      'line',
      'code',
      'inline-code',
      'insert-before',
      'insert-after',
      '|',
      'table',
      '|',
      'undo',
      'redo',
      '|',
      'fullscreen',
      'edit-mode',
      {
        name: 'more',
        toolbar: [
          'both',
          'code-theme',
          'content-theme',
          'export',
          'outline',
          'preview',
          'devtools',
        ],
      },
    ],
    input: () => {
      if (vditor.value) {
        emit('update:modelValue', vditor.value.getValue());
      }
    },
    after: () => {
      if (vditor.value) {
        vditor.value.setValue(props.modelValue);
      }
    },
  };

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

  onMounted(() => {
    vditor.value = new Vditor('vditor', options);
  });

  onUnmounted(() => {
    vditor.value?.destroy();
  });

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
  .main {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .content {
    border: 1px solid rgb(var(--gray-2));
  }

  .attribute {
    padding: 1rem 0px;
  }
</style>
