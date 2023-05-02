import { DataTableColumns } from 'naive-ui';
import { UserView } from '../../user/type';
import { NButton, NSpace, NPopconfirm } from 'naive-ui';

export const useColumns: (
  refresh: (flag: boolean) => void,
  onEdit: (id: string) => void
) => DataTableColumns<UserView> = (refresh, onEdit) => {
  async function onDeleteHandler(id: string) {
    await deleteUser(id);
    refresh(false);
  }
  return [
    {
      title: 'username',
      key: 'username',
      width: 200,
    },
    {
      title: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'phone',
      key: 'phone',
      width: 200,
    },
    {
      title: 'actions',
      key: 'actions',
      width: 200,
      render(row) {
        return (
          <NSpace>
            <NButton
              disabled={row.is_system_admin}
              text
              type="info"
              onClick={() => onEdit(row.id)}
            >
              edit
            </NButton>
            <NPopconfirm
              onPositiveClick={() => onDeleteHandler(row.id)}
              v-slots={{
                trigger: () => (
                  <NButton disabled={row.is_system_admin} text type="error">
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
