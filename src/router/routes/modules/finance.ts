import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const FINANCE: AppRouteRecordRaw = {
  path: '/finance',
  name: 'finance',
  component: DEFAULT_LAYOUT,
  redirect: '/finance/bill',
  meta: {
    locale: 'finance.menu.bill',
    requiresAuth: true,
    icon: 'lucide-receipt-text',
    order: 116,
    roles: ['user', 'reseller', 'admin'],
  },
  children: [
    {
      path: 'bill',
      name: 'BillList',
      component: () => import('@/views/finance/list/bill.vue'),
      meta: {
        locale: 'finance.menu.bill',
        requiresAuth: true,
        icon: 'lucide-receipt-text',
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
        icon: 'lucide-circle-dollar-sign',
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'DealRecordList',
      },
    },
  ],
};

export default FINANCE;
