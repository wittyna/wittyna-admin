<template>
  <div class="view">
    <NRow class="searchArea">
      <NCol :span="6">
        <NInput
          v-model:value="search"
          placeholder="search by desc,id,type"
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
      <NButton @click="() => createClientViewRef?.open()"> Create </NButton>
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
    />
    <CreateClientView
      ref="createClientViewRef"
      @success="refresh(true)"
    ></CreateClientView>
    <ClientUsersManage ref="clientUsersManageRef"></ClientUsersManage>
  </div>
</template>

<script lang="ts" setup>
import { SearchOutline } from '@vicons/ionicons5';
import { useColumns } from './columns';
import { ref, reactive, watch } from 'vue';
import { DataTableInst, PaginationProps } from 'naive-ui';
import { getClientList } from './service';
import CreateClientView from './CreateClientView.vue';
import ClientUsersManage from './clientUsersManage/ClientUsersManage.vue';
import { userinfo } from '../../main';
import { Client } from './type';

const tableRef = ref<DataTableInst>();
const createClientViewRef = ref();
const clientUsersManageRef = ref();

const search = ref('');
const searchConfirm = ref('');
const loading = ref(true);

const page = ref(1);
const pageSize = ref(10);
const data = ref<Client[]>([]);
const pagination = reactive<PaginationProps>({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  prefix({ itemCount }) {
    return `total: ${itemCount}`;
  },
});
const columns = useColumns(
  refresh,
  (id) => createClientViewRef.value.open(id),
  (id, row) => clientUsersManageRef.value.open(id, row)
);
function rowKey(rowData: { id: string }) {
  return rowData.id;
}
async function query() {
  loading.value = true;
  try {
    const { rows, total, pageCount } = await getClientList({
      page: page.value,
      pageSize: pageSize.value,
      search: searchConfirm.value,
    });
    (data.value as Client[]) = rows;
    pagination.pageCount = pageCount;
    pagination.itemCount = total;
  } finally {
    loading.value = false;
  }
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
watch(
  () => {
    return JSON.stringify([page.value, pageSize.value, searchConfirm.value]);
  },
  query,
  {
    immediate: true,
  }
);
</script>

<style scoped lang="scss">
.searchArea {
  margin-bottom: 20px !important;
}
</style>
