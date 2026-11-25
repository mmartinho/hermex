# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Hermex é uma locadora de veículos. Monorepo PNPM (`pnpm-workspace.yaml`) com três pacotes:

- `apps/web` — Next.js 16 (App Router, Tailwind 4, Atomic Design, Auth.js v5, Apollo Client)
- `apps/api` — Nest.js 11 (GraphQL code-first/Apollo, Prisma 7 + `@prisma/adapter-pg`, JWT/Passport), Postgres 17 via `docker-compose.yaml`
- `packages/shared` — `@hermex/shared`, tipos/constantes comuns; consumido a partir de `dist/`, então **precisa ser compilado** (`pnpm build:shared`) após alterações. `pnpm dev` e `postinstall` já fazem isso.

Requer pnpm 12. O Node 24 é fixado por projeto via `devEngines.runtime` no `package.json` raiz: o pnpm o baixa no `pnpm install` e o usa em todos os scripts `pnpm ...`, sem tocar no Node global (`node` digitado direto no terminal continua sendo o global). Os planos de implementação ficam em `plans/` e o PRD em `PRD.md`. Documentação em português; código e cabeçalhos de arquivo seguem o formato de comentários do CLAUDE.md global do usuário.

## Git
- Repositório único do monorepo (remoto `origin`: github.com/mmartinho/hermex). `apps/web` e `apps/api` **não** podem ter `.git` próprio — scaffolders como `create-next-app` e `nest new` criam um; remova-o.
- Branches por aula do curso (`aula-1`, `aula-2`, ...), não por feature.
- Branches **acumulativas**: cada `aula-N` nasce da `aula-(N-1)` (não da `main`), então a mais recente contém as alterações de todas as anteriores. O PR de cada aula usa a aula anterior como base (ex.: `aula-2` → `aula-1`).
- A `main` é a branch padrão no GitHub e aponta para a versão consolidada mais recente. Não se commita direto nela: ao fim de cada aula, avança por fast-forward até a `aula-N` (`git fetch . aula-N:main` e `git push origin main`), sem merge commit, squash ou rebase.
- Mensagens em **Conventional Commits, em português do Brasil**: `tipo(escopo opcional): descrição` com tipo em inglês (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `build`, `ci`) e descrição/corpo em pt-BR, no imperativo da 3ª pessoa e minúscula (ex.: `feat(api): adiciona resolver de reservas`). Escopos usuais: `web`, `api`, `shared`. Mudança incompatível: `!` após o tipo e rodapé `BREAKING CHANGE:`.

## Comandos (rodar na raiz)

Os scripts da raiz usam `--filter`, então não é preciso entrar nas pastas.

- Setup: `pnpm install`, copiar `.env.example` → `.env`, `apps/api/.env.example` → `apps/api/.env`, `apps/web/.env.example` → `apps/web/.env.local`; depois `pnpm db:up`, `pnpm db:migrate`, `pnpm db:seed`
- Dev: `pnpm dev` (web :3000 + API :4000/graphql); `pnpm dev:web` / `pnpm dev:api` isolados
- Build: `pnpm build` (shared → api → web)
- Qualidade: `pnpm lint`, `pnpm typecheck`, `pnpm format` / `pnpm format:check`
- Storybook (só web): `pnpm storybook` (:6006), `pnpm build:storybook` (saída em `apps/web/storybook-static`, ignorada)
- Testes (só a API tem Jest): `pnpm test:api`; um arquivo/teste: `pnpm api test auth.service` ou `pnpm api test -t "nome do teste"`
- Prisma: `pnpm db:migrate --name <nome>` (sem `--`: com ele o Prisma ignora o nome e trava no prompt interativo), `db:generate`, `db:studio`, `db:deploy`. O client gerado fica em `apps/api/src/generated/prisma` (não editar à mão)
- Comando arbitrário num pacote: `pnpm web <cmd>`, `pnpm api <cmd>`, `pnpm shared <cmd>`

## Arquitetura

### Fluxo do schema GraphQL
O schema é **code-first**: a API gera `apps/api/src/schema.gql` ao subir. O front deriva tipos dele com `pnpm codegen` (GraphQL Codegen client-preset), lendo as operações de `apps/web/src/graphql/**/*.graphql` e gerando `apps/web/src/gql/`. Ao mudar resolvers/models: subir a API → `pnpm codegen`.

### Autenticação (atravessa web e api)
- A **API é a fonte da verdade**. No login social (Google/Facebook) ou email/senha, o servidor Next (`apps/web/src/auth.ts`) chama a mutation `authenticateWithProvider`, protegida pelo header `x-internal-api-key` (`InternalApiKeyGuard`), que cria/vincula o usuário e devolve o JWT da API.
- `INTERNAL_API_KEY` deve ter o **mesmo valor** em `apps/api/.env` e `apps/web/.env.local`.
- O JWT da API vive no token de sessão do Auth.js (cookie httpOnly) e nunca vai ao navegador. Client Components falam com a API via proxy `apps/web/src/app/api/graphql/route.ts`, que anexa o token no servidor.
- Conta social só é vinculada a usuário existente se o provedor garantir email verificado (Google); senão retorna erro de conflito.
- Na API: `auth/` (guards `GqlAuthGuard`, `RolesGuard`, `InternalApiKeyGuard`, strategy JWT, decorators `@CurrentUser`/`@Roles`), `common/graphql/format-error.ts` mapeia status HTTP para `extensions.code` (ex.: 409 → `CONFLICT`), `config/env.validation.ts` valida o ambiente.

### Front-end
- Componentes em Atomic Design: `src/components/{atoms,molecules,organisms,templates}` com `index.ts` de barrel em cada nível. Cada componente tem uma story ao lado (`Componente.stories.tsx`).
- Design system do Figma em `src/app/globals.css` (`@theme`): cores (`primary`, `secondary`, `neutral-*`, `focus`…), tipografia (`text-heading-*`, `text-body-*`, fontes em `src/app/fonts.ts`), sombras `shadow-elevation-*`. Use esses tokens, não cores/tamanhos arbitrários. Ícones: `<Icon name="…" />` (Material Icons). Só modo claro.
- Tailwind 4: o Next usa `@tailwindcss/turbopack`; o Storybook usa `@tailwindcss/vite` (em `.storybook/main.ts`). Ao usar `outline-none` + `focus-visible:outline-*`, declare também `focus-visible:outline-solid`.
- Rotas em grupos `(public)` e `(private)`; o grupo privado é protegido por layout + `src/proxy.ts`.
- Next 16: `proxy.ts` substitui `middleware.ts`, e **Cache Components está ativo** — leituras de sessão/dados dinâmicos devem ficar sob `<Suspense>`.

## Restrições de versão (não "atualizar" sem checar)
- **Nest 11** e **GraphQL Codegen CLI 7 + client-preset 5** são mantidos por decisão do projeto. O motivo original (Nest CLI 12 e Codegen CLI > 7 quebravam no Node 22.13 com `ERR_REQUIRE_CYCLE_MODULE`) deixou de existir com o Node 24 (Nest CLI 12 e Codegen CLI 8 iniciam normalmente nele), mas a migração para Nest 12 / Codegen 8 não foi feita nem validada — não atualizar sem pedido explícito.
- Prisma fixado em 7.10.1 (o `latest` do npm era um RC do Prisma 8); usa `prisma.config.ts` e adapter `pg`.
- `bcryptjs` em vez de `bcrypt` (evita build nativo no Windows). Scripts de build de dependências são controlados por `allowBuilds` em `pnpm-workspace.yaml`.
