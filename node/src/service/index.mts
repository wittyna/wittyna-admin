import { prismaClient } from '../index.mjs';

export async function checkMyClientAdmin(session: SessionInfo) {
  return checkClientAdmin(session.tokenInfo.clientId, session.tokenInfo.userId);
}

export async function checkClientAdmin(clientId: string, userId: string) {
  const client2User = await prismaClient.client2User.findUnique({
    where: {
      clientId_userId: {
        clientId,
        userId,
      },
    },
    select: {
      isClientAdmin: true,
    },
  });
  return !!(client2User && client2User.isClientAdmin);
}

export interface SessionInfo {
  tokenInfo: {
    userId: string;
    clientId: string;
  };
}
