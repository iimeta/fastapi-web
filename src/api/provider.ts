import axios from 'axios';
import qs from 'query-string';

export interface ProviderCreate {
  name: string;
  code: string;
  sort: any;
  is_public: boolean;
  remark: string;
}

export function submitProviderCreate(data: ProviderCreate) {
  return axios.post('/api/v1/provider/create', data);
}

export interface ProviderPage {
  id: string;
  name: string;
  code: string;
  sort: number;
  is_public: boolean;
  status: number;
  remark: string;
}
export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface ProviderPageParams extends Partial<ProviderPage> {
  current: number;
  pageSize: number;
}

export interface ProviderPageRes {
  items: ProviderPage[];
  paging: Paging;
}

export function queryProviderPage(params: ProviderPageParams) {
  return axios.post<ProviderPageRes>('/api/v1/provider/page', params);
}

export interface ProviderList {
  id: string;
  name: string;
  code: string;
  sort: number;
  is_public: boolean;
  status: number;
  remark: string;
}

export interface ProviderListRes {
  items: ProviderList[];
}

export function queryProviderList() {
  return axios.get<ProviderListRes>('/api/v1/provider/list');
}

export interface ProviderDeleteParams {
  id: string;
}

export function submitProviderDelete(params: ProviderDeleteParams) {
  return axios.post('/api/v1/provider/delete', params);
}

export interface ProviderDetailParams {
  id: any;
}

export interface ProviderDetail {
  id: string;
  name: string;
  code: string;
  sort: number;
  status: number;
  is_public: boolean;
  remark: string;
  created_at: string;
  updated_at: string;
}

export function queryProviderDetail(params: ProviderDetailParams) {
  return axios.get<ProviderDetail>('/api/v1/provider/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface ProviderUpdate {
  id: string;
  name: string;
  code: string;
  sort: number;
  is_public: boolean;
  remark: string;
  status: number;
}

export function submitProviderUpdate(data: ProviderUpdate) {
  return axios.post('/api/v1/provider/update', data);
}

export interface ProviderChangePublic {
  id: string;
  is_public: any;
}

export function submitProviderChangePublic(data: ProviderChangePublic) {
  return axios.post('/api/v1/provider/change/public', data);
}

export interface ProviderChangeStatus {
  id: string;
  status: number;
}

export function submitProviderChangeStatus(data: ProviderChangeStatus) {
  return axios.post('/api/v1/provider/change/status', data);
}

export interface ProviderBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
}

export function submitProviderBatchOperate(data: ProviderBatchOperate) {
  return axios.post('/api/v1/provider/batch/operate', data);
}
