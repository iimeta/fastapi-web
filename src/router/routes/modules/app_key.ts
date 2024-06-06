import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const APP_KEY: AppRouteRecordRaw = {
  path: '/app/key',
  name: 'app_key',
  component: DEFAULT_LAYOUT,
  redirect: '/app/key',
  meta: {
    locale: 'menu.key',
    requiresAuth: true,
    icon: 'icon-safe',
    order: 4,
    hideChildrenInMenu: true,
    roles: ['user'],
  },
  children: [
    {
      path: '',
      name: 'AppKeyList',
      component: () => import('@/views/key/list/app.vue'),
      meta: {
        locale: 'menu.key.app.list',
        requiresAuth: true,
        roles: ['user'],
        activeMenu: 'app_key',
      },
    },
  ],
};

export default APP_KEY;
