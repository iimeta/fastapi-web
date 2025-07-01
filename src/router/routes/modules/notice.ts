import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const NOTICE: AppRouteRecordRaw = {
  path: '/notice',
  name: 'notice',
  component: DEFAULT_LAYOUT,
  redirect: '/notice/list',
  meta: {
    locale: 'menu.notice',
    requiresAuth: true,
    icon: 'icon-notification',
    order: 11,
    hideChildrenInMenu: true,
    roles: ['reseller', 'admin'],
  },
  children: [
    {
      path: 'list',
      name: 'NoticeList',
      component: () => import('@/views/notice/list/index.vue'),
      meta: {
        locale: 'menu.notice.list',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        activeMenu: 'notice',
      },
    },
    {
      path: 'create',
      name: 'NoticeCreate',
      component: () => import('@/views/notice/create/index.vue'),
      meta: {
        locale: 'menu.notice.create',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        hideInMenu: true,
      },
    },
    {
      path: 'update',
      name: 'NoticeUpdate',
      component: () => import('@/views/notice/update/index.vue'),
      meta: {
        locale: 'menu.notice.update',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        hideInMenu: true,
      },
    },
  ],
};

export default NOTICE;
