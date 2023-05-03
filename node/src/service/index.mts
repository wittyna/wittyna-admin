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
      client_id_user_id: {
        client_id: clientId,
        user_id: userId,
      },
    },
    select: {
      is_client_admin: true,
    },
  });
  return !!(client2User && client2User.is_client_admin);
}

export interface SessionInfo {
  token_info: {
    user_id: string;
    client_id: string;
  };
}
