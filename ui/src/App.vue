<script setup lang="ts">
fetch('/admin/userInfo').then(async (data)=> {
  let json = await data.json()
  if(data.status === 200){
    alert(JSON.stringify(json))
  } else if(data.status === 401) {
    location.href = json.redirect_uri
  }
})
function aaa() {
  location.href = `/admin/logout?redirect_uri=${encodeURIComponent(location.href+'?a=1')}&state=123`
}
</script>

<template>
  <h1>hello</h1>
  <button @click="aaa">登出</button>
</template>
<style scoped>
.root {
  background: rgb(100, 101, 106);
  color: white;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
