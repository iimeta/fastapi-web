import axios from 'axios';
import qs from 'query-string';

export interface ResellerCreate {
  name: string;
  email: string;
  account: string;
  password: string;
  quota: any;
  quota_type: any;
  quota_expires_at: string;
  groups: string[];
  remark: string;
}

export function submitResellerCreate(data: ResellerCreate) {
  return axios.post('/api/v1/admin/reseller/create', data);
}

export interface ResellerPage {
  id: string;
  user_id: number;
  name: string;
  email: string;
  quota: number;
  used_quota: number;
  quota_expires_at: any;
  groups: string[];
  remark: string;
  status: number;
}
export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface ResellerPageParams extends Partial<ResellerPage> {
  current: number;
  pageSize: number;
}

export interface ResellerPageRes {
  items: ResellerPage[];
  paging: Paging;
}

export function queryResellerPage(params: ResellerPageParams) {
  return axios.post<ResellerPageRes>('/api/v1/admin/reseller/page', params);
}

export interface ResellerList {
  user_id: number;
  name: string;
  status: number;
}

export interface ResellerListRes {
  items: ResellerList[];
}

export function queryResellerList() {
  return axios.get<ResellerListRes>('/api/v1/admin/reseller/list');
}

export interface ResellerDeleteParams {
  id?: string;
  user_id?: any;
  name?: string;
  data: number[];
  action?: string;
}

export function submitResellerDelete(params: ResellerDeleteParams) {
  return axios.post('/api/v1/admin/reseller/delete', params);
}

export interface ResellerDetailParams {
  id: any;
}

export interface ResellerDetail {
  id: string;
  user_id: number;
  name: string;
  account: string;
  email: string;
  quota: number;
  used_quota: number;
  allocated_quota: number;
  to_be_allocated_quota: number;
  quota_expires_at: string;
  groups: string[];
  group_names: string[];
  quota_warning: boolean;
  warning_threshold: number;
  expire_warning_threshold: number;
  warning_notice: boolean;
  exhaustion_notice: boolean;
  expire_warning_notice: boolean;
  expire_notice: boolean;
  remark: string;
  status: number;
  login_ip: string;
  login_time: string;
  login_domain: string;
  created_at: string;
  updated_at: string;
}

export function queryResellerDetail(params: ResellerDetailParams) {
  return axios.get<ResellerDetail>('/api/v1/admin/reseller/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface ResellerUpdate {
  id: string;
  name: string;
  email: string;
  account: string;
  password: string;
  quota_expires_at: string;
  groups: string[];
  remark: string;
  status: number;
}

export function submitResellerUpdate(data: ResellerUpdate) {
  return axios.post('/api/v1/admin/reseller/update', data);
}

export interface ResellerChangeQuotaExpire {
  id: string;
  quota_expires_at: string;
}

export function submitResellerChangeQuotaExpire(
  data: ResellerChangeQuotaExpire
) {
  return axios.post('/api/v1/admin/reseller/change/quota/expire', data);
}

export interface ResellerChangeStatus {
  id: string;
  status: number;
}

export function submitResellerChangeStatus(data: ResellerChangeStatus) {
  return axios.post('/api/v1/admin/reseller/change/status', data);
}

export interface ResellerRechargeParams {
  user_id: any;
  quota_expires_at: string;
}

export interface ResellerRecharge {
  user_id: number;
  quota: any;
  quota_type: any;
  quota_expires_at: string;
  is_send_notice: boolean;
}

export function submitResellerRecharge(data: ResellerRecharge) {
  return axios.post('/api/v1/admin/reseller/recharge', data);
}

export interface ResellerBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
  quota_type?: any;
  quota_expires_at?: string;
  is_send_notice?: boolean;
  data?: number[];
}

export function submitResellerBatchOperate(data: ResellerBatchOperate) {
  return axios.post('/api/v1/admin/reseller/batch/operate', data);
}
