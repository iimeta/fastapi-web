import axios from 'axios';

// 数据看板汇总
export interface StatisticsSummaryParams {
  stat_start_time: number;
  stat_end_time: number;
  rid?: number;
  user_id?: number;
  app_id?: number;
  app_key?: string;
  models?: string[];
}

export interface StatisticsSummaryRes {
  total: number;
  tokens: number;
  abnormal: number;
  abnormal_rate: number;
  active_users: number;
  active_apps: number;
  prev_total: number;
  prev_tokens: number;
  prev_abnormal: number;
  prev_abnormal_rate: number;
}

export function querySummary(params: StatisticsSummaryParams) {
  return axios.post<StatisticsSummaryRes>(
    '/api/v1/statistics/data/summary',
    params
  );
}

// 数据看板趋势
export interface StatisticsTrendParams {
  stat_start_time: number;
  stat_end_time: number;
  rid?: number;
  user_id?: number;
  app_id?: number;
  app_key?: string;
  models?: string[];
}

export interface StatisticsTrendItem {
  date: string;
  total: number;
  tokens: number;
  abnormal: number;
  abnormal_rate: number;
  active_users: number;
  active_apps: number;
}

export interface StatisticsTrendRes {
  items: StatisticsTrendItem[];
}

export function queryTrend(params: StatisticsTrendParams) {
  return axios.post<StatisticsTrendRes>(
    '/api/v1/statistics/data/trend',
    params
  );
}

// 数据看板模型分布
export interface StatisticsModelPercentParams {
  stat_start_time: number;
  stat_end_time: number;
  rid?: number;
  user_id?: number;
  app_id?: number;
  app_key?: string;
  data_type?: string;
}

export interface StatisticsModelPercentItem {
  name: string;
  value: number;
}

export interface StatisticsModelPercentRes {
  models: string[];
  items: StatisticsModelPercentItem[];
}

export function queryModelPercent(params: StatisticsModelPercentParams) {
  return axios.post<StatisticsModelPercentRes>(
    '/api/v1/statistics/data/model/percent',
    params
  );
}

// 数据看板排行
export interface StatisticsTopParams {
  stat_start_time: number;
  stat_end_time: number;
  data_type: string;
  rid?: number;
  user_id?: number;
  app_id?: number;
  app_key?: string;
  provider?: string;
  limit?: number;
}

export interface StatisticsTopItem {
  user_id: number;
  app_id: number;
  app_key: string;
  app_key_raw?: string;
  model: string;
  provider: string;
  provider_id?: string;
  call: number;
  tokens: number;
}

export interface StatisticsTopRes {
  items: StatisticsTopItem[];
}

export function queryTop(params: StatisticsTopParams) {
  return axios.post<StatisticsTopRes>('/api/v1/statistics/data/top', params);
}

// 数据看板明细
export interface StatisticsDetailParams {
  stat_start_time: number;
  stat_end_time: number;
  data_type: string;
  rid?: number;
  user_id?: number;
  app_id?: number;
  app_key?: string;
  model_id?: string;
  current?: number;
  pageSize?: number;
}

export interface ModelStat {
  model_id: string;
  model: string;
  total: number;
  tokens: number;
  abnormal: number;
  abnormal_tokens: number;
}

export interface StatisticsDetailItem {
  user_id: number;
  app_id: number;
  app_key: string;
  model: string;
  stat_date: string;
  total: number;
  tokens: number;
  abnormal: number;
  abnormal_rate: number;
  model_stats: ModelStat[];
}

export interface StatisticsDetailRes {
  items: StatisticsDetailItem[];
  paging: {
    current: number;
    pageSize: number;
    total: number;
  };
}

export function queryDetail(params: StatisticsDetailParams) {
  return axios.post<StatisticsDetailRes>(
    '/api/v1/statistics/data/detail',
    params
  );
}

// 数据看板全局总览
export interface StatisticsOverviewParams {
  rid?: number;
  user_id?: number;
  app_id?: number;
  app_key?: string;
}

