<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { getAllUserList, getUserList } from '../../user/service';
import { SearchOutline } from '@vicons/ionicons5';
import { DataTableColumns, PaginationProps, DataTableRowKey } from 'naive-ui';
import { UserView } from '../../user/type';
import { addClientUser } from '../service';
import { message } from '../../../util';
import { User } from '../../user/type';
const show = ref(false);
const loading = ref(false);
const commitLoading = ref(false);
const clientId = ref('');
const search = ref('');
const searchConfirm = ref('');
const page = ref(1);
const pageSize = ref(10);
const data = ref<User[]>([]);
const pagination = reactive<PaginationProps>({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  prefix({ itemCount }) {
    return `total: ${itemCount}`;
  },
});
const columns: DataTableColumns<UserView> = [
  {
    type: 'selection',
  },
  {
    title: 'Username',
    key: 'username',
    width: 200,
  },
  {
    title: 'Email',
    key: 'email',
    width: 200,
  },
  {
    title: 'Phone',
    key: 'phone',
    width: 200,
  },
];
function rowKey(rowData: { id: string }) {
  return rowData.id;
}
async function query() {
  loading.value = true;
  try {
    const { rows, total, pageCount } = await getAllUserList({
      page: page.value,
      pageSize: pageSize.value,
      search: searchConfirm.value,
    });
    (data.value as User[]) = rows;
    pagination.pageCount = pageCount;
    pagination.itemCount = total;
  } finally {
    loading.value = false;
  }
}
function init() {
  pagination.page = 1;
  pagination.pageCount = 1;
  pagination.pageSize = 10;
  pagination.itemCount = 0;
  checkedRowKeysRef.value = [];
  search.value = '';
  searchConfirm.value = '';
  commitLoading.value = false;
  loading.value = false;
  data.value = [];
}
function refresh(flag: boolean) {
  if (flag) {
    page.value = 1;
  }
  query();
}
function doSearch() {
  searchConfirm.value = search.value;
}
const checkedRowKeysRef = ref<DataTableRowKey[]>([]);
function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeysRef.value = rowKeys;
}
async function addClientUser_() {
  commitLoading.value = true;
  try {
    await addClientUser({
      clientId: clientId.value,
      userIds: checkedRowKeysRef.value as string[],
    });
    message.success('add success');
    show.value = false;
    emit('success');
  } finally {
    commitLoading.value = true;
  }
}

watch(() => {
  return JSON.stringify([page.value, pageSize.value, searchConfirm.value]);
}, query);

const emit = defineEmits<{
  (e: 'success'): void;
}>();

defineExpose({
  async open(clientId_: string) {
    clientId.value = clientId_;
    show.value = true;
    loading.value = true;
    try {
      await query();
    } catch (e) {
      //
    }
    loading.value = false;
  },
});
</script>

<template>
  <NDrawer
    v-model:show="show"
    :width="700"
    title="Create Client"
    @after-leave="init"
  >
    <NDrawerContent title="Add Users" closable>
      <NRow class="searchArea">
        <NCol :span="12">
          <NInput
            v-model:value="search"
            placeholder="search by username, email, phone"
            @keyup.enter="doSearch"
          >
            <template #suffix>
              <NIcon>
                <SearchOutline></SearchOutline>
              </NIcon>
            </template>
          </NInput>
        </NCol>
        <div style="flex: 1"></div>
      </NRow>
      <NDataTable
        ref="tableRef"
        v-model:page="page"
        v-model:pageSize="pageSize"
        :rowKey="rowKey"
        :pagination="pagination"
        :columns="columns"
        :data="data"
        :loading="loading"
        :maxHeight="600"
        @update:checked-row-keys="handleCheck"
      />
      <template #footer>
        <NButton type="primary" :loading="commitLoading" @click="addClientUser_"
          >Commit</NButton
        >
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped lang="scss">
.searchArea {
  margin-bottom: 20px !important;
}
</style>
