import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const CHAT: AppRouteRecordRaw = {
  path: '/chat',
  name: 'chat',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.chat',
    requiresAuth: true,
    icon: 'icon-wechat',
    order: 9,
  },
  children: [
    {
      path: 'list',
      name: 'ChatList',
      component: () => import('@/views/chat/list/index.vue'),
      meta: {
        locale: 'menu.chat.list',
        requiresAuth: true,
        roles: ['admin', 'user'],
      },
    },
    {
      path: 'detail',
      name: 'ChatDetail',
      component: () => import('@/views/chat/detail/index.vue'),
      meta: {
        locale: 'menu.chat.detail',
        requiresAuth: true,
        roles: ['admin', 'user'],
        hideInMenu: true,
      },
    },
  ],
};

export default CHAT;
