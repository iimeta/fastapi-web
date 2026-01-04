import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  redirect: '/dashboard/workplace',
  meta: {
    locale: 'dashboard.menu',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 10,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'workplace',
      name: 'Workplace',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        locale: 'dashboard.menu',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'dashboard',
      },
    },
  ],
};

export default DASHBOARD;
