import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/key',
  name: 'key',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.key',
    requiresAuth: true,
    icon: 'icon-safe',
    order: 3,
  },
  children: [
    {
      path: 'key-list', // The midline path complies with SEO specifications
      name: 'KeyList',
      component: () => import('@/views/key/list/index.vue'),
      meta: {
        locale: 'menu.key.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'key-create',
      name: 'KeyCreate',
      component: () => import('@/views/key/create/index.vue'),
      meta: {
        locale: 'menu.key.create',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};

export default LIST;
