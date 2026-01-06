import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const APP_KEY: AppRouteRecordRaw = {
  path: '/app/key',
  name: 'app_key',
  component: DEFAULT_LAYOUT,
  redirect: '/app/key',
  meta: {
    locale: 'app.key.menu',
    requiresAuth: true,
    icon: 'icon-safe',
    order: 100,
    hideChildrenInMenu: true,
    roles: ['user', 'reseller', 'admin'],
  },
  children: [
    {
      path: '',
      name: 'AppKeyList',
      component: () => import('@/views/app_key/list/index.vue'),
      meta: {
        locale: 'app.key.menu',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'app_key',
      },
    },
  ],
};

export default APP_KEY;
