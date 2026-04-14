import axios from 'axios';

// 监控中心实时性能维度分析
export interface PerfBreakdownParams {
  dimension: string;
  limit?: number;
  window?: number;
}

export interface PerfBreakdownItem {
  name: string;
  rps: number;
  tps: number;
  rpm: number;
  tpm: number;
  avg_total_time: number;
  avg_conn_time: number;
  avg_duration: number;
  avg_internal_time: number;
  success_rate: number;
  error_count: number;
  input_tokens: number;
  output_tokens: number;
  avg_tokens_per_req: number;
}

export interface PerfBreakdownRes {
  items: PerfBreakdownItem[];
}

export function queryPerfBreakdown(params: PerfBreakdownParams) {
  return axios.post<PerfBreakdownRes>('/api/v1/monitor/perf/breakdown', params);
}

// 监控中心历史性能数据
export interface PerfHistoryParams {
  dimension: string;
  range: string;
  metric: string;
  limit?: number;
}

export interface PerfHistoryRes {
  dates: string[];
  series: Record<string, number[]>;
}

export function queryPerfHistory(params: PerfHistoryParams) {
  return axios.post<PerfHistoryRes>('/api/v1/monitor/perf/history', params);
}

// 监控中心全局实时指标
export interface MonitorGlobalRes {
  rps: number;
  tps: number;
  rpm: number;
  tpm: number;
}

export function queryMonitorGlobal() {
  return axios.post<MonitorGlobalRes>('/api/v1/monitor/global');
}
