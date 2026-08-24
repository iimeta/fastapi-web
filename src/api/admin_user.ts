import axios from 'axios';
import qs from 'query-string';

export interface UserCreate {
  name: string;
  email: string;
  account: string;
  password: string;
  expires_at: string;
  quota: any;
  quota_type: any;
  quota_expires_at: string;
  is_cycle_reset_quota: boolean;
  reset_quota: any;
  cycle_period: any;
  period_unit: string;
  reset_mode: string;
  groups: string[];
  remark: string;
}

export function submitUserCreate(data: UserCreate) {
  return axios.post('/api/v1/admin/user/create', data);
}

export interface UserPage {
  id: string;
  user_id: number;
  name: string;
  email: string;
  quota: number;
  used_quota: number;
  quota_expires_at: any;
  expires_at: any;
  groups: string[];
  remark: string;
  status: number;
}
export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface UserPageParams extends Partial<UserPage> {
  current: number;
  pageSize: number;
}

export interface UserPageRes {
  items: UserPage[];
  paging: Paging;
}

export function queryUserPage(params: UserPageParams) {
  return axios.post<UserPageRes>('/api/v1/admin/user/page', params);
}

export interface UserList {
  user_id: number;
  name: string;
  status: number;
}

export interface UserListRes {
  items: UserList[];
}

export function queryUserList() {
  return axios.get<UserListRes>('/api/v1/admin/user/list');
}

export interface UserDeleteParams {
  id?: string;
  user_id?: any;
  name?: string;
  data: number[];
  action?: string;
}

export function submitUserDelete(params: UserDeleteParams) {
  return axios.post('/api/v1/admin/user/delete', params);
}

export interface UserDetailParams {
  id: any;
}

export interface UserPrivacy {
  is_configured: boolean;
  log_request_content: boolean;
  log_response_content: boolean;
  log_resource_url: boolean;
  log_client_ip: boolean;
  log_request_fields: string[];
  log_response_fields: string[];
  log_resource_fields: string[];
  log_network_fields: string[];
}

export interface PrivacyLogFieldOption {
  key: string;
  label: string;
  description?: string;
  log_types?: string[];
  enabled: boolean;
  sort?: number;
}

export interface LogPrivacy {
  is_enable_request: boolean;
  is_default_enable_request: boolean;
  request_privacy_fields: PrivacyLogFieldOption[];
  is_enable_response: boolean;
  is_default_enable_response: boolean;
  response_privacy_fields: PrivacyLogFieldOption[];
  is_enable_resource: boolean;
  is_default_enable_resource: boolean;
  resource_privacy_fields: PrivacyLogFieldOption[];
  is_enable_network: boolean;
  is_default_enable_network: boolean;
  network_privacy_fields: PrivacyLogFieldOption[];
}

export interface UserDetail {
  id: string;
  user_id: number;
  name: string;
  account: string;
  email: string;
  quota: number;
  used_quota: number;
  quota_expires_at: string;
  is_cycle_reset_quota: boolean;
  reset_quota: number;
  cycle_period: number;
  period_unit: string;
  reset_mode: string;
  reset_at: string;
  next_reset_at: string;
  groups: string[];
  group_names: string[];
  quota_warning: boolean;
  warning_threshold: number;
  expire_warning_threshold: number;
  warning_notice: boolean;
  exhaustion_notice: boolean;
  expire_warning_notice: boolean;
  expire_notice: boolean;
  remark: string;
  inviter_user_id: number;
  invite_code: string;
  status: number;
  rid: number;
  login_ip: string;
  login_time: string;
  login_domain: string;
  privacy?: UserPrivacy;
  log_privacy?: LogPrivacy;
  created_at: string;
  expires_at: string;
  updated_at: string;
}

export function queryUserDetail(params: UserDetailParams) {
  return axios.get<UserDetail>('/api/v1/admin/user/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface UserUpdate {
  id: string;
  name: string;
  email: string;
  account: string;
  password: string;
  expires_at: string;
  quota_expires_at: string;
  is_cycle_reset_quota: boolean;
  reset_quota: any;
  cycle_period: any;
  period_unit: string;
  reset_mode: string;
  groups: string[];
  remark: string;
  status: number;
  privacy?: UserPrivacy;
}

export function submitUserUpdate(data: UserUpdate) {
  return axios.post('/api/v1/admin/user/update', data);
}

export interface UserChangeQuotaExpire {
  id: string;
  quota_expires_at: string;
}

export function submitUserChangeQuotaExpire(data: UserChangeQuotaExpire) {
  return axios.post('/api/v1/admin/user/change/quota/expire', data);
}

export interface UserChangeStatus {
  id: string;
  status: number;
}

export function submitUserChangeStatus(data: UserChangeStatus) {
  return axios.post('/api/v1/admin/user/change/status', data);
}

export interface UserRechargeParams {
  user_id: any;
  quota_expires_at: string;
}

export interface UserRecharge {
  user_id: number;
  quota: any;
  quota_type: any;
  quota_expires_at: string;
  is_send_notice: boolean;
  is_recharge_rebate: boolean;
}

export function submitUserRecharge(data: UserRecharge) {
  return axios.post('/api/v1/admin/user/recharge', data);
}

export interface UserBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
  quota_type?: any;
  quota_expires_at?: string;
  is_send_notice?: boolean;
  is_recharge_rebate?: boolean;
  data?: number[];
}

export function submitUserBatchOperate(data: UserBatchOperate) {
  return axios.post('/api/v1/admin/user/batch/operate', data);
}
