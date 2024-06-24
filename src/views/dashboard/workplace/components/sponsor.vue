<template>
  <a-card
    class="general-card"
    :title="$t('workplace.sponsor')"
    :header-style="{ padding: '20px 20px 0 20px' }"
    :body-style="{ padding: '20px' }"
    :bordered="false"
  >
    <a-carousel
      indicator-type="slider"
      show-arrow="hover"
      auto-play
      style="height: 167px"
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
    'https://www.fastapi.ai/public/images/yunapi.png',
    'https://www.fastapi.ai/public/images/yunapi.png',
  ];
  const urlSrc = ['https://api.zyai.online', 'https://api.zyai.online'];
</script>

<style lang="less" scoped>
  .sponsor {
    width: 238px;
  }
</style>
