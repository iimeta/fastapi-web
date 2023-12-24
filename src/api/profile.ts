import axios from 'axios';

export interface ProfileBasicRes {
  status: number;
}

export function queryProfileBasic() {
  return axios.get<ProfileBasicRes>('/api/profile/basic');
}
