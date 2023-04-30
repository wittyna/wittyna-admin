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

export const deleteClient = (id: string): Promise<Client> =>
  request.delete(`/admin/client/${encodeURIComponent(id)}`);

export const createClient = (client: Client): Promise<Client> =>
  request.post(`/admin/client`, client);
