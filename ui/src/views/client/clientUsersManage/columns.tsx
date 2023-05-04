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
      title: 'Username',
      key: 'user.username',
      width: 200,
    },
    {
      title: 'Email',
      key: 'user.email',
      width: 200,
    },
    {
      title: 'Phone',
      key: 'user.phone',
      width: 200,
    },
    {
      title: 'Is client admin',
      key: 'isClientAdmin',
      width: 200,
      render(row) {
        return (
          <NSwitch
            value={row.isClientAdmin}
            onUpdate:value={async (v) => {
              await setClientAdmin({
                userId: row.user.id,
                clientId: clientId.value,
                isClientAdmin: v,
              });
              message.success('Update success');
              row.isClientAdmin = v;
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
                  <NButton text type="error" disabled={row.isClientAdmin}>
                    Remove
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
