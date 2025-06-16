import axios from 'axios';
import qs from 'query-string';

export interface ModelInit {
  url: string;
  key: string;
  is_config_model_agent: boolean;
}

export function submitModelInit(data: ModelInit) {
  return axios.post('/api/v1/model/init', data);
}

export interface ModelBaseInfo {
  id?: string;
  corp: string;
  name: string;
  model: string;
  type: string;
  base_url: string;
  path: string;
  remark: string;
  status?: number;
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

export interface TextQuota {
  billing_method: any;
  prompt_ratio: number;
  completion_ratio: number;
  cached_ratio: number;
  fixed_quota: any;
  prompt_price: any;
  completion_price: any;
  cached_price: any;
}

export interface GenerationQuota {
  quality: any;
  width: any;
  height: any;
  fixed_quota: any;
  is_default: string;
}

export interface ImageQuota {
  billing_method: any;
  generation_quotas: GenerationQuota[];
  text_ratio: number;
  input_ratio: number;
  output_ratio: number;
  cached_ratio: number;
  fixed_quota: any;
  text_price: any;
  input_price: any;
  output_price: any;
  cached_price: any;
}

export interface VisionQuota {
  mode: string;
  fixed_quota: any;
  is_default: string;
}

export interface AudioQuota {
  billing_method: any;
  prompt_ratio: number;
  completion_ratio: number;
  cached_ratio: number;
  fixed_quota: any;
  prompt_price: any;
  completion_price: any;
  cached_price: any;
}

export interface SearchQuota {
  search_context_size?: string;
  fixed_quota: any;
  is_default: string;
}

export interface MultimodalQuota {
  billing_rule: any;
  text_quota: TextQuota;
  vision_quotas: VisionQuota[];
  search_quota: any;
  search_quotas: SearchQuota[];
}

export interface RealtimeQuota {
  text_quota: TextQuota;
  audio_quota: AudioQuota;
  fixed_quota: any;
}

export interface MultimodalAudioQuota {
  text_quota: TextQuota;
  audio_quota: AudioQuota;
  fixed_quota: any;
}

export interface MidjourneyQuota {
  name: any;
  action: any;
  path: any;
  fixed_quota: any;
}

export interface FallbackConfig {
  model_agent?: string;
  model_agent_name?: string;
  model?: string;
  model_name?: string;
}

export interface ModelAdvanced {
  text_quota: TextQuota;
  image_quota: ImageQuota;
  audio_quota: AudioQuota;
  multimodal_quota: MultimodalQuota;
  realtime_quota: RealtimeQuota;
  multimodal_audio_quota: MultimodalAudioQuota;
  midjourney_quotas: MidjourneyQuota[];
  data_format: string;
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
}

export type ModelCreate = ModelBaseInfo & ModelAdvanced;

export function submitModelCreate(data: ModelCreate) {
  return axios.post('/api/v1/model/create', data);
}

export interface ModelPage {
  id: string;
  corp: string;
  corp_name: string;
  name: string;
  model: string;
  type: number;
  groups: string[];
  group_names: string[];
  text_quota: TextQuota;
  image_quota: ImageQuota;
  audio_quota: AudioQuota;
  multimodal_quota: MultimodalQuota;
  realtime_quota: RealtimeQuota;
  multimodal_audio_quota: MultimodalAudioQuota;
  midjourney_quotas: MidjourneyQuota[];
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
  billing_method: number;
  prompt_ratio: number;
  completion_ratio: number;
  fixed_quota: number;
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
  id: any;
}

export interface ModelDetail {
  id: string;
  corp: string;
  corp_name: string;
  corp_code: string;
  name: string;
  model: string;
  type: number;
  base_url: string;
  path: string;
  billing_method: any;
  groups: string[];
  group_names: string[];
  text_quota: TextQuota;
  image_quota: ImageQuota;
  audio_quota: AudioQuota;
  multimodal_quota: MultimodalQuota;
  realtime_quota: RealtimeQuota;
  multimodal_audio_quota: MultimodalAudioQuota;
  midjourney_quotas: MidjourneyQuota[];
  data_format: number;
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

export type ModelUpdate = ModelBaseInfo & ModelAdvanced;

export function submitModelUpdate(data: ModelUpdate) {
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
  corp: string;
  name: string;
  model: string;
  type: number;
  status: number;
  remark: string;
}

export interface ModelPermissionsRes {
  items: ModelPermissions[];
}

export function queryModelPermissions(params: ModelPermissionsParams) {
  return axios.post('/api/v1/model/permissions', params);
}
