import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MY_MODEL: AppRouteRecordRaw = {
  path: '/my',
  name: 'my_model',
  component: DEFAULT_LAYOUT,
  redirect: '/my/model',
  meta: {
    locale: 'menu.my.model',
    requiresAuth: true,
    icon: 'icon-common',
    order: 20,
    hideChildrenInMenu: true,
    roles: ['reseller', 'user'],
  },
  children: [
    {
      path: 'model',
      name: 'MyModel',
      component: () => import('@/views/model/list/my.vue'),
      meta: {
        locale: 'menu.model.list',
        requiresAuth: true,
        roles: ['reseller', 'user'],
        activeMenu: 'my_model',
      },
    },
  ],
};

export default MY_MODEL;
