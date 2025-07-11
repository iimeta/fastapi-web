import axios from 'axios';
import qs from 'query-string';

export interface NoticeTemplate {
  id?: string;
  name: string;
  scenes: string[];
  title: string;
  content: string;
  channels: string[];
  is_popup: boolean;
  is_public: boolean;
  remark: string;
  status: number;
}

export function submitNoticeTemplateCreate(data: NoticeTemplate) {
  return axios.post('/api/v1/notice/template/create', data);
}

export interface NoticeTemplatePage {
  id: string;
  title: string;
  status: number;
  remark: string;
}
export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface NoticeTemplatePageParams extends Partial<NoticeTemplatePage> {
  current: number;
  pageSize: number;
}

export interface NoticeTemplatePageRes {
  items: NoticeTemplatePage[];
  paging: Paging;
}

export function queryNoticeTemplatePage(params: NoticeTemplatePageParams) {
  return axios.post<NoticeTemplatePageRes>('/api/v1/notice/template/page', params);
}

export interface NoticeTemplateList {
  id: string;
  name: string;
  title: string;
  content: string;
  channels: string[];
}

export interface NoticeTemplateListRes {
  items: NoticeTemplateList[];
}

export function queryNoticeTemplateList() {
  return axios.get<NoticeTemplateListRes>('/api/v1/notice/template/list');
}

export interface NoticeTemplateDeleteParams {
  id: string;
}

export function submitNoticeTemplateDelete(params: NoticeTemplateDeleteParams) {
  return axios.post('/api/v1/notice/template/delete', params);
}

export interface NoticeTemplateDetailParams {
  id: any;
}

export interface NoticeTemplateDetail {
  id: string;
  name: string;
  scenes: string[];
  title: string;
  content: string;
  channels: string[];
  is_popup: boolean;
  is_public: boolean;
  remark: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export function queryNoticeTemplateDetail(params: NoticeTemplateDetailParams) {
  return axios.get<NoticeTemplateDetail>('/api/v1/notice/template/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function submitNoticeTemplateUpdate(data: NoticeTemplate) {
  return axios.post('/api/v1/notice/template/update', data);
}

export interface NoticeTemplateChangePublic {
  id: string;
  is_public: any;
}

export function submitNoticeTemplateChangePublic(data: NoticeTemplateChangePublic) {
  return axios.post('/api/v1/notice/template/change/public', data);
}

export interface NoticeTemplateChangeStatus {
  id: string;
  status: number;
}

export function submitNoticeTemplateChangeStatus(data: NoticeTemplateChangeStatus) {
  return axios.post('/api/v1/notice/template/change/status', data);
}

export interface NoticeTemplateBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
}

export function submitNoticeTemplateBatchOperate(data: NoticeTemplateBatchOperate) {
  return axios.post('/api/v1/notice/template/batch/operate', data);
}
