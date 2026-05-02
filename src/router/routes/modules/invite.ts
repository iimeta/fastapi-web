import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const INVITE: AppRouteRecordRaw = {
  path: '/invite',
  name: 'invite',
  component: DEFAULT_LAYOUT,
  redirect: () =>
    localStorage.getItem('userRole') === 'user'
      ? '/invite/rewards'
      : '/invite/manage/relations',
  meta: {
    locale: 'invite.menu',
    requiresAuth: true,
    icon: 'lucide-gift',
    order: 117,
    roles: ['user', 'reseller', 'admin'],
  },
  children: [
    // {
    //   path: 'relations',
    //   name: 'InviteRelations',
    //   component: () => import('@/views/invite/relations/index.vue'),
    //   meta: {
    //     locale: 'invite.menu.relations',
    //     requiresAuth: true,
    //     icon: 'lucide-users-round',
    //     roles: ['user'],
    //     activeMenu: 'InviteRelations',
    //   },
    // },
    {
      path: 'rewards',
      name: 'InviteRewards',
      component: () => import('@/views/invite/rewards/index.vue'),
      meta: {
        locale: 'invite.menu.rewards',
        requiresAuth: true,
        icon: 'lucide-coins',
        roles: ['user'],
        activeMenu: 'InviteRewards',
      },
    },
    {
      path: 'apply',
      name: 'InviteApply',
      component: () => import('@/views/invite/apply/index.vue'),
      meta: {
        locale: 'invite.menu.apply',
        requiresAuth: true,
        icon: 'lucide-clipboard-check',
        roles: ['user'],
        activeMenu: 'InviteApply',
      },
    },
    {
      path: 'manage/relations',
      name: 'ManageInviteRelations',
      component: () => import('@/views/invite/manage/relations.vue'),
      meta: {
        locale: 'invite.menu.manage.relations',
        requiresAuth: true,
        icon: 'lucide-users-round',
        roles: ['reseller', 'admin'],
        activeMenu: 'ManageInviteRelations',
      },
    },
    {
      path: 'manage/rewards',
      name: 'ManageInviteRewards',
      component: () => import('@/views/invite/manage/rewards.vue'),
      meta: {
        locale: 'invite.menu.manage.rewards',
        requiresAuth: true,
        icon: 'lucide-coins',
        roles: ['reseller', 'admin'],
        activeMenu: 'ManageInviteRewards',
      },
    },
    {
      path: 'manage/apply',
      name: 'ManageInviteApply',
      component: () => import('@/views/invite/manage/apply.vue'),
      meta: {
        locale: 'invite.menu.manage.apply',
        requiresAuth: true,
        icon: 'lucide-clipboard-check',
        roles: ['reseller', 'admin'],
        activeMenu: 'ManageInviteApply',
      },
    },
  ],
};

export default INVITE;
