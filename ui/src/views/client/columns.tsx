import { DataTableColumns } from 'naive-ui';
import { ClientView, ClientType } from './type';
import { formatDate } from '../../util/date';
import { NButton, NSpace, NPopconfirm } from 'naive-ui';
import { deleteClient } from './service';
import { message } from '../../util';

export const useColumns: (
  refresh: (flag: boolean) => void,
  onEdit: (id: string) => void,
  onManageUser: (id: string) => void
) => DataTableColumns<ClientView> = (refresh, onEdit, onManageUser) => {
  async function onDeleteHandler(id: string) {
    await deleteClient(id);
    message.success('remove success');
    refresh(false);
  }

  return [
    {
      title: 'Id',
      key: 'id',
      width: 300,
    },
    {
      title: 'Type',
      key: 'type',
      width: 120,
    },
    {
      title: 'Desc',
      key: 'desc',
      width: 300,
    },
    {
      title: 'Created at',
      key: 'createdAt',
      width: 150,
      render(row) {
        return formatDate(row.createdAt);
      },
    },
    {
      title: 'Updated at',
      key: 'updatedAt',
      width: 200,
      render(row) {
        return formatDate(row.updatedAt);
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
              text
              type="info"
              onClick={() => onEdit(row.id)}
              disabled={row.type === ClientType.SYSTEM}
            >
              Edit
            </NButton>
            <NButton text type="info" onClick={() => onManageUser(row.id)}>
              Users
            </NButton>
            <NPopconfirm
              onPositiveClick={() => onDeleteHandler(row.id)}
              v-slots={{
                trigger: () => (
                  <NButton
                    text
                    type="error"
                    disabled={row.type === ClientType.SYSTEM}
                  >
                    Delete
                  </NButton>
                ),
              }}
            >
              Are you sure to delete this client?
            </NPopconfirm>
          </NSpace>
        );
      },
    },
  ];
};
