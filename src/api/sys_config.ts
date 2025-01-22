import axios from 'axios';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface SysConfigItem {
  action: string;
  title: string;
  description: string;
  open?: boolean;
  reset?: boolean;
  config?: boolean;
  data?: DescData[];
}

export interface Core {
  secret_key_prefix: string;
  error_prefix: string;
  channel_prefix: string;
}

export interface Http {
  open: boolean;
  timeout: number;
  proxy_url: string;
}

export interface Email {
  open: boolean;
  host: string;
  port: number;
  user_name: string;
  password: string;
  from_name: string;
}

export interface Statistics {
  open: boolean;
  cron: string;
  days: number;
  limit: number;
  lock_minutes: number;
}

export interface Api {
  retry: number;
  model_key_err_disable: number;
  model_agent_err_disable: number;
  model_agent_key_err_disable: number;
}

export interface Midjourney {
  open: boolean;
  cdn_url: string;
  api_base_url: string;
  api_secret: string;
  api_secret_header: string;
  cdn_original_url: string;
}

export interface Gcp {
  cdn_get_token_urlurl: string;
}

export interface Log {
  open: boolean;
  records: string[];
}

export interface Error {
  open: boolean;
  shield_user: string[];
  auto_disabled: string[];
  not_retry: string[];
  not_shield: string[];
}

export interface Debug {
  open: boolean;
}

export interface SysConfigDetail {
  id: string;
  core: Core;
  http: Http;
  email: Email;
  statistics: Statistics;
  api: Api;
  midjourney: Midjourney;
  gcp: Gcp;
  log: Log;
  error: Error;
  debug: Debug;
  created_at: string;
  updated_at: string;
}

export function querySysConfigDetail() {
  return axios.get<SysConfigDetail>('/api/v1/sys/config/detail');
}

export interface SysConfigUpdate {
  id: string;
  action: string;
  core: Core;
  http: Http;
  email: Email;
  statistics: Statistics;
  api: Api;
  midjourney: Midjourney;
  gcp: Gcp;
  log: Log;
  error: Error;
  debug: Debug;
}

export function submitSysConfigUpdate(data: SysConfigUpdate) {
  return axios.post('/api/v1/sys/config/update', data);
}

export interface SysConfigChangeStatus {
  id?: string;
  action?: string;
  status?: number;
  open?: boolean;
}

export function submitSysConfigChangeStatus(data: SysConfigChangeStatus) {
  return axios.post('/api/v1/sys/config/change/status', data);
}
