import axios from 'axios';
import qs from 'query-string';

export interface AppBaseInfo {
  corp: string;
  app: string;
  remark: string;
}

export interface AppAdvanced {
  models: string[];
}

export type AppCreate = AppBaseInfo & AppAdvanced;

export function submitAppCreate(data: AppCreate) {
  return axios.post('/api/v1/app/create', data);
}

export interface AppPage {
  id: string;
  corp: string;
  app: string;
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

export interface AppPageParams extends Partial<AppPage> {
  current: number;
  pageSize: number;
}

export interface AppPageRes {
  items: AppPage[];
  paging: Paging;
}

export function queryAppPage(params: AppPageParams) {
  return axios.get<AppPageRes>('/api/v1/app/page', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
