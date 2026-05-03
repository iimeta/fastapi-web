import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const TICKET: AppRouteRecordRaw = {
  path: '/ticket',
  name: 'ticket',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'ticket.menu',
    requiresAuth: true,
    icon: 'lucide-headset',
    order: 75,
    roles: ['*'],
    hideInMenu: true,
  },
  children: [
    {
      path: 'create',
      name: 'TicketCreate',
      component: () => import('@/views/ticket/create/index.vue'),
      meta: {
        locale: 'ticket.menu.create',
        requiresAuth: true,
        icon: 'lucide-circle-plus',
        roles: ['user', 'reseller'],
        activeMenu: 'TicketCreate',
      },
    },
    {
      path: 'my',
      name: 'TicketMyList',
      component: () => import('@/views/ticket/list/index.vue'),
      meta: {
        locale: 'ticket.menu.my_tickets',
        requiresAuth: true,
        icon: 'lucide-headset',
        roles: ['user', 'reseller'],
        activeMenu: 'TicketMyList',
      },
    },
    {
      path: 'list',
      name: 'TicketList',
      component: () => import('@/views/ticket/list/index.vue'),
      meta: {
        locale: 'ticket.menu.list',
        requiresAuth: true,
        icon: 'lucide-headset',
        roles: ['reseller', 'admin'],
        activeMenu: 'TicketList',
      },
    },
    {
      path: 'detail',
      name: 'TicketDetail',
      component: () => import('@/views/ticket/detail/index.vue'),
      meta: {
        locale: 'ticket.menu.detail',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};

export default TICKET;
