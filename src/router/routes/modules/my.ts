import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MY: AppRouteRecordRaw = {
  path: '/my',
  name: 'my',
  component: DEFAULT_LAYOUT,
  redirect: '/my/model',
  meta: {
    locale: 'menu.my.model',
    requiresAuth: true,
    icon: 'icon-common',
    order: 1,
    hideChildrenInMenu: true,
    roles: ['user'],
  },
  children: [
    {
      path: 'model',
      name: 'MyModel',
      component: () => import('@/views/model/list/my.vue'),
      meta: {
        locale: 'menu.model.list',
        requiresAuth: true,
        roles: ['user'],
        activeMenu: 'my',
      },
    },
  ],
};

export default MY;
