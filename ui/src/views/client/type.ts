import { User } from '../user/type';

export interface Client {
  id?: string;
  desc: string;
  secret?: string;
  type: ClientType;
  redirectUris: string[];
  createdAt?: string;
  updatedAt?: string;
  users?: User[];
  userAuthorityDesc?: string;
}

export interface ClientView extends Client {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export enum ClientType {
  SYSTEM = 'SYSTEM',
  OFFICIAL = 'OFFICIAL',
  THREE_PART = 'THREE_PART',
}
