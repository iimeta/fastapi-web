import axios from 'axios';
import qs from 'query-string';

export interface AppKeyCreate {
  app_id: any;
}

export function submitAppKeyCreate(data: AppKeyCreate) {
  return axios.post('/api/v1/app/key/create', data);
}

export interface AppKeyConfig {
  id: string;
  app_id: number;
  key: string;
  billing_methods: number[];
  models: string[];
  is_limit_quota: boolean;
  quota: number;
  quota_expires_rule: string;
  quota_expires_at: string;
  quota_expires_minutes: any;
  is_bind_group: boolean;
  group: string;
  ip_whitelist: string;
  ip_blacklist: string;
  remark: string;
}

export function submitAppKeyConfig(data: AppKeyConfig) {
  return axios.post('/api/v1/app/key/config', data);
}

export interface AppKeyPage {
  id: string;
  type: number;
  user_id: any;
  app_id: any;
  provider_id: string;
  provider_name: string;
  key: string;
  billing_methods: number[];
  quota: number;
  models: string[];
  model_names: string[];
  model_agents: string[];
  ip_whitelist: string[];
  ip_blacklist: string[];
  status: number;
  remark: string;
}

export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface AppKeyPageParams extends Partial<AppKeyPage> {
  current: number;
  pageSize: number;
}

export interface AppKeyPageRes {
  items: AppKeyPage[];
  paging: Paging;
}

export function queryAppKeyPage(params: AppKeyPageParams) {
  return axios.post<AppKeyPageRes>('/api/v1/app/key/page', params);
}

export interface AppKeyDeleteParams {
  id: string;
}

export function submitAppKeyDelete(params: AppKeyDeleteParams) {
  return axios.post('/api/v1/app/key/delete', params);
}

export interface AppKeyDetailParams {
  id: any;
}

export interface AppKeyDetail {
  id: string;
  type: number;
  user_id: number;
  app_id: number;
  provider_id: string;
  provider_name: string;
  key: string;
  billing_methods: number[];
  quota: number;
  used_quota: number;
  quota_expires_rule: number;
  quota_expires_at: string;
  quota_expires_minutes: number;
  weight: number;
  models: string[];
  model_names: string[];
  model_agents: string[];
  model_agent_names: string[];
  is_limit_quota: boolean;
  is_agents_only: boolean;
  is_never_disable: boolean;
  is_bind_group: boolean;
  group: string;
  group_name: string;
  ip_whitelist: string[];
  ip_blacklist: string[];
  status: number;
  remark: string;
  is_auto_disabled: boolean;
  auto_disabled_reason: string;
  created_at: string;
  updated_at: string;
}

export function queryAppKeyDetail(params: AppKeyDetailParams) {
  return axios.get<AppKeyDetail>('/api/v1/app/key/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface AppKeyChangeStatus {
  id: string;
  status: number;
}

export function submitAppKeyChangeStatus(data: AppKeyChangeStatus) {
  return axios.post('/api/v1/app/key/change/status', data);
}

export interface AppKeyQueryParams {
  user_id?: number;
  app_id?: number;
  key?: string;
  models?: string[];
  quota?: number;
  quota_expires_at?: any;
  status?: any;
  remark?: string;
}

export interface AppKeyBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
  id?: string;
  user_id?: number;
  app_id?: number;
  key?: string;
  n?: number;
  billing_methods?: number[];
  models?: string[];
  is_limit_quota?: boolean;
  quota?: number;
  quota_expires_rule?: string;
  quota_expires_at?: any;
  quota_expires_minutes?: any;
  is_bind_group?: boolean;
  group?: string;
  ip_whitelist?: string;
  ip_blacklist?: string;
  remark?: string;
  query_params?: AppKeyQueryParams;
}

export function submitAppKeyBatchOperate(data: AppKeyBatchOperate) {
  return axios.post('/api/v1/app/key/batch/operate', data);
}

export interface AppKeyExportParams {
  ids?: string[];
  user_id?: number;
  app_id?: number;
}

export function submitAppKeyExport(params: AppKeyExportParams) {
  return axios.post('/api/v1/app/key/export', params, {
    responseType: 'blob',
  });
}
