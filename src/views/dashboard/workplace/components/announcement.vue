<template>
  <a-card
    class="general-card"
    :title="$t('workplace.announcement')"
    :header-style="{ padding: '10px 20px 0 20px', height: '36px' }"
    :body-style="{ padding: '10px 20px 7px 20px' }"
    :bordered="false"
  >
    <template #extra>
      <a-link
        target="_blank"
        href="https://github.com/iimeta/fastapi-admin/releases"
      >
        {{ $t('workplace.viewMore') }}
      </a-link>
    </template>
    <div>
      <div v-for="(item, idx) in list" :key="idx" class="item">
        <a-tag :color="item.type" size="small">{{ item.label }}</a-tag>
        <span class="item-content">
          <a-link
            target="_blank"
            href="https://github.com/iimeta/fastapi-admin/releases"
          >
            {{ item.content }}
          </a-link>
        </span>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  const list = [
    {
      type: 'blue',
      label: '通知',
      content: 'v1.0.0 版本发布啦! 啦!! 啦!!!',
    },
    {
      type: 'blue',
      label: '通知',
      content: 'v0.5.0 版本发布啦! 啦!! 啦!!!',
    },
    {
      type: 'blue',
      label: '通知',
      content: 'v0.4.0 版本发布啦! 啦!! 啦!!!',
    },
  ];
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
