import axios from 'axios';
import qs from 'query-string';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  account: string;
  password?: string;
  code?: string;
  terminal: string;
  channel: string;
  method: string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/v1/auth/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/v1/auth/logout');
}

export function getUserInfo() {
  return axios.get<UserState>('/api/v1/user/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

export interface CaptchaData {
  email: string;
  channel: string;
}

export function getCaptcha(data: CaptchaData) {
  return axios.post(`/api/v1/common/email-code`, data);
}

export interface RegisterData {
  account: string;
  password: string;
  terminal: string;
  code: string;
}

export function register(data: RegisterData) {
  return axios.post('/api/v1/auth/register', data);
}

export interface ForgetData {
  account: string;
  password: string;
  terminal: string;
  code: string;
}

export function forget(data: ForgetData) {
  return axios.post('/api/v1/auth/forget', data);
}


export interface UserCreate {
  name: string;
  account: string;
  password: string;
  terminal: string;
  quota: any;
  remark: string;
}

export function submitUserCreate(data: UserCreate) {
  return axios.post('/api/v1/user/create', data);
}

export interface UserPage {
  id: string;
  user_id: number;
  name: string;
  models: string[];
  model_names: string[];
  status: number;
  remark: string;
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
  return axios.post<UserPageRes>('/api/v1/user/page', params);
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
  return axios.get<UserListRes>('/api/v1/user/list');
}

export interface UserDeleteParams {
  id: string;
}

export function submitUserDelete(params: UserDeleteParams) {
  return axios.post('/api/v1/user/delete', params);
}

export interface UserDetailParams {
  id: any;
}

export interface UserDetail {
  id: string;
  user_id: number;
  name: string;
  models: string[];
  model_names: string[];
  is_limit_quota: boolean;
  quota: number;
  ip_whitelist: string[];
  ip_blacklist: string[];
  status: number;
  remark: string;
  created_at: string;
  updated_at: string;
}

export function queryUserDetail(params: UserDetailParams) {
  return axios.get<UserDetail>('/api/v1/user/detail', {
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
  return axios.post('/api/v1/user/update', data);
}
