import { prismaClient } from '../index.mjs';

export async function checkSystemAdmin(session: SessionInfo) {
  const res = await prismaClient.user.findUnique({
    where: {
      id: session.tokenInfo.userId,
    },
    select: {
      isSystemAdmin: true,
    },
  });
  return !!res?.isSystemAdmin;
}

export async function checkClientCreator(clientId: string, userId: string) {
  const client2User = await prismaClient.client.findMany({
    where: {
      id: clientId,
      creatorId: userId,
    },
  });
  return !!client2User.length;
}
export async function checkUserCreator(
  selfUserId: string,
  targetUserId: string
) {
  const client2User = await prismaClient.user.findMany({
    where: {
      id: targetUserId,
      creatorId: selfUserId,
    },
  });
  return !!client2User.length;
}

export async function checkClientAuth(session: SessionInfo, clientId: string) {
  return (
    (await checkSystemAdmin(session)) ||
    (await checkClientCreator(clientId, session.tokenInfo.userId))
  );
}

export async function checkUserAuth(
  session: SessionInfo,
  targetUserId: string
) {
  return (
    session.tokenInfo.userId === targetUserId ||
    (await checkSystemAdmin(session)) ||
    (await checkUserCreator(session.tokenInfo.userId, targetUserId))
  );
}

export interface SessionInfo {
  tokenInfo: {
    userId: string;
    clientId: string;
  };
}
