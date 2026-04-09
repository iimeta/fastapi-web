import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MODEL_SQUARE: AppRouteRecordRaw = {
  path: '/model-square',
  name: 'model_square',
  component: DEFAULT_LAYOUT,
  redirect: '/model-square/model',
  meta: {
    locale: 'model.square.menu',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 21,
    hideChildrenInMenu: true,
    roles: ['user', 'reseller'],
  },
  children: [
    {
      path: 'model',
      name: 'ModelSquare',
      component: () => import('@/views/model/list/model-square.vue'),
      meta: {
        locale: 'model.square.menu',
        requiresAuth: true,
        roles: ['user', 'reseller'],
        activeMenu: 'model_square',
      },
    },
  ],
};

export default MODEL_SQUARE;
