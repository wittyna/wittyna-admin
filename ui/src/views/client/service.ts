import { request } from '../../request';
import { Client } from './type';
import { ListResponse } from '../../type';

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

export const getClientUsers = (
  clientId: string,
  page: string,
  pageSize: string
): Promise<ListResponse<Client>> =>
  request.get(`/admin/client/${encodeURIComponent(clientId)}/user`, {
    params: {
      page,
      pageSize,
    },
  });
