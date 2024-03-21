import axios from 'axios';
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
