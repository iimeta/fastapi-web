export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  user_id?: string;
  name?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  created_at?: string;
  role: RoleType;
}
