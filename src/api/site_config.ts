import axios from 'axios';
import qs from 'query-string';

export interface SiteConfigCreate {
  domain: string;
  title: string;
  logo: string;
  favicon: string;
  avatar: string;
  bg_img: string;
  copyright: string;
  jump_url: string;
  keywords: string;
  description: string;
  icp_beian: string;
  ga_beian: string;
  register_tips: string;
  grant_quota: any;
  quota_expires_at: any;
  support_email_suffix: any;
  host: string;
  port: any;
  user_name: string;
  password: string;
  from_name: string;
  remark: string;
}

export function submitSiteConfigCreate(data: SiteConfigCreate) {
  return axios.post('/api/v1/sys/site/create', data);
}

export interface SiteConfigPage {
  id: string;
  domain: string;
  title: string;
  logo: string;
  favicon: string;
  avatar: string;
  bg_img: string;
  copyright: string;
  jump_url: string;
  keywords: string;
  description: string;
  icp_beian: string;
  ga_beian: string;
  register_tips: string;
  remark: string;
}

export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface SiteConfigPageParams extends Partial<SiteConfigPage> {
  current: number;
  pageSize: number;
}

export interface SiteConfigPageRes {
  items: SiteConfigPage[];
  paging: Paging;
}

export function querySiteConfigPage(params: SiteConfigPageParams) {
  return axios.post<SiteConfigPageRes>('/api/v1/sys/site/page', params);
}

export interface SiteConfigDeleteParams {
  id: string;
}

export function submitSiteConfigDelete(params: SiteConfigDeleteParams) {
  return axios.post('/api/v1/sys/site/delete', params);
}

export interface SiteConfigDetailParams {
  id?: any;
  domain?: string;
}

export interface SiteConfigDetail {
  id: string;
  domain: string;
  title: string;
  logo: string;
  favicon: string;
  avatar: string;
  bg_img: string;
  copyright: string;
  jump_url: string;
  keywords: string;
  description: string;
  icp_beian: string;
  ga_beian: string;
  register_tips: string;
  grant_quota: number;
  quota_expires_at: number;
  support_email_suffix: any;
  host: string;
  port: number;
  user_name: string;
  password: string;
  from_name: string;
  remark: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export function querySiteConfigDetail(params: SiteConfigDetailParams) {
  return axios.get<SiteConfigDetail>('/api/v1/sys/site/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface SiteConfigUpdate {
  id: string;
  domain: string;
  title: string;
  logo: string;
  favicon: string;
  avatar: string;
  bg_img: string;
  copyright: string;
  jump_url: string;
  keywords: string;
  description: string;
  icp_beian: string;
  ga_beian: string;
  register_tips: string;
  grant_quota: any;
  quota_expires_at: any;
  support_email_suffix: any;
  host: string;
  port: any;
  user_name: string;
  password: string;
  from_name: string;
  remark: string;
  status: number;
}

export function submitSiteConfigUpdate(data: SiteConfigUpdate) {
  return axios.post('/api/v1/sys/site/update', data);
}

export interface SiteConfigChangeStatus {
  id: string;
  status: number;
}

export function submitSiteConfigChangeStatus(data: SiteConfigChangeStatus) {
  return axios.post('/api/v1/sys/site/change/status', data);
}

export interface SiteConfigBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
}

export function submitSiteConfigBatchOperate(data: SiteConfigBatchOperate) {
  return axios.post('/api/v1/sys/site/batch/operate', data);
}

export function querySite(params: SiteConfigDetailParams) {
  return axios.get<SiteConfigDetail>('/site', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
