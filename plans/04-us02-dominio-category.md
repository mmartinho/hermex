# Plano — US02: criar o domínio Category (HRMX-5)

> **Status: APROVADO, NÃO IMPLEMENTADO** — a implementação só começa quando o usuário pedir.
> Branch: `aula-3` (criada a partir da `aula-2`).

## Contexto

O dropdown "Selecione a categoria" da home precisa de um domínio `Category` na API. A HRMX-5 bloqueia a
HRMX-12 (relação `Vehicle → Category`) e a HRMX-14 (filtro por categoria). Entrega: modelo Prisma, migration,
seed idempotente e a query pública `categories` ordenada por nome. Sem CRUD, sem campos extras e sem relação com
`Vehicle` (isso é da HRMX-12).

## Decisões

- Implementar na branch `aula-3` (decisão do usuário).
- `id` com `@default(cuid())`, como a spec pede, embora os demais modelos usem uuid (padrão assumido).
- Query sem guard: a home é pública.

## Divergências encontradas nas specs

- `VehiclesResolver` e a query `vehicles`, citados como existentes, **não existem** em nenhuma branch (só há o
  model Prisma `Vehicle`). Para a US02, a referência de estilo é `src/users/` (resolver, model, module).
- `Vehicle` não tem o campo `available`, citado nas HRMX-12 e HRMX-14.
- A HRMX-14 cita `localhost:3001`; a API usa a porta 4000.

Não afetam a US02, mas precisam ser resolvidas antes das HRMX-12/14. Vou reportar no final, sem editar o Linear.

## ToDo

1. **Pré-requisito:** Docker Desktop ligado (o daemon está parado), depois `pnpm db:up`.
2. **Scaffold** em `apps/api` (a spec exige `nest generate`):
   - `pnpm exec nest generate module categories` (registra no `AppModule`)
   - `pnpm exec nest generate resolver categories` (cria resolver e spec)
   - `pnpm exec nest generate class categories/category.model --flat --no-spec` (model, também via CLI; conferir o
     nome do arquivo e corrigir o nome da classe para `Category`)
3. **Prisma** — `prisma/schema.prisma`: adicionar
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
   Depois `pnpm db:migrate --name create_categories` e `pnpm db:generate`. A migration só cria tabela e índice;
   conferir o SQL.
4. **Model GraphQL** — `src/categories/category.model.ts`: `@ObjectType` com `@Field(() => ID) id`, `name`,
   `createdAt`, `updatedAt`, no padrão de `src/users/models/user.model.ts`.
5. **Resolver** — `src/categories/categories.resolver.ts`: injeta `PrismaService` (global via `PrismaModule`, o
   módulo não precisa importar nada); `@Resolver(() => Category)` e
   `@Query(() => [Category]) categories()` → `prisma.category.findMany({ orderBy: { name: 'asc' } })`.
6. **Seed** — `prisma/seed.ts`: lista Hatch, Sedan, SUV, Minivan, Picape com
   `prisma.category.upsert({ where: { name }, update: {}, create: { name } })`, em função própria chamada por
   `main()`, mantendo o seed do admin. Atualizar a descrição do cabeçalho.
7. **Teste** — substituir o conteúdo do spec gerado, no padrão de `src/auth/auth.service.spec.ts`
   (`new CategoriesResolver(prismaMock)`): chama `findMany` com `orderBy: { name: 'asc' }` e devolve a lista;
   devolve lista vazia quando não há categorias.
8. **Padrões:** cabeçalho e JSDoc nos arquivos novos, "Data Atualização" nos editados (`app.module.ts`,
   `schema.prisma`, `seed.ts`); imports no estilo do projeto (ajustar o que o CLI gerar); Prettier.
9. **Schema e front:** subir a API para regenerar `src/schema.gql`; rodar `pnpm codegen` para atualizar
   `apps/web/src/gql/`.

Se um teste existente quebrar por causa desta mudança, analiso a causa e pergunto antes de corrigir.

## Verificação

- `pnpm test:api`, `pnpm lint`, `pnpm typecheck`, `pnpm build`.
- `pnpm db:seed` duas vezes sem erro; contar 5 linhas em `categories` (consulta no banco; `pnpm db:studio` fica
  para a conferência visual).
- `pnpm dev:api` e `{ categories { id name } }` em `http://localhost:4000/graphql`: 5 itens na ordem Hatch,
  Minivan, Picape, Sedan, SUV (confirmar a ordem real, que depende da collation do Postgres).
- Checklist final, item a item: critérios de aceite, regras e restrições da HRMX-5, incluindo o uso de
  `nest generate` e a lista do que não foi atendido.
