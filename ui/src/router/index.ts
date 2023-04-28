import { createRouter, createWebHashHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'client',
      path: '/client',
      component: () => import('../views/client/ClientView.vue'),
    },
    {
      name: 'user',
      path: '/user',
      component: () => import('../views/user/UserView.vue'),
    },
  ],
});
