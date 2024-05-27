import axios from 'axios';
import qs from 'query-string';

export interface CorpCreate {
  name: string;
  code: string;
  remark: string;
}

export function submitCorpCreate(data: CorpCreate) {
  return axios.post('/api/v1/corp/create', data);
}

export interface CorpPage {
  id: string;
  name: string;
  code: string;
  status: number;
  remark: string;
}
export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface CorpPageParams extends Partial<CorpPage> {
  current: number;
  pageSize: number;
}

export interface CorpPageRes {
  items: CorpPage[];
  paging: Paging;
}

export function queryCorpPage(params: CorpPageParams) {
  return axios.post<CorpPageRes>('/api/v1/corp/page', params);
}

export interface CorpList {
  id: string;
  name: string;
  code: string;
  status: number;
  remark: string;
}

export interface CorpListRes {
  items: CorpList[];
}

export function queryCorpList() {
  return axios.get<CorpListRes>('/api/v1/corp/list');
}

export interface CorpDeleteParams {
  id: string;
}

export function submitCorpDelete(params: CorpDeleteParams) {
  return axios.post('/api/v1/corp/delete', params);
}

export interface CorpDetailParams {
  id: any;
}

export interface CorpDetail {
  id: string;
  name: string;
  code: string;
  status: number;
  remark: string;
  created_at: string;
  updated_at: string;
}

export function queryCorpDetail(params: CorpDetailParams) {
  return axios.get<CorpDetail>('/api/v1/corp/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface CorpUpdate {
  id: string;
  name: string;
  code: string;
  remark: string;
  status: number;
}

export function submitCorpUpdate(data: CorpUpdate) {
  return axios.post('/api/v1/corp/update', data);
}

export interface CorpChangeStatus {
  id: string;
  status: number;
}

export function submitCorpChangeStatus(data: CorpChangeStatus) {
  return axios.post('/api/v1/corp/change/status', data);
}

export interface CorpBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
}

export function submitCorpBatchOperate(data: CorpBatchOperate) {
  return axios.post('/api/v1/corp/batch/operate', data);
}
