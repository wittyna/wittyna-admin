import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { Client2User, User } from '@prisma/client';
export let userinfo: User & Client2User;
fetch('/admin/userInfo').then(async (data) => {
  const json = await data.json();
  if (data.status === 200) {
    userinfo = json;
    createApp(App).use(router).mount('#app');
  } else if (data.status === 401) {
    location.href = json.redirect_uri;
  }
});
