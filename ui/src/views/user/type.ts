import { Client } from '../client/type';

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  clients?: Client[];
}

export interface UserView extends User {
  id: string;
  createdAt: string;
  updatedAt: string;
}
