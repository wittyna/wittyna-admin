<script setup lang="ts">
import { computed, reactive, ref, Ref } from 'vue';
import { User } from './type';
import { FormRules, FormInst } from 'naive-ui';
import { upsertUser, getUser } from './service';
import { message } from '../../util';
import { generatePassword } from '../../util/password';
import { CopyOutline } from '@vicons/ionicons5';
import { copyToClipboard } from '../../util/copy';

const formRef = ref<FormInst>();

const show = ref(false);
const commitLoading = ref(false);
const loading = ref(true);
const isEdit = ref(false);
const isEditPassword = ref(false);

defineExpose({
  async open(id?: string) {
    show.value = true;
    if (id) {
      isEdit.value = true;
      loading.value = true;
      try {
        const user = await getUser(id);
        init(user);
      } catch (e) {
        //
      }
    } else {
      isEdit.value = false;
      model.password = generatePassword();
      message.info('Password has been regenerated!');
    }
    loading.value = false;
  },
});

const emit = defineEmits<{
  (e: 'success'): void;
}>();

// client reactive
const model = reactive<Partial<User>>({} as Partial<User>);
init();

const rules = computed<FormRules>(() => ({
  username: {
    required: true,
    message: 'username is required',
    trigger: ['input', 'blur'],
  },
  password: {
    required: !isEdit.value,
    message: 'password is required',
    trigger: ['input', 'blur'],
  },
}));
const showPassword = computed<boolean>(
  () => !isEdit.value || isEditPassword.value
);
async function upsertUser_() {
  await formRef.value!.validate();
  commitLoading.value = true;
  try {
    await upsertUser(model as User);
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
  isEditPassword.value = false;

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
    <NDrawerContent :title="isEdit ? 'Edit User' : 'Create User'" closable>
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
            v-if="showPassword"
            v-model:value="model.password"
            type="password"
            showPasswordOn="mousedown"
            maxlength="16"
          />
          <template v-if="isEdit">
            <NButton
              v-if="!isEditPassword"
              style="margin-left: 8px"
              text
              type="primary"
              @click="
                () => {
                  model.password = generatePassword();
                  isEditPassword = true;
                  message.info('Password has been regenerated!');
                }
              "
              >Change</NButton
            >
            <NButton
              v-else
              style="margin-left: 8px"
              text
              type="primary"
              @click="
                () => {
                  delete model.password;
                  message.info('Password has been restored');
                  isEditPassword = false;
                }
              "
              >Cancel</NButton
            >
          </template>
          <NButton
            v-if="showPassword"
            quaternary
            type="primary"
            @click="
              async () => {
                await copyToClipboard(model.password as string);
                message.success('Copied!');
              }
            "
          >
            <template #icon>
              <NIcon><CopyOutline /></NIcon>
            </template>
          </NButton>
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
          >Commit</NButton
        >
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped lang="scss"></style>
