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
    order: 120,
  },
  children: [
    {
      path: 'bill_list',
      name: 'BillList',
      component: () => import('@/views/finance/list/bill_list.vue'),
      meta: {
        locale: 'menu.bill.list',
        requiresAuth: true,
        roles: ['reseller', 'user', 'admin'],
        activeMenu: 'BillList',
      },
    },
    {
      path: 'deal_record',
      name: 'DealRecordList',
      component: () => import('@/views/finance/list/deal_record.vue'),
      meta: {
        locale: 'menu.deal_record.list',
        requiresAuth: true,
        roles: ['reseller', 'user', 'admin'],
        activeMenu: 'DealRecordList',
      },
    },
  ],
};

export default FINANCE;
