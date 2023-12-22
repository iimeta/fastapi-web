import axios from 'axios';

export interface ModelBaseInfo {
  corp: string;
  name: string;
  model: string;
  type: string;
  remark: string;
}

export interface ModelAdvanced {
  prompt_ratio: number;
  completion_ratio: number;
  data_format: string;
  base_url: string;
  path: string;
  proxy: string;
  is_public: boolean;
}

export type ModelCreate = ModelBaseInfo & ModelAdvanced;

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
