<script setup lang="ts">
import { reactive, ref } from 'vue';
import { User } from './type';
import { FormRules, FormInst } from 'naive-ui';
import { upsertUser, getUser } from './service';
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
        const user = await getUser(id);
        init(user);
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
const model = reactive<User>({} as User);
init();

const rules: FormRules = {
  username: {
    required: true,
    message: 'username is required',
    trigger: ['input', 'blur'],
  },
  password: {
    required: true,
    message: 'password is required',
    trigger: ['input', 'blur'],
  },
};

async function upsertUser_() {
  await formRef.value!.validate();
  commitLoading.value = true;
  try {
    await upsertUser(model);
    show.value = false;
    emit('success');
    if (model.id) {
      message.success('update success');
    } else {
      message.success('create success');
    }
  } finally {
    commitLoading.value = false;
  }
}

function init(user?: User) {
  Object.assign(model, {
    username: '',
    password: '',
    phone: '',
    email: '',
  });
  if (user) {
    Object.assign(model, user);
  }
}
</script>

<template>
  <NDrawer v-model:show="show" :width="502" @after-leave="() => init()">
    <NDrawerContent title="Create User" closable>
      <NForm
        v-if="!loading"
        ref="formRef"
        labelPlacement="left"
        labelWidth="120px"
        :model="model"
        :rules="rules"
      >
        <NFormItem label="username" path="username">
          <NInput v-model:value="model.username" maxlength="64" />
        </NFormItem>
        <NFormItem label="password" path="password">
          <NInput
            v-model:value="model.password"
            type="password"
            showPasswordOn="mousedown"
            maxlength="16"
          />
        </NFormItem>
        <NFormItem label="email" path="email">
          <NInput v-model:value="model.email" maxlength="64" />
        </NFormItem>
        <NFormItem label="phone" path="phone">
          <NInput v-model:value="model.phone" maxlength="32" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NButton type="primary" :loading="commitLoading" @click="upsertUser_"
          >commit</NButton
        >
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped lang="scss"></style>
