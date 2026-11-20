# Plano — Bootstrap do monorepo Hermex (locadora de veículos)

> **Status: IMPLEMENTADO** (2026-11-19) — aprovado e implementado; aguardando commit inicial.
> Criado: 2026-11-19 · Revisão 2 (2026-11-19): autenticação migrada para **Auth.js + login social**.
>
> **Desvios em relação ao plano (decididos na implementação):**
> - **Nest 11** em vez de 12: o Nest CLI 12 falha no Node 22.13 (`ERR_REQUIRE_CYCLE_MODULE`). Pelo mesmo motivo, GraphQL Codegen ficou no CLI 7 + client-preset 5.
> - **Prisma 7.10.1** (o `latest` do npm era um RC do Prisma 8), com `prisma.config.ts` e `@prisma/adapter-pg`.
> - **`bcryptjs`** no lugar de `bcrypt` (sem build nativo no Windows).
> - **Next 16**: `src/proxy.ts` no lugar de `middleware.ts`; Cache Components ativo, então leituras de sessão ficam sob `<Suspense>`.
> - Client Components falam com a API via proxy **`/api/graphql`** do Next, que anexa o JWT no servidor — o token da API nunca vai para o navegador.
> - API ganhou `formatError` que mapeia status HTTP para `extensions.code` (ex.: 409 → `CONFLICT`).

## Contexto

O repositório `hermex/` está vazio (apenas `PRD.md` e a pasta `plans/`). O PRD pede um monorepo PNPM com:
- **Front-end**: Next.js (via `npx create-next-app`), Tailwind, componentes em Atomic Design, preparado para autenticação.
- **Back-end**: Nest.js (via `@nestjs/cli`), GraphQL, Prisma, Postgres via `docker-compose.yaml` com volume.
- Atalhos no `package.json` raiz usando `--filter`, para não precisar navegar entre pastas.

Decisões tomadas com o usuário:
- Auth: **login social é prioridade** (a maioria dos clientes da locadora vai preferir entrar com rede social). Front usa **Auth.js (NextAuth v5)** com provedores **Google** e **Facebook** + **Credentials** (email/senha, para admin e quem não quiser rede social). O **Nest continua sendo a fonte da verdade**: guarda usuários/contas vinculadas e emite o JWT que protege a API GraphQL.
- GraphQL: **code-first** (Apollo Driver, `schema.gql` gerado) + **Apollo Client** no front com **GraphQL Codegen**.
- Domínio: **apenas `User` (+ `Account` para as contas sociais)** nesta etapa.
- Extras: `git init` + `.gitignore`, ESLint/Prettier compartilhados na raiz, pacote `packages/shared`, plano salvo em `hermex/plans/`.

Ambiente verificado: Node 22.13, pnpm 12.8, Docker 29.8 (Windows 10).

Regra global: **todo arquivo de código criado/alterado recebe o cabeçalho** (Autor(es) / Data Criação / Data Atualização / Descrição) e **JSDoc** em funções/métodos (params, retorno, exceções). Isso vale também para arquivos gerados pelos CLIs que forem mantidos/editados (ex.: `main.ts`, `app.module.ts`, `layout.tsx`). Arquivos 100% gerados (Prisma client, `schema.gql`, saída do codegen) ficam sem cabeçalho.

## Estrutura alvo

```
hermex/
├── apps/
│   ├── web/                 # Next.js (App Router, TS, Tailwind, Auth.js)
│   └── api/                 # Nest.js (GraphQL + Prisma + JWT)
├── packages/
│   └── shared/              # tipos/constantes comuns (@hermex/shared)
├── plans/                   # planos
├── docker-compose.yaml      # Postgres + volume
├── pnpm-workspace.yaml
├── package.json             # scripts com --filter
├── .env.example
├── .gitignore  .editorconfig  .prettierrc  .prettierignore
├── eslint.config.mjs        # config base (flat config) compartilhada
└── PRD.md
```

## Fluxo de autenticação

