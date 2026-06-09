# Webhook Receiver Service

Serviço backend desenvolvido com **NestJS + TypeScript** para recebimento de webhooks públicos e persistência de eventos em MongoDB.

---

# Tecnologias utilizadas

* Node.js
* TypeScript
* NestJS
* Prisma
* MongoDB
* Redis
* Docker Compose
* Winston

---

# Objetivo

A aplicação recebe eventos externos através de webhooks públicos e armazena os dados para posterior processamento.

O projeto foi estruturado com foco em:

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

# Subindo o ambiente

O Docker Compose sobe os seguintes containers:

* MongoDB
* Inicializador automático do Replica Set

Para subir toda a infraestrutura:

```bash
pnpm db:setup
```

Ou manualmente:

```bash
docker compose up -d
```

---

# Instalação

## Instalar dependências

```bash
pnpm install
```

## Gerar Prisma Client

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

# Estrutura do evento persistido

Exemplo de documento salvo no MongoDB:

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

MongoDB foi utilizado devido à flexibilidade para armazenamento de payloads dinâmicos de webhooks.

---

## Prisma

Prisma foi utilizado para simplificar o acesso ao banco de dados, oferecendo:

* tipagem forte
* melhor experiência de desenvolvimento
* queries organizadas
* facilidade de manutenção

---

# Logs

A aplicação utiliza Winston para logging estruturado.

Os logs incluem:

* inicialização da aplicação
* conexão com banco de dados
* erros
* requisições importantes

---

# Tratamento de erros

A aplicação possui tratamento centralizado de erros para:

* evitar vazamento de informações internas
* manter respostas padronizadas
* facilitar debugging
* melhorar observabilidade

---

# Escalabilidade

A arquitetura foi pensada para suportar crescimento futuro.

## Load Balancer

Em ambientes com múltiplas instâncias da aplicação, um Load Balancer pode distribuir o tráfego entre os serviços.

### Topologia sugerida

```text
Internet
    │
    ▼
[ Load Balancer ]
(NGINX / AWS ALB / Traefik)
    │
    ├── Instância 1 (NestJS)
    ├── Instância 2 (NestJS)
    └── Instância N (NestJS)
            │
            ├── MongoDB Replica Set
            └── Redis
```

---

## Cache

Redis pode ser utilizado como camada de cache para reduzir carga no banco de dados e melhorar latência.

### Estratégia adotada — Cache Aside

```text
Request
   │
   ├── Cache HIT  → retorna Redis
   └── Cache MISS → consulta MongoDB
                         │
                         └── salva no Redis
```

---

## Observabilidade

Em produção, observabilidade é essencial para monitoramento e troubleshooting.

### Stack sugerida

* ELK Stack (Elasticsearch + Logstash + Kibana)
* Winston para logs estruturados
* métricas e tracing distribuído

---

# Evoluções futuras

Possíveis melhorias:

* autenticação de webhooks
* idempotência
* filas
* retries automáticos
* DLQ (Dead Letter Queue)
* rate limiting
* métricas
* tracing distribuído
* documentação Swagger

---

# Executando testes

```bash
pnpm run test:e2e
```

---

# Considerações finais

O foco principal foi construir uma base simples, organizada e preparada para crescimento futuro, priorizando:

* clareza arquitetural
* separação de responsabilidades
* facilidade de manutenção
* escalabilidade
* legibilidade do código
* simplicidade na evolução do projeto
