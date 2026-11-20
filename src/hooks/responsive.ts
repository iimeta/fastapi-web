import { onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useAppStore } from '@/store';
import { addEventListen, removeEventListen } from '@/utils/event';

const WIDTH = 992; // https://arco.design/vue/component/grid#responsivevalue

function queryDevice() {
  const rect = document.body.getBoundingClientRect();
  return rect.width - 1 < WIDTH;
}

export default function useResponsive(immediate?: boolean) {
  const appStore = useAppStore();
  function resizeHandler() {
    // 页面不可见(后台标签页/最小化)时不计算, 恢复可见后由 visibilitychange 补算
    if (document.hidden) return;
    const isMobile = queryDevice();
    appStore.toggleDevice(isMobile ? 'mobile' : 'desktop');
    appStore.toggleMenu(isMobile);
  }
  const debounceFn = useDebounceFn(resizeHandler, 100);
  // 首屏渲染前先同步算一次, 避免先按错误的布局渲染, 100ms 后再切换
  if (immediate) resizeHandler();
  onMounted(() => {
    if (immediate) debounceFn();
  });
  onBeforeMount(() => {
    addEventListen(window, 'resize', debounceFn);
    document.addEventListener('visibilitychange', resizeHandler);
  });
  onBeforeUnmount(() => {
    removeEventListen(window, 'resize', debounceFn);
    document.removeEventListener('visibilitychange', resizeHandler);
  });
}
