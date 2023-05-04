import { prismaClient } from './index.mjs';
import { CONFIG } from './config.mjs';

export async function init() {
  const clients = CONFIG.clients;
  const users = CONFIG.users;
  const client2UserArr = CONFIG.client2UserArr;
  await prismaClient.$transaction([
    ...users.map((user) =>
      prismaClient.user.upsert({
        where: {
          username: user.username,
        },
        create: user,
        update: user,
      })
    ),
    ...clients.map((client) =>
      prismaClient.client.upsert({
        where: {
          id: client.id,
        },
        create: client,
        update: client,
      })
    ),
    ...client2UserArr.map((client2User) =>
      prismaClient.client2User.upsert({
        where: {
          clientId_userId: {
            clientId: client2User.clientId,
            userId: client2User.userId,
          },
        },
        create: client2User,
        update: client2User,
      })
    ),
  ]);
}
