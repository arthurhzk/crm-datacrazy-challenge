/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { WebhooksController } from '@/modules/webhooks/webhooks.controller';
import { WebhooksService } from '@/modules/webhooks/webhooks.service';

describe('WebhooksController (e2e)', () => {
  let app: INestApplication;

  const mockWebhooksService = {
    create: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [
        {
          provide: WebhooksService,
          useValue: mockWebhooksService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should receive webhook and return id', async () => {
    mockWebhooksService.create.mockResolvedValue({
      id: 'webhook-id-123',
    });

    const payload = {
      event: 'payment.approved',
    };

    const response = await request(app.getHttpServer())
      .post('/webhooks/stripe')
      .set('x-signature', 'abc123')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      id: 'webhook-id-123',
    });

    expect(mockWebhooksService.create).toHaveBeenCalledWith(
      'stripe',
      payload,
      expect.objectContaining({
        'x-signature': 'abc123',
      }),
    );
  });

  it('should accept empty payload', async () => {
    mockWebhooksService.create.mockResolvedValue({
      id: 'empty-payload-id',
    });

    const response = await request(app.getHttpServer())
      .post('/webhooks/hubspot')
      .send({})
      .expect(201);

    expect(response.body).toEqual({
      id: 'empty-payload-id',
    });

    expect(mockWebhooksService.create).toHaveBeenCalledWith(
      'hubspot',
      {},
      expect.any(Object),
    );
  });

  it('should pass all headers correctly', async () => {
    mockWebhooksService.create.mockResolvedValue({
      id: 'headers-id',
    });

    await request(app.getHttpServer())
      .post('/webhooks/github')
      .set('x-github-event', 'push')
      .set('authorization', 'Bearer token123')
      .send({
        action: 'push',
      })
      .expect(201);

    expect(mockWebhooksService.create).toHaveBeenCalledWith(
      'github',
      {
        action: 'push',
      },
      expect.objectContaining({
        'x-github-event': 'push',
        authorization: 'Bearer token123',
      }),
    );
  });

  it('should return 500 when service throws', async () => {
    mockWebhooksService.create.mockRejectedValue(new Error('Database error'));

    const response = await request(app.getHttpServer())
      .post('/webhooks/stripe')
      .send({
        test: true,
      })
      .expect(500);

    expect(response.body).toEqual({
      statusCode: 500,
      message: 'Internal server error',
    });
  });

  it('should call service only once per request', async () => {
    mockWebhooksService.create.mockResolvedValue({
      id: 'single-call-id',
    });

    await request(app.getHttpServer())
      .post('/webhooks/stripe')
      .send({
        hello: 'world',
      })
      .expect(201);

    expect(mockWebhooksService.create).toHaveBeenCalledTimes(1);
  });
});
