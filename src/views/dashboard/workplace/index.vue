<template>
  <div class="container">
    <div class="left-side">
      <div class="panel">
        <Banner />
        <DataPanel />
        <DataChart />
      </div>
      <a-grid :cols="24" :col-gap="10" :row-gap="10" style="margin-top: 10px">
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }"
        >
          <DataTop />
        </a-grid-item>
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }"
        >
          <ModelPercent />
        </a-grid-item>
      </a-grid>
    </div>
    <div class="right-side">
      <a-grid :cols="24" :row-gap="10">
        <a-grid-item :span="24">
          <div class="panel moduler-wrap">
            <UserInfo />
          </div>
        </a-grid-item>
        <a-grid-item
          v-permission="['user']"
          class="panel moduler-wrap"
          :span="24"
        >
          <Expense />
        </a-grid-item>
        <a-grid-item
          v-permission="['admin']"
          class="panel moduler-wrap"
          :span="24"
        >
          <QuickOperation />
        </a-grid-item>
        <a-grid-item v-if="appStore.getCarousel1Title" class="panel" :span="24">
          <Sponsor />
        </a-grid-item>
        <a-grid-item v-if="appStore.getCarousel2Title" class="panel" :span="24">
          <Author />
        </a-grid-item>
        <a-grid-item
          v-if="appStore.getAnnouncementTitle"
          class="panel"
          :span="24"
        >
          <Announcement />
        </a-grid-item>
        <a-grid-item v-if="appStore.getDocumentTitle" class="panel" :span="24">
          <Docs />
        </a-grid-item>
      </a-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import Banner from './components/banner.vue';
  import DataPanel from './components/data-panel.vue';
  import DataChart from './components/data-chart.vue';
  import DataTop from './components/data-top.vue';
  import ModelPercent from './components/model-percent.vue';
  import QuickOperation from './components/quick-operation.vue';
  import UserInfo from './components/user-info.vue';
  import Expense from './components/expense.vue';
  import Author from './components/author.vue';
  import Sponsor from './components/sponsor.vue';
  import Announcement from './components/announcement.vue';
  import Docs from './components/docs.vue';

  const appStore = useAppStore();
</script>

<script lang="ts">
  export default {
    name: 'Dashboard', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .container {
    background-color: var(--color-fill-2);
    padding: 10px 10px 20px 10px;
    padding-bottom: 0;
    display: flex;
  }

  .left-side {
    flex: 1;
  }

  .right-side {
    width: 280px;
    margin-left: 10px;
  }

  .panel {
    background-color: var(--color-bg-2);
    border-radius: 4px;
    overflow: auto;
  }
  :deep(.panel-border) {
    margin-bottom: 0;
    border-bottom: 1px solid rgb(var(--gray-2));
  }
  .moduler-wrap {
    border-radius: 4px;
    background-color: var(--color-bg-2);
    :deep(.text) {
      font-size: 12px;
      text-align: center;
      color: rgb(var(--gray-8));
    }

    :deep(.wrapper) {
      margin-bottom: 8px;
      text-align: center;
      cursor: pointer;

      &:last-child {
        .text {
          margin-bottom: 0;
        }
      }
      &:hover {
        .icon {
          color: rgb(var(--arcoblue-6));
          background-color: #e8f3ff;
        }
        .text {
          color: rgb(var(--arcoblue-6));
        }
      }
    }

    :deep(.icon) {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-bottom: 4px;
      color: rgb(var(--dark-gray-1));
      line-height: 32px;
      font-size: 16px;
      text-align: center;
      background-color: rgb(var(--gray-1));
      border-radius: 4px;
    }
  }

  // responsive
  .mobile {
    .container {
      display: block;
    }
    .right-side {
      // display: none;
      width: 100%;
      margin-left: 0;
      margin-top: 16px;
    }
  }
</style>
