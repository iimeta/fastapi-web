import axios from 'axios';

export interface UserAgreementParams {
  domain?: string;
  path?: string;
}

export function queryUserAgreement(params: UserAgreementParams) {
  return axios.post('/api/v1/open/user/agreement', params);
}

export interface PrivacyPolicyParams {
  domain?: string;
  path?: string;
}

export function queryPrivacyPolicy(params: PrivacyPolicyParams) {
  return axios.post('/api/v1/open/privacy/policy', params);
}
