import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/user',
  name: 'user',
  component: DEFAULT_LAYOUT,
  redirect: '/user/list',
  meta: {
    locale: 'menu.user',
    icon: 'icon-user',
    requiresAuth: true,
    order: 7,
    hideChildrenInMenu: true,
    roles: ['admin'],
  },
  children: [
    {
      path: 'list',
      name: 'UserList',
      component: () => import('@/views/user/list/index.vue'),
      meta: {
        locale: 'menu.user.list',
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'user',
      },
    },
    {
      path: 'create',
      name: 'UserCreate',
      component: () => import('@/views/user/create/index.vue'),
      meta: {
        locale: 'menu.user.create',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
    {
      path: 'update',
      name: 'UserUpdate',
      component: () => import('@/views/user/update/index.vue'),
      meta: {
        locale: 'menu.user.update',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
    {
      path: 'detail',
      name: 'UserDetail',
      component: () => import('@/views/user/detail/index.vue'),
      meta: {
        locale: 'menu.user.detail',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
    {
      path: 'center',
      name: 'Center',
      component: () => import('@/views/user/center/index.vue'),
      meta: {
        locale: 'menu.user.center',
        requiresAuth: true,
        roles: ['admin', 'user'],
        hideInMenu: true,
      },
    },
  ],
};

export default USER;
