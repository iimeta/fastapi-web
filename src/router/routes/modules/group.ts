import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const getGroupListView = () => localStorage.getItem('groupListView');

const GROUP: AppRouteRecordRaw = {
  path: '/group',
  name: 'group',
  component: DEFAULT_LAYOUT,
  redirect: '/group/card',
  meta: {
    locale: 'group.menu',
    requiresAuth: true,
    icon: 'lucide-combine',
    order: 70,
    hideChildrenInMenu: true,
    roles: ['admin'],
  },
  children: [
    {
      path: 'list',
      name: 'GroupList',
      component: () => import('@/views/group/list/index.vue'),
      beforeEnter: () => {
        if (getGroupListView() !== 'list') {
          return { name: 'GroupCardList' };
        }
        return true;
      },
      meta: {
        locale: 'group.menu',
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'group',
      },
    },
    {
      path: 'card',
      name: 'GroupCardList',
      component: () => import('@/views/group/list/card.vue'),
      beforeEnter: () => {
        if (getGroupListView() === 'list') {
          return { name: 'GroupList' };
        }
        return true;
      },
      meta: {
        locale: 'group.menu',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'group',
      },
    },
    {
      path: 'create',
      name: 'GroupCreate',
      component: () => import('@/views/group/create/index.vue'),
      meta: {
        locale: 'group.menu.create',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'group',
      },
    },
    {
      path: 'update',
      name: 'GroupUpdate',
      component: () => import('@/views/group/update/index.vue'),
      meta: {
        locale: 'group.menu.update',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'group',
      },
    },
  ],
};

export default GROUP;
