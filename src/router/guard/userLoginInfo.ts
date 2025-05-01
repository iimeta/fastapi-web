import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore, useAppStore } from '@/store';
import { isLogin } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    const appStore = useAppStore();
    appStore.init();
    if (isLogin()) {
      if (userStore.role) {
        next();
      } else {
        try {
          await userStore.info();
          next();
        } catch (error) {
          await userStore.logout();
          next({
            name: 'login',
            query: {
              redirect: to.name === 'login' ? undefined : to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
        }
      }
    } else {
      if (
        to.name === 'reseller' ||
        to.name === 'login' ||
        to.name === 'admin'
      ) {
        next();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name === 'login' ? undefined : to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
