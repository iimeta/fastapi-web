import axios from 'axios';
import qs from 'query-string';

export interface BillDetailParams {
  id: any;
}

export interface ModelStat {
  model_id: string;
  model: string;
  total: number;
  tokens: number;
  abnormal: number;
  abnormal_tokens: number;
}

export interface StatisticsUser {
  id: string;
  user_id: number;
  stat_date: string;
  stat_time: number;
  total: number;
  tokens: number;
  abnormal: number;
  abnormal_tokens: number;
  model_stats: ModelStat[];
}

export function queryBillDetail(params: BillDetailParams) {
  return axios.get<StatisticsUser>('/api/v1/finance/bill/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface BillPage {
  id: string;
  user_id: string;
}

export interface BillPageParams extends Partial<BillPage> {
  current: number;
  pageSize: number;
}

export interface BillPageRes {
  items: BillPage[];
  paging: Paging;
}

export function queryBillPage(params: BillPageParams) {
  return axios.post<BillPageRes>('/api/v1/finance/bill/page', params);
}

export interface BillExportParams {
  ids?: string[];
  stat_date?: any;
  user_id?: number;
}

export function submitBillExport(params: BillExportParams) {
  return axios.post('/api/v1/finance/bill/export', params, {
    responseType: 'blob',
  });
}

export interface DealRecordPage {
  id: string;
  user_id: string;
  status: number;
  remark: string;
}

export interface DealRecordPageParams extends Partial<DealRecordPage> {
  current: number;
  pageSize: number;
}

export interface DealRecordPageRes {
  items: DealRecordPage[];
  paging: Paging;
}

export function queryDealRecordPage(params: DealRecordPageParams) {
  return axios.post<DealRecordPageRes>(
    '/api/v1/finance/deal/record/page',
    params
  );
}
