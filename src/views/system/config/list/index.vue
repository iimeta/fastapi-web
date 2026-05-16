<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <lucide-settings />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('sys.menu') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('sys.config.menu') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card
          class="general-card"
          :bordered="false"
          :header-style="cardHeaderStyle"
          :body-style="cardBodyStyle"
        >
          <a-row justify="space-between">
            <a-col :span="24">
              <a-tabs :default-active-tab="0" type="rounded">
                <a-tab-pane key="0" :title="$t('common.all')">
                  <Global />
                  <General />
                  <Task />
                  <API />
                </a-tab-pane>
                <a-tab-pane key="1" :title="$t('sys.config.tab.title.global')">
                  <Global />
                </a-tab-pane>
                <a-tab-pane key="2" :title="$t('sys.config.tab.title.general')">
                  <General />
                </a-tab-pane>
                <a-tab-pane key="3" :title="$t('sys.config.tab.title.task')">
                  <Task />
                </a-tab-pane>
                <a-tab-pane key="4" :title="$t('sys.config.tab.title.api')">
                  <API />
                </a-tab-pane>
              </a-tabs>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import Global from './components/global.vue';
  import General from './components/general.vue';
  import Task from './components/task.vue';
  import API from './components/api.vue';
  import { provideSysConfig } from './composables/use-sys-config';

  provideSysConfig();

  const cardHeaderStyle = {
    padding: '20px',
  };
  const cardBodyStyle = {
    padding: '25px 20px 20px 14px',
  };
</script>

<script lang="ts">
  export default {
    name: 'SysConfig',
  };
</script>

<style scoped lang="less">
  // 公共骨架(.container padding / .container-breadcrumb)已由 page-list.less 全局提供

  .container {
    :deep(.arco-list-content) {
      overflow-x: hidden;
    }

    :deep(.arco-card-meta-title) {
      font-size: 14px;
    }
  }
  :deep(.arco-list-col) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  :deep(.arco-list-item) {
    width: 33%;
  }

  :deep(.block-title) {
    margin: 0 0 12px 0;
    font-size: 14px;
  }
  :deep(.list-wrap) {
    // min-height: 140px;
    .list-row {
      align-items: stretch;
      .list-col {
        margin-bottom: 16px;
      }
    }
    :deep(.arco-space) {
      width: 100%;
      .arco-space-item {
        &:last-child {
          flex: 1;
        }
      }
    }
  }
  :deep(.arco-tabs-content) {
    padding-top: 6px;
    padding-left: 6px;
  }
</style>
