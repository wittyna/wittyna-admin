import { User } from '../user/type';

export interface Client {
  id?: string;
  desc: string;
  secret?: string;
  type: ClientType;
  redirect_uris: string[];
  created_at?: string;
  updated_at?: string;
  users?: User[];
}

export interface ClientView extends Client {
  id: string;
  created_at: string;
  updated_at: string;
}

export enum ClientType {
  SYSTEM = 'SYSTEM',
  OFFICIAL = 'OFFICIAL',
  THREE_PART = 'THREE_PART',
}
