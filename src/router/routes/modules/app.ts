import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const APP: AppRouteRecordRaw = {
  path: '/app',
  name: 'app',
  component: DEFAULT_LAYOUT,
  redirect: '/app/list',
  meta: {
    locale: 'app.menu',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 90,
    hideChildrenInMenu: true,
    roles: ['user', 'reseller', 'admin'],
  },
  children: [
    {
      path: 'list',
      name: 'AppList',
      component: () => import('@/views/app/list/index.vue'),
      meta: {
        locale: 'app.menu',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'app',
      },
    },
    {
      path: 'create',
      name: 'AppCreate',
      component: () => import('@/views/app/create/index.vue'),
      meta: {
        locale: 'app.menu.create',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        hideInMenu: true,
        activeMenu: 'app',
      },
    },
    {
      path: 'update',
      name: 'AppUpdate',
      component: () => import('@/views/app/update/index.vue'),
      meta: {
        locale: 'app.menu.update',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        hideInMenu: true,
        activeMenu: 'app',
      },
    },
  ],
};

export default APP;
