<template>
  <a-card
    class="general-card"
    :title="$t('workplace.sponsor')"
    :header-style="{ padding: '10px 20px 0 20px', height: '36px' }"
    :body-style="{ padding: '10px 20px 20px 20px' }"
    :bordered="false"
  >
    <a-carousel
      indicator-type="slider"
      show-arrow="hover"
      auto-play
      style="height: 197px"
    >
      <a-carousel-item v-for="(src, idx) in imageSrc" :key="idx">
        <a-link :href="urlSrc[idx]" target="_blank">
          <img class="sponsor" :src="src" />
        </a-link>
      </a-carousel-item>
    </a-carousel>
  </a-card>
</template>

<script lang="ts" setup>
  const imageSrc = [
    'https://fastapi.ai/public/images/iimyun.png',
    'https://fastapi.ai/public/images/iimyun.png',
    'https://fastapi.ai/public/images/iimyun.png',
  ];
  const urlSrc = [
    'https://www.iimyun.com/cart?fid=3&gid=11',
    'https://www.iimyun.com/cart?fid=3&gid=11',
    'https://www.iimyun.com/cart?fid=3&gid=11',
  ];
</script>

<style lang="less" scoped>
  .sponsor {
    width: 238px;
  }
</style>
