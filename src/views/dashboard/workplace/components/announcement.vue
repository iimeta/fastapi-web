<template>
  <a-card
    class="general-card"
    :title="appStore.getAnnouncementTitle"
    :header-style="{ padding: '10px 20px 0 20px', height: '36px' }"
    :body-style="{ padding: '10px 20px 7px 20px' }"
    :bordered="false"
  >
    <template #extra>
      <a-link :href="appStore.getAnnouncementMoreUrl" target="_blank">
        {{ $t('workplace.viewMore') }}
      </a-link>
    </template>
    <div>
      <div
        v-for="(announcement, idx) in appStore.getAnnouncements"
        :key="idx"
        class="item"
      >
        <a-tag color="blue" size="small">通知</a-tag>
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
