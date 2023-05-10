import { prismaClient } from '../index.mjs';
import { CLIENT_ID, CONFIG } from '../config.mjs';
import { ResponseError } from 'wittyna';

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

class UserAuthority {
  userLimit?: number;
  clientLimit?: number;
  clientUserLimit?: number;
}
export async function getUserAuthority(
  session: SessionInfo
): Promise<UserAuthority> {
  const client2UserClient = await prismaClient.client2User.findUnique({
    where: {
      clientId_userId: {
        clientId: CLIENT_ID,
        userId: session.tokenInfo.userId,
      },
    },
    select: {
      authority: true,
    },
  });
  try {
    const searchParams = new URLSearchParams(
      client2UserClient?.authority || ''
    );
    return {
      userLimit: Number(searchParams.get('userLimit')),
      clientLimit: Number(searchParams.get('clientLimit')),
      clientUserLimit: Number(searchParams.get('clientUserLimit')),
    };
  } catch (e) {
    return {};
  }
}

export async function checkUserAuthority(
  session: SessionInfo,
  type: keyof UserAuthority,
  count = 1,
  clientId?: string
): Promise<void> {
  const { [type]: limit } = await getUserAuthority(session);
  if (limit) {
    if (type === 'userLimit') {
      const currentCount = await prismaClient.user.count({
        where: {
          creatorId: session.tokenInfo.userId,
        },
      });
      if (currentCount + count > limit) {
        throw new ResponseError({
          error: 'User limit exceeded',
        });
      }
    } else if (type === 'clientLimit') {
      const currentCount = await prismaClient.client.count({
        where: {
          creatorId: session.tokenInfo.userId,
        },
      });
      if (currentCount + count > limit) {
        throw new ResponseError({
          error: 'Client limit exceeded',
        });
      }
    } else if (type === 'clientUserLimit') {
      const currentCount = await prismaClient.client2User.count({
        where: {
          clientId,
        },
      });
      if (currentCount + count > limit) {
        throw new ResponseError({
          error: 'Client user limit exceeded',
        });
      }
    }
  }
}
