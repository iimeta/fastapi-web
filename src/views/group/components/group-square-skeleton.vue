<template>
  <div class="group-square-skel">
    <div class="group-square-skel-bar" />
    <div class="group-square-skel-head">
      <a-skeleton-shape shape="circle" :size="36" />
      <div style="flex: 1">
        <a-skeleton-line :rows="2" :line-height="12" :widths="['60%', '40%']" />
      </div>
    </div>
    <div class="group-square-skel-tags">
      <a-skeleton-shape
        shape="square"
        :size="16"
        style="width: 52px; border-radius: 3px"
      />
      <a-skeleton-shape
        shape="square"
        :size="16"
        style="width: 40px; border-radius: 3px"
      />
    </div>
    <div class="group-square-skel-body">
      <a-skeleton-line
        :rows="3"
        :line-height="11"
        :widths="['90%', '75%', '60%']"
      />
    </div>
  </div>
</template>

<script lang="ts">
  export default { name: 'GroupSquareSkeleton' };
</script>

<style scoped lang="less">
  .group-square-skel {
    overflow: hidden;
    background: var(--color-bg-2);
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  .group-square-skel-bar {
    height: 4px;
    background: var(--color-fill-3);
  }

  .group-square-skel-head {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 16px 18px 0;
  }

  .group-square-skel-tags {
    display: flex;
    gap: 6px;
    padding: 12px 18px 0;
  }

  .group-square-skel-body {
    margin: 12px 18px 16px;
    padding: 10px 12px;
    background: var(--color-fill-1);
    border-radius: 6px;
  }
</style>
