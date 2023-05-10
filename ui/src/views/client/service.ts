import { request } from '../../request';
import { Client } from './type';
import { ListResponse } from '../../type';
import { Client2User, User } from '@prisma/client';

export const getClientList = ({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search: string;
}): Promise<ListResponse<Client>> =>
  request.get('/admin/client', {
    params: {
      page,
      pageSize,
      search,
    },
  });

export const getClient = (id: string): Promise<Client> =>
  request.get(`/admin/client/${encodeURIComponent(id)}`);

export const deleteClient = (id: string): Promise<Client> =>
  request.delete(`/admin/client/${encodeURIComponent(id)}`);

export const upsertClient = (client: Client): Promise<Client> => {
  if (client.id) {
    return request.put(`/admin/client`, client);
  }
  return request.post(`/admin/client`, client);
};

export const getClientUsers = ({
  clientId,
  pageSize,
  page,
  search,
}: {
  clientId: string;
  page: number;
  pageSize: number;
  search: string;
}): Promise<ListResponse<Client2User & { user: User }>> =>
  request.get(`/admin/client/${encodeURIComponent(clientId)}/user`, {
    params: {
      page,
      pageSize,
      search,
    },
  });

export const removeClientUser = ({
  userId,
  clientId,
}: {
  userId: string;
  clientId: string;
}): Promise<ListResponse<Client>> =>
  request.delete(
    `/admin/client/${encodeURIComponent(clientId)}/user/${encodeURIComponent(
      userId
    )}`
  );

export const addClientUser = ({
  userIds,
  clientId,
}: {
  userIds: string[];
  clientId: string;
}): Promise<ListResponse<Client>> =>
  request.post(`/admin/client/${encodeURIComponent(clientId)}/user`, {
    userIds,
  });

export async function setClientUserExpiresAt({
  clientId,
  userId,
  expiresAt,
}: {
  clientId: string;
  userId: string;
  expiresAt: string;
}) {
  return request.put(
    `/admin/client/${encodeURIComponent(clientId)}/user/${encodeURIComponent(
      userId
    )}/expires-at/${encodeURIComponent(expiresAt)}`
  );
}

export async function setClientUserAuthority({
  clientId,
  userId,
  authority,
}: {
  clientId: string;
  userId: string;
  authority: string;
}): Promise<void> {
  return request.put(
    `/admin/client/${encodeURIComponent(clientId)}/user/${encodeURIComponent(
      userId
    )}/authority/${encodeURIComponent(authority || 'null')}`
  );
}
