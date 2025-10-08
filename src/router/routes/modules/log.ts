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
    order: 130,
  },
  children: [
    {
      path: 'chat',
      name: 'ChatList',
      component: () => import('@/views/log/list/chat.vue'),
      meta: {
        locale: 'menu.chat.list',
        requiresAuth: true,
        roles: ['reseller', 'user', 'admin'],
         activeMenu: 'ChatList',
      },
    },
    {
      path: 'image',
      name: 'ImageList',
      component: () => import('@/views/log/list/image.vue'),
      meta: {
        locale: 'menu.image.list',
        requiresAuth: true,
        roles: ['reseller', 'user', 'admin'],
        activeMenu: 'ImageList',
      },
    },
    {
      path: 'audio',
      name: 'AudioList',
      component: () => import('@/views/log/list/audio.vue'),
      meta: {
        locale: 'menu.audio.list',
        requiresAuth: true,
        roles: ['reseller', 'user', 'admin'],
        activeMenu: 'AudioList',
      },
    },
  ],
};

export default LOG;
