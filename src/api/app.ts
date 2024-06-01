import axios from 'axios';
import qs from 'query-string';

export interface AppCreateBaseInfo {
  name: string;
  remark: string;
}

export interface AppCreateAdvanced {
  models: string[];
  is_limit_quota: boolean;
  quota: any;
  quota_expires_at: string;
  ip_whitelist: string;
  ip_blacklist: string;
}

export type AppCreate = AppCreateBaseInfo & AppCreateAdvanced;

export function submitAppCreate(data: AppCreate) {
  return axios.post('/api/v1/app/create', data);
}

export interface AppPage {
  id: string;
  app_id: number;
  name: string;
  models: string[];
  model_names: string[];
  quota: number;
  used_quota: number;
  quota_expires_at: string;
  status: number;
  remark: string;
}
export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface AppPageParams extends Partial<AppPage> {
  current: number;
  pageSize: number;
}

export interface AppPageRes {
  items: AppPage[];
  paging: Paging;
}

export function queryAppPage(params: AppPageParams) {
  return axios.post<AppPageRes>('/api/v1/app/page', params);
}

export interface AppList {
  id: string;
  app_id: number;
  name: string;
  models: string[];
  status: number;
  remark: string;
}

export interface AppListRes {
  items: AppList[];
}

export function queryAppList() {
  return axios.get<AppListRes>('/api/v1/app/list');
}

export interface AppDeleteParams {
  id: string;
}

export function submitAppDelete(params: AppDeleteParams) {
  return axios.post('/api/v1/app/delete', params);
}

export interface AppDetailParams {
  id: any;
}

export interface AppDetail {
  id: string;
  app_id: number;
  name: string;
  models: string[];
  model_names: string[];
  is_limit_quota: boolean;
  quota: number;
  used_quota: number;
  quota_expires_at: string;
  ip_whitelist: string[];
  ip_blacklist: string[];
  status: number;
  remark: string;
  created_at: string;
  updated_at: string;
}

export function queryAppDetail(params: AppDetailParams) {
  return axios.get<AppDetail>('/api/v1/app/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface AppUpdateBaseInfo {
  id: string;
  name: string;
  remark: string;
  status: number;
}

export interface AppUpdateAdvanced {
  models: string[];
  is_limit_quota: boolean;
  quota: any;
  quota_expires_at: string;
  ip_whitelist: string;
  ip_blacklist: string;
}

export type AppUpdate = AppUpdateBaseInfo & AppUpdateAdvanced;

export function submitAppUpdate(data: AppUpdate) {
  return axios.post('/api/v1/app/update', data);
}

export interface AppChangeStatus {
  id: string;
  status: number;
}

export function submitAppChangeStatus(data: AppChangeStatus) {
  return axios.post('/api/v1/app/change/status', data);
}

export interface AppCreateKeyParams {
  app_id: any;
}

export function submitAppCreateKey(data: AppCreateKeyParams) {
  return axios.post('/api/v1/app/create/key', data);
}

export interface AppKeyConfig {
  id: string;
  app_id: number;
  key: string;
  is_limit_quota: boolean;
  quota: number;
  quota_expires_at: string;
  models: string[];
  ip_whitelist: string;
  ip_blacklist: string;
  remark: string;
}

export function submitAppKeyConfig(data: AppKeyConfig) {
  return axios.post('/api/v1/app/key/config', data);
}
