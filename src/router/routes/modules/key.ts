import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const KEY: AppRouteRecordRaw = {
  path: '/key',
  name: 'key',
  component: DEFAULT_LAYOUT,
  redirect: '/key/list',
  meta: {
    locale: 'key.menu',
    requiresAuth: true,
    icon: 'icon-safe',
    order: 50,
    hideChildrenInMenu: true,
    roles: ['admin'],
  },
  children: [
    {
      path: 'list',
      name: 'ModelKeyList',
      component: () => import('@/views/key/list/index.vue'),
      meta: {
        locale: 'key.menu',
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'key',
      },
    },
    {
      path: 'create',
      name: 'KeyCreate',
      component: () => import('@/views/key/create/index.vue'),
      meta: {
        locale: 'key.menu.create',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'key',
      },
    },
    {
      path: 'update',
      name: 'KeyUpdate',
      component: () => import('@/views/key/update/index.vue'),
      meta: {
        locale: 'key.menu.update',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'key',
      },
    },
  ],
};

export default KEY;
