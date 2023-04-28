<script setup></script>

<template>
  <NLayout class="root">
    <NLayoutHeader bordered style="height: 50px">
      <IHeader></IHeader>
    </NLayoutHeader>
    <NLayout hasSider style="height: calc(100% - 50px)">
      <NLayoutSider bordered>
        <IMenu> </IMenu>
      </NLayoutSider>
      <NLayoutContent> <RouterView /> </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
<style scoped lang="scss">
.root {
  height: 100vh;
}
</style>
