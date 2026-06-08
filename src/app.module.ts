import { Module } from '@nestjs/common';
import { HealthModule } from '@/modules/health/health.module';
import { ConfigModule } from '@/modules/shared/config/config.module';
import { PrismaModule } from '@/modules/shared/database/prisma.module';
import { LoggerModule } from '@/modules/shared/logger/logger.module';

@Module({
  imports: [ConfigModule, LoggerModule, HealthModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
