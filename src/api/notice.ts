import axios from 'axios';
import qs from 'query-string';

export interface NoticeCreate {
  title: string;
  content: string;
  category: any;
  scope: number;
  users: number[];
  resellers: number[];
  methods: number[];
  priority: any;
  expires_at: string;
  scheduled_time: string;
  remark: string;
  status: number;
}

export function submitNoticeCreate(data: NoticeCreate) {
  return axios.post('/api/v1/sys/notice/create', data);
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
  return axios.post<NoticePageRes>('/api/v1/sys/notice/page', params);
}

export interface NoticeList {
  id: string;
  title: string;
}

export interface NoticeListRes {
  items: NoticeList[];
}

export function queryNoticeList() {
  return axios.get<NoticeListRes>('/api/v1/sys/notice/list');
}

export interface NoticeDeleteParams {
  id: string;
}

export function submitNoticeDelete(params: NoticeDeleteParams) {
  return axios.post('/api/v1/sys/notice/delete', params);
}

export interface NoticeDetailParams {
  id: any;
}

export interface NoticeDetail {
  id: string;
  title: string;
  content: string;
  category: number;
  scope: number;
  users: number[];
  resellers: number[];
  methods: number[];
  priority: number;
  expires_at: string;
  scheduled_time: string;
  remark: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export function queryNoticeDetail(params: NoticeDetailParams) {
  return axios.get<NoticeDetail>('/api/v1/sys/notice/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface NoticeUpdate {
  id: string;
  title: string;
  content: string;
  category: number;
  scope: number;
  users: number[];
  resellers: number[];
  methods: number[];
  priority: number;
  expires_at: string;
  scheduled_time: string;
  remark: string;
  status: number;
}

export function submitNoticeUpdate(data: NoticeUpdate) {
  return axios.post('/api/v1/sys/notice/update', data);
}

export interface NoticeBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
}

export function submitNoticeBatchOperate(data: NoticeBatchOperate) {
  return axios.post('/api/v1/sys/notice/batch/operate', data);
}
