import axios from 'axios';
import qs from 'query-string';

export interface ForwardConfig {
  forward_rule: string;
  forward_mode: number;
  match_rule: string[];
  target_model: string;
  target_model_name?: string;
  decision_model: string;
  decision_model_name?: string;
  keywords: string[];
  target_models: string[];
  target_model_names?: string[];
  content_length: any;
  used_quota: any;
}

export interface GroupBaseInfo {
  id?: string;
  name: string;
  discount: any;
  models: string[];
  is_default: boolean;
  is_public: boolean;
  weight: any;
  expires_at: string;
  remark: string;
  status?: number;
}

export interface GroupAdvanced {
  is_enable_model_agent: boolean;
  lb_strategy: string;
  model_agents: string[];
  is_limit_quota: boolean;
  quota: any;
  is_enable_forward: boolean;
  forward_config: ForwardConfig;
}

export type GroupCreate = GroupBaseInfo & GroupAdvanced;

export function submitGroupCreate(data: GroupCreate) {
  return axios.post('/api/v1/group/create', data);
}

export interface GroupPage {
  id: string;
  name: string;
  discount: number;
  used_quota: number;
  models: string[];
  model_agents: string[];
  status: number;
  remark: string;
  expires_at: any;
}

export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface GroupPageParams extends Partial<GroupPage> {
  current: number;
  pageSize: number;
}

export interface GroupPageRes {
  items: GroupPage[];
  paging: Paging;
}

export function queryGroupPage(params: GroupPageParams) {
  return axios.post<GroupPageRes>('/api/v1/group/page', params);
}

export interface GroupDeleteParams {
  id: string;
}

export function submitGroupDelete(params: GroupDeleteParams) {
  return axios.post('/api/v1/group/delete', params);
}

export interface GroupDetailParams {
  id: any;
}

export interface GroupDetail {
  id: string;
  name: string;
  discount: number;
  models: string[];
  model_names: string[];
  is_default: boolean;
  is_public: boolean;
  weight: number;
  expires_at: string;
  remark: string;
  status: number;
  used_quota: number;
  is_enable_model_agent: boolean;
  lb_strategy: number;
  model_agents: string[];
  model_agent_names: string[];
  is_limit_quota: boolean;
  quota: number;
  is_enable_forward: boolean;
  forward_config: ForwardConfig;
  created_at: string;
  updated_at: string;
}

export function queryGroupDetail(params: GroupDetailParams) {
  return axios.get<GroupDetail>('/api/v1/group/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export type GroupUpdate = GroupBaseInfo & GroupAdvanced;

export function submitGroupUpdate(data: GroupUpdate) {
  return axios.post('/api/v1/group/update', data);
}

export interface GroupChangePublic {
  id: string;
  is_public: any;
}

export function submitGroupChangePublic(data: GroupChangePublic) {
  return axios.post('/api/v1/group/change/public', data);
}

export interface GroupChangeExpire {
  id: string;
  expires_at: string;
}

export function submitGroupChangeExpire(data: GroupChangeExpire) {
  return axios.post('/api/v1/group/change/expire', data);
}

export interface GroupChangeStatus {
  id: string;
  status: number;
}

export function submitGroupChangeStatus(data: GroupChangeStatus) {
  return axios.post('/api/v1/group/change/status', data);
}

export interface GroupBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
}

export function submitGroupBatchOperate(data: GroupBatchOperate) {
  return axios.post('/api/v1/group/batch/operate', data);
}

export interface GroupList {
  id: string;
  name: string;
}

export interface GroupListRes {
  items: GroupList[];
}

export function queryGroupList() {
  return axios.get<GroupListRes>('/api/v1/group/list');
}
