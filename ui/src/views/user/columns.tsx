import { DataTableColumns } from 'naive-ui';
import { UserView } from './type';
import { formatDate } from '../../util/date';
import { NButton, NSpace, NPopconfirm } from 'naive-ui';
import { deleteUser } from './service';
import { userinfo } from '../../main';
import { message } from '../../util';

export const useColumns: (
  refresh: (flag: boolean) => void,
  onEdit: (id: string) => void
) => DataTableColumns<UserView> = (refresh, onEdit) => {
  async function onDeleteHandler(id: string) {
    await deleteUser(id);
    message.success('remove success');
    refresh(false);
  }
  return [
    {
      title: 'Username',
      key: 'username',
      width: 200,
    },
    {
      title: 'Email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Phone',
      key: 'phone',
      width: 200,
    },
    {
      title: 'Created at',
      key: 'created_at',
      width: 200,
      render(row) {
        return formatDate(row.created_at);
      },
    },
    {
      title: 'Updated at',
      key: 'updated_at',
      width: 200,
      render(row) {
        return formatDate(row.updated_at);
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render(row) {
        return (
          <NSpace>
            <NButton
              disabled={!userinfo.is_client_admin}
              text
              type="info"
              onClick={() => onEdit(row.id)}
            >
              Edit
            </NButton>
            <NPopconfirm
              onPositiveClick={() => onDeleteHandler(row.id)}
              v-slots={{
                trigger: () => (
                  <NButton
                    text
                    type="error"
                    disabled={!userinfo.is_client_admin}
                  >
                    Delete
                  </NButton>
                ),
              }}
            >
              Are you sure to delete this user?
            </NPopconfirm>
          </NSpace>
        );
      },
    },
  ];
};
