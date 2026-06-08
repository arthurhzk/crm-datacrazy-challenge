import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { WebhooksService } from '@/modules/webhooks/webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post(':source')
  @HttpCode(HttpStatus.ACCEPTED)
  async receive(
    @Param('source') source: string,
    @Body() payload: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    return this.webhooksService.create(source, payload, headers);
  }
}
