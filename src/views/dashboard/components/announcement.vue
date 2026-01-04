<template>
  <a-card
    class="general-card"
    :title="appStore.getAnnouncementTitle"
    :header-style="{ padding: '10px 20px 0 20px', height: '36px' }"
    :body-style="{ padding: '10px 20px 7px 20px' }"
    :bordered="false"
  >
    <template #extra>
      <a-link
        v-if="appStore.getAnnouncementMoreUrl"
        :href="appStore.getAnnouncementMoreUrl"
        target="_blank"
      >
        {{ $t('dashboard.view_more') }}
      </a-link>
    </template>
    <div>
      <div
        v-for="(announcement, idx) in appStore.getAnnouncements"
        :key="idx"
        class="item"
      >
        <a-tag color="blue" size="small">{{ $t('dashboard.tag.notice') }}</a-tag>
        <span class="item-content">
          <a-link :href="announcement.jump_url" target="_blank">
            {{ announcement.content }}
          </a-link>
        </span>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';

  const appStore = useAppStore();
</script>

<script lang="ts">
  export default {
    name: 'Announcement', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style scoped lang="less">
  .item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 24px;
    margin-bottom: 4px;
    .item-content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 4px;
      color: var(--color-text-2);
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
    }
  }
</style>
