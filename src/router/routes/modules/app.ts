import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const APP: AppRouteRecordRaw = {
  path: '/app',
  name: 'app',
  component: DEFAULT_LAYOUT,
  redirect: '/app/list',
  meta: {
    locale: 'menu.app',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 8,
    hideChildrenInMenu: true,
    roles: ['admin', 'user'],
  },
  children: [
    {
      path: 'list',
      name: 'AppList',
      component: () => import('@/views/app/list/index.vue'),
      meta: {
        locale: 'menu.app.list',
        requiresAuth: true,
        roles: ['admin', 'user'],
        activeMenu: 'app',
      },
    },
    {
      path: 'create',
      name: 'AppCreate',
      component: () => import('@/views/app/create/index.vue'),
      meta: {
        locale: 'menu.app.create',
        requiresAuth: true,
        roles: ['admin', 'user'],
        hideInMenu: true,
      },
    },
    {
      path: 'update',
      name: 'AppUpdate',
      component: () => import('@/views/app/update/index.vue'),
      meta: {
        locale: 'menu.app.update',
        requiresAuth: true,
        roles: ['admin', 'user'],
        hideInMenu: true,
      },
    },
  ],
};

export default APP;
