import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
export let userinfo: { username: string };
fetch('/admin/userInfo').then(async (data) => {
  const json = await data.json();
  if (data.status === 200) {
    userinfo = json;
    createApp(App).use(router).mount('#app');
  } else if (data.status === 401) {
    location.href = json.redirect_uri;
  }
});
