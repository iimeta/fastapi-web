import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PROVIDER: AppRouteRecordRaw = {
  path: '/provider',
  name: 'provider',
  component: DEFAULT_LAYOUT,
  redirect: '/provider/list',
  meta: {
    locale: 'menu.provider',
    requiresAuth: true,
    icon: 'icon-bar-chart',
    order: 60,
    hideChildrenInMenu: true,
    roles: ['admin'],
  },
  children: [
    {
      path: 'list',
      name: 'ProviderList',
      component: () => import('@/views/provider/list/index.vue'),
      meta: {
        locale: 'menu.provider.list',
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'provider',
      },
    },
    {
      path: 'create',
      name: 'ProviderCreate',
      component: () => import('@/views/provider/create/index.vue'),
      meta: {
        locale: 'menu.provider.create',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'provider',
      },
    },
    {
      path: 'update',
      name: 'ProviderUpdate',
      component: () => import('@/views/provider/update/index.vue'),
      meta: {
        locale: 'menu.provider.update',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'provider',
      },
    },
  ],
};

export default PROVIDER;
