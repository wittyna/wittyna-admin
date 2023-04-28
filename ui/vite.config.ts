import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NaiveUiResolver } from 'unplugin-vue-components/dist/resolvers';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Components from 'unplugin-vue-components/dist/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
  server: {
    port: 5566,
    proxy: {
      '^/admin': {
        target: 'http://127.0.0.1:5565',
        changeOrigin: true,
      },
    },
  },
});
