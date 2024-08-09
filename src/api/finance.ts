import axios from 'axios';

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
  return axios.post<BillPageRes>('/api/v1/finance/bill', params);
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
  return axios.post<DealRecordPageRes>('/api/v1/finance/deal/record', params);
}
