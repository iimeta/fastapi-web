import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const FINANCE_DEAL: AppRouteRecordRaw = {
  path: '/finance',
  name: 'deal',
  component: DEFAULT_LAYOUT,
  redirect: '/finance/deal',
  meta: {
    locale: 'finance.menu.deal_record',
    requiresAuth: true,
    icon: 'icon-wechatpay',
    order: 118,
    hideChildrenInMenu: true,
    roles: ['user', 'reseller', 'admin'],
  },
  children: [
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

export default FINANCE_DEAL;
