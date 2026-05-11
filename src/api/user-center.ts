import axios from 'axios';

export interface UpdateInfoData {
  name: string;
}

export function updateInfo(data: UpdateInfoData) {
  return axios.post('/api/v1/user/update/info', data);
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export function changePassword(data: ChangePasswordData) {
  return axios.post('/api/v1/user/change/password', data);
}

export interface ChangeEmailData {
  email: string;
  code: string;
  password: string;
}

export function changeEmail(data: ChangeEmailData) {
  return axios.post('/api/v1/user/change/email', data);
}

export function changeAvatar(
  data: FormData,
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  }
) {
  // const controller = new AbortController();
  return axios.post('/api/v1/user/change/avatar', data, config);
}

export interface UserPrivacy {
  log_request_content: boolean;
  log_response_content: boolean;
  log_resource_url: boolean;
  log_client_ip: boolean;
  log_request_fields: string[];
  log_response_fields: string[];
  log_resource_fields: string[];
  log_network_fields: string[];
}

export interface PrivacyLogFieldOption {
  key: string;
  label: string;
  category: string;
  description?: string;
  log_types?: string[];
  enabled: boolean;
  sort?: number;
}

export function getPrivacySettings() {
  return axios.get<UserPrivacy>('/api/v1/user/privacy');
}

export function updatePrivacySettings(data: UserPrivacy) {
  return axios.post('/api/v1/user/privacy', data);
}

export function getPrivacyLogFields() {
  return axios.get<{ items: PrivacyLogFieldOption[] }>(
    '/api/v1/user/privacy/fields'
  );
}
