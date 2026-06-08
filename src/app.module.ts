import { Module } from '@nestjs/common';
import { HealthModule } from '@/modules/health/health.module';
import { WebhooksModule } from '@/modules/webhooks/webhooks.module';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { ConfigModule } from '@/common/config/config.module';
import { PrismaModule } from '@/common/database/prisma.module';
import { LoggerModule } from '@/common/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    HealthModule,
    PrismaModule,
    WebhooksModule,
  ],
  controllers: [],
  providers: [HttpExceptionFilter],
})
export class AppModule {}
