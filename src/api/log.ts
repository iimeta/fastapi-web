import axios from 'axios';
import qs from 'query-string';

export interface ChatPage {
  id: string;
  trace_id: any;
  user_id: any;
  app_id: any;
  model: string;
  is_smart_match: boolean;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  stream: boolean;
  conn_time: number;
  duration: number;
  total_time: number;
  internal_time: number;
  req_time: any;
}

export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface ChatPageParams extends Partial<ChatPage> {
  current: number;
  pageSize: number;
}

export interface ChatPageRes {
  items: ChatPage[];
  paging: Paging;
}

export function queryChatPage(params: ChatPageParams) {
  return axios.post<ChatPageRes>('/api/v1/log/chat/page', params);
}

export interface DetailParams {
  id: any;
}

export interface TextQuota {
  billing_method: number;
  prompt_ratio: number;
  completion_ratio: number;
  fixed_quota: number;
}

export interface ImageQuota {
  width?: any;
  height?: any;
  fixed_quota: any;
  mode?: string;
  is_default: string;
}

export interface MultimodalQuota {
  text_quota: TextQuota;
  image_quotas: ImageQuota[];
}

export interface MidjourneyQuota {
  name: any;
  action: any;
  path: any;
  fixed_quota: any;
}

export interface ForwardConfig {
  forward_rule: string;
  target_model: string;
  target_model_name?: string;
  keywords: string[];
  target_models: string[];
  target_model_names?: string[];
}

export interface FallbackConfig {
  fallback_model: string;
  fallback_model_name?: string;
}

export interface ChatDetail {
  id: string;
  trace_id: string;
  user_id: any;
  app_id: any;
  corp: string;
  corp_name: string;
  model_id: string;
  name: string;
  model: string;
  type: number;
  key: string;
  real_model_id: string;
  real_model_name: string;
  real_model: string;
  is_enable_model_agent: boolean;
  model_agent_id: string;
  model_agent: any;
  is_enable_forward: boolean;
  forward_config: ForwardConfig;
  is_smart_match: boolean;
  is_enable_fallback: boolean;
  fallback_config: FallbackConfig;
  prompt: string;
  completion: string;
  messages: any;
  text_quota: TextQuota;
  multimodal_quota: MultimodalQuota;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  stream: boolean;
  conn_time: number;
  duration: number;
  total_time: number;
  internal_time: number;
  req_time: string;
  client_ip: string;
  remote_ip: string;
  local_ip: string;
  err_msg: string;
  status: number;
  creator: string;
  created_at: string;
  updated_at: string;
}

export function queryChatDetail(params: DetailParams) {
  return axios.get<ChatDetail>('/api/v1/log/chat/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface ImagePage {
  id: string;
  trace_id: any;
  user_id: any;
  app_id: any;
  model: string;
  is_smart_match: boolean;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  stream: boolean;
  conn_time: number;
  duration: number;
  total_time: number;
  internal_time: number;
  req_time: any;
}

export interface ImagePageParams extends Partial<ImagePage> {
  current: number;
  pageSize: number;
}

export interface ImagePageRes {
  items: ImagePage[];
  paging: Paging;
}

export function queryImagePage(params: ImagePageParams) {
  return axios.post<ImagePageRes>('/api/v1/log/image/page', params);
}

export interface ImageDetail {
  id: string;
  trace_id: string;
  user_id: any;
  app_id: any;
  corp: string;
  corp_name: string;
  model_id: string;
  name: string;
  model: string;
  type: number;
  key: string;
  real_model_id: string;
  real_model_name: string;
  real_model: string;
  is_enable_model_agent: boolean;
  model_agent_id: string;
  model_agent: any;
  is_enable_forward: boolean;
  forward_config: ForwardConfig;
  is_smart_match: boolean;
  is_enable_fallback: boolean;
  fallback_config: FallbackConfig;
  prompt: string;
  image_data: any;
  text_quota: TextQuota;
  multimodal_quota: MultimodalQuota;
  total_tokens: number;
  total_time: number;
  internal_time: number;
  req_time: string;
  client_ip: string;
  remote_ip: string;
  local_ip: string;
  err_msg: string;
  status: number;
  creator: string;
  created_at: string;
  updated_at: string;
}

export function queryImageDetail(params: DetailParams) {
  return axios.get<ImageDetail>('/api/v1/log/image/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
