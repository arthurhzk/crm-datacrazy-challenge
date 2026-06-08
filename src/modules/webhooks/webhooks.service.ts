import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '@/common/database/prisma.service';
import { WebhookStatus } from '@/modules/webhooks/constants/webhook-status';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(
    source: string,
    payload: unknown,
    headers: Record<string, string | string[] | undefined>,
  ) {
    try {
      const event = await this.prisma.webhookEvent.create({
        data: {
          source,
          payload: payload as Prisma.InputJsonValue,
          headers: headers,
          status: WebhookStatus.RECEIVED,
        },
      });

      this.logger.info('Webhook event saved', { id: event.id, source });

      return { id: event.id };
    } catch (error: unknown) {
      this.logger.error('Failed to save webhook event', { source, error });

      throw new InternalServerErrorException('Failed to save webhook event');
    }
  }
}
