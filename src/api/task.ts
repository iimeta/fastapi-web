import axios from 'axios';
import qs from 'query-string';

export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface VideoPage {
  id: string;
  trace_id: string;
  user_id: number;
  app_id: number;
  task_id: string;
  video_url: string;
  video_time: number;
  status: number;
  created_at: any;
}

export interface VideoPageParams extends Partial<VideoPage> {
  current: number;
  pageSize: number;
}

export interface VideoPageRes {
  items: VideoPage[];
  paging: Paging;
}

export function queryVideoPage(params: VideoPageParams) {
  return axios.post<VideoPageRes>('/api/v1/task/video/page', params);
}

export interface DetailParams {
  id: any;
}

export interface VideoDetail {
  id: string;
  trace_id: string;
  user_id: number;
  app_id: number;
  model: string;
  video_id: string;
  width: number;
  height: number;
  seconds: number;
  prompt: string;
  progress: number;
  remixed_from_video_id: string;
  status: string;
  completed_at: string;
  expires_at: string;
  video_url: string;
  file_name: string;
  file_path: string;
  error: any;
  creator: string;
  created_at: string;
  updated_at: string;
}

export function queryVideoDetail(params: DetailParams) {
  return axios.get<VideoDetail>('/api/v1/task/video/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface VideoCopyFieldParams {
  id: string;
  field: string;
}

export interface VideoCopyFieldRes {
  value: string;
}

export function videoCopyField(params: VideoCopyFieldParams) {
  return axios.post<VideoCopyFieldRes>('/api/v1/task/video/copy/field', params);
}
