import axios from 'axios';
import qs from 'query-string';

export interface UserCreate {
  name: string;
  email: string;
  account: string;
  password: string;
  quota: any;
  quota_expires_at: string;
  models: string[];
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
  models: string[];
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
  id: string;
}

export function submitUserDelete(params: UserDeleteParams) {
  return axios.post('/api/v1/admin/user/delete', params);
}

export interface UserDetailParams {
  id: any;
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
  model_names: string[];
  quota_warning: boolean;
  warning_threshold: number;
  expire_warning_threshold: number;
  warning_notice: boolean;
  exhaustion_notice: boolean;
  expire_warning_notice: boolean;
  expire_notice: boolean;
  remark: string;
  status: number;
  login_ip: string;
  login_time: string;
  login_domain: string;
  created_at: string;
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
  quota_expires_at: string;
  remark: string;
  status: number;
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
  quota_expires_at: string;
}

export function submitUserRecharge(data: UserRecharge) {
  return axios.post('/api/v1/admin/user/recharge', data);
}

export interface UserPermissionsParams {
  user_id: any;
  models: string[];
}

export interface UserPermissions {
  id: string;
  user_id: number;
  models: string[];
}

export function submitUserPermissions(data: UserPermissions) {
  return axios.post('/api/v1/admin/user/permissions', data);
}

export interface UserBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
  quota_expires_at?: string;
}

export function submitUserBatchOperate(data: UserBatchOperate) {
  return axios.post('/api/v1/admin/user/batch/operate', data);
}
