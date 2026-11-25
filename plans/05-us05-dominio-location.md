# Plano — US05: criar o domínio Location (HRMX-6)

> **Status: IMPLEMENTADO** em 2026-11-25 (commit `da09993`), conforme o workflow da skill
> `/plan-backend-issue-from-linear`.
> Branch: `aula-3`.
> Issue: [HRMX-6](https://linear.app/mmartinho/issue/HRMX-6) — In Review, prioridade Medium, milestone Backend.

## 0. Pré-requisitos

- MCP do Linear disponível (conferido).
- Estados do Hermex Team (conferidos): Backlog, Todo, **In Progress**, **In Review**, Done, Canceled, Duplicate.
  Não existe "Blocked": se a issue travar, comentar o motivo e perguntar ao usuário antes de mudar o status.
- Docker Desktop ligado, depois `pnpm db:up`.

## 1. Spec obtida

`get_issue HRMX-6` (com relações), sem comentários na issue. Não é bloqueada por nenhuma outra; bloqueia a
HRMX-16 (US06, busca de veículos disponíveis por data e local).

## 2. Leitura da spec

| Item | Conteúdo |
|------|----------|
| Contexto | Os campos "Local de retirada" e "Local de devolução" da home precisam de um domínio `Location` (filiais/pontos de retirada) |
| Contrato | Query `locations` → todos os locais (`id`, `name`, `address`, `city`, `state`), sem paginação |
| Regras | `id` (cuid), `name` (string, unique), `address`, `city`, `state` (2 caracteres), `createdAt`, `updatedAt`; ordem por `name` ASC; seed com pelo menos 3 locais em cidades diferentes, idempotente |
| Restrições | Sem CRUD; sem relação com `Vehicle`; módulo criado com `nest generate`, não à mão |
| Stack e padrões | Prisma em `prisma/schema.prisma`; model em `src/locations/location.model.ts`; resolver em `src/locations/locations.resolver.ts` com `PrismaService`; seed no `prisma/seed.ts`; `LocationsModule` no `AppModule` |
| Critérios de aceite | Ver o checklist da etapa 7 |
| Verificação | Testes passando; locais no banco após o seed; comparação com a spec; revisão humana do uso de `nest generate` e da idempotência do seed |

## 3. Planejamento

### Referências no código (coesão e não regressão)

- `src/users/` — módulo, resolver e model (`@ObjectType` com `description`, `@Field(() => ID)`).
- `src/auth/auth.service.spec.ts` — único spec existente; referência de teste com mock.
- `src/app.module.ts` — registro dos módulos de domínio; o `PrismaModule` já é importado ali.
- `prisma/seed.ts` — já faz o seed do admin, que precisa continuar funcionando.
- Convenções do `CLAUDE.md`: GraphQL code-first (`src/schema.gql` gerado ao subir a API), Prisma Client em
  `src/generated/prisma` (não editar), `pnpm db:migrate --name <nome>` sem `--`.

### Decisões

- `id` com `@default(cuid())`, como a spec pede, embora os demais modelos usem uuid (mesma escolha do plano 04).
- `state` como `@db.Char(2)`: limita o tamanho no banco. Não garante exatamente 2 letras, mas a API só lê e o seed
  fornece as siglas corretas.
- Query sem guard: a home é pública.
- Sem relação com `Vehicle` (restrição da spec).
- Independe da US02 (`plans/04-us02-dominio-category.md`). Ambas editam `app.module.ts`, `schema.prisma` e
  `seed.ts`; a que for implementada depois só acrescenta ao que a primeira deixar.
- Nenhuma dependência nova; `package.json` não muda (se mudasse, só via `pnpm add`).

### Divergências entre a spec e o repositório

| Divergência | Tratamento na US05 |
|-------------|--------------------|
| "Mesmo padrão dos outros resolvers" ao injetar `PrismaService`: o `UsersResolver` injeta `UsersService` | Seguir a spec (injeção direta); `src/users/` vale como referência de estilo |
| `pnpm --filter @hermex/api test`: o pacote se chama `api` | Usar `pnpm --filter api test` (como na skill) |
| "Mesmo `seed.ts` de US02": o arquivo já existe, com o seed do admin | Acrescentar ao arquivo atual, com ou sem a US02 |

As divergências são reportadas ao usuário no final; a issue não é editada sem pedido. Qualquer ambiguidade nova
durante a implementação é perguntada antes de assumir.

### ToDo

- [x] Confirmar Docker ligado e subir o banco (`pnpm db:up`)
- [x] Mover a HRMX-6 para **In Progress** (etapa 4)
- [x] Scaffold do módulo, resolver e model com `nest generate`
- [x] Model Prisma e migration `create_locations`
- [x] Model GraphQL
- [x] Resolver com a query `locations`
- [x] Seed dos 3 locais
- [x] Cabeçalhos, JSDoc e Prettier
- [x] Regenerar `schema.gql` e rodar `pnpm codegen`
- [x] Testes do resolver
- [x] Lint, build e typecheck
- [x] Checklist contra a spec
- [x] Mover para **In Review** e comentar na issue
- [x] Commit

## 4. Marcar como "In Progress"

Antes da primeira alteração de código: `save_issue(id: "HRMX-6", state: "In Progress")`.

## 5. Implementação

1. **Scaffold** (em `apps/api`):
   - `pnpm exec nest generate module locations` (registra no `AppModule`)
   - `pnpm exec nest generate resolver locations` (cria resolver e spec)
   - `pnpm exec nest generate class locations/location.model --flat --no-spec` (conferir o nome do arquivo e
     corrigir o nome da classe para `Location`)
2. **Prisma** — `prisma/schema.prisma`:
   ```prisma
   /// Filial/ponto de retirada e devolução de veículos.
   model Location {
     id        String   @id @default(cuid())
     name      String   @unique
     address   String
     city      String
     /// Sigla da UF (ex.: SP).
     state     String   @db.Char(2)
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt

     @@map("locations")
   }
   ```
   Depois `pnpm db:migrate --name create_locations` e `pnpm db:generate`. Conferir que o SQL só cria a tabela e o
   índice único.
3. **Model GraphQL** — `src/locations/location.model.ts`: `@ObjectType` com `id`, `name`, `address`, `city`,
   `state`, `createdAt`, `updatedAt`.
4. **Resolver** — `src/locations/locations.resolver.ts`: injeta `PrismaService` (global, o módulo não precisa
   importar nada); `@Resolver(() => Location)` e `@Query(() => [Location]) locations()` →
   `prisma.location.findMany({ orderBy: { name: 'asc' } })`.
5. **Seed** — `prisma/seed.ts`: função própria, chamada por `main()`, com
   `prisma.location.upsert({ where: { name }, update: {}, create })` para cada local, mantendo o que já existir.
   Atualizar a descrição do cabeçalho. Dados fictícios:

   | name | address | city | state |
   |---|---|---|---|
   | Hermex Belo Horizonte Centro | Av. Exemplo, 100 - Centro | Belo Horizonte | MG |
   | Hermex Rio de Janeiro Centro | Rua Exemplo, 200 - Centro | Rio de Janeiro | RJ |
   | Hermex São Paulo Paulista | Av. Exemplo, 300 - Bela Vista | São Paulo | SP |

6. **Padrões** — cabeçalho e JSDoc nos arquivos novos; "Data Atualização" nos editados (`app.module.ts`, incluindo
   a descrição, `schema.prisma`, `seed.ts`); imports no estilo do projeto (ajustar o que o CLI gerar); Prettier.
7. **Schema e front** — subir a API para regenerar `src/schema.gql`; `pnpm codegen` atualiza `apps/web/src/gql/`.

## 6. Testes

- `src/locations/locations.resolver.spec.ts` (substituir o conteúdo gerado), instanciando
  `new LocationsResolver(prismaMock)`:
  - chama `findMany` com `orderBy: { name: 'asc' }` e devolve a lista;
  - devolve lista vazia quando não há locais.
- Executar `pnpm --filter api test`.
- Se um teste existente quebrar por causa desta mudança: analisar as causas e **perguntar antes de corrigir**.

## 7. Conferência contra a spec

- `pnpm --filter api lint`, `pnpm build:api` e também `pnpm typecheck` (cobre o web após o codegen).
- `pnpm db:seed` duas vezes sem erro; consultar o banco (3 linhas em `locations`, 3 cidades); `pnpm db:studio`
  para a conferência visual.
- `pnpm dev:api` e `{ locations { id name address city state } }` em `http://localhost:4000/graphql`. Ordem
  esperada: Belo Horizonte, Rio de Janeiro, São Paulo.

Checklist (marcar item a item):

- [x] query `locations` retorna lista com `id`, `name`, `address`, `city`, `state`
- [x] locais ordenados por nome
- [x] seed cria pelo menos 3 locais em cidades diferentes
- [x] seed roda várias vezes sem duplicatas
- [x] módulo importado e funcionando no `AppModule`
- [x] regras: campos do modelo conforme a spec, `name` unique, `state` com 2 caracteres
- [x] restrições: sem CRUD, sem relação com `Vehicle`, scaffold via `nest generate`
- [x] itens não atendidos listados (nenhum)

## 8. Marcar como "In Review"

Somente com testes, lint, build e checklist ok e sem dúvidas em aberto:

- `save_issue(id: "HRMX-6", state: "In Review")`
- `save_comment(issueId: "HRMX-6", body: ...)` com: resumo do que foi implementado, arquivos principais, checklist
  dos critérios de aceite e instruções de verificação (comandos e query).

## 9. Commit e próximos passos

- Commit na `aula-3`: `feat(api): cria domínio Location com query locations e seed`.
- Push e PR (`aula-3` → `aula-2`) só se o usuário pedir.
- "Done" depois do merge: não há integração Linear↔GitHub confirmada, então conferir o status após o merge e
  atualizar manualmente se necessário.
