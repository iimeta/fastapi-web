import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MY_MODEL: AppRouteRecordRaw = {
  path: '/my',
  name: 'my_model',
  component: DEFAULT_LAYOUT,
  redirect: '/my/model',
  meta: {
    locale: 'model.menu.my',
    requiresAuth: true,
    icon: 'icon-common',
    order: 20,
    hideChildrenInMenu: true,
    roles: ['user', 'reseller'],
  },
  children: [
    {
      path: 'model',
      name: 'MyModel',
      component: () => import('@/views/model/list/my.vue'),
      meta: {
        locale: 'model.menu',
        requiresAuth: true,
        roles: ['user', 'reseller'],
        activeMenu: 'my_model',
      },
    },
  ],
};

export default MY_MODEL;
