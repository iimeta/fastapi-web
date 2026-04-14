import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const STATISTICS: AppRouteRecordRaw = {
  path: '/statistics',
  name: 'statistics',
  component: DEFAULT_LAYOUT,
  redirect: '/statistics/databoard',
  meta: {
    locale: 'statistics.databoard.menu',
    requiresAuth: true,
    icon: 'icon-bar-chart',
    order: 15,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'databoard',
      name: 'DataBoardIndex',
      component: () => import('@/views/statistics/index.vue'),
      meta: {
        locale: 'statistics.databoard.menu',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'statistics',
      },
    },
  ],
};

export default STATISTICS;
