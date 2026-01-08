import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/user',
  name: 'user',
  component: DEFAULT_LAYOUT,
  redirect: '/user/list',
  meta: {
    locale: 'user.menu',
    icon: 'icon-user',
    requiresAuth: true,
    order: 80,
    hideChildrenInMenu: true,
    roles: ['reseller', 'admin'],
  },
  children: [
    {
      path: 'list',
      name: 'UserList',
      component: () => import('@/views/user/list/index.vue'),
      meta: {
        locale: 'user.menu',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        activeMenu: 'user',
      },
    },
    {
      path: 'create',
      name: 'UserCreate',
      component: () => import('@/views/user/create/index.vue'),
      meta: {
        locale: 'user.menu.create',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        hideInMenu: true,
        activeMenu: 'user',
      },
    },
    {
      path: 'update',
      name: 'UserUpdate',
      component: () => import('@/views/user/update/index.vue'),
      meta: {
        locale: 'user.menu.update',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        hideInMenu: true,
        activeMenu: 'user',
      },
    },
    {
      path: 'center',
      name: 'Center',
      component: () => import('@/views/user/center/index.vue'),
      meta: {
        locale: 'user.center.menu',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        hideInMenu: true,
      },
    },
  ],
};

export default USER;
