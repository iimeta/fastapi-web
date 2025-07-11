import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MODEL: AppRouteRecordRaw = {
  path: '/model',
  name: 'model',
  component: DEFAULT_LAYOUT,
  redirect: '/model/list',
  meta: {
    locale: 'menu.model',
    requiresAuth: true,
    icon: 'icon-common',
    order: 30,
    hideChildrenInMenu: true,
    roles: ['admin'],
  },
  children: [
    {
      path: 'list',
      name: 'ModelList',
      component: () => import('@/views/model/list/index.vue'),
      meta: {
        locale: 'menu.model.list',
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'model',
      },
    },
    {
      path: 'create',
      name: 'ModelCreate',
      component: () => import('@/views/model/create/index.vue'),
      meta: {
        locale: 'menu.model.create',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'model',
      },
    },
    {
      path: 'update',
      name: 'ModelUpdate',
      component: () => import('@/views/model/update/index.vue'),
      meta: {
        locale: 'menu.model.update',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'model',
      },
    },
  ],
};

export default MODEL;
