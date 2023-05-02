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
} from 'wittyna';
import { prismaClient } from '../../index.mjs';
import { User } from '@prisma/client';
import { Context } from 'koa';

@Controller('user')
export class UserController {
  select = {
    id: true,
    username: true,
    email: true,
    phone: true,
    updated_at: true,
    created_at: true,
  };
  @Post()
  async createUser(@Body() @Required() @Required('password') user: User) {
    return prismaClient.user.create({
      data: user,
      select: this.select,
    });
  }
  @Put()
  async updateUser(@Body() @Required() @Required('id') user: User) {
    return prismaClient.user.update({
      where: {
        id: user.id,
      },
      select: this.select,
      data: user,
    });
  }
  @Get(':id')
  async getUser(@Param('id') @Required() id: string, ctx: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const loginUserId = ctx.session?.token_info?.user_id;
    const loginUser = await prismaClient.client2User.findMany({
      where: {
        client_id: 'admin',
        user_id: loginUserId,
        is_client_admin: true,
      },
    });
    if (!loginUser || loginUser.length) {
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
    const rows = await prismaClient.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: this.select,
      where: search
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
        : undefined,
    });
    const total = await prismaClient.user.count();
    return {
      total,
      pageCount: Math.ceil(total / pageSize),
      rows,
    };
  }
  @Delete(':id')
  async delete(@Param('id') @Required() id: string) {
    const users = await prismaClient.client2User.findMany({
      where: {
        client_id: 'admin',
        user_id: id,
        is_client_admin: true,
      },
    });
    // 不能删除系统管理员
    if (users && users.length) {
      throw new ResponseError({
        error: 'no permission',
      });
    }
    return prismaClient.user.delete({
      where: {
        id: id,
      },
      select: this.select,
    });
  }
}
