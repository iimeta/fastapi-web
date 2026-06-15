<template>
  <a-config-provider :locale="locale">
    <router-view />
    <global-setting />
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue';
  import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
  import zhTW from '@arco-design/web-vue/es/locale/lang/zh-tw';
  import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
  import GlobalSetting from '@/components/global-setting/index.vue';
  import { useAppStore } from '@/store';
  import useLocale from '@/hooks/locale';

  const appStore = useAppStore();
  const { currentLocale } = useLocale();
  const locale = computed(() => {
    switch (currentLocale.value) {
      case 'zh-CN':
        return zhCN;
      case 'zh-TW':
        return zhTW;
      case 'en-US':
        return enUS;
      default:
        return zhCN;
    }
  });

  // 恢复本地缓存的色弱模式(通过 document filter 实现)
  onMounted(() => {
    if (appStore.colorWeak) {
      document.body.style.filter = 'invert(80%)';
    }
  });
</script>
