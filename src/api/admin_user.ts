import axios from 'axios';
import qs from 'query-string';

export interface UserCreate {
  name: string;
  account: string;
  password: string;
  terminal: string;
  quota: any;
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
  phone: string;
  quota: number;
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
  id: string;
  user_id: number;
  name: string;
  models: string[];
  status: number;
  remark: string;
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
  phone: string;
  email: string;
  quota: number;
  model_names: string[];
  status: number;
  remark: string;
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

export interface UserUpdateBaseInfo {
  id: string;
  name: string;
  remark: string;
}
export interface UserUpdateAdvanced {
  models: string[];
  is_limit_quota: boolean;
  quota: any;
  ip_whitelist: string;
  ip_blacklist: string;
}

export type UserUpdate = UserUpdateBaseInfo & UserUpdateAdvanced;

export function submitUserUpdate(data: UserUpdate) {
  return axios.post('/api/v1/admin/user/update', data);
}

export interface UserChangeStatus {
  id: string;
  status: number;
}

export function submitUserChangeStatus(data: UserChangeStatus) {
  return axios.post('/api/v1/admin/user/change/status', data);
}

export interface UserGrantQuotaParams {
  user_id: any;
}

export interface UserGrantQuota {
  id: string;
  user_id: number;
  quota: number;
}

export function submitUserGrantQuota(data: UserGrantQuota) {
  return axios.post('/api/v1/admin/user/grant/quota', data);
}

export interface UserModelsParams {
  user_id: any;
  models: string[];
}

export interface UserModels {
  id: string;
  user_id: number;
  models: string[];
}

export function submitUserModels(data: UserModels) {
  return axios.post('/api/v1/admin/user/models', data);
}
