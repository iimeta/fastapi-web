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
    order: 3,
    hideChildrenInMenu: true,
    roles: ['reseller', 'user'],
  },
  children: [
    {
      path: 'group',
      name: 'MyGroup',
      component: () => import('@/views/group/list/my.vue'),
      meta: {
        locale: 'menu.group.list',
        requiresAuth: true,
        roles: ['reseller', 'user'],
        activeMenu: 'my_group',
      },
    },
  ],
};

export default MY_GROUP;
