<template>
  <NLayout class="root">
    <NLayoutHeader bordered style="height: 50px">
      <IHeader />
    </NLayoutHeader>
    <NLayout hasSider style="height: calc(100% - 50px)">
      <NLayoutSider bordered>
        <IMenu />
      </NLayoutSider>
      <NLayoutContent> <RouterView /> </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
<style scoped lang="scss">
.root {
  height: 100vh;
  :deep(.view) {
    padding: 16px;
  }
}
</style>
