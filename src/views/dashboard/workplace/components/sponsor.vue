<template>
  <a-card
    class="general-card"
    :title="appStore.getCarousel1Title"
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
      <a-carousel-item
        v-for="(carousel, idx) in appStore.getCarousels1"
        :key="idx"
      >
        <a-link :href="carousel.jump_url" target="_blank">
          <img class="sponsor" :src="carousel.image_url" />
        </a-link>
      </a-carousel-item>
    </a-carousel>
  </a-card>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';

  const appStore = useAppStore();
</script>

<style lang="less" scoped>
  .sponsor {
    width: 238px;
  }
</style>
