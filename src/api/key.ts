import axios from 'axios';
import qs from 'query-string';

export interface KeyCreateBaseInfo {
  corp: string;
  key: string;
  remark: string;
}

export interface KeyCreateAdvanced {
  lb_strategy: string;
  weight: any;
  models: string[];
  model_agents: string[];
  is_agents_only: boolean;
}

export type KeyCreate = KeyCreateBaseInfo & KeyCreateAdvanced;

export function submitKeyCreate(data: KeyCreate) {
  return axios.post('/api/v1/key/create', data);
}

export interface KeyPage {
  id: string;
  type: number;
  user_id: any;
  app_id: any;
  corp: string;
  corp_name: string;
  key: string;
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

export interface KeyPageParams extends Partial<KeyPage> {
  current: number;
  pageSize: number;
}

export interface KeyPageRes {
  items: KeyPage[];
  paging: Paging;
}

export function queryKeyPage(params: KeyPageParams) {
  return axios.post<KeyPageRes>('/api/v1/key/page', params);
}

export interface KeyDeleteParams {
  id: string;
}

export function submitKeyDelete(params: KeyDeleteParams) {
  return axios.post('/api/v1/key/delete', params);
}

export interface KeyDetailParams {
  id: any;
}

export interface KeyDetail {
  id: string;
  type: number;
  user_id: number;
  app_id: number;
  corp: string;
  corp_name: string;
  key: string;
  quota: number;
  used_quota: number;
  quota_expires_at: string;
  lb_strategy: number;
  weight: number;
  models: string[];
  model_names: string[];
  model_agents: string[];
  model_agent_names: string[];
  is_limit_quota: boolean;
  is_agents_only: boolean;
  ip_whitelist: string[];
  ip_blacklist: string[];
  status: number;
  remark: string;
  is_auto_disabled: boolean;
  auto_disabled_reason: string;
  created_at: string;
  updated_at: string;
}

export function queryKeyDetail(params: KeyDetailParams) {
  return axios.get<KeyDetail>('/api/v1/key/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface KeyUpdateBaseInfo {
  id: string;
  corp: string;
  key: string;
  remark: string;
  status: number;
}

export interface KeyUpdateAdvanced {
  lb_strategy: string;
  weight: any;
  models: string[];
  model_agents: string[];
  is_agents_only: boolean;
}

export type KeyUpdate = KeyUpdateBaseInfo & KeyUpdateAdvanced;

export function submitKeyUpdate(data: KeyUpdate) {
  return axios.post('/api/v1/key/update', data);
}

export interface KeyChangeStatus {
  id: string;
  status: number;
}

export function submitKeyChangeStatus(data: KeyChangeStatus) {
  return axios.post('/api/v1/key/change/status', data);
}

export interface KeyBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
}

export function submitKeyBatchOperate(data: KeyBatchOperate) {
  return axios.post('/api/v1/key/batch/operate', data);
}
