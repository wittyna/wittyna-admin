import { ClientType, UserRole } from '@prisma/client';

export interface Client {
  id: string;
  desc: string;
  client_id: string;
  client_secret: string;
  type: ClientType;
  redirect_uris: string[];
  created_at: string;
  updated_at: string;
  users?: User[];
}

export interface User {
  id: string;
  username: string;
  password: string;
  roles: UserRole[];
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  clients?: Client[];
}
