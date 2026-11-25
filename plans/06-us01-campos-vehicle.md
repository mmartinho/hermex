# Plano — US01: campos category, imageUrl e transmission no Vehicle (HRMX-12)

> **Status: IMPLEMENTADO** em 2026-11-25 (commit `e027487`), conforme o workflow da skill `/plan-backend-issue-from-linear`.
> Branch: `aula-4` (criada a partir da `aula-3`).
> Issue: [HRMX-12](https://linear.app/mmartinho/issue/HRMX-12) — **Done** (2026-11-25, a pedido do usuário), prioridade High, milestone Backend.

## 0. Pré-requisitos

- MCP do Linear disponível (conferido).
- Estados do Hermex Team (conferidos): Backlog, Todo, **In Progress**, **In Review**, Done, Canceled, Duplicate.
- Postgres local no ar (`hermex-postgres`, healthy).

## 1. Spec obtida

`get_issue HRMX-12` (com relações), sem comentários. Bloqueada pela HRMX-5 (US02, implementada e em In Review);
bloqueia a HRMX-14 (US03).

## 2. Leitura da spec

| Item | Conteúdo |
|------|----------|
| Contexto | Os cards da home mostram imagem, categoria e transmissão (ex.: "SUV Automático") |
| Contrato | Query `vehicles` retorna `imageUrl`, `category { id name }` e `transmission`, além dos campos atuais |
| Regras | `imageUrl` opcional; `categoryId` FK (nullable temporariamente é permitido); `transmission` `MANUAL`/`AUTOMATIC`; categoria via relation do Prisma, sem N+1 |
| Restrições | Não remover campos; sem resolver separado para a categoria; regra condicional sobre enum do Prisma |
| Stack e padrões | `prisma/schema.prisma`; `src/vehicles/vehicle.model.ts`; `registerEnumType`; migrate + generate; Jest |
| Critérios de aceite | Ver o checklist da etapa 7 |
| Verificação | Testes passando; comparação com a spec; revisão humana da segurança da migration |

## 3. Planejamento

### Referências no código (coesão e não regressão)

- `src/categories/` — módulo, resolver, model e spec (padrão mais próximo).
- `src/common/graphql/enums.ts` e `packages/shared/src/auth.ts` — padrão de enum compartilhado.
- `prisma/seed.ts` — admin, categorias e locais precisam continuar funcionando.

### Divergências entre a spec e o repositório

| Divergência | Tratamento |
|-------------|------------|
| A query `vehicles` e o módulo `vehicles` não existem (só o model Prisma) | Criar módulo, model e resolver nesta story (necessário para os critérios de aceite) |
| `Vehicle` não tem `available` | Incluir nesta story (decisão do usuário) |
| O projeto já usa enums do Prisma | Usar enum do Prisma (decisão do usuário) |
| O pacote se chama `api`, não `@hermex/api` | `pnpm --filter api test` |

### Decisões do usuário (2026-11-25)

1. `categoryId` **nullable** por ora; o NOT NULL fica para uma migration futura.
2. `transmission` como **enum do Prisma**, default `MANUAL`, com enum em `@hermex/shared`.
3. `available` (boolean, default `true`) **incluído** nesta story. O filtro continua sendo da US03.
4. **Veículos de exemplo** no seed.

### Decisões técnicas

- Query `vehicles` pública (a home é pública), sem filtro nem paginação (US03/US04).
- Ordem determinística: `brand` ASC, `model` ASC.
- `include: { category: true }` — uma chamada ao Prisma, sem `@ResolveField`.
- `dailyRate` exposto como `Float`, convertido de `Decimal` no resolver.
- GraphQL expõe `category` (nullable), não `categoryId`.
- FK com o comportamento padrão da relação opcional (`ON DELETE SET NULL`) e índice em `categoryId`.
- Sem dependências novas.

### ToDo

- [x] Mover a HRMX-12 para **In Progress**
- [x] Enum `Transmission` em `@hermex/shared` e registro no GraphQL
- [x] Schema Prisma e migration `add_vehicle_category_transmission`
- [x] Scaffold de `vehicles` com `nest generate`
- [x] Model GraphQL e resolver com a query `vehicles`
- [x] Seed de veículos de exemplo
- [x] Testes do resolver
- [x] Cabeçalhos, JSDoc e Prettier
- [x] Regenerar `schema.gql` e rodar `pnpm codegen`
- [x] Testes, lint, typecheck e build
- [x] Checklist contra a spec
- [x] Commit
- [x] Mover para **In Review** e comentar na issue

## 4. Marcar como "In Progress"

`save_issue(id: "HRMX-12", state: "In Progress")` antes da primeira alteração de código.

## 5. Implementação

1. **Shared** — `packages/shared/src/vehicle.ts` com `Transmission` (`MANUAL`, `AUTOMATIC`), exportado no
   `index.ts`; `pnpm build:shared`. Registrar em `src/common/graphql/enums.ts`.
2. **Prisma:**
   - `enum Transmission { MANUAL AUTOMATIC }`
   - `Vehicle`: `imageUrl String?`, `transmission Transmission @default(MANUAL)`,
     `available Boolean @default(true)`, `categoryId String?`, `category Category? @relation(...)`,
     `@@index([categoryId])`
   - `Category`: `vehicles Vehicle[]`
   - `pnpm db:migrate --name add_vehicle_category_transmission` e `pnpm db:generate`; conferir que o SQL só
     adiciona (nenhum DROP, nenhum NOT NULL sem default).
3. **Scaffold** (em `apps/api`): `nest generate module vehicles`, `nest generate resolver vehicles`,
   `nest generate class vehicles/vehicle.model --flat --no-spec`.
4. **Model e resolver** — `Vehicle` (`@ObjectType`) com `id`, `brand`, `model`, `year`, `licensePlate`,
   `dailyRate`, `imageUrl`, `transmission`, `available`, `category`, `createdAt`, `updatedAt`; `vehicles()` com
   `findMany({ include: { category: true }, orderBy })`.
5. **Seed** — `seedVehicles()` após `seedCategories()`, `upsert` pela placa (placas fictícias), um ou mais por
   categoria, um deles com `available: false`, sem `imageUrl`.

## 6. Testes

`src/vehicles/vehicles.resolver.spec.ts`: argumentos do `findMany` (include e ordem); retorno de `imageUrl`
(string e null), `category`, `transmission` e `dailyRate` numérico; veículo sem categoria; lista vazia.
Se um teste existente quebrar, analisar e **perguntar antes de corrigir**.

## 7. Conferência contra a spec

- `pnpm --filter api test`, `pnpm --filter api lint`, `pnpm build:api`, `pnpm typecheck`.
- `pnpm db:seed` duas vezes sem duplicar.
- `{ vehicles { id brand imageUrl transmission category { id name } } }` em `http://localhost:4000/graphql`.

Checklist:

- [x] `vehicles` retorna `imageUrl` (string ou null)
- [x] `vehicles` retorna `category { id, name }` (null para veículo sem categoria)
- [x] `vehicles` retorna `transmission`
- [x] migration roda sem erros no banco existente
- [x] testes do resolver `vehicles` passam com os novos campos

Resultado: 15 testes (4 suítes), lint, build e typecheck ok; seed executado duas vezes; query conferida na API
com 7 veículos. A migration também foi aplicada num banco temporário com um veículo pré-existente (ficou com
`MANUAL`, `available = true`, sem categoria e sem imagem).

Ressalvas: `categoryId` ainda não é obrigatória (a spec permite temporariamente). `pnpm format:check` acusa só
`.claude/settings.local.json`, arquivo local fora desta mudança.

## 8. Marcar como "In Review"

`save_issue(id: "HRMX-12", state: "In Review")` e comentário com resumo, arquivos, checklist, divergências e
instruções de verificação.

## 9. Commit e próximos passos

- Commit na `aula-4`: `feat(api): adiciona categoria, imagem e transmissão ao Vehicle com query vehicles`.
- Push e PR (`aula-4` → `aula-3`) só se o usuário pedir.
