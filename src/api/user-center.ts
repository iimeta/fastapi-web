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
