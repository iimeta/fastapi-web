import axios from 'axios';
import qs from 'query-string';

export interface Paging {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}

export interface DetailParams {
  id: any;
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

export interface ImagePage {
  id: string;
  trace_id: string;
  user_id: number;
  app_id: number;
  task_id: string;
  image_url: string;
  image_urls: string[];
  image_time: number;
  prompt: string;
  quality: string;
  status: number;
  total_time: number;
  created_at: any;
}

export interface ImagePageParams extends Partial<ImagePage> {
  current: number;
  pageSize: number;
  model_agents?: string[];
}

export interface ImagePageRes {
  items: ImagePage[];
  paging: Paging;
}

export function queryImagePage(params: ImagePageParams) {
  return axios.post<ImagePageRes>('/api/v1/task/image/page', params);
}

export interface ImageDetail {
  id: string;
  trace_id: string;
  user_id: number;
  app_id: number;
  model: string;
  image_id: string;
  job_id: string;
  width: number;
  height: number;
  n: number;
  quality: string;
  size: string;
  output_format: string;
  response_format: string;
  prompt: string;
  progress: number;
  status: string;
  completed_at: string;
  expires_at: string;
  image_url: string;
  image_urls: string[];
  file_name: string;
  file_names: string[];
  file_path: string;
  file_paths: string[];
  input_file_paths: string[];
  error: any;
  model_agent_id: string;
  model_agent: any;
  creator: string;
  created_at: string;
  updated_at: string;
}

export function queryImageDetail(params: DetailParams) {
  return axios.get<ImageDetail>('/api/v1/task/image/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface ImageCopyFieldParams {
  id: string;
  field: string;
}

export interface ImageCopyFieldRes {
  value: string;
}

export function imageCopyField(params: ImageCopyFieldParams) {
  return axios.post<ImageCopyFieldRes>('/api/v1/task/image/copy/field', params);
}

export function regenerateImage(params: { id: string }) {
  return axios.post('/api/v1/task/image/regenerate', params);
}

export interface ImageBatchOperate {
  action: string;
  ids?: string[];
  value?: any;
}

export function submitImageBatchOperate(data: ImageBatchOperate) {
  return axios.post('/api/v1/task/image/batch/operate', data);
}

export interface FilePage {
  id: string;
  trace_id: string;
  user_id: number;
  app_id: number;
  task_id: string;
  file_url: string;
  file_time: number;
  status: number;
  created_at: any;
}

export interface FilePageParams extends Partial<FilePage> {
  current: number;
  pageSize: number;
}

export interface FilePageRes {
  items: FilePage[];
  paging: Paging;
}

export function queryFilePage(params: FilePageParams) {
  return axios.post<FilePageRes>('/api/v1/task/file/page', params);
}

export interface FileDetail {
  id: string;
  trace_id: string;
  user_id: number;
  app_id: number;
  model: string;
  purpose: string;
  file_id: string;
  file_name: string;
  bytes: number;
  file_url: string;
  status: string;
  expires_at: string;
  response_data: any;
  error: any;
  file_path: string;
  batch_trace_id: string;
  creator: string;
  created_at: string;
  updated_at: string;
}

export function queryFileDetail(params: DetailParams) {
  return axios.get<FileDetail>('/api/v1/task/file/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface FileCopyFieldParams {
  id: string;
  field: string;
}

export interface FileCopyFieldRes {
  value: string;
}

export function fileCopyField(params: FileCopyFieldParams) {
  return axios.post<FileCopyFieldRes>('/api/v1/task/file/copy/field', params);
}

export interface BatchPage {
  id: string;
  trace_id: string;
  user_id: number;
  app_id: number;
  task_id: string;
  batch_url: string;
  batch_time: number;
  status: number;
  created_at: any;
}

export interface BatchPageParams extends Partial<BatchPage> {
  current: number;
  pageSize: number;
}

export interface BatchPageRes {
  items: BatchPage[];
  paging: Paging;
}

export function queryBatchPage(params: BatchPageParams) {
  return axios.post<BatchPageRes>('/api/v1/task/batch/page', params);
}

export interface BatchDetail {
  id: string;
  trace_id: string;
  user_id: number;
  app_id: number;
  model: string;
  batch_id: string;
  input_file_id: string;
  output_file_id: string;
  error_file_id: string;
  status: string;
  in_progress_at: string;
  finalizing_at: string;
  completed_at: string;
  expires_at: string;
  cancelling_at: string;
  cancelled_at: string;
  failed_at: string;
  response_data: any;
  error: any;
  creator: string;
  created_at: string;
  updated_at: string;
}

export function queryBatchDetail(params: DetailParams) {
  return axios.get<BatchDetail>('/api/v1/task/batch/detail', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface BatchCopyFieldParams {
  id: string;
  field: string;
}

export interface BatchCopyFieldRes {
  value: string;
}

export function batchCopyField(params: BatchCopyFieldParams) {
  return axios.post<BatchCopyFieldRes>('/api/v1/task/batch/copy/field', params);
}
