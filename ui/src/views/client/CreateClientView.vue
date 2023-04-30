<script setup lang="ts">
import { reactive } from 'vue';
import { Client } from './type';
import { ClientType } from '@prisma/client';

// client reactive
const model = reactive<Client>({
  client_id: '',
  client_secret: '',
  desc: '',
  type: ClientType.THREE_PART,
  redirect_uris: [],
});
const typeOptions = reactive([
  { label: 'THREE_PART', value: ClientType.THREE_PART },
  { label: '官方', value: ClientType.OFFICIAL },
]);
</script>

<template>
  <div class="create-client-view">
    <NForm labelPlacement="left" labelWidth="120px" :model="model">
      <NFormItem label="client_id" path="client_id">
        <NInput v-model:value="model.client_id" />
      </NFormItem>
      <NFormItem label="client_secret" path="client_secret">
        <NInput v-model:value="model.client_secret" />
      </NFormItem>
      <NFormItem label="desc" path="desc">
        <NInput v-model:value="model.desc" />
      </NFormItem>
      <NFormItem label="type" path="type" :options="typeOptions">
        <NSelect v-model:value="model.type" />
      </NFormItem>
    </NForm>
  </div>
</template>

<style scoped lang="scss"></style>
