# Hermex

Locadora de veículos — monorepo PNPM com front-end **Next.js** e API **Nest.js + GraphQL + Prisma**.

```
apps/web         Next.js 16 (App Router, Tailwind 4, Atomic Design, Auth.js v5, Apollo Client)
apps/api         Nest.js 11 (GraphQL code-first/Apollo, Prisma 7, JWT)
packages/shared  Tipos e constantes comuns (@hermex/shared)
plans/           Planos de implementação
```

## Pré-requisitos

- Node.js **22.12+** (recomendado 22.14+)
- pnpm **12** (`corepack enable`)
- Docker (para o Postgres)

## Primeiros passos

```bash
pnpm install                              # instala tudo, compila o shared e gera o Prisma Client

cp .env.example .env                      # variáveis do docker-compose
cp apps/api/.env.example apps/api/.env    # API: banco, JWT, chave interna, seed
cp apps/web/.env.example apps/web/.env.local  # Web: Auth.js, OAuth, URL da API

pnpm db:up        # sobe o Postgres (volume hermex_pgdata)
pnpm db:migrate   # aplica as migrations
pnpm db:seed      # cria o admin (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)
pnpm dev          # web em http://localhost:3000 e API em http://localhost:4000/graphql
```

> `INTERNAL_API_KEY` precisa ter **o mesmo valor** em `apps/api/.env` e `apps/web/.env.local`.
> Gere segredos fortes com `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.

## Autenticação

- **Auth.js (NextAuth v5)** no front com Google, Facebook e email/senha.
- A **API Nest é a fonte da verdade**: no login social, o servidor Next chama a mutation
  `authenticateWithProvider` (protegida pelo header `x-internal-api-key`), que cria/vincula o
  usuário e devolve o JWT da API.
- O JWT da API fica no token de sessão do Auth.js (cookie httpOnly criptografado) e **não é
  exposto ao navegador**. Client Components usam o proxy `/api/graphql`, que anexa o token no
  servidor.
- Uma conta social só é vinculada a um usuário existente se o provedor garantir que o email foi
  verificado (Google). Caso contrário, o login retorna erro de conflito.

### Configurando os provedores OAuth

| Provedor | Onde criar | URL de callback |
| --- | --- | --- |
| Google | [Google Cloud Console → Credenciais](https://console.cloud.google.com/apis/credentials) (ID do cliente OAuth, tipo "Aplicativo da Web") | `http://localhost:3000/api/auth/callback/google` |
| Facebook | [Meta for Developers](https://developers.facebook.com/apps) (produto "Login do Facebook", permissões `email` e `public_profile`) | `http://localhost:3000/api/auth/callback/facebook` |

Preencha `AUTH_GOOGLE_ID/SECRET` e `AUTH_FACEBOOK_ID/SECRET` em `apps/web/.env.local`.

## Scripts (raiz)

| Script | O que faz |
| --- | --- |
| `pnpm dev` | Compila o shared e sobe web + api em paralelo |
| `pnpm dev:web` / `pnpm dev:api` | Sobe só um app |
| `pnpm build` | Build de shared, api e web |
| `pnpm lint` / `pnpm typecheck` | Lint / checagem de tipos em todos os pacotes |
| `pnpm format` / `pnpm format:check` | Prettier |
| `pnpm test:api` | Testes unitários da API |
| `pnpm db:up` / `db:down` / `db:logs` | Controla o Postgres (docker compose) |
| `pnpm db:migrate` | `prisma migrate dev` (aceita `--name <nome>`) |
| `pnpm db:generate` / `db:seed` / `db:studio` / `db:deploy` | Demais comandos do Prisma |
| `pnpm codegen` | Gera os tipos GraphQL do front a partir de `apps/api/src/schema.gql` |
| `pnpm web <cmd>` / `pnpm api <cmd>` | Roda qualquer comando no app (ex.: `pnpm api add zod`) |

O `schema.gql` é gerado automaticamente quando a API sobe. Depois de alterar resolvers, suba a API
e rode `pnpm codegen`.

## Observações de versão

- O **Nest CLI 12** falha no Node 22.13 (erro `ERR_REQUIRE_CYCLE_MODULE`), por isso a API usa
  Nest 11. Com Node ≥ 22.14 é possível migrar para o Nest 12.
- Pelo mesmo motivo, o GraphQL Codegen está no CLI 7 + client-preset 5.
- O Auth.js v5 ainda é publicado como `beta` no npm (`next-auth@5.0.0-beta.32`).
