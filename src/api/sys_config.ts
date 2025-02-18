import axios from 'axios';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface SysConfigItem {
  action: string;
  title: string;
  description: string;
  open?: boolean;
  config?: boolean;
  reset?: boolean;
  data?: DescData[];
}

export interface Core {
  secret_key_prefix: string;
  error_prefix: string;
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

export interface Base {
  err_retry: number;
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

export interface Log {
  open: boolean;
  records: string[];
}

export interface UserLoginRegister {
  account_login: boolean;
  email_login: boolean;
  email_register: boolean;
  email_retrieve: boolean;
  session_expire: number;
}

export interface UserShieldError {
  open: boolean;
  errors: string[];
}

export interface AdminLogin {
  account_login: boolean;
  email_login: boolean;
  email_retrieve: boolean;
  session_expire: number;
}

export interface AutoDisabledError {
  open: boolean;
  errors: string[];
}

export interface EnableError {
  cron: string;
  enable_time: any;
  error: string;
}

export interface AutoEnableError {
  open: boolean;
  enable_errors: EnableError[];
}

export interface NotRetryError {
  open: boolean;
  errors: string[];
}

export interface NotShieldError {
  open: boolean;
  errors: string[];
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
  base: Base;
  midjourney: Midjourney;
  log: Log;
  user_login_register: UserLoginRegister;
  admin_login: AdminLogin;
  user_shield_error: UserShieldError;
  auto_disabled_error: AutoDisabledError;
  auto_enable_error: AutoEnableError;
  not_retry_error: NotRetryError;
  not_shield_error: NotShieldError;
  debug: Debug;
  created_at: string;
  updated_at: string;
}

export function querySysConfigDetail() {
  return axios.get<SysConfigDetail>('/api/v1/sys/config/detail');
}

export interface SysConfigUpdate {
  action: string;
  core: Core;
  http: Http;
  email: Email;
  statistics: Statistics;
  base: Base;
  midjourney: Midjourney;
  log: Log;
  user_login_register: UserLoginRegister;
  user_shield_error: UserShieldError;
  admin_login: AdminLogin;
  auto_disabled_error: AutoDisabledError;
  auto_enable_error: AutoEnableError;
  not_retry_error: NotRetryError;
  not_shield_error: NotShieldError;
  debug: Debug;
}

export function submitSysConfigUpdate(data: SysConfigUpdate) {
  return axios.post('/api/v1/sys/config/update', data);
}

export interface SysConfigChangeStatus {
  action: string;
  open: boolean;
}

export function submitSysConfigChangeStatus(data: SysConfigChangeStatus) {
  return axios.post('/api/v1/sys/config/change/status', data);
}

export interface SysConfigReset {
  action: string;
}

export function submitSysConfigReset(data: SysConfigReset) {
  return axios.post('/api/v1/sys/config/reset', data);
}

export function querySysConfig() {
  return axios.get<SysConfigDetail>('/api/v1/open/sys/config');
}
