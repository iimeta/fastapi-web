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

export interface CallData {
  date: string;
  call: number;
  tokens: number;
  user: number;
  app: number;
  abnormal: number;
}

export interface CallDataRes {
  items: CallData[];
}

export function queryCallData(days: number) {
  return axios.get<CallDataRes>(`/api/v1/dashboard/call/data/${days}`);
}

export interface BaseDataRecord {
  app: number;
  today_app: number;
  model: number;
  app_key: number;
  model_key: number;
  user: number;
  today_user: number;
  call: number;
}

export function queryBaseData() {
  return axios.get<BaseDataRecord>('/api/v1/dashboard/base/data');
}

export interface Expense {
  quota: number;
  quota_usd: number;
  used_quota: number;
  used_quota_usd: number;
  quota_expires_at: string;
}

export function queryExpense() {
  return axios.get<Expense>('/api/v1/dashboard/expense');
}

export interface DataTop {
  user_id: number;
  app_id: number;
  app_key: string;
  model: string;
  call: number;
  models: number;
  tokens: number;
  user: number;
  app: number;
}

export interface DataTopRes {
  items: DataTop[];
}

export function queryDataTop(params: { days: number; data_type: string }) {
  return axios.get<DataTopRes>(`/api/v1/dashboard/data/top`, { params });
}

export interface ModelPercent {
  name: string;
  value: number;
}

export interface ModelPercentRes {
  models: string[];
  items: ModelPercent[];
}

export function queryModelPercent(days: number) {
  return axios.get<ModelPercentRes>(`/api/v1/dashboard/model/percent/${days}`);
}

export interface PerMinuteRes {
  rpm: number;
  tpm: number;
}

export function queryPerMinute() {
  return axios.get<PerMinuteRes>(`/api/v1/dashboard/per/minute`);
}
