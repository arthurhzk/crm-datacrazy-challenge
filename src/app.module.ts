import { Module } from '@nestjs/common';
import { HealthModule } from '@/modules/health/health.module';
import { PrismaModule } from '@/modules/shared/database/prisma.module';

@Module({
  imports: [HealthModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
