import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { WebhooksController } from '@/modules/webhooks/webhooks.controller';
import { WebhooksService } from '@/modules/webhooks/webhooks.service';

void describe('WebhooksController (e2e)', () => {
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
});
