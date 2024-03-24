import { dirname } from 'path';
import process from 'node:process';
import { ClientType } from '@prisma/client';
import { sha256 } from './utils/encrypt.mjs';
const ENV = process.env.ENV;
export const CONFIG = {
  clients: [
    {
      id: 'admin',
      secret: '123456',
      desc: 'admin',
      type: ClientType.SYSTEM,
      userAuthorityDesc: `userLimit&clientLimit&clientUserLimit`,
      redirectUris: [
        // 用于本地直接起服务调试。
        'http://127.0.0.1:5566/admin/authorize',
        'https://admin.wittyna.com/admin/authorize',
      ],
    },
    {
      id: 'stock',
      secret: '123456',
      desc: 'stock',
      type: ClientType.OFFICIAL,
      creatorId: 'baixiyang',
      redirectUris: [
        'https://stock.wittyna.com/stock/authorize',
        // 用于ui界面调试。
        'http://127.0.0.1:7777/stock/authorize',
        'http://192.168.8.21:7777/stock/authorize',
      ],
    },
    {
      id: 'carrot',
      secret: '123456',
      desc: 'carrot',
      type: ClientType.OFFICIAL,
      creatorId: 'baixiyang',
      redirectUris: [
        'https://stock.wittyna.com/carrot/authorize',
        // 用于ui界面调试。
        'http://127.0.0.1:8888/carrot/authorize',
        'http://192.168.8.21:8888/carrot/authorize',
      ],
    },
    {
      id: 'tool-of-nana',
      secret: '123456',
      desc: 'tool-of-nana',
      type: ClientType.OFFICIAL,
      creatorId: 'rona',
      redirectUris: [
        'https://tool.wittyna.com/tool/authorize',
        // 用于ui界面调试。
        'http://127.0.0.1:3000/tool/authorize',
      ],
    },
  ],
  users: [
    {
      id: 'admin',
      username: 'admin',
      password: sha256('123456'),
      isSystemAdmin: true,
    },
    {
      id: 'baixiyang',
      username: 'baixiyang',
      email: 'baixiyang@outlook.com',
      password: sha256('123456'),
      isSystemAdmin: true,
    },
    {
      id: 'rona',
      username: 'rona',
      password: sha256('luona0206'),
    },
  ],
  client2UserArr: [
    {
      clientId: 'admin',
      userId: 'admin',
    },
    {
      clientId: 'admin',
      userId: 'baixiyang',
    },
    {
      clientId: 'tool-of-nana',
      userId: 'baixiyang',
    },
    {
      clientId: 'stock',
      userId: 'baixiyang',
    },
    {
      clientId: 'carrot',
      userId: 'baixiyang',
    },
    {
      clientId: 'tool-of-nana',
      userId: 'rona',
    },
    {
      clientId: 'admin',
      userId: 'rona',
    },
    {
      clientId: 'carrot',
      userId: 'rona',
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
  uiRoot: dirname(new URL(import.meta.url).pathname) + '/ui',
};

export const CLIENT_ID = CONFIG.clients[0].id;
export const CLIENT_SECRET = CONFIG.clients[0].secret;
