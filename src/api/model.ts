import axios from 'axios';
import qs from 'query-string';

export interface ModelCreateBaseInfo {
  corp: string;
  name: string;
  model: string;
  type: string;
  remark: string;
}

export interface ModelCreateAdvanced {
  prompt_ratio: number;
  completion_ratio: number;
  data_format: string;
  base_url: string;
  path: string;
  proxy: string;
  is_public: boolean;
}

export type ModelCreate = ModelCreateBaseInfo & ModelCreateAdvanced;

export function submitModelCreate(data: ModelCreate) {
  return axios.post('/api/v1/model/create', data);
}

export interface ModelPage {
  id: string;
  corp: string;
  name: string;
  model: string;
  type: number;
  prompt_ratio: number;
  completion_ratio: number;
  data_format: number;
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

export interface ModelPageParams extends Partial<ModelPage> {
  current: number;
  pageSize: number;
}

export interface ModelPageRes {
  items: ModelPage[];
  paging: Paging;
}

export function queryModelPage(params: ModelPageParams) {
  return axios.post<ModelPageRes>('/api/v1/model/page', params);
}

export interface ModelList {
  id: string;
  corp: string;
  name: string;
  model: string;
  type: number;
  prompt_ratio: number;
  completion_ratio: number;
  data_format: number;
  is_public: boolean;
  status: number;
  remark: string;
}

export interface ModelListRes {
  items: ModelList[];
}

export function queryModelList() {
  return axios.get<ModelListRes>('/api/v1/model/list');
}

export interface ModelDeleteParams {
  id: string;
}

export function submitModelDelete(params: ModelDeleteParams) {
  return axios.post('/api/v1/model/delete', params);
}

export interface ModelDetailParams {
  id: string;
}

export interface ModelDetail {
  id: string;
  corp: string;
  name: string;
  model: string;
  type: string;
  prompt_ratio: number;
  completion_ratio: number;
  data_format: string;
  base_url: string;
  path: string;
  proxy: string;
  is_public: boolean;
  status: number;
  remark: string;
}

export function queryModelDetail(params: ModelDetailParams) {
  return axios.get<ModelDetail>('/api/v1/model/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface ModelUpdateBaseInfo {
  id: string;
  corp: string;
  name: string;
  model: string;
  type: string;
  remark: string;
}

export interface ModelUpdateAdvanced {
  prompt_ratio: number;
  completion_ratio: number;
  data_format: string;
  base_url: string;
  path: string;
  proxy: string;
  is_public: boolean;
}

export type ModelUpdate = ModelUpdateBaseInfo & ModelUpdateAdvanced;

export function submitModelUpdate(data: ModelUpdate) {
  return axios.post('/api/v1/model/update', data);
}
