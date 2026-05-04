import axios from 'axios';
import qs from 'query-string';

export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface TicketCreate {
  title: string;
  content: string;
  category: string;
  priority: number;
}

export function submitTicketCreate(data: TicketCreate) {
  return axios.post('/api/v1/ticket/create', data);
}

export interface TicketReplyCreate {
  ticket_id: string;
  content: string;
}

export function submitTicketReply(data: TicketReplyCreate) {
  return axios.post('/api/v1/ticket/reply', data);
}

export interface TicketPage {
  id: string;
  ticket_no: string;
  title: string;
  category: string;
  priority: number;
  status: number;
  user_id: number;
  user_name: string;
  user_role: string;
  assignee_id: number;
  assignee_role: string;
  reply_count: number;
  last_reply_at: string;
  rid: number;
  created_at: string;
  updated_at: string;
}

export interface TicketPageParams {
  current: number;
  pageSize: number;
  ticket_no?: string;
  title?: string;
  user_name?: string;
  category?: string;
  priority?: number;
  status?: number;
  scope?: string;
  created_at_start?: string;
  created_at_end?: string;
}

export interface TicketPageRes {
  items: TicketPage[];
  paging: Paging;
}

export function queryTicketPage(params: TicketPageParams) {
  return axios.post<TicketPageRes>('/api/v1/ticket/page', params);
}

export interface TicketDetailParams {
  id: any;
}

export interface TicketReply {
  id: string;
  ticket_id: string;
  content: string;
  user_id: number;
  user_name: string;
  role: string;
  created_at: string;
}

export interface TicketDetail {
  id: string;
  ticket_no: string;
  title: string;
  content: string;
  category: string;
  priority: number;
  status: number;
  user_id: number;
  user_name: string;
  user_role: string;
  assignee_id: number;
  assignee_role: string;
  reply_count: number;
  last_reply_at: string;
  rid: number;
  creator: string;
  updater: string;
  created_at: string;
  updated_at: string;
  replies: TicketReply[];
}

export function queryTicketDetail(params: TicketDetailParams) {
  return axios.get<TicketDetail>('/api/v1/ticket/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface TicketUpdateStatus {
  id: string;
  status: number;
}

export function submitTicketUpdateStatus(data: TicketUpdateStatus) {
  return axios.post('/api/v1/ticket/status/update', data);
}

export interface TicketClose {
  id: string;
}

export function submitTicketClose(data: TicketClose) {
  return axios.post('/api/v1/ticket/close', data);
}

export interface TicketAssign {
  id: string;
  assignee_id: number;
}

export function submitTicketAssign(data: TicketAssign) {
  return axios.post('/api/v1/ticket/assign', data);
}

export interface TicketBatchDelete {
  ids: string[];
}

export function submitTicketBatchDelete(data: TicketBatchDelete) {
  return axios.post('/api/v1/ticket/batch/delete', data);
}
