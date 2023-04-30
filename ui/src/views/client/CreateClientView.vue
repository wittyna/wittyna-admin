<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Client } from './type';
import { ClientType } from '@prisma/client';
import { FormRules, FormInst } from 'naive-ui';
import { createClient } from './service';

const formRef = ref<FormInst>();

const show = ref(false);
const commitLoading = ref(false);

defineExpose({
  open() {
    show.value = true;
  },
});

const emits = defineEmits<{
  (e: 'success'): void;
}>();

// client reactive
const model = reactive<Client>(getInitModel());
const typeOptions = [
  { label: 'THREE_PART', value: ClientType.THREE_PART },
  { label: 'OFFICIAL', value: ClientType.OFFICIAL },
];

const rules: FormRules = {
  client_id: {
    required: true,
    message: 'client_id is required',
    trigger: ['input', 'blur'],
  },
  client_secret: {
    required: true,
    message: 'client_secret is required',
    trigger: ['input', 'blur'],
  },
  desc: {
    required: true,
    message: 'desc is required',
    trigger: ['input', 'blur'],
  },
  type: {
    required: true,
    message: 'type is required',
    trigger: ['input', 'blur'],
  },
  redirect_uris: [
    {
      required: true,
      validator(rule, value) {
        if (!(value && value.length > 0 && value.some((one) => !!one))) {
          return new Error('redirect_uris is required');
        }
        for (let one of value) {
          try {
            new URL(one);
          } catch (e) {
            return new Error('redirect_uris is invalid');
          }
        }
        return true;
      },
      trigger: ['blur'],
    },
  ],
};

async function createClient_() {
  await formRef.value.validate();
  commitLoading.value = true;
  try {
    await createClient(model);
    Object.assign(model, getInitModel());
    show.value = false;
    emits('success');
  } finally {
    commitLoading.value = false;
  }
}

function getInitModel(): Client {
  return {
    client_id: '',
    client_secret: '',
    desc: '',
    type: ClientType.THREE_PART,
    redirect_uris: [],
  };
}
</script>

<template>
  <NDrawer v-model:show="show" :width="502" title="Create Client">
    <NDrawerContent title="Create client" closable>
      <NForm
        ref="formRef"
        labelPlacement="left"
        labelWidth="120px"
        :model="model"
        :rules="rules"
      >
        <NFormItem label="client_id" path="client_id">
          <NInput v-model:value="model.client_id" maxlength="64" />
        </NFormItem>
        <NFormItem label="client_secret" path="client_secret">
          <NInput
            v-model:value="model.client_secret"
            type="password"
            showPasswordOn="mousedown"
            maxlength="16"
          />
        </NFormItem>
        <NFormItem label="desc" path="desc">
          <NInput v-model:value="model.desc" maxlength="256" />
        </NFormItem>
        <NFormItem label="type" path="type">
          <NSelect v-model:value="model.type" :options="typeOptions" />
        </NFormItem>
        <NFormItem label="redirect_uris" path="redirect_uris">
          <NInput
            :value="model.redirect_uris.join(',')"
            maxlength="512"
            @update:value="model.redirect_uris = $event.split(',')"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <NButton type="primary" :loading="commitLoading" @click="createClient_"
          >commit</NButton
        >
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped lang="scss"></style>
