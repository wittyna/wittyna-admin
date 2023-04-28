<template>
  <div class="header">
    <NIcon size="25">
      <PrismOutline></PrismOutline>
    </NIcon>
    &nbsp;&nbsp;&nbsp;
    <div class="title">ADMIN</div>
    <div style="flex: 1"></div>
    {{ userinfo.username }}
    &nbsp;&nbsp;
    <NButton text size="small" type="primary" @click="logout"> 注销 </NButton>
  </div>
</template>

<script lang="ts" setup>
import { PrismOutline } from '@vicons/ionicons5';
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
