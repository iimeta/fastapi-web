import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LOG: AppRouteRecordRaw = {
  path: '/log',
  name: 'log',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.text',
    requiresAuth: true,
    icon: 'icon-message',
    order: 130,
  },
  children: [
    {
      path: 'text',
      name: 'TextList',
      component: () => import('@/views/log/list/text.vue'),
      meta: {
        locale: 'menu.text.list',
        requiresAuth: true,
        roles: ['reseller', 'user', 'admin'],
         activeMenu: 'TextList',
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
