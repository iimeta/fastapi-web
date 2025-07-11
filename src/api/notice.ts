import axios from 'axios';
import qs from 'query-string';

export interface Notice {
  id?: string;
  title: string;
  content: string;
  category: string;
  scope: any;
  users: number[];
  resellers: number[];
  channels: string[];
  is_popup: boolean;
  priority: any;
  expires_at: string;
  scheduled_time: string;
  remark: string;
  status: number;
  template?: string;
}

export function submitNoticeCreate(data: Notice) {
  return axios.post('/api/v1/notice/create', data);
}

export interface NoticePage {
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

export interface NoticePageParams extends Partial<NoticePage> {
  current: number;
  pageSize: number;
}

export interface NoticePageRes {
  items: NoticePage[];
  paging: Paging;
}

export function queryNoticePage(params: NoticePageParams) {
  return axios.post<NoticePageRes>('/api/v1/notice/page', params);
}

export interface NoticeList {
  id: string;
  title: string;
}

export interface NoticeListRes {
  items: NoticeList[];
}

export function queryNoticeList() {
  return axios.get<NoticeListRes>('/api/v1/notice/list');
}

export interface NoticeDeleteParams {
  id: string;
}

export function submitNoticeDelete(params: NoticeDeleteParams) {
  return axios.post('/api/v1/notice/delete', params);
}

export interface NoticeDetailParams {
  id: any;
}

export interface NoticeDetail {
  id: string;
  title: string;
  content: string;
  category: string;
  scope: number;
  users: number[];
  resellers: number[];
  channels: string[];
  is_popup: boolean;
  priority: number;
  expires_at: string;
  scheduled_time: string;
  remark: string;
  status: number;
  publish_time: string;
  created_at: string;
  updated_at: string;
}

export function queryNoticeDetail(params: NoticeDetailParams) {
  return axios.get<NoticeDetail>('/api/v1/notice/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function submitNoticeUpdate(data: Notice) {
  return axios.post('/api/v1/notice/update', data);
}

export interface NoticeBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
}

export function submitNoticeBatchOperate(data: NoticeBatchOperate) {
  return axios.post('/api/v1/notice/batch/operate', data);
}
