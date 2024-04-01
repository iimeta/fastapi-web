import axios from 'axios';
import qs from 'query-string';

export interface ChatPage {
  id: string;
  user_id: any;
  app_id: any;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  stream: boolean;
  conn_time: number;
  duration: number;
  total_time: number;
  internal_time: number;
  req_time: string;
  req_times: string[];
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
  return axios.post<ChatPageRes>('/api/v1/chat/page', params);
}

export interface ChatDetailParams {
  id: any;
}

export interface ChatDetail {
  id: string;
  trace_id: string;
  user_id: any;
  app_id: any;
  corp: string;
  model_id: string;
  name: string;
  model: string;
  type: number;
  key: string;
  is_enable_model_agent: boolean;
  model_agent_id: string;
  model_agent: any;
  prompt: string;
  completion: string;
  messages: any;
  prompt_ratio: number;
  completion_ratio: number;
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

export function queryChatDetail(params: ChatDetailParams) {
  return axios.get<ChatDetail>('/api/v1/chat/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
