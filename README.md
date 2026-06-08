# Webhook Receiver Service

Serviço backend desenvolvido com **NestJS + TypeScript** para recebimento de webhooks públicos e persistência de eventos em MongoDB.

---

# Tecnologias utilizadas

* Node.js
* TypeScript
* NestJS
* Prisma
* MongoDB
* Docker Compose
* Winston

---

# Objetivo

A aplicação recebe eventos externos através de webhooks públicos e armazena os dados para posterior processamento.

O projeto foi estruturado pensando em:

* organização
* manutenção
* escalabilidade
* legibilidade
* simplicidade

---

# Estrutura do projeto

```bash
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
```

---

# Como executar o projeto

## Pré-requisitos

* Docker
* Docker Compose
* Node.js
* PNPM

---

# Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000

DATABASE_URL="mongodb://admin:admin@localhost:27017/webhooks?authSource=admin&replicaSet=rs0"
```

---

# Subindo o MongoDB

O Docker Compose sobe dois containers:

* mongodb — instância MongoDB com replica set
* mongo-init — container auxiliar que inicializa o replica set automaticamente (executa rs.initiate() e encerra)

Para subir tudo de uma vez (MongoDB + replica set + Prisma schema):

```bash
pnpm db:setup
```

Ou manualmente:

```bash
docker compose up -d
```

---

# Instalando dependências

```bash
pnpm install
```

---

# Gerando o Prisma Client

```bash
npx prisma generate
```

---

# Executando a aplicação

```bash
pnpm run start:dev
```

Aplicação disponível em:

```bash
http://localhost:3000
```

---

# Endpoints

## Receber webhook

```http
POST /webhooks/:source
```

### Exemplo

```http
POST /webhooks/shopify
```

### Payload

```json
{
  "event": "order.created",
  "data": {
    "id": 123
  }
}
```

---

## Health Check

```http
GET /health
```

### Retorna

* status da aplicação
* status da conexão com MongoDB
* timestamp

---

# Estrutura do evento salvo

Exemplo de documento persistido no MongoDB:

```json
{
  "id": "uuid",
  "source": "shopify",
  "payload": {},
  "headers": {},
  "receivedAt": "2026-06-08T00:00:00.000Z",
  "status": "processed",
  "errorMessage": null
}
```

---

# Decisões técnicas

## NestJS

O NestJS foi escolhido por oferecer:

* arquitetura modular
* injeção de dependência
* organização
* facilidade de manutenção
* escalabilidade

---

## MongoDB

MongoDB foi utilizado devido à flexibilidade no armazenamento de payloads dinâmicos de webhooks.

---

## Prisma

Prisma foi utilizado para simplificar o acesso ao banco de dados, oferecendo:

* tipagem forte
* melhor experiência de desenvolvimento
* queries mais organizadas
* facilidade de manutenção

---

# Logs

A aplicação utiliza Winston para logging estruturado.

Os logs incluem:

* inicialização da aplicação
* conexão com banco
* erros
* requisições importantes

---

# Tratamento de erros

A aplicação possui tratamento centralizado de erros para:

* evitar vazamento de informações internas
* manter respostas padronizadas
* facilitar debugging e observabilidade

---

# Escalabilidade

Em cenários futuros de maior volume, seria possível adicionar:

* filas
* processamento assíncrono
* retries
* rate limiting
* observabilidade distribuída

---

# Evoluções futuras

Possíveis melhorias:

* autenticação de webhooks
* idempotência
* DLQ (Dead Letter Queue)
* métricas
* tracing
* documentação Swagger
* retries automáticos

---

# Executando testes

```bash
pnpm run test:e2e
```

---

# Considerações finais

O foco principal foi construir uma base simples, organizada e preparada para crescimento futuro, priorizando:

* clareza arquitetural
* facilidade de manutenção
* separação de responsabilidades
* escalabilidade
* legibilidade do código
