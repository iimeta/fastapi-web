import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const NOTICE: AppRouteRecordRaw = {
  path: '/notice',
  name: 'notice',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.notice',
    requiresAuth: true,
    icon: 'icon-notification',
    order: 11,
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
        activeMenu: 'NoticeList',
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
        activeMenu: 'NoticeList',
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
        activeMenu: 'NoticeList',
      },
    },
    {
      path: 'template/list',
      name: 'NoticeTemplateList',
      component: () => import('@/views/notice_template/list/index.vue'),
      meta: {
        locale: 'menu.notice.template.list',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        activeMenu: 'NoticeTemplateList',
      },
    },
    {
      path: 'template/create',
      name: 'NoticeTemplateCreate',
      component: () => import('@/views/notice_template/create/index.vue'),
      meta: {
        locale: 'menu.notice.template.create',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        hideInMenu: true,
        activeMenu: 'NoticeTemplateList',
      },
    },
    {
      path: 'template/update',
      name: 'NoticeTemplateUpdate',
      component: () => import('@/views/notice_template/update/index.vue'),
      meta: {
        locale: 'menu.notice.template.update',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        hideInMenu: true,
        activeMenu: 'NoticeTemplateList',
      },
    },
  ],
};

export default NOTICE;
