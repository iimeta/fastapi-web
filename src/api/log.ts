import axios from 'axios';
import qs from 'query-string';
import { ForwardConfig, FallbackConfig } from './model';
import { Spend } from './common';

export interface ChatPage {
  id: string;
  trace_id: any;
  user_id: any;
  app_id: any;
  model: string;
  spend: Spend;
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

export interface ChatDetail {
  id: string;
  host: string;
  trace_id: string;
  user_id: any;
  app_id: any;
  provider_id: string;
  provider_name: string;
  model_id: string;
  model_name: string;
  model: string;
  model_type: number;
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
  spend: Spend;
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

export interface ChatCopyFieldParams {
  id: string;
  field: string;
}

export interface ChatCopyFieldRes {
  value: string;
}

export function chatCopyField(params: ChatCopyFieldParams) {
  return axios.post<ChatCopyFieldRes>('/api/v1/log/chat/copy/field', params);
}

export interface ImagePage {
  id: string;
  trace_id: any;
  user_id: any;
  app_id: any;
  model: string;
  total_tokens: number;
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
  host: string;
  user_id: any;
  app_id: any;
  provider_id: string;
  provider_name: string;
  model_id: string;
  model_name: string;
  model: string;
  model_type: number;
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
  size: string;
  n: number;
  quality: string;
  image_data: any;
  spend: Spend;
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

export interface ImageCopyFieldParams {
  id: string;
  field: string;
}

export interface ImageCopyFieldRes {
  value: string;
}

export function imageCopyField(params: ImageCopyFieldParams) {
  return axios.post<ImageCopyFieldRes>('/api/v1/log/image/copy/field', params);
}

export interface AudioPage {
  id: string;
  trace_id: any;
  user_id: any;
  app_id: any;
  model: string;
  total_tokens: number;
  total_time: number;
  internal_time: number;
  req_time: any;
}

export interface AudioPageParams extends Partial<AudioPage> {
  current: number;
  pageSize: number;
}

export interface AudioPageRes {
  items: AudioPage[];
  paging: Paging;
}

export function queryAudioPage(params: AudioPageParams) {
  return axios.post<AudioPageRes>('/api/v1/log/audio/page', params);
}

export interface AudioDetail {
  id: string;
  trace_id: string;
  host: string;
  user_id: any;
  app_id: any;
  provider_id: string;
  provider_name: string;
  model_id: string;
  model_name: string;
  model: string;
  model_type: number;
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
  input: string;
  text: string;
  spend: Spend;
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

export function queryAudioDetail(params: DetailParams) {
  return axios.get<AudioDetail>('/api/v1/log/audio/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface AudioCopyFieldParams {
  id: string;
  field: string;
}

export interface AudioCopyFieldRes {
  value: string;
}

export function audioCopyField(params: AudioCopyFieldParams) {
  return axios.post<AudioCopyFieldRes>('/api/v1/log/audio/copy/field', params);
}

export interface ChatExportParams {
  ids?: string[];
  req_time?: any;
  user_id?: number;
}

export function submitChatExport(params: ChatExportParams) {
  return axios.post('/api/v1/log/chat/export', params, {
    responseType: 'blob',
  });
}

export interface ChatBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
  user_id?: number;
  status?: number[];
}

export function submitChatBatchOperate(data: ChatBatchOperate) {
  return axios.post('/api/v1/log/chat/batch/operate', data);
}
