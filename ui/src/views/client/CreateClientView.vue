<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Client, ClientType } from './type';
import { FormRules, FormInst } from 'naive-ui';
import { upsertClient, getClient } from './service';
import { message } from '../../util';

const formRef = ref<FormInst>();

const show = ref(false);
const commitLoading = ref(false);
const loading = ref(true);

defineExpose({
  async open(id?: string) {
    show.value = true;
    if (id) {
      loading.value = true;
      try {
        const client = await getClient(id);
        init(client);
      } catch (e) {
        //
      }
    }
    loading.value = false;
  },
});

const emit = defineEmits<{
  (e: 'success'): void;
}>();

// client reactive
const model = reactive<Client>({} as Client);
init();
const typeOptions = [
  { label: ClientType.THREE_PART, value: ClientType.THREE_PART },
  { label: ClientType.OFFICIAL, value: ClientType.OFFICIAL },
];

const rules: FormRules = {
  secret: {
    required: true,
    message: 'secret is required',
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
  redirectUris: [
    {
      required: true,
      validator(rule, value: string[]) {
        if (!(value && value.length > 0 && value.some((one) => !!one))) {
          return new Error('redirect uris is required');
        }
        for (let one of value) {
          try {
            new URL(one);
          } catch (e) {
            return new Error('redirect uris is invalid');
          }
        }
        return true;
      },
      trigger: ['blur'],
    },
  ],
};

async function upsertClient_() {
  await formRef.value!.validate();
  commitLoading.value = true;
  try {
    await upsertClient(model);
    show.value = false;
    emit('success');
    if (model.id) {
      message.success('Update success');
    } else {
      message.success('Create success');
    }
  } finally {
    commitLoading.value = false;
  }
}

function init(client?: Client) {
  Object.assign(model, {
    secret: '',
    desc: '',
    type: ClientType.THREE_PART,
    redirect_uris: [],
  });
  if (client) {
    Object.assign(model, client);
  }
}
</script>

<template>
  <NDrawer v-model:show="show" :width="502" @after-leave="() => init()">
    <NDrawerContent title="Create client" closable>
      <NForm
        v-if="!loading"
        ref="formRef"
        labelPlacement="left"
        labelWidth="120px"
        :model="model"
        :rules="rules"
      >
        <NFormItem label="desc" path="desc">
          <NInput v-model:value="model.desc" maxlength="256" />
        </NFormItem>
        <NFormItem label="secret" path="secret">
          <NInput
            v-model:value="model.secret"
            type="password"
            showPasswordOn="mousedown"
            maxlength="16"
          />
        </NFormItem>
        <NFormItem label="type" path="type">
          <NSelect v-model:value="model.type" :options="typeOptions" />
        </NFormItem>
        <NFormItem label="redirect uris" path="redirectUris">
          <NInput
            :value="model.redirectUris.join(',')"
            maxlength="512"
            @update:value="model.redirectUris = $event.split(',')"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <NButton type="primary" :loading="commitLoading" @click="upsertClient_"
          >Commit</NButton
        >
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped lang="scss"></style>
