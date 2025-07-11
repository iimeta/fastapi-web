import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const AGENT: AppRouteRecordRaw = {
  path: '/agent',
  name: 'agent',
  component: DEFAULT_LAYOUT,
  redirect: '/agent/list',
  meta: {
    locale: 'menu.agent',
    requiresAuth: true,
    icon: 'icon-bug',
    order: 50,
    hideChildrenInMenu: true,
    roles: ['admin'],
  },
  children: [
    {
      path: 'list',
      name: 'ModelAgentList',
      component: () => import('@/views/agent/list/index.vue'),
      meta: {
        locale: 'menu.model.agent.list',
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'agent',
      },
    },
    {
      path: 'create',
      name: 'ModelAgentCreate',
      component: () => import('@/views/agent/create/index.vue'),
      meta: {
        locale: 'menu.model.agent.create',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'agent',
      },
    },
    {
      path: 'update',
      name: 'ModelAgentUpdate',
      component: () => import('@/views/agent/update/index.vue'),
      meta: {
        locale: 'menu.model.agent.update',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'agent',
      },
    },
  ],
};

export default AGENT;
