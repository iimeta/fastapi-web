import axios from 'axios';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface SysConfigItem {
  action: string;
  title: string;
  description: string;
  open?: boolean;
  config?: boolean;
  reset?: boolean;
  refresh?: boolean;
  data?: DescData[];
}

export interface Core {
  secret_key_prefix: string;
  error_prefix: string;
  replace_error_prefixes: any;
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
  interval: number;
}

export interface Statistics {
  open: boolean;
  cron: string;
  limit: number;
  lock_minutes: number;
}

export interface Base {
  err_retry: number;
  model_key_err_disable: number;
  model_agent_err_disable: number;
  model_agent_key_err_disable: number;
  short_timeout: number;
  long_timeout: number;
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
  text_records: string[];
  text_reserve: number;
  image_reserve: number;
  audio_reserve: number;
  status: number[];
  cron: string;
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

export interface ResellerLoginRegister {
  account_login: boolean;
  email_login: boolean;
  email_register: boolean;
  email_retrieve: boolean;
  session_expire: number;
}

export interface ResellerShieldError {
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

export interface Notice {
  open: boolean;
  cron: string;
  lock_minutes: number;
}

export interface Quota {
  warning: boolean;
  threshold: number;
  expired_warning: boolean;
  expired_threshold: number;
  exhausted_notice: boolean;
  expired_notice: boolean;
  expired_clear: boolean;
  expired_clear_defer: number;
}

export interface QuotaTask {
  open: boolean;
  cron: string;
  lock_minutes: number;
}

export interface VideoTask {
  open: boolean;
  cron: string;
  lock_minutes: number;
  is_enable_storage: boolean;
  storage_dir: string;
  storage_base_url: string;
}

export interface ServiceUnavailable {
  open: boolean;
  ip_whitelist: string[];
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
  reseller_login_register: ResellerLoginRegister;
  reseller_shield_error: ResellerShieldError;
  auto_disabled_error: AutoDisabledError;
  auto_enable_error: AutoEnableError;
  not_retry_error: NotRetryError;
  not_shield_error: NotShieldError;
  notice: Notice;
  quota: Quota;
  quota_task: QuotaTask;
  video_task: VideoTask;
  service_unavailable: ServiceUnavailable;
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
  reseller_login_register: ResellerLoginRegister;
  reseller_shield_error: ResellerShieldError;
  admin_login: AdminLogin;
  auto_disabled_error: AutoDisabledError;
  auto_enable_error: AutoEnableError;
  not_retry_error: NotRetryError;
  not_shield_error: NotShieldError;
  notice: Notice;
  quota: Quota;
  quota_task: QuotaTask;
  video_task: VideoTask;
  service_unavailable: ServiceUnavailable;
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

export interface SysConfigRefresh {
  action: string;
}

export function submitSysConfigRefresh(data: SysConfigRefresh) {
  return axios.post('/api/v1/sys/config/refresh', data);
}

export function querySysConfig() {
  return axios.get<SysConfigDetail>('/api/v1/open/sys/config');
}
