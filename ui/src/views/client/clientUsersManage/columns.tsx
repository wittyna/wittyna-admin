import { DataTableColumns, NSwitch } from 'naive-ui';
import { Client2User, User } from '@prisma/client';
import { NButton, NSpace, NPopconfirm } from 'naive-ui';
import { removeClientUser, setClientAdmin } from '../service';
import { message } from '../../../util';

export const useColumns: (
  refresh: (flag: boolean) => void,
  clientId: Ref<string>
) => DataTableColumns<Client2User & { user: User }> = (refresh, clientId) => {
  async function onRemoveHandler(userId: string) {
    await removeClientUser({
      userId,
      clientId: clientId.value,
    });
    message.success('remove success');
    refresh(false);
  }
  return [
    {
      title: 'username',
      key: 'user.username',
      width: 200,
    },
    {
      title: 'email',
      key: 'user.email',
      width: 200,
    },
    {
      title: 'phone',
      key: 'user.phone',
      width: 200,
    },
    {
      title: 'is_client_admin',
      key: 'is_client_admin',
      width: 200,
      render(row) {
        return (
          <NSwitch
            value={row.is_client_admin}
            onUpdate:value={async (v) => {
              await setClientAdmin({
                user_id: row.user.id,
                client_id: clientId.value,
                is_client_admin: v,
              });
              message.success('update success');
              row.is_client_admin = v;
            }}
          ></NSwitch>
        );
      },
    },
    {
      title: 'actions',
      key: 'actions',
      width: 200,
      render(row) {
        return (
          <NSpace>
            <NPopconfirm
              onPositiveClick={() => onRemoveHandler(row.user.id)}
              v-slots={{
                trigger: () => (
                  <NButton text type="error" disabled={row.is_client_admin}>
                    remove
                  </NButton>
                ),
              }}
            >
              Are you sure to remove this user?
            </NPopconfirm>
          </NSpace>
        );
      },
    },
  ];
};