export interface StatisticsOverviewRes {
  total_calls: number;
  total_tokens: number;
  total_abnormal: number;
  abnormal_rate: number;
  total_users: number;
  total_apps: number;
  total_app_keys: number;
  total_models: number;
  total_model_keys: number;
  total_agents: number;
  total_providers: number;
  total_groups: number;
  today_calls: number;
  today_tokens: number;
  today_abnormal: number;
  today_users: number;
  today_apps: number;
  total_batch_tasks: number;
  total_file_tasks: number;
  total_video_tasks: number;
}

export function queryOverview(params?: StatisticsOverviewParams) {
  return axios.post<StatisticsOverviewRes>(
    '/api/v1/statistics/data/overview',
    params
  );
}

// 数据看板模型趋势
export interface StatisticsModelTrendParams {
  stat_start_time: number;
  stat_end_time: number;
  rid?: number;
  user_id?: number;
  app_id?: number;
  app_key?: string;
  models?: string[];
}

export interface ModelTrendSeries {
  calls: number[];
  tokens: number[];
  abnormal: number[];
}

export interface StatisticsModelTrendRes {
  models: string[];
  dates: string[];
  series: Record<string, ModelTrendSeries>;
}

export function queryModelTrend(params: StatisticsModelTrendParams) {
  return axios.post<StatisticsModelTrendRes>(
    '/api/v1/statistics/data/model/trend',
    params
  );
}

// 数据看板密钥状态(admin)
export interface KeyStat {
  key: string;
  status: number;
  used_quota: number;
}

export interface StatisticsKeyStatusRes {
  total: number;
  active: number;
  disabled: number;
  auto_disabled: number;
  by_key: KeyStat[];
}

export function queryKeyStatus(params?: {
  stat_start_time?: number;
  stat_end_time?: number;
  app_key?: string;
  key?: string;
  models?: string[];
  provider?: string;
}) {
  return axios.post<StatisticsKeyStatusRes>(
    '/api/v1/statistics/data/key/status',
    params
  );
}

// 数据看板代理状态(admin)
export interface AgentStat {
  name: string;
  status: number;
  used_quota: number;
}

export interface StatisticsAgentStatusRes {
  total: number;
  active: number;
  disabled: number;
  auto_disabled: number;
  by_agent: AgentStat[];
}

export function queryAgentStatus(params?: {
  stat_start_time?: number;
  stat_end_time?: number;
  app_key?: string;
  key?: string;
  models?: string[];
  provider?: string;
}) {
  return axios.post<StatisticsAgentStatusRes>(
    '/api/v1/statistics/data/agent/status',
    params
  );
}

// 数据看板任务状态分布(admin)
export interface TaskStatusItem {
  status: string;
  count: number;
}

export interface StatisticsTaskStatusRes {
  batch: TaskStatusItem[];
  file: TaskStatusItem[];
  video: TaskStatusItem[];
  active_batch: number;
  active_video: number;
  queued_video: number;
  queued_batch: number;
}

export function queryTaskStatus(params?: {
  stat_start_time?: number;
  stat_end_time?: number;
  rid?: number;
  user_id?: number;
  app_id?: number;
  app_key?: string;
  key?: string;
  models?: string[];
  provider?: string;
}) {
  return axios.post<StatisticsTaskStatusRes>(
    '/api/v1/statistics/data/task/status',
    params
  );
}

// 数据看板响应耗时趋势
export interface StatisticsLatencyTrendParams {
  stat_start_time: number;
  stat_end_time: number;
  rid?: number;
  user_id?: number;
  app_id?: number;
  app_key?: string;
}

export interface LatencyTrendSeries {
  avg_total_time: number[];
}

export interface StatisticsLatencyTrendRes {
  models: string[];
  dates: string[];
  series: Record<string, LatencyTrendSeries>;
}

export function queryLatencyTrend(params: StatisticsLatencyTrendParams) {
  return axios.post<StatisticsLatencyTrendRes>(
    '/api/v1/statistics/data/latency/trend',
    params
  );
}
