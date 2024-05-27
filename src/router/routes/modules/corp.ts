import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const CORP: AppRouteRecordRaw = {
  path: '/corp',
  name: 'corp',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.corp',
    requiresAuth: true,
    icon: 'icon-bar-chart',
    order: 8,
  },
  children: [
    {
      path: 'list',
      name: 'CorpList',
      component: () => import('@/views/corp/list/index.vue'),
      meta: {
        locale: 'menu.corp.list',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'create',
      name: 'CorpCreate',
      component: () => import('@/views/corp/create/index.vue'),
      meta: {
        locale: 'menu.corp.create',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
    {
      path: 'update',
      name: 'CorpUpdate',
      component: () => import('@/views/corp/update/index.vue'),
      meta: {
        locale: 'menu.corp.update',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
  ],
};

export default CORP;
