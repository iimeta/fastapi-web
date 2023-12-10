import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/model',
  name: 'model',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.model',
    requiresAuth: true,
    icon: 'icon-list',
    order: 2,
  },
  children: [
    {
      path: 'model-list', // The midline path complies with SEO specifications
      name: 'ModelList',
      component: () => import('@/views/model/search-table/index.vue'),
      meta: {
        locale: 'menu.model.modelList',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'model-add',
      name: 'ModelAdd',
      component: () => import('@/views/model/add/index.vue'),
      meta: {
        locale: 'menu.model.add',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
