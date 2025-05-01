export type RoleType = '' | '*' | 'reseller' | 'user' | 'admin';
export interface UserState {
  user_id?: string;
  account?: string;
  name?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  created_at?: string;
  role: RoleType;
  rid?: number;
}
