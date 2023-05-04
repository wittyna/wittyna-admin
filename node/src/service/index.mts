import { prismaClient } from '../index.mjs';

export async function checkMyClientAdmin(session: SessionInfo) {
  return checkClientAdmin(
    session.token_info.client_id,
    session.token_info.user_id
  );
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
  token_info: {
    user_id: string;
    client_id: string;
  };
}
