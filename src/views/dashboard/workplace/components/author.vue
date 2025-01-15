<template>
  <a-card
    class="general-card"
    :title="appStore.getCarousel2Title"
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
      <a-carousel-item
        v-for="(carousel, idx) in appStore.getCarousels2"
        :key="idx"
      >
        <a-link :href="carousel.jump_url" target="_blank">
          <img class="author" :src="carousel.image_url" />
        </a-link>
      </a-carousel-item>
    </a-carousel>
  </a-card>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';

  const appStore = useAppStore();
</script>

<script lang="ts">
  export default {
    name: 'Author', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .author {
    width: 238px;
  }
</style>
