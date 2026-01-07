import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MODEL_AGENT: AppRouteRecordRaw = {
  path: '/model/agent',
  name: 'model_agent',
  component: DEFAULT_LAYOUT,
  redirect: '/model/agent/list',
  meta: {
    locale: 'model.agent.menu',
    requiresAuth: true,
    icon: 'icon-bug',
    order: 40,
    hideChildrenInMenu: true,
    roles: ['admin'],
  },
  children: [
    {
      path: 'list',
      name: 'ModelAgentList',
      component: () => import('@/views/model_agent/list/index.vue'),
      meta: {
        locale: 'model.agent.menu',
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'model_agent',
      },
    },
    {
      path: 'create',
      name: 'ModelAgentCreate',
      component: () => import('@/views/model_agent/create/index.vue'),
      meta: {
        locale: 'model.agent.menu.create',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'model_agent',
      },
    },
    {
      path: 'update',
      name: 'ModelAgentUpdate',
      component: () => import('@/views/model_agent/update/index.vue'),
      meta: {
        locale: 'model.agent.menu.update',
        requiresAuth: true,
        roles: ['admin'],
        hideInMenu: true,
        activeMenu: 'model_agent',
      },
    },
  ],
};

export default MODEL_AGENT;
