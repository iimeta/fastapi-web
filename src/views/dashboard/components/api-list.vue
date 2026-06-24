<template>
  <a-card
    class="general-card"
    :title="$t('dashboard.api')"
    :header-style="cardHeaderStyle"
    :body-style="cardBodyStyle"
    :bordered="false"
  >
    <div v-if="apis.length > 0">
      <div v-for="(item, index) in apis" :key="index" class="api-item">
        <div class="api-item-header">
          <span class="api-item-name">{{ item.name }}</span>
          <a-tooltip :content="item.url" position="tl">
            <a-button
              type="text"
              size="small"
              class="api-item-copy"
              @click="handleCopy(item.url)"
            >
              <icon-copy />
            </a-button>
          </a-tooltip>
        </div>
        <a-link class="api-item-url" :href="item.url" target="_blank">{{
          item.url
        }}</a-link>
        <div v-if="item.remark" class="api-item-remark">{{ item.remark }}</div>
      </div>
    </div>
    <a-empty v-else />
  </a-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { querySysConfig, ApiItem } from '@/api/sys_config';

  const { t } = useI18n();

  const cardHeaderStyle = { padding: '10px 20px 0 20px', height: '36px' };
  const cardBodyStyle = { padding: '6px 20px 12px 20px' };

  const apis = ref<ApiItem[]>([]);

  const getApiList = async () => {
    try {
      const { data } = await querySysConfig({
        domain: window.location.hostname,
        path: window.location.pathname,
      });
      apis.value = data?.api?.apis || [];
    } catch (err) {
      // ignore
    }
  };
  getApiList();

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      Message.success(t('success.copy'));
    });
  }
</script>

<script lang="ts">
  export default {
    name: 'ApiList',
  };
</script>

<style lang="less" scoped>
  .api-item {
    background: #f7f8fa;
    padding: 8px 10px;
    margin-top: 6px;
    border-radius: 6px;
  }

  .api-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .api-item-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-1);
  }

  .api-item-copy {
    color: var(--color-text-3);
    padding: 0 4px;
    font-size: 14px;
  }

  .api-item-url {
    font-size: 14px;
    word-break: break-all;
    margin-top: 2px;
    padding: 0;
  }

  .api-item-remark {
    font-size: 12px;
    color: var(--color-text-3);
    margin-top: 2px;
  }
</style>
