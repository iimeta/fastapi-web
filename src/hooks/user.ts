import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';

import { useUserStore } from '@/store';

export default function useUser() {
  const { t } = useI18n();
  const router = useRouter();
  const userStore = useUserStore();
  const logout = async (logoutTo?: string) => {
    const userRole = localStorage.getItem('userRole');
    await userStore.logout();
    const currentRoute = router.currentRoute.value;
    Message.success(t('login.logout.success'));

    let routeName =
      logoutTo && typeof logoutTo === 'string' ? logoutTo : 'login';

    if (routeName === 'login' && userRole === 'reseller') {
      routeName = 'reseller';
    }

    if (routeName === 'login' && userRole === 'admin') {
      routeName = 'admin';
    }

    router.push({
      name: routeName,
      query: {
        ...router.currentRoute.value.query,
        redirect: currentRoute.name as string,
      },
    });
  };
  return {
    logout,
  };
}
