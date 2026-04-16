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
    icon: 'lucide-boxes',
    order: 30,
    hideChildrenInMenu: true,
    roles: ['user', 'reseller', 'admin'],
  },
  children: [
    {
      path: 'square',
      name: 'GroupSquare',
      component: () => import('@/views/group/list/group-square.vue'),
      meta: {
        locale: 'group.square.menu',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'group_square',
      },
    },
  ],
};

export default GROUP_SQUARE;