```
Navegador ──(Google/Facebook OAuth ou email+senha)──► Auth.js (Next, server-side)
   Auth.js callback `jwt` (no 1º login):
     • social     → mutation `authenticateWithProvider` no Nest (server-to-server, header `x-internal-api-key`)
     • credentials→ mutation `login` no Nest
   Nest: upsert User + Account (vincula por email verificado) → retorna { accessToken (JWT Nest), user }
   Auth.js guarda accessToken + user.id/role no JWT de sessão (cookie httpOnly criptografado do Auth.js)
Apollo Client (server e client) ──Authorization: Bearer <accessToken Nest>──► API GraphQL (JwtStrategy/GqlAuthGuard)
```

Pontos de segurança:
- `authenticateWithProvider` só aceita chamadas com `INTERNAL_API_KEY` (segredo compartilhado apenas entre os servidores Next e Nest; nunca exposto ao browser).
- Vincular conta social a usuário existente **apenas se o provedor informar email verificado** (Google: `email_verified`; Facebook: tratar email como verificado só se retornado pela Graph API — caso contrário cria conta separada / pede confirmação).
- Expiração do JWT do Nest alinhada ao `maxAge` da sessão do Auth.js (ex.: 7 dias). **Refresh token fica para um plano futuro.**
- Sem Prisma Adapter do Auth.js: o Next não acessa o banco; toda persistência passa pelo Nest.

## Passos

### 1. Raiz do monorepo
- `git init` + `.gitignore` (node_modules, .next, dist, .env*, exceto `.env.example`, coverage).
- `pnpm-workspace.yaml` com `apps/*` e `packages/*`.
- `package.json` raiz (`private: true`, `packageManager: pnpm@12.8.1`) com atalhos:
  - `dev` (paralelo: `pnpm -r --parallel --filter ./apps/** dev`), `dev:web`, `dev:api`
  - `build`, `build:web`, `build:api`, `build:shared`
  - `lint`, `format`, `typecheck`
  - `db:up` / `db:down` / `db:logs` (docker compose)
  - `db:migrate`, `db:generate`, `db:studio`, `db:seed` → `pnpm --filter api prisma ...`
  - `codegen` → `pnpm --filter web codegen`
  - `web` / `api` → `pnpm --filter web` / `pnpm --filter api` (para rodar qualquer comando, ex.: `pnpm api add x`)
- Prettier + ESLint (flat config) na raiz; cada app estende a base (o Next mantém `eslint-config-next`, o Nest mantém o preset dele, ambos integrados ao Prettier).
- `.editorconfig`.

### 2. Banco — `docker-compose.yaml`
- Serviço `postgres` (imagem `postgres:17-alpine`), porta `5432`, variáveis vindas de `.env` (`POSTGRES_USER/PASSWORD/DB=hermex`), **volume nomeado** `hermex_pgdata` montado em `/var/lib/postgresql/data`, `healthcheck` com `pg_isready`.
- `.env.example` na raiz com as variáveis do compose.
- `apps/api/.env.example`: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`, `INTERNAL_API_KEY`, `PORT=4000`, `CORS_ORIGIN=http://localhost:3000`, `SEED_ADMIN_PASSWORD`.

### 3. `packages/shared`
- `@hermex/shared`, TypeScript, build com `tsc` (saída CJS + d.ts, compatível com Nest e Next).
- Conteúdo inicial: const/enum `UserRole` (`ADMIN`, `CUSTOMER`), `AuthProvider` (`GOOGLE`, `FACEBOOK`), tipo `AuthTokenPayload`, constante `INTERNAL_API_KEY_HEADER`.
- Consumido como `workspace:*` por `web` e `api` (no Next, `transpilePackages: ['@hermex/shared']`).

