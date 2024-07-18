<template>
  <a-card
    class="general-card"
    :title="$t('workplace.author')"
    :header-style="{ padding: '10px 20px 0 20px', height: '36px' }"
    :body-style="{ padding: '10px 20px 15px 20px' }"
    :bordered="false"
  >
    <a-carousel
      indicator-type="slider"
      show-arrow="hover"
      auto-play
      style="height: 252px"
    >
      <a-carousel-item v-for="(src, idx) in imageSrc" :key="idx">
        <div>
          <img class="author" :src="src" />
        </div>
      </a-carousel-item>
    </a-carousel>
  </a-card>
</template>

<script lang="ts" setup>
  const imageSrc = [
    'https://www.fastapi.ai/Author.png',
    'https://www.fastapi.ai/AuthorQQ.png',
  ];
</script>

<style lang="less" scoped>
  .author {
    width: 238px;
  }
</style>
