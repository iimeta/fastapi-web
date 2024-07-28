import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const FINANCE: AppRouteRecordRaw = {
  path: '/finance',
  name: 'finance',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.finance',
    requiresAuth: true,
    icon: 'icon-wechatpay',
    order: 10,
  },
  children: [
    {
      path: 'deal_record',
      name: 'DealRecordList',
      component: () => import('@/views/finance/list/deal_record.vue'),
      meta: {
        locale: 'menu.deal_record.list',
        requiresAuth: true,
        roles: ['admin', 'user'],
      },
    },
  ],
};

export default FINANCE;
