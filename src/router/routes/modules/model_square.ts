import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MODEL_SQUARE: AppRouteRecordRaw = {
  path: '/model',
  name: 'model_square',
  component: DEFAULT_LAYOUT,
  redirect: '/model/square',
  meta: {
    locale: 'model.square.menu',
    requiresAuth: true,
    icon: 'lucide-component',
    order: 20,
    hideChildrenInMenu: true,
    roles: ['user', 'reseller', 'admin'],
  },
  children: [
    {
      path: 'square',
      name: 'ModelSquare',
      component: () => import('@/views/model/list/model-square.vue'),
      meta: {
        locale: 'model.square.menu',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'model_square',
      },
    },
  ],
};

export default MODEL_SQUARE;
