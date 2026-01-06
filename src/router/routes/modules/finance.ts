import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const FINANCE: AppRouteRecordRaw = {
  path: '/finance',
  name: 'finance',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'finance.menu',
    requiresAuth: true,
    icon: 'icon-wechatpay',
    order: 120,
  },
  children: [
    {
      path: 'bill',
      name: 'BillList',
      component: () => import('@/views/finance/list/bill.vue'),
      meta: {
        locale: 'finance.menu.bill',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'BillList',
      },
    },
    {
      path: 'deal',
      name: 'DealRecordList',
      component: () => import('@/views/finance/list/deal_record.vue'),
      meta: {
        locale: 'finance.menu.deal_record',
        requiresAuth: true,
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'DealRecordList',
      },
    },
  ],
};

export default FINANCE;
