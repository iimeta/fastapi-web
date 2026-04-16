import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const FINANCE_BILL: AppRouteRecordRaw = {
  path: '/finance',
  name: 'bill',
  component: DEFAULT_LAYOUT,
  redirect: '/finance/bill',
  meta: {
    locale: 'finance.menu.bill',
    requiresAuth: true,
    icon: 'lucide-receipt-text',
    order: 116,
    hideChildrenInMenu: true,
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
        roles: ['user', 'reseller', 'admin'],
        activeMenu: 'BillList',
      },
    },
  ],
};

export default FINANCE_BILL;
