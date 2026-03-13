<template>
  <a-card
    class="general-card"
    :title="appStore.getCarousel2Title"
    :header-style="cardHeaderStyle"
    :body-style="cardBodyStyle"
    :bordered="false"
  >
    <a-carousel
      class="dashboard-author-carousel"
      indicator-type="slider"
      show-arrow="hover"
      auto-play
    >
      <a-carousel-item
        v-for="(carousel, idx) in appStore.getCarousels2"
        :key="idx"
      >
        <a-link :href="carousel.jump_url" target="_blank">
          <img
            class="author dashboard-author-image"
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

  const cardHeaderStyle = { padding: '10px 20px 0 20px', height: '36px' };
  const cardBodyStyle = { padding: '10px 20px 15px 20px' };
</script>

<script lang="ts">
  export default {
    name: 'Author',
  };
</script>

<style lang="less" scoped>
  .author {
    width: 238px;
  }

  .dashboard-author-carousel {
    height: 252px;
  }

  .dashboard-author-image {
    background-color: var(--color-bg-2);
  }
</style>
