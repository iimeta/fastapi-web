import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MY_GROUP: AppRouteRecordRaw = {
  path: '/my',
  name: 'my_group',
  component: DEFAULT_LAYOUT,
  redirect: '/my/group',
  meta: {
    locale: 'menu.my.group',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 30,
    hideChildrenInMenu: true,
    roles: ['user', 'reseller'],
  },
  children: [
    {
      path: 'group',
      name: 'MyGroup',
      component: () => import('@/views/group/list/my.vue'),
      meta: {
        locale: 'menu.group.list',
        requiresAuth: true,
        roles: ['user', 'reseller'],
        activeMenu: 'my_group',
      },
    },
  ],
};

export default MY_GROUP;
