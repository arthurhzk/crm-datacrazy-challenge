import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
@Controller('health')
export class HealthController {
  constructor() {}
  @Get('health')
  @HttpCode(HttpStatus.OK)
  check() {
    return {
      status: 'ok',
    };
  }
}
