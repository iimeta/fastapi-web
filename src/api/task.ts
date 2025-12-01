import axios from 'axios';

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
