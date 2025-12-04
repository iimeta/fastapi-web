import axios from 'axios';
import qs from 'query-string';
import { ForwardConfig, FallbackConfig } from './model';
import { Spend } from './common';

export interface TextPage {
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

export interface TextPageParams extends Partial<TextPage> {
  current: number;
  pageSize: number;
}

export interface TextPageRes {
  items: TextPage[];
  paging: Paging;
}

export function queryTextPage(params: TextPageParams) {
  return axios.post<TextPageRes>('/api/v1/log/text/page', params);
}

export interface DetailParams {
  id: any;
}

export interface TextDetail {
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

export function queryTextDetail(params: DetailParams) {
  return axios.get<TextDetail>('/api/v1/log/text/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface TextCopyFieldParams {
  id: string;
  field: string;
}

export interface TextCopyFieldRes {
  value: string;
}

export function textCopyField(params: TextCopyFieldParams) {
  return axios.post<TextCopyFieldRes>('/api/v1/log/text/copy/field', params);
}

export interface TextExportParams {
  ids?: string[];
  req_time?: any;
  user_id?: number;
}

export function submitTextExport(params: TextExportParams) {
  return axios.post('/api/v1/log/text/export', params, {
    responseType: 'blob',
  });
}

export interface TextBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
  user_id?: number;
  status?: number[];
}

export function submitTextBatchOperate(data: TextBatchOperate) {
  return axios.post('/api/v1/log/text/batch/operate', data);
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

export interface VideoPage {
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

export interface VideoPageParams extends Partial<VideoPage> {
  current: number;
  pageSize: number;
}

export interface VideoPageRes {
  items: VideoPage[];
  paging: Paging;
}

export function queryVideoPage(params: VideoPageParams) {
  return axios.post<VideoPageRes>('/api/v1/log/video/page', params);
}

export interface VideoDetail {
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
  request_data: any;
  response_data: any;
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

export function queryVideoDetail(params: DetailParams) {
  return axios.get<VideoDetail>('/api/v1/log/video/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface VideoCopyFieldParams {
  id: string;
  field: string;
}

export interface VideoCopyFieldRes {
  value: string;
}

export function videoCopyField(params: VideoCopyFieldParams) {
  return axios.post<VideoCopyFieldRes>('/api/v1/log/video/copy/field', params);
}

export interface GeneralPage {
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

export interface GeneralPageParams extends Partial<GeneralPage> {
  current: number;
  pageSize: number;
}

export interface GeneralPageRes {
  items: GeneralPage[];
  paging: Paging;
}

export function queryGeneralPage(params: GeneralPageParams) {
  return axios.post<GeneralPageRes>('/api/v1/log/general/page', params);
}

export interface GeneralDetail {
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
  request_data: any;
  response_data: any;
  completion: string;
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

export function queryGeneralDetail(params: DetailParams) {
  return axios.get<GeneralDetail>('/api/v1/log/general/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface GeneralCopyFieldParams {
  id: string;
  field: string;
}

export interface GeneralCopyFieldRes {
  value: string;
}

export function generalCopyField(params: GeneralCopyFieldParams) {
  return axios.post<GeneralCopyFieldRes>(
    '/api/v1/log/general/copy/field',
    params
  );
}
