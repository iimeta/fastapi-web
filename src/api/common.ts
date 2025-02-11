import axios from 'axios';

export interface CaptchaData {
  email: string;
  action: string;
  channel: string;
  domain?: string;
}

export function getCaptcha(data: CaptchaData) {
  return axios.post(`/api/v1/common/email-code`, data);
}
