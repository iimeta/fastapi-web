<template>
  <a-card
    class="general-card"
    :title="appStore.getCarousel1Title"
    :header-style="{ padding: '10px 20px 0 20px', height: '36px' }"
    :body-style="{ padding: '10px 20px 15px 20px' }"
    :bordered="false"
  >
    <a-carousel
      indicator-type="slider"
      show-arrow="hover"
      auto-play
      :style="{
        height:
          userRole === 'user'
            ? '190px'
            : userRole === 'reseller'
            ? '177px'
            : '203px',
      }"
    >
      <a-carousel-item
        v-for="(carousel, idx) in appStore.getCarousels1"
        :key="idx"
      >
        <a-link :href="carousel.jump_url" target="_blank">
          <img
            class="sponsor"
            :src="carousel.image_url"
            style="background-color: #ffffff"
          />
        </a-link>
      </a-carousel-item>
    </a-carousel>
  </a-card>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';

  const appStore = useAppStore();
  const userRole = localStorage.getItem('userRole');
</script>

<script lang="ts">
  export default {
    name: 'Sponsor', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .sponsor {
    width: 238px;
  }
</style>
