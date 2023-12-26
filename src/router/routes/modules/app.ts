import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/app',
  name: 'app',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.app',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 1,
  },
  children: [
    {
      path: 'list',
      name: 'AppList',
      component: () => import('@/views/app/list/index.vue'),
      meta: {
        locale: 'menu.app.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'create',
      name: 'AppCreate',
      component: () => import('@/views/app/create/index.vue'),
      meta: {
        locale: 'menu.app.create',
        requiresAuth: true,
        roles: ['*'],
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
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'detail',
      name: 'AppDetail',
      component: () => import('@/views/app/detail/index.vue'),
      meta: {
        locale: 'menu.app.detail',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};

export default LIST;
