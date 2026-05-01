import axios from 'axios';

export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface InviteProfile {
  invite_code: string;
  invite_link: string;
  invite_rule_text: string;
  invite_reward_quota: number;
  invitee_grant_quota: number;
  total_invites: number;
  pending_quota: number;
  applying_quota: number;
  credited_quota: number;
  current_quota: number;
  invite_min_apply_quota: number;
  invite_recharge_rebate_enabled: boolean;
  invite_recharge_rebate_first_enabled: boolean;
  invite_recharge_rebate_first_type: string;
  invite_recharge_rebate_first_rate: number;
  invite_recharge_rebate_first_quota: number;
  invite_recharge_rebate_second_enabled: boolean;
  invite_recharge_rebate_second_type: string;
  invite_recharge_rebate_second_rate: number;
  invite_recharge_rebate_second_quota: number;
}

export function queryInviteProfile() {
  return axios.get<InviteProfile>('/api/v1/invite/profile');
}

export interface InviteRelationPage {
  id: string;
  invite_code: string;
  inviter_user_id: number;
  invitee_user_id: number;
  rid: number;
  domain: string;
  terminal: string;
  channel: string;
  account: string;
  ip: string;
  status: number;
  reward_quota: number;
  reward_id: string;
  remark: string;
  created_at: string;
  updated_at: string;
}

export interface InviteRelationPageParams
  extends Partial<Omit<InviteRelationPage, 'created_at'>> {
  current: number;
  pageSize: number;
  created_at?: string[];
}

export interface InviteRelationPageRes {
  items: InviteRelationPage[];
  paging: Paging;
}

export function queryInviteRelationPage(params: InviteRelationPageParams) {
  return axios.post<InviteRelationPageRes>(
    '/api/v1/invite/relations/page',
    params
  );
}

export function queryManageInviteRelationPage(
  params: InviteRelationPageParams
) {
  return axios.post<InviteRelationPageRes>(
    '/api/v1/invite/manage/relations/page',
    params
  );
}

export interface InviteRewardPage {
  id: string;
  relation_id: string;
  inviter_user_id: number;
  invitee_user_id: number;
  rid: number;
  quota: number;
  status: number;
  trigger_type: string;
  source_deal_record_id: string;
  recharge_sequence: number;
  recharge_quota: number;
  rebate_type: string;
  rebate_rate: number;
  rebate_quota: number;
  apply_order_id: string;
  deal_record_id: string;
  credited_at: string;
  rejected_reason: string;
  cancelled_reason: string;
  created_at: string;
  updated_at: string;
}

export interface InviteRewardPageParams
  extends Partial<Omit<InviteRewardPage, 'created_at'>> {
  current: number;
  pageSize: number;
  created_at?: string[];
}

export interface InviteRewardPageRes {
  items: InviteRewardPage[];
  paging: Paging;
}

export function queryInviteRewardPage(params: InviteRewardPageParams) {
  return axios.post<InviteRewardPageRes>('/api/v1/invite/rewards/page', params);
}

export function queryManageInviteRewardPage(params: InviteRewardPageParams) {
  return axios.post<InviteRewardPageRes>(
    '/api/v1/invite/manage/rewards/page',
    params
  );
}

export function submitInviteRewardApply(rewardIds: string[]) {
  return axios.post('/api/v1/invite/reward/apply', { reward_ids: rewardIds });
}

export function submitManageInviteRewardsCancel(
  ids: string[],
  cancelledReason?: string
) {
  return axios.post('/api/v1/invite/manage/rewards/cancel', {
    ids,
    cancelled_reason: cancelledReason,
  });
}

export interface InviteRewardApplyPage {
  id: string;
  order_no: string;
  user_id: number;
  rid: number;
  reward_ids: string[];
  total_quota: number;
  status: number;
  audit_role: string;
  audit_user_id: number;
  audit_remark: string;
  reject_reason: string;
  deal_record_id: string;
  applied_at: string;
  audited_at: string;
  credited_at: string;
  created_at: string;
  updated_at: string;
}

export interface InviteRewardApplyPageParams
  extends Partial<Omit<InviteRewardApplyPage, 'applied_at'>> {
  current: number;
  pageSize: number;
  applied_at?: string[];
}

export interface InviteRewardApplyPageRes {
  items: InviteRewardApplyPage[];
  paging: Paging;
}

export function queryInviteRewardApplyPage(
  params: InviteRewardApplyPageParams
) {
  return axios.post<InviteRewardApplyPageRes>(
    '/api/v1/invite/reward/apply/page',
    params
  );
}

export function queryManageInviteRewardApplyPage(
  params: InviteRewardApplyPageParams
) {
  return axios.post<InviteRewardApplyPageRes>(
    '/api/v1/invite/manage/reward/apply/page',
    params
  );
}

export function submitManageInviteRewardApplyApprove(
  id: string,
  auditRemark?: string
) {
  return axios.post('/api/v1/invite/manage/reward/apply/approve', {
    id,
    audit_remark: auditRemark,
  });
}

export function submitManageInviteRewardApplyReject(
  id: string,
  rejectReason?: string,
  returnPending?: boolean,
  auditRemark?: string
) {
  return axios.post('/api/v1/invite/manage/reward/apply/reject', {
    id,
    reject_reason: rejectReason,
    return_pending: returnPending,
    audit_remark: auditRemark,
  });
}
