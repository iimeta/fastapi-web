import axios from 'axios';
import qs from 'query-string';
import { Pricing } from './common';

export interface ModelInit {
  url: string;
  key: string;
  is_config_model_agent: boolean;
  is_cover_price: boolean;
}

export function submitModelInit(data: ModelInit) {
  return axios.post('/api/v1/model/init', data);
}

export interface PresetConfig {
  is_support_system_role: boolean;
  system_role_prompt: string;
  min_tokens: any;
  max_tokens: any;
  is_support_stream: boolean;
}

export interface ForwardConfig {
  forward_rule: string;
  match_rule: string[];
  target_model: string;
  target_model_name?: string;
  decision_model: string;
  decision_model_name?: string;
  keywords: string[];
  target_models: string[];
  target_model_names?: string[];
  content_length: any;
}

export interface FallbackConfig {
  model_agent?: string;
  model_agent_name?: string;
  model?: string;
  model_name?: string;
}

export interface Model {
  id?: string;
  provider_id: string;
  name: string;
  model: string;
  type: string;
  base_url: string;
  path: string;
  remark: string;
  pricing: Pricing;
  request_data_format: string;
  response_data_format: string;
  is_public: boolean;
  groups: string[];
  is_enable_preset_config: boolean;
  preset_config: PresetConfig;
  is_enable_model_agent: boolean;
  lb_strategy: string;
  model_agents: string[];
  is_enable_forward: boolean;
  forward_config: ForwardConfig;
  is_enable_fallback: boolean;
  fallback_config: FallbackConfig;
  status?: number;
}

export function submitModelCreate(data: Model) {
  return axios.post('/api/v1/model/create', data);
}

export interface ModelPage {
  id: string;
  provider_id: string;
  provider_name: string;
  name: string;
  model: string;
  type: number;
  pricing: Pricing;
  groups: string[];
  group_names: string[];
  request_data_format: number;
  response_data_format: number;
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
  provider_id: string;
  name: string;
  model: string;
  type: number;
  request_data_format: number;
  response_data_format: number;
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
  id: any;
}

export interface ModelDetail {
  id: string;
  provider_id: string;
  provider_name: string;
  provider_code: string;
  name: string;
  model: string;
  type: number;
  base_url: string;
  path: string;
  pricing: Pricing;
  groups: string[];
  group_names: string[];
  request_data_format: number;
  response_data_format: number;
  is_public: boolean;
  is_enable_preset_config: boolean;
  preset_config: PresetConfig;
  is_enable_model_agent: boolean;
  lb_strategy: number;
  model_agents: string[];
  model_agent_names: string[];
  is_enable_forward: boolean;
  forward_config: ForwardConfig;
  is_enable_fallback: boolean;
  fallback_config: FallbackConfig;
  status: number;
  remark: string;
  created_at: string;
  updated_at: string;
}

export function queryModelDetail(params: ModelDetailParams) {
  return axios.get<ModelDetail>('/api/v1/model/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function submitModelUpdate(data: Model) {
  return axios.post('/api/v1/model/update', data);
}

export interface ModelChangeStatus {
  id: string;
  status: number;
}

export function submitModelChangeStatus(data: ModelChangeStatus) {
  return axios.post('/api/v1/model/change/status', data);
}

export interface ModelBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
  lb_strategy?: string;
  model_agents?: string[];
  target_model?: string;
  fallback_config?: FallbackConfig;
}

export function submitModelBatchOperate(data: ModelBatchOperate) {
  return axios.post('/api/v1/model/batch/operate', data);
}

export interface Tree {
  title: string;
  value: string;
  key: string;
  children: Tree[];
}

export interface ModelTreeRes {
  items: Tree[];
}

export function queryModelTree() {
  return axios.get<ModelTreeRes>('/api/v1/model/tree');
}

export interface ModelPermissionsParams {
  id: any;
  action: string;
}

export interface ModelPermissions {
  id: string;
  provider_id: string;
  name: string;
  model: string;
  type: number;
  status: number;
  remark: string;
  testing: boolean;
  trace_id: string;
  result: boolean;
  total_time: number;
}

export interface ModelPermissionsRes {
  items: ModelPermissions[];
}

export function queryModelPermissions(params: ModelPermissionsParams) {
  return axios.post('/api/v1/model/permissions', params);
}
