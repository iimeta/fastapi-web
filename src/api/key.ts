import axios from 'axios';

export interface KeyBaseInfo {
  corp: string;
  key: string;
  remark: string;
}

export interface KeyAdvanced {
  models: string[];
}

export type KeyCreate = KeyBaseInfo & KeyAdvanced;

export function submitKeyCreate(data: KeyCreate) {
  return axios.post('/api/v1/key/create', data);
}

export interface KeyPage {
  id: string;
  corp: string;
  key: string;
  quota: number;
  models: string[];
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
