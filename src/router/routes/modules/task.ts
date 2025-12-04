import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const TASK: AppRouteRecordRaw = {
  path: '/task',
  name: 'task',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.task',
    requiresAuth: true,
    icon: 'icon-calendar',
    order: 125,
  },
  children: [
    {
      path: 'video',
      name: 'TaskVideoList',
      component: () => import('@/views/task/list/video.vue'),
      meta: {
        locale: 'menu.task.video.list',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'TaskVideoList',
      },
    },
  ],
};

export default TASK;
