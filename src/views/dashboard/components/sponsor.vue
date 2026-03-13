<template>
  <a-card
    class="general-card"
    :title="appStore.getCarousel1Title"
    :header-style="cardHeaderStyle"
    :body-style="cardBodyStyle"
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
            class="sponsor dashboard-sponsor-image"
            :src="carousel.image_url"
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

  const cardHeaderStyle = { padding: '10px 20px 0 20px', height: '36px' };
  const cardBodyStyle = { padding: '10px 20px 15px 20px' };
</script>

<script lang="ts">
  export default {
    name: 'Sponsor',
  };
</script>

<style lang="less" scoped>
  .sponsor {
    width: 238px;
  }

  .dashboard-sponsor-image {
    background-color: var(--color-bg-2);
  }
</style>
