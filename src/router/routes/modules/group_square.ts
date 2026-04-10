import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const GROUP_SQUARE: AppRouteRecordRaw = {
  path: '/group',
  name: 'group_square',
  component: DEFAULT_LAYOUT,
  redirect: '/group/square',
  meta: {
    locale: 'group.square.menu',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 30,
    hideChildrenInMenu: true,
    roles: ['user', 'reseller'],
  },
  children: [
    {
      path: 'square',
      name: 'GroupSquare',
      component: () => import('@/views/group/list/group-square.vue'),
      meta: {
        locale: 'group.square.menu',
        requiresAuth: true,
        roles: ['user', 'reseller'],
        activeMenu: 'group_square',
      },
    },
  ],
};

export default GROUP_SQUARE;
