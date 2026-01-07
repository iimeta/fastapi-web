import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const TASK: AppRouteRecordRaw = {
  path: '/task',
  name: 'task',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'task.menu',
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
        locale: 'task.menu.video',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'TaskVideoList',
      },
    },
    {
      path: 'file',
      name: 'TaskFileList',
      component: () => import('@/views/task/list/file.vue'),
      meta: {
        locale: 'task.menu.file',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'TaskFileList',
      },
    },
    {
      path: 'batch',
      name: 'TaskBatchList',
      component: () => import('@/views/task/list/batch.vue'),
      meta: {
        locale: 'task.menu.batch',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'TaskBatchList',
      },
    },
  ],
};

export default TASK;
