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
import { User } from '@prisma/client';
import { checkMyClientAdmin, SessionInfo } from '../../service/index.mjs';

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
    if (!(await checkMyClientAdmin(session))) {
      throw new ResponseError({
        error: 'no permission',
      });
    }
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
    if (!(await checkMyClientAdmin(session))) {
      throw new ResponseError({
        error: 'no permission',
      });
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
    if (!(await checkMyClientAdmin(session))) {
      throw new ResponseError({
        error: 'no permission',
      });
    }

    return prismaClient.user.findUnique({
      where: {
        id: id,
      },
      select: {
        ...this.select,
        password: true,
      },
    });
  }
  @Get()
  async getList(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('search') search = ''
  ) {
    page = Number(page);
    pageSize = Number(pageSize);
    const where = search
      ? {
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
        }
      : undefined;
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
    if (!(await checkMyClientAdmin(session))) {
      throw new ResponseError({
        error: 'no permission',
      });
    }
    const users = await prismaClient.client2User.findMany({
      where: {
        clientId: session.token_info.client_id,
        userId,
        isClientAdmin: true,
      },
    });
    // 不能删除管理员
    if (users && users.length) {
      throw new ResponseError({
        error: 'cannot delete admin',
      });
    }
    return prismaClient.user.delete({
      where: {
        id: userId,
      },
      select: this.select,
    });
  }
}
