import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params });
}


export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/v1/dashboard/base/data');
}

export interface BaseDataRecord {
  app: number;
  today_app: number;
  model: number;
  app_key: number;
  model_key: number;
  user: number;
  today_user: number;
}

export function queryBaseData() {
  return axios.get<BaseDataRecord>('/api/v1/dashboard/base/data');
}

export interface Expense {
  quota: number;
}

export function queryExpense() {
  return axios.get<Expense>('/api/v1/dashboard/expense');
}
