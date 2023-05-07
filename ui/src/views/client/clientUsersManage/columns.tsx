import {
  DataTableColumns,
  NDatePicker,
  NPopover,
  NSwitch,
  NTooltip,
} from 'naive-ui';
import { Client2User, User } from '@prisma/client';
import { NButton, NSpace, NPopconfirm } from 'naive-ui';
import {
  removeClientUser,
  setClientAdmin,
  setClientUserExpiresAt,
} from '../service';
import { message } from '../../../util';
import { formatDate } from '../../../util/date';
import { Component, defineComponent, ref } from 'vue';

export const useColumns: (
  refresh: (flag: boolean) => void,
  clientId: Ref<string>
) => DataTableColumns<
  Omit<Client2User, 'expiresAt'> & { user: User; expiresAt: string }
> = (refresh, clientId) => {
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
      width: 150,
      render(row) {
        if (row.expiresAt && Date.now() > new Date(row.expiresAt).getTime()) {
          return <ExpiredStyle>{row.user?.username}</ExpiredStyle>;
        }
        return row.user.username;
      },
    },
    {
      title: 'Email',
      key: 'user.email',
      width: 200,
      render(row) {
        if (row.expiresAt && Date.now() > new Date(row.expiresAt).getTime()) {
          return <ExpiredStyle>{row.user?.email}</ExpiredStyle>;
        }
        return row.user.username;
      },
    },
    {
      title: 'Phone',
      key: 'user.phone',
      width: 150,
      render(row) {
        if (row.expiresAt && Date.now() > new Date(row.expiresAt).getTime()) {
          return <ExpiredStyle>{row.user?.phone}</ExpiredStyle>;
        }
        return row.user.username;
      },
    },
    {
      title: 'Expires at',
      key: 'expiresAt',
      width: 200,
      render(row) {
        return (
          <>
            {row.expiresAt ? (
              Date.now() > new Date(row.expiresAt).getTime() ? (
                <ExpiredStyle>Expired</ExpiredStyle>
              ) : (
                formatDate(row.expiresAt)
              )
            ) : (
              ''
            )}
            &nbsp;&nbsp;
            <ConfirmDatetime
              defaultValue={row.expiresAt}
              onConfirm={async (v: string) => {
                await setClientUserExpiresAt({
                  userId: row.user.id,
                  clientId: clientId.value,
                  expiresAt: v,
                });
                message.success('Update success');
                row.expiresAt = v;
              }}
            ></ConfirmDatetime>
          </>
        );
      },
    },
    {
      title: 'Is client admin',
      key: 'isClientAdmin',
      width: 150,
      render(row) {
        return (
          <NPopconfirm
            onPositiveClick={async () => {
              await setClientAdmin({
                userId: row.user.id,
                clientId: clientId.value,
                isClientAdmin: !row.isClientAdmin,
              });
              message.success('Update success');
              row.isClientAdmin = !row.isClientAdmin;
            }}
            v-slots={{
              trigger: () => <NSwitch value={row.isClientAdmin}></NSwitch>,
            }}
          >
            {row.isClientAdmin
              ? 'Are you sure to unset client admin?'
              : 'Are you sure to set client admin?'}
          </NPopconfirm>
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

const ConfirmDatetime = defineComponent({
  props: {
    onConfirm: { type: Function, required: true },
    defaultValue: { type: String, required: true },
  },
  setup(props) {
    const show = ref(false);
    return () => (
      <NPopover
        show={show.value}
        onUpdate:show={(v) => {
          show.value = v;
        }}
        placement="top"
        trigger="click"
        v-slots={{
          trigger: () => (
            <NButton text type="primary">
              Set
            </NButton>
          ),
        }}
      >
        <NDatePicker
          actions={['clear', 'now', 'confirm']}
          panel
          type="datetime"
          default-time="23:59:59"
          defaultValue={new Date(props.defaultValue).getTime() || undefined}
          onConfirm={(v) => {
            if (v === null) {
              props.onConfirm(v);
            } else {
              props.onConfirm(new Date(v).toISOString());
            }
            show.value = false;
          }}
        ></NDatePicker>
      </NPopover>
    );
  },
});

const ExpiredStyle = defineComponent({
  setup(props, { slots }) {
    return () => (
      <span style="color: rgb(51, 54, 57, 0.6)">{slots.default?.()}</span>
    );
  },
});
