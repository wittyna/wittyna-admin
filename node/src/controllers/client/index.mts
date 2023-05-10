import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Query,
  Required,
  Delete,
  ResponseError,
  Session,
} from 'wittyna';
import { prismaClient } from '../../index.mjs';
import { Client, ClientType, PrismaClient } from '@prisma/client';
import {
  checkClientAuth,
  checkSystemAdmin,
  checkUserAuthority,
  SessionInfo,
} from '../../service/index.mjs';
@Controller('client')
export class ClientController {
  select = {
    id: true,
    desc: true,
    type: true,
    updatedAt: true,
    createdAt: true,
    userAuthorityDesc: true,
  };
  @Post()
  async create(
    @Body()
    @Required()
    @Required('secret')
    @Required('redirectUris')
    client: Client,
    @Session() session: SessionInfo
  ) {
    if (client.type === ClientType.SYSTEM || !ClientType[client.type]) {
      throw new ResponseError({
        error: 'Invalid client type',
      });
    }
    if (
      !(await checkSystemAdmin(session)) &&
      client.type !== ClientType.THREE_PART
    ) {
      throw new ResponseError({
        error: 'Invalid client type',
      });
    }
    await checkUserAuthority(session, 'clientLimit', 1);
    return prismaClient.client.create({
      data: {
        ...client,
        creatorId: session.tokenInfo.userId,
      },
      select: this.select,
    });
  }
  @Put()
  async update(
    @Body() @Required() @Required('id') client: Partial<Client>,
    @Session() session: SessionInfo
  ) {
    if (!(await checkClientAuth(session, client.id!))) {
      throw new ResponseError({
        error: 'No permission',
      });
    }
    if (
      client.type !== ClientType.OFFICIAL &&
      client.type !== ClientType.THREE_PART
    ) {
      throw new ResponseError({
        error: 'Invalid client type',
      });
    }
    delete client.creatorId;
    return prismaClient.client.update({
      where: {
        id: client.id,
      },
      select: this.select,
      data: client,
    });
  }
  @Get(':id')
  async getOne(
    @Param('id') @Required() id: string,
    @Session() session: SessionInfo
  ) {
    if (!(await checkClientAuth(session, id))) {
      throw new ResponseError({
        error: 'No permission',
      });
    }
    return prismaClient.client.findUnique({
      where: {
        id,
      },
      select: {
        ...this.select,
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
        secret: true,
        redirectUris: true,
      },
    });
  }
  @Get()
  async getList(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('search') search = '',
    @Session() session: SessionInfo
  ) {
    page = Number(page);
    pageSize = Number(pageSize);
    const isSystemAdmin = await checkSystemAdmin(session);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    type Where = Parameters<PrismaClient['client']['findMany']>[0]['where'];

    const where_: Where = isSystemAdmin
      ? {}
      : {
          creatorId: session.tokenInfo.userId,
        };
    const where: Where = search
      ? {
          ...where_,
          OR: [
            {
              desc: {
                contains: search,
              },
            },
            {
              id: {
                contains: search,
              },
            },
            ...(Object.values(ClientType).includes(search as ClientType)
              ? [
                  {
                    type: {
                      equals: search as ClientType,
                    },
                  },
                ]
              : []),
          ],
        }
      : where_;

    const rows = await prismaClient.client.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        ...this.select,
        creator: {
          select: {
            username: true,
            id: true,
          },
        },
      },
      where,
    });
    const total = await prismaClient.client.count({
      where,
    });
    return {
      total,
      pageCount: Math.ceil(total / pageSize),
      rows,
    };
  }
  @Delete(':clientId')
  async delete(
    @Param('clientId') @Required() clientId: string,
    @Session() session: SessionInfo
  ) {
    if (!(await checkClientAuth(session, clientId))) {
      throw new ResponseError({
        error: 'No permission',
      });
    }
    await prismaClient.client2User.deleteMany({
      where: {
        clientId,
      },
    });
    return prismaClient.client.delete({
      where: {
        id: clientId,
      },
    });
  }
  @Post(':clientId/user')
  async addClientUsers(
    @Param('clientId') @Required() clientId: string,
    @Body('userIds') @Required() userIds: string[],
    @Session() session: SessionInfo
  ) {
    if (!(await checkClientAuth(session, clientId))) {
      throw new ResponseError({
        error: 'No permission',
      });
    }
    await checkUserAuthority(
      session,
      'clientUserLimit',
      userIds.length,
      clientId
    );
    return await prismaClient.$transaction([
      ...userIds.map((userId) =>
        prismaClient.client2User.upsert({
          where: {
            clientId_userId: {
              userId,
              clientId,
            },
          },
          create: { userId, clientId },
          update: { userId, clientId },
        })
      ),
    ]);
  }

  @Delete(':clientId/user/:userId')
  async deleteClientUser(
    @Param('clientId') @Required() clientId: string,
    @Param('userId') @Required() userId: string,
    @Session() session: SessionInfo
  ) {
    if (!(await checkClientAuth(session, clientId))) {
      throw new ResponseError({
        error: 'No permission',
      });
    }
    return prismaClient.client2User.delete({
      where: {
        clientId_userId: {
          clientId,
          userId,
        },
      },
    });
  }

  @Get(':clientId/user')
  async getClientUsers(
    @Param('clientId') @Required() clientId: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('search') search = ''
  ) {
    page = Number(page);
    pageSize = Number(pageSize);
    const where = {
      clientId,
      OR: [
        {
          user: {
            username: {
              contains: search,
            },
          },
        },
        {
          user: {
            email: {
              contains: search,
            },
          },
        },
        {
          user: {
            phone: {
              contains: search,
            },
          },
        },
      ],
    };
    const rows = await prismaClient.client2User.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
      select: {
        user: true,
        expiresAt: true,
        authority: true,
      },
    });
    const total = await prismaClient.client2User.count({
      where,
    });
    return {
      total,
      pageCount: Math.ceil(total / pageSize),
      rows,
    };
  }
  @Put(':clientId/user/:userId/expires-at/:expiresAt')
  async setExpiresAt(
    @Param('clientId') @Required() clientId: string,
    @Param('userId') @Required() userId: string,
    @Param('expiresAt') @Required() expiresAt: string,
    @Session() session: SessionInfo
  ) {
    if (!(await checkClientAuth(session, clientId))) {
      throw new ResponseError({
        error: 'No permission',
      });
    }

    if (expiresAt === 'null') {
      return prismaClient.client2User.update({
        where: {
          clientId_userId: {
            clientId,
            userId,
          },
        },
        data: {
          expiresAt: null,
        },
      });
    }
    return prismaClient.client2User.update({
      where: {
        clientId_userId: {
          clientId,
          userId,
        },
      },
      data: {
        expiresAt: new Date(expiresAt),
      },
    });
  }

  @Put(':clientId/user/:userId/authority/:authority')
  async setAuthority(
    @Param('clientId') @Required() clientId: string,
    @Param('userId') @Required() userId: string,
    @Param('authority') @Required() authority: string,
    @Session() session: SessionInfo
  ) {
    if (!(await checkClientAuth(session, clientId))) {
      throw new ResponseError({
        error: 'No permission',
      });
    }

    if (!authority || authority === 'null' || authority === 'undefined') {
      return prismaClient.client2User.update({
        where: {
          clientId_userId: {
            clientId,
            userId,
          },
        },
        data: {
          authority: null,
        },
      });
    }
    return prismaClient.client2User.update({
      where: {
        clientId_userId: {
          clientId,
          userId,
        },
      },
      data: {
        authority,
      },
    });
  }
}
