---
name: plan-backend-issue-from-linear 
description: Planeja e executa uma issue de backend de ponta a ponta a partir do Linear, atualizando o status da issue conforme evolui. Use quando o usuário passar um id ou link de issue do Linear descrevendo trabalho no backend (endpoints, regras, stack, critérios de aceite). 
---

# Planejar Issue do Backend

Fluxo de desenvolvimento para buscar uma Issue no Linear e entregá-la pronta, testada e verificada contra a spec.

> **O fluxo tem duas fases separadas por uma aprovação do usuário:**
>
> 1. **Planejamento (passos 0–3):** só leitura (Linear, código, banco) e escrita do arquivo de plano em `plans/`. **Nenhum arquivo de código, schema, migration ou seed é criado ou alterado**, nenhum comando que modifique o projeto ou o banco é executado (`nest generate`, `db:migrate`, `pnpm add`...) e o status da issue **não muda**.
> 2. **Execução (passos 4–9):** só começa depois de o usuário **aprovar explicitamente** o plano no chat ("aprovado", "pode implementar"...). Perguntas, comentários ou pedidos de ajuste no plano **não** contam como aprovação: ajuste o plano e peça aprovação de novo.

## 0. Pré-requisitos 

- MCP do Linear disponível no projeto (`mcp__linear-server__*`) 
- Antes de mover status, confira os nomes válidos no time com `mcp__linear-server__list_issue_statuses`. Os nomes podem variar (ex.: "In Progress", "Em andamento", "In Review", "Code Review", "Done").

## 1. Obter a spec 

- Use `mcp__linear-server__get_issue` com o id/identifier (ex.: `HRMX-12`) para buscar a issue. 
- Se o usuário passou apenas um link, extraia o identifier da URL.

## 2. Ler a spec 

Extrair a spec:
- Contexto
- Query / endpoints / contratos
- Regras de negócio
- Restrições
- Stack e padrões
- Critérios de Aceite
- Plano de verificação

## 3. Planejar (escrever o plano e PARAR)

- Escreva o plano em `plans/NN-usXX-<slug>.md` (NN = próximo número em `plans/`), no mesmo formato dos planos anteriores (ex.: `plans/06-us01-campos-vehicle.md`): cabeçalho com **Status: AGUARDANDO APROVAÇÃO**, branch e issue; seções numeradas seguindo os passos desta skill (pré-requisitos, spec obtida, leitura da spec em tabela, planejamento com referências no código, **divergências spec × repositório**, decisões do usuário, decisões técnicas, ToDo, implementação, testes, conferência contra a spec, status e commit).
- O plano deve listar os arquivos/módulos que serão criados ou alterados, as mudanças de schema Prisma e migrations (e se são seguras para os dados existentes), o impacto no `schema.gql`/codegen do front e os testes previstos.
- Divergências ou ambiguidades: pergunte ao usuário (AskUserQuestion) **durante o planejamento** e registre as respostas em "Decisões do usuário".
- Antes de finalizar o planejamento, releia as specs e garanta que o plano:
  - não cria regressão
  - não cria pattern / design / estilo desalinhado com o projeto
  - segue exemplos parecidos (ex.: módulo `users`, `categories`) para manter coesão
- Revise o `CLAUDE.md` para convenções específicas do backend (NestJS code-first, Prisma em `src/generated/prisma/`, `nest generate`, etc).
- **Pare aqui.** Apresente ao usuário um resumo do plano (caminho do arquivo, decisões e divergências) e **peça aprovação**. Não edite código, não rode comandos que alterem o projeto ou o banco e não mova o status da issue enquanto não houver aprovação explícita.
- Aprovado: mude o cabeçalho do plano para **Status: APROVADO** (com a data) e siga para o passo 4. Ao final, marque **IMPLEMENTADO** e os itens da ToDo/checklist, como nos planos anteriores.

## 4. Marcar como "In Progress" no Linear 

**Só depois da aprovação do plano** e antes de começar a codar, **atualize o status** da issue:  
mcp__linear-server__save_issue(id: "HRMX-XX", state: "In Progress") 
Se o time usa outro nome para esse estado (confirmado no passo 0), use-o.

## 5. Implementar 

- Respeite a stack e o plano aprovado. Se surgir algo que obrigue a desviar do plano (novo módulo, mudança de contrato GraphQL, migration diferente, regressão), **pare e pergunte**, depois registre o desvio no plano.
- Crie a ToDo list (TodoWrite) a partir da seção ToDo do plano.
- Use `nest generate` (rodado a partir de `apps/api`) para novos módulos/resolvers/services — nunca crie manualmente. 
- Nunca edite `package.json` à mão — use `pnpm add`/`pnpm install`. 
- Atualize a ToDo list conforme avança.

## 6. Testar 
 
- Escreva e execute os testes relacionados (`pnpm --filter api test`). 
- Se um teste existente quebrar, verifique se foi causado por esse desenvolvimento. Se sim, analise possíveis causas e **PERGUNTE** antes de resolver — talvez uma regra de negócio não prevista precise ser adicionada.

## 7. Conferir contra a spec 
 
- Escreva um checklist com os critérios de aceite e valide um por um. 
- Rode lint (`pnpm --filter api lint`) e build (`pnpm build:api`) antes de seguir.


## 8. Marcar como "In Review" no Linear 

Quando o código estiver pronto, testes passando e critérios de aceite validados, **mova o status para review**: 
mcp__linear-server__save_issue(id: "HRMX-XX", state: "In Review") 

Adicione um comentário resumindo o que foi entregue: 
mcp__linear-server__save_comment(issueId: "HRMX-XX", body: "...") 

O comentário deve conter: 
- resumo curto do que foi implementado 
- arquivos principais tocados 
- checklist dos critérios de aceite marcados 
- instruções de verificação (comando pra rodar, endpoint pra testar)

## 9. Commit e próximos passos 

- Faça commit seguindo conventional commits em pt-BR (ex.: `feat(api): ...`). 
- Se o usuário pedir, abra o PR — o merge move a issue para "Done" automaticamente via integração Linear↔GitHub (se configurada). Caso não tenha integração, atualize o status manualmente após o merge.

## Regras de ouro 

- **Plano antes, código depois da aprovação**: nenhuma linha de código, migration ou `nest generate` antes de o usuário aprovar o plano em `plans/`.
- **Nunca pule atualizações de status**: in progress ao começar a codar (após a aprovação), in review quando entregar. 
- **Um status por vez**: se descobrir que a issue está bloqueada, mova para "Blocked"/"Canceled" com comentário explicando. 
- Se algo na spec for ambíguo, **pergunte antes** de assumir — não mude o status pra review com dúvidas em aberto.