### 4. Back-end — `apps/api`
- Criar com `npx @nestjs/cli new api --package-manager pnpm --skip-git` dentro de `apps/`; ajustar `name: "api"`.
- Dependências: `@nestjs/graphql @nestjs/apollo @apollo/server graphql`, `@nestjs/config`, `@nestjs/jwt @nestjs/passport passport passport-jwt`, `bcrypt`, `class-validator class-transformer`, `prisma @prisma/client` (versão estável atual; se for Prisma 7, usar `prisma.config.ts` + driver adapter `@prisma/adapter-pg`).
- Módulos:
  - `ConfigModule` global (validação das envs).
  - `GraphQLModule.forRoot<ApolloDriverConfig>` code-first, `autoSchemaFile: 'src/schema.gql'`, `sortSchema`, `context: ({ req, res }) => ({ req, res })`, Sandbox só em dev. Endpoint `http://localhost:4000/graphql`.
  - `PrismaModule` global com `PrismaService` (`onModuleInit` → `$connect`, `enableShutdownHooks`).
  - `UsersModule`: `UsersService` (`findByEmail`, `findById`, `create` com hash bcrypt, `upsertFromProvider`), `User` ObjectType (sem expor `passwordHash`), resolver com query `me` (protegida).
  - `AuthModule`:
    - `AuthService`: `validateUser`, `login` (credentials → JWT), `authenticateWithProvider` (upsert `User` + `Account`, regra de vínculo por email verificado → JWT).
    - `JwtStrategy` (lê `Authorization: Bearer`), `GqlAuthGuard` (sobrescreve `getRequest` p/ GraphQL), decorator `@CurrentUser()`.
    - `InternalApiKeyGuard` (valida header `x-internal-api-key` contra `INTERNAL_API_KEY`).
    - `AuthResolver`: `login(input)` e `register(input)` → `AuthPayload { accessToken, user }`; `authenticateWithProvider(input: { provider, providerAccountId, email, emailVerified, name, image })` → `AuthPayload` (protegida por `InternalApiKeyGuard`).
  - Decorator/guard de roles (`@Roles()` + `RolesGuard`) usando `UserRole` do shared — base para futuras áreas admin.
- Prisma `schema.prisma`:
  ```prisma
  enum UserRole { ADMIN CUSTOMER }
  enum AuthProvider { GOOGLE FACEBOOK }

  model User {
    id            String    @id @default(uuid())
    email         String    @unique
    emailVerified DateTime?
    name          String
    image         String?
    passwordHash  String?   // null para quem só usa login social
    role          UserRole  @default(CUSTOMER)
    accounts      Account[]
    createdAt     DateTime  @default(now())
    updatedAt     DateTime  @updatedAt
  }

  model Account {
    id                String       @id @default(uuid())
    userId            String
    user              User         @relation(fields: [userId], references: [id], onDelete: Cascade)
    provider          AuthProvider
    providerAccountId String
    createdAt         DateTime     @default(now())
    @@unique([provider, providerAccountId])
  }
  ```
  Migration inicial `init_auth` + `prisma/seed.ts` criando um admin (`admin@hermex.local`, senha de `SEED_ADMIN_PASSWORD`).
- `main.ts`: `ValidationPipe` global, CORS com `credentials: true` para `CORS_ORIGIN`, porta via env.

### 5. Front-end — `apps/web`
- Criar com `npx create-next-app@latest web --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --skip-install` dentro de `apps/`, depois `pnpm install` na raiz.
- **Auth.js** (`next-auth@5` — confirmar na instalação a versão estável/status do projeto):
  - `src/auth.ts`: `NextAuth({ providers: [Google, Facebook, Credentials], session: { strategy: 'jwt', maxAge: 7d } })`.
    - `authorize` (Credentials) → mutation `login` no Nest.
    - callback `jwt` → no 1º login social chama `authenticateWithProvider` com `INTERNAL_API_KEY`; grava `accessToken`, `userId`, `role` no token.
    - callback `session` → expõe `user.id`, `user.role` e `accessToken` para o servidor (tipos estendidos em `src/types/next-auth.d.ts`).
  - `src/app/api/auth/[...nextauth]/route.ts` exportando os handlers.
  - Proteção de rotas: `src/middleware.ts` (ou `src/proxy.ts` conforme a convenção da versão do Next) usando `auth` do Auth.js — `(private)/*` sem sessão → `/login`; `/login` com sessão → `/dashboard`.
  - `apps/web/.env.example`: `AUTH_SECRET`, `AUTH_URL=http://localhost:3000`, `AUTH_GOOGLE_ID/SECRET`, `AUTH_FACEBOOK_ID/SECRET`, `INTERNAL_API_KEY`, `API_GRAPHQL_URL=http://localhost:4000/graphql`, `NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql`.
  - README com o passo a passo para criar os apps OAuth no Google Cloud Console e no Meta for Developers (callback `http://localhost:3000/api/auth/callback/{google|facebook}`).
