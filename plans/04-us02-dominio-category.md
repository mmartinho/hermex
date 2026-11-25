# Plano — US02: criar o domínio Category (HRMX-5)

> **Status: PLANEJADO, NÃO IMPLEMENTADO** — revisado em 2026-11-25 conforme o workflow da skill
> `/plan-backend-issue-from-linear`. A implementação só começa quando o usuário pedir.
> Branch: `aula-3` (criada a partir da `aula-2`).
> Issue: [HRMX-5](https://linear.app/mmartinho/issue/HRMX-5) — Backlog, prioridade High, milestone Backend.

## 0. Pré-requisitos

- MCP do Linear disponível (conferido).
- Estados do Hermex Team (conferidos): Backlog, Todo, **In Progress**, **In Review**, Done, Canceled, Duplicate.
  Não existe "Blocked": se a issue travar, comentar o motivo e perguntar ao usuário antes de mudar o status.
- Docker Desktop ligado, depois `pnpm db:up`.

## 1. Spec obtida

`get_issue HRMX-5` (com relações), sem comentários na issue. Não é bloqueada por nenhuma outra; bloqueia a
HRMX-12 (US01, relação `Vehicle → Category`) e a HRMX-14 (US03, filtro por categoria).

## 2. Leitura da spec

| Item | Conteúdo |
|------|----------|
| Contexto | O dropdown "Selecione a categoria" da home precisa de um domínio `Category` (modelo, módulo e query) |
| Contrato | Query `categories` → todas as categorias (`id`, `name`), sem paginação |
| Regras | `id` (cuid), `name` (string, unique), `createdAt`, `updatedAt`; ordem por `name` ASC; seed idempotente com Hatch, Sedan, SUV, Minivan, Picape |
| Restrições | Sem CRUD; sem campos extras; módulo criado com `nest generate`, não à mão |
| Stack e padrões | Prisma em `prisma/schema.prisma`; model em `src/categories/category.model.ts`; resolver em `src/categories/categories.resolver.ts` com `PrismaService`; seed em `prisma/seed.ts`; `CategoriesModule` no `AppModule` |
| Critérios de aceite | Ver o checklist da etapa 7 |
| Verificação | Testes passando; categorias no banco após o seed; comparação com a spec; revisão humana do uso de `nest generate` |

## 3. Planejamento

### Referências no código (coesão e não regressão)

- `src/users/` — módulo, resolver e model (`@ObjectType` com `description`, `@Field(() => ID)`).
- `src/auth/auth.service.spec.ts` — único spec existente; referência de teste com mock.
- `src/app.module.ts` — registro dos módulos de domínio; o `PrismaModule` já é importado ali.
- `prisma/seed.ts` — já faz o seed do admin, que precisa continuar funcionando.
- Convenções do `CLAUDE.md`: GraphQL code-first (`src/schema.gql` gerado ao subir a API), Prisma Client em
  `src/generated/prisma` (não editar), `pnpm db:migrate --name <nome>` sem `--`.

### Decisões

- `id` com `@default(cuid())`, como a spec pede, embora os demais modelos usem uuid.
- Query sem guard: a home é pública.
- Sem relação com `Vehicle` (é da HRMX-12).
- Nenhuma dependência nova; `package.json` não muda (se mudasse, só via `pnpm add`).

### Divergências entre a spec e o repositório

| Divergência | Tratamento na US02 |
|-------------|--------------------|
| `VehiclesResolver`, citado como padrão, não existe (só há o model Prisma `Vehicle`) | Usar `src/users/` como referência |
| `pnpm --filter @hermex/api test`: o pacote se chama `api` | Usar `pnpm --filter api test` (como na skill) |
| `Vehicle` não tem `available`, citado nas HRMX-12/14 | Não afeta a US02; reportar |
| HRMX-14 cita `localhost:3001`; a API usa a porta 4000 | Não afeta a US02; reportar |

As divergências são reportadas ao usuário no final; as issues não são editadas sem pedido. Qualquer ambiguidade
nova durante a implementação é perguntada antes de assumir.

### ToDo

- [ ] Confirmar Docker ligado e subir o banco (`pnpm db:up`)
- [ ] Mover a HRMX-5 para **In Progress** (etapa 4)
- [ ] Scaffold do módulo, resolver e model com `nest generate`
- [ ] Model Prisma e migration `create_categories`
- [ ] Model GraphQL
- [ ] Resolver com a query `categories`
- [ ] Seed das 5 categorias
- [ ] Testes do resolver
- [ ] Cabeçalhos, JSDoc e Prettier
- [ ] Regenerar `schema.gql` e rodar `pnpm codegen`
- [ ] Testes, lint, typecheck e build
- [ ] Checklist contra a spec
- [ ] Commit
- [ ] Mover para **In Review** e comentar na issue

## 4. Marcar como "In Progress"

Antes da primeira alteração de código: `save_issue(id: "HRMX-5", state: "In Progress")`.

## 5. Implementação

1. **Scaffold** (em `apps/api`):
   - `pnpm exec nest generate module categories` (registra no `AppModule`)
   - `pnpm exec nest generate resolver categories` (cria resolver e spec)
   - `pnpm exec nest generate class categories/category.model --flat --no-spec` (conferir o nome do arquivo e
     corrigir o nome da classe para `Category`)
2. **Prisma** — `prisma/schema.prisma`:
   ```prisma
   /// Categoria de veículo (ex.: SUV, Sedan).
   model Category {
     id        String   @id @default(cuid())
     name      String   @unique
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt

     @@map("categories")
   }
   ```
   Depois `pnpm db:migrate --name create_categories` e `pnpm db:generate`. Conferir que o SQL só cria a tabela e
   o índice único.
3. **Model GraphQL** — `src/categories/category.model.ts`: `@ObjectType` com `id`, `name`, `createdAt`,
   `updatedAt`.
4. **Resolver** — `src/categories/categories.resolver.ts`: injeta `PrismaService` (global, o módulo não precisa
   importar nada); `@Resolver(() => Category)` e `@Query(() => [Category]) categories()` →
   `prisma.category.findMany({ orderBy: { name: 'asc' } })`.
5. **Seed** — `prisma/seed.ts`: função própria, chamada por `main()`, com
   `prisma.category.upsert({ where: { name }, update: {}, create: { name } })` para cada categoria, mantendo o
   seed do admin. Atualizar a descrição do cabeçalho.
6. **Padrões** — cabeçalho e JSDoc nos arquivos novos; "Data Atualização" nos editados (`app.module.ts`, incluindo
   a descrição, `schema.prisma`, `seed.ts`); imports no estilo do projeto (ajustar o que o CLI gerar); Prettier.
7. **Schema e front** — subir a API para regenerar `src/schema.gql`; `pnpm codegen` atualiza `apps/web/src/gql/`.

## 6. Testes

- `src/categories/categories.resolver.spec.ts` (substituir o conteúdo gerado), instanciando
  `new CategoriesResolver(prismaMock)`:
  - chama `findMany` com `orderBy: { name: 'asc' }` e devolve a lista;
  - devolve lista vazia quando não há categorias.
- Executar `pnpm --filter api test`.
- Se um teste existente quebrar por causa desta mudança: analisar as causas e **perguntar antes de corrigir**.

## 7. Conferência contra a spec

- `pnpm --filter api lint`, `pnpm build:api` e também `pnpm typecheck` (cobre o web após o codegen).
- `pnpm db:seed` duas vezes sem erro; consultar o banco (5 linhas em `categories`); `pnpm db:studio` para a
  conferência visual.
- `pnpm dev:api` e `{ categories { id name } }` em `http://localhost:4000/graphql`. Ordem esperada: Hatch,
  Minivan, Picape, Sedan, SUV (confirmar, pois depende da collation do Postgres).

Checklist (marcar item a item):

- [ ] query `categories` retorna lista com `id` e `name`
- [ ] categorias ordenadas por nome
- [ ] seed cria as 5 categorias
- [ ] seed roda várias vezes sem erro nem duplicata
- [ ] módulo importado e funcionando no `AppModule`
- [ ] regras: campos do modelo conforme a spec, `name` unique, seed idempotente
- [ ] restrições: sem CRUD, sem campos extras, scaffold via `nest generate`
- [ ] itens não atendidos listados (se houver)

## 8. Marcar como "In Review"

Somente com testes, lint, build e checklist ok e sem dúvidas em aberto:

- `save_issue(id: "HRMX-5", state: "In Review")`
- `save_comment(issueId: "HRMX-5", body: ...)` com: resumo do que foi implementado, arquivos principais, checklist
  dos critérios de aceite e instruções de verificação (comandos e query).

## 9. Commit e próximos passos

- Commit na `aula-3`: `feat(api): cria domínio Category com query categories e seed`.
- Push e PR (`aula-3` → `aula-2`) só se o usuário pedir.
- "Done" depois do merge: não há integração Linear↔GitHub confirmada, então conferir o status após o merge e
  atualizar manualmente se necessário.
