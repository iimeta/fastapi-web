import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const KEY: AppRouteRecordRaw = {
  path: '/key',
  name: 'key',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.key',
    requiresAuth: true,
    icon: 'icon-safe',
    order: 3,
  },
  children: [
    {
      path: 'model/list',
      name: 'KeyModelList',
      component: () => import('@/views/key/list/model.vue'),
      meta: {
        locale: 'menu.key.model.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'app/list',
      name: 'KeyAppList',
      component: () => import('@/views/key/list/app.vue'),
      meta: {
        locale: 'menu.key.app.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'create',
      name: 'KeyCreate',
      component: () => import('@/views/key/create/index.vue'),
      meta: {
        locale: 'menu.key.create',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'update',
      name: 'KeyUpdate',
      component: () => import('@/views/key/update/index.vue'),
      meta: {
        locale: 'menu.key.update',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'detail',
      name: 'KeyDetail',
      component: () => import('@/views/key/detail/index.vue'),
      meta: {
        locale: 'menu.key.detail',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};

export default KEY;
