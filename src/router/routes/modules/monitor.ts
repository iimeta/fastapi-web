import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MONITOR: AppRouteRecordRaw = {
  path: '/monitor',
  name: 'monitor',
  component: DEFAULT_LAYOUT,
  redirect: '/monitor/center',
  meta: {
    locale: 'monitor.menu',
    requiresAuth: true,
    icon: 'lucide-monitor-cloud',
    order: 88,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'center',
      name: 'MonitorIndex',
      component: () => import('@/views/monitor/index.vue'),
      meta: {
        locale: 'monitor.menu',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'monitor',
      },
    },
  ],
};

export default MONITOR;
