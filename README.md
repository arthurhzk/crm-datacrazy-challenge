Webhook Receiver Service

Serviço backend desenvolvido com NestJS + TypeScript para recebimento de webhooks públicos e persistência de eventos em MongoDB.

Tecnologias utilizadas
Node.js
TypeScript
NestJS
Prisma
MongoDB
Docker Compose
Winston
Objetivo

A aplicação recebe eventos externos através de webhooks públicos e armazena os dados para posterior processamento.

O projeto foi estruturado pensando em:

organização
manutenção
escalabilidade
legibilidade
simplicidade
Estrutura do projeto
src/
├── common/
├── modules/
│   ├── health/
│   │   ├── health.controller.ts
│   │   ├── health.module.ts
│   │   └── health.service.ts
│   │
│   └── webhooks/
│       ├── constants/
│       ├── webhooks.controller.ts
│       ├── webhooks.module.ts
│       └── webhooks.service.ts
│
├── app.module.ts
└── main.ts

prisma/
└── schema.prisma
Como executar o projeto
Pré-requisitos
Docker
Docker Compose
Node.js
Variáveis de ambiente

Criar um arquivo .env:

PORT=3000

DATABASE_URL=mongodb://admin:admin@localhost:27017/webhooks?authSource=admin
Subindo o MongoDB
docker compose up -d
Instalando dependências
pnpm install
Gerando o Prisma Client
npx prisma generate
Executando a aplicação
pnpm run start:dev

Aplicação disponível em:

http://localhost:3000
Endpoints
Receber webhook
POST /webhooks/:source

Exemplo:

POST /webhooks/shopify

Payload:

{
  "event": "order.created",
  "data": {
    "id": 123
  }
}
Health Check
GET /health

Retorna:

status da aplicação
status da conexão com MongoDB
timestamp
Estrutura do evento salvo

Exemplo:

{
  "id": "uuid",
  "source": "shopify",
  "payload": {},
  "headers": {},
  "receivedAt": "2026-06-08T00:00:00.000Z",
  "status": "processed",
  "errorMessage": null
}
Decisões técnicas
NestJS

NestJS foi escolhido por oferecer:

arquitetura modular
injeção de dependência
organização
facilidade de manutenção
escalabilidade
MongoDB

MongoDB foi utilizado devido à flexibilidade no armazenamento de payloads dinâmicos de webhooks.

Prisma

Prisma foi utilizado para simplificar o acesso ao banco de dados, oferecendo:

tipagem forte
melhor experiência de desenvolvimento
queries mais organizadas
facilidade de manutenção
Logs

A aplicação utiliza Winston para logging estruturado.

Os logs incluem:

inicialização da aplicação
conexão com banco
erros
requisições importantes
Tratamento de erros

A aplicação possui tratamento centralizado de erros para evitar vazamento de informações internas e manter respostas padronizadas.

Escalabilidade

Em cenários futuros de maior volume, seria possível adicionar:

filas
processamento assíncrono
retries
rate limiting
observabilidade distribuída

Evoluções futuras

Possíveis melhorias:

autenticação de webhooks
idempotência
DLQ (dead letter queue)
métricas
tracing
documentação Swagger
retries automáticos

Executando testes
pnpm run test:e2e
Considerações finais

O foco principal foi construir uma base simples, organizada e preparada para crescimento futuro, priorizando clareza arquitetural e facilidade de manutenção.