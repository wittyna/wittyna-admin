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
  checkClientAdmin,
  checkMyClientAdmin,
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
    if (!(await checkMyClientAdmin(session))) {
      throw new ResponseError({
        error: 'no permission',
      });
    }
    if (
      client.type !== ClientType.OFFICIAL &&
      client.type !== ClientType.THREE_PART
    ) {
      throw new ResponseError({
        error: 'invalid client type',
      });
    }
    return prismaClient.client.create({
      data: client as Client,
      select: this.select,
    });
  }
  @Put()
  async update(
    @Body() @Required() @Required('id') client: Client,
    @Session() session: SessionInfo
  ) {
    if (
      !(await checkClientAdmin(client.id, session.tokenInfo.userId)) &&
      !(await checkMyClientAdmin(session))
    ) {
      throw new ResponseError({
        error: 'no permission',
      });
    }
    if (
      client.type !== ClientType.OFFICIAL &&
      client.type !== ClientType.THREE_PART
    ) {
      throw new ResponseError({
        error: 'invalid client type',
      });
    }
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
    if (
      !(await checkClientAdmin(id, session.tokenInfo.userId)) &&
      !(await checkMyClientAdmin(session))
    ) {
      throw new ResponseError({
        error: 'no permission',
      });
    }
    return prismaClient.client.findUnique({
      where: {
        id,
      },
      select: {
        ...this.select,
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
    const isSystemAdmin = await checkMyClientAdmin(session);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    type Where = Parameters<PrismaClient['client']['findMany']>[0]['where'];

    const where_: Where = isSystemAdmin
      ? {}
      : {
          client2UserArr: {
            some: {
              userId: session.tokenInfo.userId,
              isClientAdmin: true,
            },
          },
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
      select: this.select,
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
  @Delete(':id')
  async delete(
    @Param('id') @Required() id: string,
    @Session() session: SessionInfo
  ) {
    if (!(await checkMyClientAdmin(session))) {
      throw new ResponseError({
        error: 'no permission',
      });
    }
    return prismaClient.client.delete({
      where: {
        id: id,
      },
    });
  }
  @Post(':id/user')
  async addClientUsers(
    @Param('id') @Required() clientId: string,
    @Body('userIds') @Required() userIds: string[],
    @Session() session: SessionInfo
  ) {
    const isClientAdmin = await checkClientAdmin(
      clientId,
      session.tokenInfo.userId
    );
    if (!isClientAdmin) {
      throw new ResponseError({
        error: 'no permission',
      });
    }
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

  @Put(':clientId/admin')
  async setClientAdmin(
    @Param('clientId') @Required() clientId: string,
    @Body('userId') @Required() userId: string,
    @Body('isClientAdmin') @Required() isClientAdmin: boolean,
    @Session() session: SessionInfo
  ) {
    const isClientAdmin_ = await checkClientAdmin(
      clientId,
      session.tokenInfo.userId
    );
    if (!isClientAdmin_) {
      throw new ResponseError({
        error: 'no permission',
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
        isClientAdmin,
      },
    });
  }

  @Delete(':clientId/user/:userId')
  async deleteClientUser(
    @Param('clientId') @Required() clientId: string,
    @Param('userId') @Required() userId: string,
    @Session() session: SessionInfo
  ) {
    const isClientAdmin = await checkClientAdmin(
      clientId,
      session.tokenInfo.userId
    );
    if (!isClientAdmin) {
      throw new ResponseError({
        error: 'no permission',
      });
    }
    const isDeleteClientAdmin = await checkClientAdmin(clientId, userId);
    if (isDeleteClientAdmin) {
      throw new ResponseError({
        error: 'can not delete admin',
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
        isClientAdmin: true,
        expiresAt: true,
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
}
