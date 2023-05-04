<template>
  <div class="header">
    <NIcon size="25">
      <PrismOutline></PrismOutline>
    </NIcon>
    &nbsp;&nbsp;&nbsp;
    <div class="title">ADMIN</div>
    <div style="flex: 1"></div>
    <NIcon size="18">
      <PersonOutline></PersonOutline>
    </NIcon>
    &nbsp;&nbsp;
    {{ userinfo.username }}
    &nbsp;&nbsp;
    <NButton text size="small" type="primary" @click="logout"> Logout </NButton>
  </div>
</template>

<script lang="ts" setup>
import { PrismOutline, PersonOutline } from '@vicons/ionicons5';
import { userinfo } from '../../main';
function logout() {
  location.href = `/admin/logout?redirect_uri=${encodeURIComponent(
    location.href
  )}`;
}
</script>

<style scoped lang="scss">
.header {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  .title {
    font-size: 25px;
  }
}
</style>
