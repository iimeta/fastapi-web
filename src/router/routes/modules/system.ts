import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SYS: AppRouteRecordRaw = {
  path: '/sys',
  name: 'sys',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.sys',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 20,
  },
  children: [
    {
      path: 'reseller/list',
      name: 'ResellerList',
      component: () => import('@/views/system/reseller/list/index.vue'),
      meta: {
        locale: 'menu.reseller',
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'ResellerList',
      },
    },
    {
      path: 'reseller/create',
      name: 'ResellerCreate',
      component: () => import('@/views/system/reseller/create/index.vue'),
      meta: {
        locale: 'menu.reseller.create',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
    {
      path: 'reseller/update',
      name: 'ResellerUpdate',
      component: () => import('@/views/system/reseller/update/index.vue'),
      meta: {
        locale: 'menu.reseller.update',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
    {
      path: 'reseller/detail',
      name: 'ResellerDetail',
      component: () => import('@/views/system/reseller/detail/index.vue'),
      meta: {
        locale: 'menu.reseller.detail',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
    {
      path: 'notice/list',
      name: 'NoticeList',
      component: () => import('@/views/system/notice/list/index.vue'),
      meta: {
        locale: 'menu.notice.list',
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'notice',
      },
    },
    {
      path: 'notice/create',
      name: 'NoticeCreate',
      component: () => import('@/views/system/notice/create/index.vue'),
      meta: {
        locale: 'menu.notice.create',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
    {
      path: 'notice/update',
      name: 'NoticeUpdate',
      component: () => import('@/views/system/notice/update/index.vue'),
      meta: {
        locale: 'menu.notice.update',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
      },
    },
    {
      path: 'site/config',
      name: 'SiteConfig',
      component: () => import('@/views/system/site_config/list/index.vue'),
      meta: {
        locale: 'menu.site.config',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
      },
    },
    {
      path: 'site/config/create',
      name: 'SiteConfigCreate',
      component: () => import('@/views/system/site_config/create/index.vue'),
      meta: {
        locale: 'menu.site.config.create',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        hideInMenu: true,
      },
    },
    {
      path: 'site/config/update',
      name: 'SiteConfigUpdate',
      component: () => import('@/views/system/site_config/update/index.vue'),
      meta: {
        locale: 'menu.site.config.update',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        hideInMenu: true,
      },
    },
    {
      path: 'config',
      name: 'SysConfig',
      component: () => import('@/views/system/config/list/index.vue'),
      meta: {
        locale: 'menu.sys.config',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
};

export default SYS;
