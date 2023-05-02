import { Client } from '../client/type';

export interface User {
  id: string;
  username: string;
  password: string;
  is_system_admin: boolean;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  clients?: Client[];
}

export interface UserView extends User {
  id: string;
  created_at: string;
  updated_at: string;
}
