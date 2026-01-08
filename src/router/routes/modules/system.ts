import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SYS: AppRouteRecordRaw = {
  path: '/sys',
  name: 'sys',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'sys.menu',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 200,
    roles: ['reseller', 'admin'],
  },
  children: [
    {
      path: 'provider/list',
      name: 'ProviderList',
      component: () => import('@/views/system/provider/list/index.vue'),
      meta: {
        locale: 'provider.menu',
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'ProviderList',
      },
    },
    {
      path: 'provider/create',
      name: 'ProviderCreate',
      component: () => import('@/views/system/provider/create/index.vue'),
      meta: {
        locale: 'provider.menu.create',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'ProviderList',
      },
    },
    {
      path: 'provider/update',
      name: 'ProviderUpdate',
      component: () => import('@/views/system/provider/update/index.vue'),
      meta: {
        locale: 'provider.menu.update',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'ProviderList',
      },
    },
    {
      path: 'reseller/list',
      name: 'ResellerList',
      component: () => import('@/views/system/reseller/list/index.vue'),
      meta: {
        locale: 'reseller.menu',
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
        locale: 'reseller.menu.create',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'ResellerList',
      },
    },
    {
      path: 'reseller/update',
      name: 'ResellerUpdate',
      component: () => import('@/views/system/reseller/update/index.vue'),
      meta: {
        locale: 'reseller.menu.update',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'ResellerList',
      },
    },
    {
      path: 'site/config',
      name: 'SiteConfig',
      component: () => import('@/views/system/site_config/list/index.vue'),
      meta: {
        locale: 'site.config.menu',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        activeMenu: 'SiteConfig',
      },
    },
    {
      path: 'site/config/create',
      name: 'SiteConfigCreate',
      component: () => import('@/views/system/site_config/create/index.vue'),
      meta: {
        locale: 'site.config.menu.create',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        hideInMenu: true,
        activeMenu: 'SiteConfig',
      },
    },
    {
      path: 'site/config/update',
      name: 'SiteConfigUpdate',
      component: () => import('@/views/system/site_config/update/index.vue'),
      meta: {
        locale: 'site.config.menu.update',
        requiresAuth: true,
        roles: ['reseller', 'admin'],
        hideInMenu: true,
        activeMenu: 'SiteConfig',
      },
    },
    {
      path: 'config',
      name: 'SysConfig',
      component: () => import('@/views/system/config/list/index.vue'),
      meta: {
        locale: 'sys.config.menu',
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'SysConfig',
      },
    },
  ],
};

export default SYS;
