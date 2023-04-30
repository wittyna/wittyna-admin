import { DataTableColumns } from 'naive-ui';
import { ClientView } from './type';
import { formatDate } from '../../util/date';
import { NButton, NSpace, NPopconfirm } from 'naive-ui';
import { ClientType } from '@prisma/client';
import { deleteClient } from './service';

export const useColumns: (
  refresh: (flag: boolean) => void
) => DataTableColumns<ClientView> = (refresh) => {
  async function onDeleteHandler(id: string) {
    await deleteClient(id);
    refresh(false);
  }

  return [
    {
      title: 'client_id',
      key: 'client_id',
      width: 200,
    },
    {
      title: 'desc',
      key: 'desc',
      width: 200,
    },
    {
      title: 'type',
      key: 'type',
      width: 200,
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
      title: 'actions',
      key: 'actions',
      render(row) {
        return (
          <NSpace>
            <NButton text type="info" disabled={row.type === ClientType.SYSTEM}>
              edit
            </NButton>
            <NPopconfirm
              onPositiveClick={() => onDeleteHandler(row.id!)}
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
