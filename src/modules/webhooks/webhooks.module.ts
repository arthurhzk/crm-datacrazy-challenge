import { Module } from '@nestjs/common';
import { WebhooksController } from '@/modules/webhooks/webhooks.controller';
import { WebhooksService } from '@/modules/webhooks/webhooks.service';

@Module({
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
