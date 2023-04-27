import fs from 'node:fs';
import { createRequire } from 'module';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
import process from 'node:process';
const ENV = process.env.ENV;
export const CONFIG = {
  systemClient: {
    desc: 'admin',
    client_id: 'admin',
    client_secret: '42ea9BE#',
    redirect_uris: [
      // 用于本地直接起服务调试。
      'http://127.0.0.1:5566/admin/authorize',
      // 用于ui界面调试。
      'http://127.0.0.1:5567/admin/authorize',
      'https://admin.wittyna.com/admin/authorize',
    ],
  },
  normalClients: [
    {
      desc: 'tool-of-nana',
      client_id: 'tool-of-nana',
      client_secret: '42ea9BE#',
      redirect_uris: [
        'https://tool.wittyna.com/tool/authorize',
        // 用于ui界面调试。
        'http://127.0.0.1:3000/tool/authorize',
      ],
    },
  ],
  systemAdminUsers: [
    {
      id: 'admin',
      username: 'admin',
      password: '42ea9BE#',
    },
    {
      id: 'baixiyang',
      username: 'baixiyang',
      email: 'baixiyang@outlook.com',
      password: '42ea9BE#',
    },
    {
      id: 'rona',
      username: 'rona',
      password: 'luona0206',
    },
  ],
  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 5,
  },
  // 单位 秒
  sessionLeftTime: 60 * 60 * 24,
  port: ENV === 'development' ? 5565 : 5566,
  authIss:
    ENV === 'development'
      ? 'http://127.0.0.1:5555'
      : 'https://auth.wittyna.com',
  iss:
    ENV === 'development'
      ? 'http://127.0.0.1:5566'
      : 'https://admin.wittyna.com',
  jwtPublicKey: fs.readFileSync(require.resolve('./pem/public.pem')),
  uiRoot: dirname(new URL(import.meta.url).pathname) + '/ui',
};
