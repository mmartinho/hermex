# Plano — US05: criar o domínio Location (HRMX-6)

> **Status: APROVADO, NÃO IMPLEMENTADO** — a implementação só começa quando o usuário pedir.
> Branch: `aula-3`.

## Contexto

A barra de busca da home tem os campos "Local de retirada" e "Local de devolução". Falta na API um domínio
`Location` com as filiais da locadora. A HRMX-6 bloqueia a HRMX-16 (busca por data e local). Entrega: modelo
Prisma, migration, seed idempotente e a query pública `locations` ordenada por nome. Sem CRUD, sem relação com
`Vehicle` e sem campos extras.

## Ao aprovar este plano

Apenas salvá-lo em `plans/05-us05-dominio-location.md` (decisão do usuário). Sem implementar, commitar ou enviar.

## Decisões

- `id` com `@default(cuid())`, como a spec pede (mesma escolha do plano 04; os modelos atuais usam uuid).
- `state` como `@db.Char(2)`: limita o tamanho no banco. A API só lê, e o seed fornece as siglas corretas.
- Query sem guard: a home é pública.
- Independe da US02 (`plans/04-us02-dominio-category.md`, ainda não implementada). Ambas editam `app.module.ts`,
  `schema.prisma` e `seed.ts`; a segunda só acrescenta ao que a primeira deixar.
- A referência de estilo é `apps/api/src/users/`. Os "outros resolvers" citados na spec que injetam
  `PrismaService` não existem hoje (o `UsersResolver` usa `UsersService`); segue-se a spec: injeção direta.

## ToDo

Caminhos relativos a `apps/api`.

1. **Pré-requisito:** Docker Desktop ligado (daemon parado), depois `pnpm db:up`.
2. **Scaffold** (a spec exige `nest generate`):
   - `pnpm exec nest generate module locations` (registra no `AppModule`)
   - `pnpm exec nest generate resolver locations` (cria resolver e spec)
   - `pnpm exec nest generate class locations/location.model --flat --no-spec` (conferir o nome do arquivo e
     corrigir o nome da classe para `Location`)
3. **Prisma** — `prisma/schema.prisma`:
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
   Depois `pnpm db:migrate --name create_locations` e `pnpm db:generate`. Conferir que o SQL só cria tabela e índice.
4. **Model GraphQL** — `src/locations/location.model.ts`: `@ObjectType` com `id` (`ID`), `name`, `address`, `city`,
   `state`, `createdAt`, `updatedAt`, no padrão de `src/users/models/user.model.ts`.
5. **Resolver** — `src/locations/locations.resolver.ts`: injeta `PrismaService` (global, sem import no módulo);
   `@Resolver(() => Location)` e `@Query(() => [Location]) locations()` →
   `prisma.location.findMany({ orderBy: { name: 'asc' } })`.
6. **Seed** — `prisma/seed.ts`: função própria chamada por `main()`, com
   `prisma.location.upsert({ where: { name }, update: {}, create })`, mantendo o que já existe. Dados fictícios:

   | name | address | city | state |
   |---|---|---|---|
   | Hermex Belo Horizonte Centro | Av. Exemplo, 100 - Centro | Belo Horizonte | MG |
   | Hermex Rio de Janeiro Centro | Rua Exemplo, 200 - Centro | Rio de Janeiro | RJ |
   | Hermex São Paulo Paulista | Av. Exemplo, 300 - Bela Vista | São Paulo | SP |

7. **Teste** — substituir o conteúdo do spec gerado, no padrão de `src/auth/auth.service.spec.ts`
   (`new LocationsResolver(prismaMock)`): chama `findMany` com `orderBy: { name: 'asc' }` e devolve a lista;
   devolve lista vazia quando não há locais.
8. **Padrões:** cabeçalho e JSDoc nos arquivos novos; "Data Atualização" e descrição nos editados
   (`app.module.ts`, `schema.prisma`, `seed.ts`); imports no estilo do projeto; Prettier.
9. **Schema e front:** subir a API para regenerar `src/schema.gql`; rodar `pnpm codegen`.

Se um teste existente quebrar por causa desta mudança, analisar a causa e perguntar antes de corrigir.

## Verificação

- `pnpm test:api`, `pnpm lint`, `pnpm typecheck`, `pnpm build`.
- `pnpm db:seed` duas vezes sem erro; `locations` continua com 3 linhas, em 3 cidades.
- `pnpm dev:api` e `{ locations { id name address city state } }` em `http://localhost:4000/graphql`, em ordem
  de nome.
- Checklist final, item a item: critérios de aceite, regras e restrições da HRMX-6, incluindo o uso de
  `nest generate` e a lista do que não foi atendido.
