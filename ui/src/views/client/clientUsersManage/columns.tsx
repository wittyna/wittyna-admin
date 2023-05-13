import { DataTableColumns, NDatePicker, NInput, NPopover } from 'naive-ui';
import { Client2User, User } from '@prisma/client';
import { NButton, NSpace, NPopconfirm } from 'naive-ui';
import {
  removeClientUser,
  setClientUserAuthority,
  setClientUserExpiresAt,
} from '../service';
import { message } from '../../../util';
import { formatDate } from '../../../util/date';
import { defineComponent, ref } from 'vue';
import { ClientView } from '../type';

export const useColumns: (
  refresh: (flag: boolean) => void,
  clientId: Ref<string>,
  client: Ref<ClientView | undefined>
) => DataTableColumns<
  Omit<Client2User, 'expiresAt'> & { user: User; expiresAt: string }
> = (refresh, clientId, client) => {
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
      title: 'Authority',
      key: 'Authority',
      width: 150,
      render(row) {
        return (
          <>
            {row.authority}
            &nbsp;&nbsp;
            <ConfirmAuthority
              onConfirm={async (v: string) => {
                await setClientUserAuthority({
                  userId: row.user.id,
                  clientId: clientId.value,
                  authority: v,
                });
                message.success('Update success');
                row.authority = v;
              }}
              placeholder={client.value?.userAuthorityDesc || ''}
              defaultValue={row.authority || ''}
            ></ConfirmAuthority>
          </>
        );
      },
    },
    {
      title: 'actions',
      key: 'actions',
      width: 80,
      render(row) {
        return (
          <NSpace>
            <NPopconfirm
              onPositiveClick={() => onRemoveHandler(row.user.id)}
              v-slots={{
                trigger: () => (
                  <NButton text type="error">
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
        placement="left"
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

// todo
const ConfirmAuthority = defineComponent({
  props: {
    onConfirm: { type: Function, required: true },
    defaultValue: { type: String, required: true },
    placeholder: { type: String, required: true },
  },
  setup(props) {
    const show = ref(false);
    const value = ref(props.defaultValue);
    return () => (
      <NPopover
        show={show.value}
        onUpdate:show={(v) => {
          show.value = v;
        }}
        placement="left"
        trigger="click"
        v-slots={{
          trigger: () => (
            <NButton text type="primary">
              Set
            </NButton>
          ),
        }}
      >
        <NInput
          placeholder={props.placeholder}
          type="textarea"
          size="small"
          value={value.value}
          onUpdate:value={(v) => {
            value.value = v;
          }}
        ></NInput>
        <div
          style={{ display: 'flex', justifyContent: 'end', marginTop: '8px' }}
        >
          <NButton
            onClick={() => {
              props.onConfirm(value.value);
              show.value = false;
            }}
          >
            Confirm
          </NButton>
        </div>
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
