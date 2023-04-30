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
} from 'wittyna';
import { prismaClient } from '../../index.mjs';
import { Client, ClientType } from '@prisma/client';

@Controller('client')
export class ClientController {
  select = {
    id: true,
    desc: true,
    client_id: true,
    type: true,
    updated_at: true,
    created_at: true,
  };
  @Post()
  async create(
    @Body()
    @Required()
    @Required('client_secret')
    @Required('redirect_uris')
    client: Client
  ) {
    // 只能组册普通客户端
    client.type = ClientType.OFFICIAL;
    return prismaClient.client.create({
      data: client,
      select: this.select,
    });
  }
  @Put()
  async update(@Body() @Required() @Required('id') client: Client) {
    // 只能组册普通客户端
    client.type = ClientType.OFFICIAL;
    return prismaClient.client.update({
      where: {
        id: client.id,
      },
      select: this.select,
      data: client,
    });
  }
  @Get(':id')
  async getOne(@Param('id') @Required() id: string) {
    return prismaClient.client.findUnique({
      where: {
        id: id,
      },
      select: this.select,
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
    const rows = await prismaClient.client.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: this.select,
      where: search
        ? {
            OR: [
              {
                desc: {
                  contains: search,
                },
              },
              {
                client_id: {
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
        : undefined,
    });
    const total = await prismaClient.client.count();
    return {
      total,
      pageCount: Math.ceil(total / pageSize),
      rows,
    };
  }
  @Delete(':id')
  async delete(@Param('id') @Required() id: string) {
    return prismaClient.client.delete({
      where: {
        id: id,
      },
    });
  }
  @Post(':id/users')
  async addUsers(
    @Param('id') @Required() id: string,
    @Body('ids') @Required() ids: string[]
  ) {
    return prismaClient.client.update({
      where: {
        id,
      },
      data: {
        users: {
          connect: ids.map((id) => ({ id })),
        },
      },
    });
  }
}
