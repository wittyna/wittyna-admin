<template>
  <NMenu :options="menuOptions" />
</template>

<script lang="tsx" setup>
import { NIcon } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { RouterLink } from 'vue-router';
import {
  AppsOutline as ClientIcon,
  PersonOutline as UserIcon,
} from '@vicons/ionicons5';

const menuOptions: MenuOption[] = [
  {
    label: () => <RouterLink to="user">User</RouterLink>,
    key: 'user',
    icon: () => (
      <NIcon>
        <UserIcon></UserIcon>
      </NIcon>
    ),
  },
  {
    label: () => <RouterLink to="client">Client</RouterLink>,
    key: 'client',
    icon: () => (
      <NIcon>
        <ClientIcon></ClientIcon>
      </NIcon>
    ),
  },
];
</script>
