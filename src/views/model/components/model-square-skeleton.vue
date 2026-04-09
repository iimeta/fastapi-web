<template>
  <div class="model-square-skel">
    <div class="model-square-skel-bar" />
    <div class="model-square-skel-head">
      <a-skeleton-shape shape="square" :size="28" />
      <a-skeleton-line
        :rows="1"
        :line-height="12"
        :widths="['50%']"
        style="flex: 1"
      />
    </div>
    <div class="model-square-skel-name">
      <a-skeleton-line :rows="1" :line-height="18" :widths="['70%']" />
    </div>
    <div class="model-square-skel-tags">
      <a-skeleton-shape
        shape="square"
        :size="16"
        style="width: 48px; border-radius: 3px"
      />
      <a-skeleton-shape
        shape="square"
        :size="16"
        style="width: 48px; border-radius: 3px"
      />
    </div>
    <div class="model-square-skel-pricing">
      <a-skeleton-line
        :rows="3"
        :line-height="11"
        :widths="['90%', '75%', '60%']"
      />
    </div>
  </div>
</template>

<script lang="ts">
  export default { name: 'ModelSquareSkeleton' };
</script>

<style scoped lang="less">
  .model-square-skel {
    overflow: hidden;
    background: var(--color-bg-2);
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  .model-square-skel-bar {
    height: 4px;
    background: var(--color-fill-3);
  }

  .model-square-skel-head {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 16px 18px 0;
  }

  .model-square-skel-name {
    padding: 10px 18px 0;
  }

  .model-square-skel-tags {
    display: flex;
    gap: 6px;
    padding: 10px 18px 0;
  }

  .model-square-skel-pricing {
    margin: 12px 18px 16px;
    padding: 10px 12px;
    background: var(--color-fill-1);
    border-radius: 6px;
  }
</style>