- Atomic Design em `src/components/`:
  - `atoms/` (Button, Input, Label, Spinner, Avatar), `molecules/` (FormField, NavLink, SocialLoginButton), `organisms/` (Header com menu do usuário, LoginForm com botões sociais em destaque + email/senha), `templates/` (PublicTemplate, PrivateTemplate); páginas ficam em `src/app` (as "pages" do atomic design).
  - Cada nível com `index.ts` de barrel.
- Rotas (App Router): `(public)/page.tsx` (home), `(public)/login/page.tsx`, `(private)/dashboard/page.tsx` (exibe `me`).
- Apollo Client:
  - `src/lib/apollo/` com cliente para Server Components (via `@apollo/client-integration-nextjs` ou equivalente da versão atual, token via `auth()`) e cliente para Client Components (`ApolloProvider` em `providers.tsx`, token via `SessionProvider`/`useSession`).
- GraphQL Codegen (`@graphql-codegen/cli` + `client-preset`): `codegen.ts` lendo `../api/src/schema.gql`, documentos em `src/graphql/**/*.graphql`, saída em `src/gql/`. Operações iniciais: `Login`, `AuthenticateWithProvider`, `Me`.
- `src/lib/auth/` com helpers finos sobre o Auth.js (`getSession`, `requireSession`, `signInWith(provider)`, `signOut`) para isolar o resto do app da lib de auth.

### 6. Documentação e fechamento
- `README.md` na raiz: pré-requisitos, configuração OAuth (Google/Facebook), passo a passo (`pnpm i` → copiar `.env.example` → `pnpm db:up` → `pnpm db:migrate` → `pnpm db:seed` → `pnpm dev`) e tabela de scripts.
- Commit inicial (somente após aprovação do usuário).

## Arquivos críticos
- `package.json`, `pnpm-workspace.yaml`, `docker-compose.yaml` (raiz)
- `apps/api/src/app.module.ts`, `apps/api/src/main.ts`, `apps/api/prisma/schema.prisma`, `apps/api/src/auth/**`, `apps/api/src/users/**`, `apps/api/src/prisma/prisma.service.ts`
- `apps/web/src/auth.ts`, `apps/web/src/middleware.ts`, `apps/web/src/app/api/auth/[...nextauth]/route.ts`, `apps/web/src/lib/apollo/**`, `apps/web/src/lib/auth/**`, `apps/web/src/components/{atoms,molecules,organisms,templates}/**`, `apps/web/codegen.ts`
- `packages/shared/src/index.ts`

## Verificação
1. `pnpm install` na raiz sem erros; `pnpm build` compila `shared`, `api` e `web`.
2. `pnpm db:up` → container saudável (`docker compose ps`); `pnpm db:down && pnpm db:up` mantém os dados (volume).
3. `pnpm db:migrate` e `pnpm db:seed` → tabelas `User`/`Account` e o admin criado (`pnpm db:studio`).
4. `pnpm dev:api` → Apollo Sandbox em `http://localhost:4000/graphql`:
   - `login` com o admin retorna token; `me` sem token → `Unauthorized`; com token → dados.
   - `authenticateWithProvider` sem `x-internal-api-key` → erro; com a chave → cria `User` + `Account`; repetir a chamada não duplica.
5. `pnpm codegen` gera `apps/web/src/gql/` sem erros.
6. `pnpm dev` (ambos):
   - `/dashboard` sem sessão → redireciona para `/login`.
   - Login com Google (e Facebook, se as credenciais estiverem configuradas) → volta ao `/dashboard` mostrando `me`; registro aparece em `Account`.
   - Login com email/senha do admin funciona; logout limpa a sessão e volta para `/login`.
7. `pnpm lint`, `pnpm typecheck` e `pnpm format --check` passam.
8. Conferir que arquivos criados/editados têm o cabeçalho padrão e JSDoc.

## Fora do escopo (próximos planos)
- Refresh token / rotação do JWT do Nest.
- Login com Apple (exige conta paga no Apple Developer) e outros provedores.
- Tela para vincular/desvincular contas sociais no perfil.
- Domínio da locadora (veículos, clientes, locações).
