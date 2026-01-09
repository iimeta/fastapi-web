<template>
  <div class="main">
    <div id="vditor" class="content"></div>
    <div class="attribute">
      <a-descriptions
        :title="$t('common.variable.user')"
        :column="{ xs: 1, md: 2, lg: 3 }"
      >
        <a-descriptions-item
          v-for="(item, index) of userAttribute"
          :key="index"
          :label="item.label"
        >
          <a-tag>{{ item.value }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>

      <a-descriptions
        :title="$t('common.variable.reseller')"
        :column="{ xs: 1, md: 2, lg: 3 }"
      >
        <a-descriptions-item
          v-for="(item, index) of resellerAttribute"
          :key="index"
          :label="item.label"
        >
          <a-tag>{{ item.value }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>

      <a-descriptions
        :title="$t('common.variable.site')"
        :column="{ xs: 1, md: 3, lg: 4 }"
      >
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
  import { useI18n } from 'vue-i18n';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';

  const { t } = useI18n();

  const getSystemLocale = () => {
    const systemLang = navigator.language || 'zh-CN';

    // 精确匹配优先
    const exactMatch: Record<string, string> = {
      'zh-CN': 'zh_CN',
      'zh-TW': 'zh_TW',
      'zh-HK': 'zh_TW',
      'zh-MO': 'zh_TW',
      'zh-SG': 'zh_CN',
      'en-US': 'en_US',
      'en-GB': 'en_US',
      'en-CA': 'en_US',
      'en-AU': 'en_US',
    };

    // 语言代码匹配（去掉地区后缀）
    const langCode = systemLang.split('-')[0];
    const languageMatch: Record<string, string> = {
      zh: 'zh_CN',
      en: 'en_US',
    };

    return exactMatch[systemLang] || languageMatch[langCode] || 'zh_CN';
  };

  let defaultLocale = localStorage.getItem('arco-locale') || getSystemLocale();
  defaultLocale = defaultLocale.replace('-', '_');

  const props = defineProps<{
    modelValue: string;
  }>();

  const emit = defineEmits<(e: 'update:modelValue', value: string) => void>();

  const vditor = ref<Vditor | null>(null);

  const options = {
    mode: 'wysiwyg' as 'wysiwyg' | 'sv' | 'ir',
    height: '60vh',
    placeholder: t('notice.placeholder.content'),
    cache: {
      enable: false,
    },
    cdn: 'https://vditor.fastapi.pro/vditor@3.11.1',
    lang: defaultLocale as any,
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
      if (vditor.value && props.modelValue) {
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
      label: t('common.user_id'),
      value: '{{.user.user_id}}',
    },
    {
      label: t('common.name'),
      value: '{{.user.name}}',
    },
    {
      label: t('common.email'),
      value: '{{.user.email}}',
    },
    {
      label: t('common.phone'),
      value: '{{.user.phone}}',
    },
    {
      label: t('common.current_quota'),
      value: '{{.user.quota}}',
    },
    {
      label: t('common.used_quota'),
      value: '{{.user.used_quota}}',
    },
    {
      label: t('user.label.quota_expires_at'),
      value: '{{.user.quota_expires_at}}',
    },
    {
      label: t('user.detail.warning_threshold'),
      value: '{{.user.warning_threshold}}',
    },
    {
      label: t('user.detail.expire_warning_threshold'),
      value: '{{.user.expire_warning_threshold}}',
    },
  ];

  const resellerAttribute = [
    {
      label: t('common.user_id'),
      value: '{{.reseller.user_id}}',
    },
    {
      label: t('common.name'),
      value: '{{.reseller.name}}',
    },
    {
      label: t('common.email'),
      value: '{{.reseller.email}}',
    },
    {
      label: t('common.phone'),
      value: '{{.reseller.phone}}',
    },
    {
      label: t('common.current_quota'),
      value: '{{.reseller.quota}}',
    },
    {
      label: t('common.used_quota'),
      value: '{{.reseller.used_quota}}',
    },
    {
      label: t('reseller.label.quota_expires_at'),
      value: '{{.reseller.quota_expires_at}}',
    },
    {
      label: t('reseller.detail.warning_threshold'),
      value: '{{.reseller.warning_threshold}}',
    },
    {
      label: t('reseller.detail.expire_warning_threshold'),
      value: '{{.reseller.expire_warning_threshold}}',
    },
  ];

  const siteAttribute = [
    {
      label: t('site.config.label.domain'),
      value: '{{.site.domain}}',
    },
    {
      label: t('site.config.label.title'),
      value: '{{.site.title}}',
    },
    {
      label: t('site.config.label.logo'),
      value: '{{.site.logo}}',
    },
    {
      label: t('site.config.label.copyright'),
      value: '{{.site.copyright}}',
    },
    {
      label: t('site.config.label.jump_url'),
      value: '{{.site.jump_url}}',
    },
    {
      label: t('site.config.label.icp_beian'),
      value: '{{.site.icp_beian}}',
    },
    {
      label: t('site.config.label.ga_beian'),
      value: '{{.site.ga_beian}}',
    },
    {
      label: t('site.config.label.register_welcome'),
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
