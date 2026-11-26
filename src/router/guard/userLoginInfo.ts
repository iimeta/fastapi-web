import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore, useAppStore } from '@/store';
import { isLogin } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    const appStore = useAppStore();
    appStore.init();
    if (isLogin()) {
      if (!userStore.role) {
        try {
          await userStore.info();
        } catch (error) {
          await userStore.logout();
          next({
            name: 'login',
            query: {
              redirect: to.name === 'login' ? undefined : to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
          return;
        }
      }

      // 首次登录或密码已过有效期时, 未修改密码前只允许停留在修改密码页
      if (userStore.need_change_password) {
        if (to.name !== 'ChangePassword') {
          next({ name: 'ChangePassword' });
          return;
        }
      } else if (to.name === 'ChangePassword') {
        next({ name: 'Workplace' });
        return;
      }

      next();
    } else {
      if (
        to.name === 'reseller' ||
        to.name === 'login' ||
        to.name === 'InviteRegister' ||
        to.name === 'admin' ||
        to.name === 'UserAgreement' ||
        to.name === 'PrivacyPolicy'
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
