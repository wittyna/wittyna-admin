import { request } from '../../request';
import { User } from './type';
import { ListResponse } from '../../type';

export const getUserList = ({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search: string;
}): Promise<ListResponse<User>> =>
  request.get('/admin/user', {
    params: {
      page,
      pageSize,
      search,
    },
  });

export const getUser = (id: string): Promise<User> =>
  request.get(`/admin/user/${encodeURIComponent(id)}`);

export const deleteUser = (id: string): Promise<User> =>
  request.delete(`/admin/user/${encodeURIComponent(id)}`);

export const upsertUser = (client: User): Promise<User> => {
  if (client.id) {
    return request.put(`/admin/user`, client);
  }
  return request.post(`/admin/user`, client);
};
