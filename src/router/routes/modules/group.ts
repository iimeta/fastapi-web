import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const GROUP: AppRouteRecordRaw = {
  path: '/group',
  name: 'group',
  component: DEFAULT_LAYOUT,
  redirect: '/group/list',
  meta: {
    locale: 'menu.group',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 7,
    hideChildrenInMenu: true,
    roles: ['admin'],
  },
  children: [
    {
      path: 'list',
      name: 'GroupList',
      component: () => import('@/views/group/list/index.vue'),
      meta: {
        locale: 'menu.group.list',
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'group',
      },
    },
    {
      path: 'create',
      name: 'GroupCreate',
      component: () => import('@/views/group/create/index.vue'),
      meta: {
        locale: 'menu.group.create',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
    {
      path: 'update',
      name: 'GroupUpdate',
      component: () => import('@/views/group/update/index.vue'),
      meta: {
        locale: 'menu.group.update',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
  ],
};

export default GROUP;
