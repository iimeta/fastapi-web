import axios from 'axios';
import qs from 'query-string';

export interface KeyCreateBaseInfo {
  corp: string;
  key: string;
  remark: string;
}

export interface KeyCreateAdvanced {
  models: string[];
}

export type KeyCreate = KeyCreateBaseInfo & KeyCreateAdvanced;

export function submitKeyCreate(data: KeyCreate) {
  return axios.post('/api/v1/key/create', data);
}

export interface KeyPage {
  id: string;
  type: number;
  app_id: number;
  corp: string;
  key: string;
  quota: number;
  models: string[];
  model_names: string[];
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
  id: string;
}

export interface KeyDetail {
  id: string;
  type: number;
  app_id: number;
  corp: string;
  key: string;
  quota: number;
  models: string[];
  model_names: string[];
  ip_whitelist: string[];
  ip_blacklist: string[];
  status: number;
  remark: string;
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
}

export interface KeyUpdateAdvanced {
  models: string[];
}

export type KeyUpdate = KeyUpdateBaseInfo & KeyUpdateAdvanced;

export function submitKeyUpdate(data: KeyUpdate) {
  return axios.post('/api/v1/key/update', data);
}
