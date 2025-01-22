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

export interface Http {
  open: boolean;
  timeout: number;
  proxy_url: string;
}

export interface SysConfigDetail {
  id: string;
  http: Http;
  created_at: string;
  updated_at: string;
}

export function querySysConfigDetail() {
  return axios.get<SysConfigDetail>('/api/v1/sys/config/detail');
}

export interface SysConfigUpdate {
  id: string;
  action: string;
  http: Http;
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
