import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Required,
  Query,
  Delete,
  ResponseError,
  Session,
} from 'wittyna';
import { prismaClient } from '../../index.mjs';
import { PrismaClient, User } from '@prisma/client';
import {
  checkSystemAdmin,
  checkUserAuth,
  SessionInfo,
} from '../../service/index.mjs';
import { sha256 } from '../../utils/encrypt.mjs';

@Controller('user')
export class UserController {
  select = {
    id: true,
    username: true,
    email: true,
    phone: true,
    updatedAt: true,
    createdAt: true,
  };
  @Post()
  async createUser(
    @Body() @Required() @Required('password') user: User,
    @Session() session: SessionInfo
  ) {
    user.password = sha256(user.password);
    user.isSystemAdmin = false;
    user.creatorId = session.tokenInfo.userId;
    return prismaClient.user.create({
      data: user,
      select: this.select,
    });
  }
  @Put()
  async updateUser(
    @Body() @Required() @Required('id') user: Partial<User>,
    @Session() session: SessionInfo
  ) {
    if (!(await checkUserAuth(session, user.id!))) {
      throw new ResponseError({
        error: 'No permission',
      });
    }
    if (user.password) {
      user.password = sha256(user.password);
    }
    return prismaClient.user.update({
      where: {
        id: user.id,
      },
      select: this.select,
      data: user,
    });
  }
  @Get(':id')
  async getUser(
    @Param('id') @Required() id: string,
    @Session() session: SessionInfo
  ) {
    if (!(await checkUserAuth(session, id))) {
      throw new ResponseError({
        error: 'No permission',
      });
    }

    return prismaClient.user.findUnique({
      where: {
        id: id,
      },
      select: {
        ...this.select,
      },
    });
  }
  @Get()
  async getList(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('search') search = '',
    @Query('all') all = 'false',
    @Session() session: SessionInfo
  ) {
    page = Number(page);
    pageSize = Number(pageSize);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    type Where = Parameters<PrismaClient['user']['findMany']>[0]['where'];
    const where_: Where =
      all === 'true' || (await checkSystemAdmin(session))
        ? {}
        : {
            OR: [
              {
                creatorId: session.tokenInfo.userId,
              },
              {
                id: session.tokenInfo.userId,
              },
            ],
          };
    const where = search
      ? {
          AND: [
            where_,
            {
              OR: [
                {
                  email: {
                    contains: search,
                  },
                },
                {
                  username: {
                    contains: search,
                  },
                },
                {
                  phone: {
                    contains: search,
                  },
                },
              ],
            },
          ],
        }
      : where_;
    const rows = await prismaClient.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: this.select,
      where,
    });
    const total = await prismaClient.user.count({
      where,
    });
    return {
      total,
      pageCount: Math.ceil(total / pageSize),
      rows,
    };
  }
  @Delete(':userId')
  async delete(
    @Param('userId') @Required() userId: string,
    @Session() session: SessionInfo
  ) {
    if (!(await checkUserAuth(session, userId))) {
      throw new ResponseError({
        error: 'No permission',
      });
    }
    if (userId === session.tokenInfo.userId) {
      throw new ResponseError({
        error: 'Cannot delete self',
      });
    }
    await prismaClient.client2User.deleteMany({
      where: {
        userId,
      },
    });
    return prismaClient.user.delete({
      where: {
        id: userId,
      },
      select: this.select,
    });
  }
}
