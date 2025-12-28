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
      name: 'LogTextList',
      component: () => import('@/views/log/list/text.vue'),
      meta: {
        locale: 'menu.text.list',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'LogTextList',
      },
    },
    {
      path: 'image',
      name: 'LogImageList',
      component: () => import('@/views/log/list/image.vue'),
      meta: {
        locale: 'menu.image.list',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'LogImageList',
      },
    },
    {
      path: 'audio',
      name: 'LogAudioList',
      component: () => import('@/views/log/list/audio.vue'),
      meta: {
        locale: 'menu.audio.list',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'LogAudioList',
      },
    },
    {
      path: 'video',
      name: 'LogVideoList',
      component: () => import('@/views/log/list/video.vue'),
      meta: {
        locale: 'menu.video.list',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'LogVideoList',
      },
    },
    {
      path: 'file',
      name: 'LogFileList',
      component: () => import('@/views/log/list/file.vue'),
      meta: {
        locale: 'menu.file.list',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'LogFileList',
      },
    },
    {
      path: 'batch',
      name: 'LogBatchList',
      component: () => import('@/views/log/list/batch.vue'),
      meta: {
        locale: 'menu.batch.list',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'LogBatchList',
      },
    },
    {
      path: 'general',
      name: 'LogGeneralList',
      component: () => import('@/views/log/list/general.vue'),
      meta: {
        locale: 'menu.general.list',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'LogGeneralList',
      },
    },
  ],
};

export default LOG;
