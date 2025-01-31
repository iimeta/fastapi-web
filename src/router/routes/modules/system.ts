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
      path: 'site/config',
      name: 'SiteConfig',
      component: () => import('@/views/system/site_config/list/index.vue'),
      meta: {
        locale: 'menu.site.config',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'site/config/create',
      name: 'SiteConfigCreate',
      component: () => import('@/views/system/site_config/create/index.vue'),
      meta: {
        locale: 'menu.site.config.create',
        requiresAuth: true,
        roles: ['admin'],
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
        roles: ['admin'],
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
