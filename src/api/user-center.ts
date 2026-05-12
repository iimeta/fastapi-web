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
  is_configured: boolean;
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
  description?: string;
  log_types?: string[];
  enabled: boolean;
  sort?: number;
}

export interface LogPrivacy {
  is_enable_request: boolean;
  is_default_enable_request: boolean;
  request_privacy_fields: PrivacyLogFieldOption[];
  is_enable_response: boolean;
  is_default_enable_response: boolean;
  response_privacy_fields: PrivacyLogFieldOption[];
  is_enable_resource: boolean;
  is_default_enable_resource: boolean;
  resource_privacy_fields: PrivacyLogFieldOption[];
  is_enable_network: boolean;
  is_default_enable_network: boolean;
  network_privacy_fields: PrivacyLogFieldOption[];
}

export interface UserPrivacyRes {
  privacy: UserPrivacy;
  log_privacy: LogPrivacy;
}

export function getPrivacySettings() {
  return axios.get<UserPrivacyRes>('/api/v1/user/privacy');
}

export function updatePrivacySettings(data: UserPrivacy) {
  return axios.post<UserPrivacyRes>('/api/v1/user/privacy', data);
}
