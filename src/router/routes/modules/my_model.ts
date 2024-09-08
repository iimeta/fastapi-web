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
    order: 2,
    hideChildrenInMenu: true,
    roles: ['user'],
  },
  children: [
    {
      path: 'model',
      name: 'MyModelList',
      component: () => import('@/views/model/list/my.vue'),
      meta: {
        locale: 'menu.model.list',
        requiresAuth: true,
        roles: ['user'],
        activeMenu: 'my_model',
      },
    },
  ],
};

export default MY_MODEL;
