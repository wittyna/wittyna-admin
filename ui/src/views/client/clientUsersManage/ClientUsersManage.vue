<template>
  <NDrawer
    v-model:show="show"
    :width="1000"
    title="Create Client"
    @after-leave="init"
  >
    <NDrawerContent title="Manage Client Users" closable>
      <NRow class="searchArea">
        <NCol :span="12">
          <NInput
            v-model:value="search"
            placeholder="search by username, email"
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
        <NButton @click="() => addUserRef?.open(clientId)"> add </NButton>
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
    /></NDrawerContent>
    <AddUser ref="addUserRef" @success="refresh(true)"></AddUser>
  </NDrawer>
</template>

<script lang="ts" setup>
import { SearchOutline } from '@vicons/ionicons5';
import { useColumns } from './columns';
import { ref, reactive, watch } from 'vue';
import { DataTableInst, PaginationProps } from 'naive-ui';
import { getClientUsers } from '../service';
import AddUser from './AddUser.vue';
import { Client2User, User } from '@prisma/client';

const tableRef = ref<DataTableInst>();
const addUserRef = ref();

const search = ref('');
const searchConfirm = ref('');
const loading = ref(true);
const show = ref(false);
const clientId = ref('');

const page = ref(1);
const pageSize = ref(10);
const data = ref<(Client2User & { user: User })[]>([]);
const pagination = reactive<PaginationProps>({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  prefix({ itemCount }) {
    return `total: ${itemCount}`;
  },
});
const columns = useColumns(refresh, clientId);
function rowKey(rowData: { id: string }) {
  return rowData.id;
}
async function query() {
  loading.value = true;
  try {
    const { rows, total, pageCount } = await getClientUsers({
      page: page.value,
      pageSize: pageSize.value,
      search: searchConfirm.value,
      clientId: clientId.value,
    });
    data.value = rows;
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
  search.value = '';
  searchConfirm.value = '';
  data.value = [];
}
function refresh(flag?: boolean) {
  if (flag) {
    page.value = 1;
  }
  query();
}
function doSearch() {
  searchConfirm.value = search.value;
}
watch(
  () => {
    return JSON.stringify([page.value, pageSize.value, searchConfirm.value]);
  },
  () => refresh()
);

defineExpose({
  async open(id: string) {
    clientId.value = id;
    show.value = true;
    if (id) {
      loading.value = true;
      try {
        await query();
      } catch (e) {
        //
      }
    }
    loading.value = false;
  },
});
</script>

<style scoped lang="scss">
.searchArea {
  margin-bottom: 20px !important;
}
</style>
