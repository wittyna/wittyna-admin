import { DataTableColumns } from 'naive-ui';
import { ClientView } from './type';
import { formatDate } from '../../util/date';
import { NButton, NSpace, NPopconfirm } from 'naive-ui';
import { ClientType } from '@prisma/client';
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
      title: 'id',
      key: 'id',
      width: 200,
    },
    {
      title: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: 'created_at',
      key: 'created_at',
      width: 200,
      render(row) {
        return formatDate(row.created_at);
      },
    },
    {
      title: 'updated_at',
      key: 'updated_at',
      width: 200,
      render(row) {
        return formatDate(row.updated_at);
      },
    },
    {
      title: 'desc',
      key: 'desc',
      width: 350,
    },
    {
      title: 'actions',
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
              edit
            </NButton>
            <NButton text type="info" onClick={() => onManageUser(row.id)}>
              users
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
