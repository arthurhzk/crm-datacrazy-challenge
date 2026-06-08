import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect()
      .then(() => {
        console.log('Prisma connected successfully');
      })
      .catch((error) => {
        console.error('Error connecting to Prisma:', error);
      });
  }
  async onModuleDestroy() {
    await this.$disconnect()
      .then(() => {
        console.log('Prisma disconnected successfully');
      })
      .catch((error) => {
        console.error('Error disconnecting from Prisma:', error);
      });
  }
}
