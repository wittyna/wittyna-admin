<template>
  <NMenu
    :options="menuOptions"
    :defaultValue="defaultValue"
    :watchProps="['defaultValue']"
  />
</template>

<script lang="tsx" setup>
import { watch, ref } from 'vue';
import { NIcon } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { RouterLink, useRouter, useRoute } from 'vue-router';

import {
  AppsOutline as ClientIcon,
  PersonOutline as UserIcon,
} from '@vicons/ionicons5';
const defaultValue = ref('');
const route = useRoute();
watch(
  () => {
    return route.name;
  },
  (name) => {
    if (name) {
      defaultValue.value = name as string;
    }
  },
  {
    immediate: true,
  }
);

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
