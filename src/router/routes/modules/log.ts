import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LOG: AppRouteRecordRaw = {
  path: '/log',
  name: 'log',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.chat',
    requiresAuth: true,
    icon: 'icon-message',
    order: 11,
  },
  children: [
    {
      path: 'chat',
      name: 'ChatList',
      component: () => import('@/views/log/chat/list/index.vue'),
      meta: {
        locale: 'menu.chat.list',
        requiresAuth: true,
        roles: ['admin', 'user'],
      },
    },
    {
      path: 'image',
      name: 'ImageList',
      component: () => import('@/views/log/image/list/index.vue'),
      meta: {
        locale: 'menu.image.list',
        requiresAuth: true,
        roles: ['admin', 'user'],
      },
    },
    {
      path: 'audio',
      name: 'AudioList',
      component: () => import('@/views/log/audio/list/index.vue'),
      meta: {
        locale: 'menu.audio.list',
        requiresAuth: true,
        roles: ['admin', 'user'],
      },
    },
  ],
};

export default LOG;
