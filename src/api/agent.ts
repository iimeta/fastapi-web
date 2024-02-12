import axios from 'axios';
import qs from 'query-string';

export interface ModelAgentCreateBaseInfo {
  name: string;
  base_url: string;
  path: string;
  weight: any;
  remark: string;
}

export interface ModelAgentCreateAdvanced {
  models: string[];
  key: string;
}

export type ModelAgentCreate = ModelAgentCreateBaseInfo & ModelAgentCreateAdvanced;

export function submitModelAgentCreate(data: ModelAgentCreate) {
  return axios.post('/api/v1/model/agent/create', data);
}

export interface ModelAgentPage {
  id: string;
  name: string;
  base_url: string;
  path: string;
  weight: number;
  models: string[];
  model_names: string[];
  status: number;
  remark: string;
}
export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface ModelAgentPageParams extends Partial<ModelAgentPage> {
  current: number;
  pageSize: number;
}

export interface ModelAgentPageRes {
  items: ModelAgentPage[];
  paging: Paging;
}

export function queryModelAgentPage(params: ModelAgentPageParams) {
  return axios.post<ModelAgentPageRes>('/api/v1/model/agent/page', params);
}

export interface ModelAgentList {
  id: string;
  name: string;
  base_url: string;
  path: string;
  weight: number;
  models: string[];
  status: number;
  remark: string;
}

export interface ModelAgentListRes {
  items: ModelAgentList[];
}

export function queryModelAgentList() {
  return axios.get<ModelAgentListRes>('/api/v1/model/agent/list');
}

export interface ModelAgentDeleteParams {
  id: string;
}

export function submitModelAgentDelete(params: ModelAgentDeleteParams) {
  return axios.post('/api/v1/model/agent/delete', params);
}

export interface ModelAgentDetailParams {
  id: any;
}

export interface ModelAgentDetail {
  id: string;
  name: string;
  base_url: string;
  path: string;
  weight: number;
  models: string[];
  model_names: string[];
  key: string;
  status: number;
  remark: string;
  created_at: string;
  updated_at: string;
}

export function queryModelAgentDetail(params: ModelAgentDetailParams) {
  return axios.get<ModelAgentDetail>('/api/v1/model/agent/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface ModelAgentUpdateBaseInfo {
  id: string;
  name: string;
  base_url: string;
  path: string;
  weight: any;
  remark: string;
  status: number;
}
export interface ModelAgentUpdateAdvanced {
  models: string[];
  key: string;
}

export type ModelAgentUpdate = ModelAgentUpdateBaseInfo & ModelAgentUpdateAdvanced;

export function submitModelAgentUpdate(data: ModelAgentUpdate) {
  return axios.post('/api/v1/model/agent/update', data);
}
