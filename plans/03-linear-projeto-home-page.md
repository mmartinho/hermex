# Plano — Sincronizar o épico EP01 (Página Home) com o Linear

> **Status: EXECUTADO** (2026-11-23) — projeto atualizado e 15 issues criadas no Linear.
> Branch: `aula-1`.
>
> **Escopo pedido pelo usuário:**
> 1. Atualizar o projeto Linear **Home Page** com a descrição de `docs/epicos/EP01-pagina-home.md`.
> 2. Criar uma issue por story (`docs/stories/backend/*` e `docs/stories/frontend/*`), com título no padrão `USNN`
>    (igual aos arquivos locais), na milestone certa (já criadas no Linear: Backend e Frontend).

## Resultado

Projeto: [Home Page](https://linear.app/mmartinho/project/home-page-054293e79170) (`P-HRMX-1`).

| Story | Issue | Milestone | Prioridade | Bloqueada por |
|-------|-------|-----------|------------|---------------|
| US01 | HRMX-12 | Backend | High | US02 |
| US02 | HRMX-5 | Backend | High | — |
| US03 | HRMX-14 | Backend | High | US01, US02 |
| US04 | HRMX-15 | Backend | Medium | US03 |
| US05 | HRMX-6 | Backend | Medium | — |
| US06 | HRMX-16 | Backend | Medium | US03, US05 |
| US07 | HRMX-7 | Frontend | High | — |
| US08 | HRMX-8 | Frontend | High | — |
| US09 | HRMX-9 | Frontend | High | — |
| US10 | HRMX-10 | Frontend | High | — |
| US11 | HRMX-11 | Frontend | High | — |
| US12 | HRMX-13 | Frontend | High | US07, US08, US09, US10, US11 |
| US13 | HRMX-17 | Frontend | High | US04, US12 |
| US14 | HRMX-18 | Frontend | Medium | US03, US13 |
| US15 | HRMX-19 | Frontend | Medium | US06, US13 |

Os números `HRMX-n` não acompanham o número da story porque as issues foram criadas em ordem topológica (cada
uma depois das que a bloqueiam). Todas estão em Backlog, com labels `backend`/`frontend` + `Feature`.

## Estado do Linear antes da execução (levantado via MCP)

| Item | Valor |
|------|-------|
| Projeto | **Home Page** — `P-HRMX-1`; descrição original "Home page do Hermex", summary vazio |
| Status / prioridade | Backlog / Urgent (não alterados) |
| Time | **Hermex Team** (`HRMX`) |
| Milestone Backend | `e48bfb50-d5c4-4377-a26a-723caf88c338` |
| Milestone Frontend | `82b7bd25-40bd-4de0-b18f-7d4e02c2676d` (renomeada pelo usuário de "Fontend") |
| Issues no projeto | nenhuma |
| Labels do time | `backend`, `frontend`, `Feature`, `Bug`, `Improvement` |

As milestones são referenciadas **pelo ID**, para não depender de renomeações.

## Ferramentas MCP Linear usadas

| Ferramenta | Uso |
|------------|-----|
| `get_project` (`includeMilestones`) | Levantar projeto e milestones; verificação final |
| `list_issues` | Checar duplicatas antes de criar; verificação final |
| `save_project` | Fase 1 (`summary`, `description`, `links`); fases 3 e 5 (`patch`) |
| `save_issue` | Criar as 15 issues (`team`, `project`, `milestone`, `title`, `description`, `priority`, `labels`, `blockedBy`, `state`); fase 5 (título e `patch` da descrição) |
| `get_issue` (`relations`) | Conferir as relações de dependência |

## Convenções de mapeamento

- **Título:** `USNN — <título>` (ex.: `US01 — Adicionar campos category, imageUrl e transmission ao Vehicle`).
  O título da US01 segue o do épico (inclui `transmission`); o H1 do arquivo local não foi alterado.
- **Descrição:** conteúdo integral do `.md` da story **sem o H1**, com o link relativo do épico trocado pelo link
  do projeto no Linear. Referências a outras stories no texto usam `USNN`.
- **Milestone:** `backend/` → Backend; `frontend/` → Frontend.
- **Prioridade:** Alta → `2` (High); Média → `3` (Medium).
- **Dependências:** relação `blockedBy`, conforme a tabela do épico.
- Sem responsável, estimativa nem ciclo (não pedido).

## Fases executadas

1. **Projeto:** `save_project` com `summary`, `description` (EP01 sem o H1) e link do Figma em Resources.
   Status, prioridade, lead, datas e time não foram alterados.
2. **Issues**, em 6 levas conforme as dependências:
   `US02, US05, US07–US11` → `US01, US12` → `US03` → `US04, US06` → `US13` → `US14, US15`.
   Antes de começar, `list_issues` confirmou que não havia issues no projeto.
3. **Ligação projeto ↔ issues:** `patch` na descrição do projeto trocando o ID de cada linha da tabela de stories
   pelo identificador da issue (renderizado como link clicável).
4. **Verificação:** 15 issues com milestone, prioridade, labels e status conforme a tabela; relações `blockedBy`
   conferidas por amostragem em US06, US12 e US13.
5. **Ajuste de formato (a pedido do usuário):** os títulos criados como `US-NN` foram trocados para `USNN`, e
   `US-` virou `US` nas descrições das issues e do projeto (`patch` com `replace_all`).

## Decisões do usuário

1. **Formato do título:** inicialmente `US-NN`; trocado para `USNN` para ficar parecido com as stories locais.
2. **Milestone:** renomeada por ele no servidor para "Frontend".
3. **Título da US01:** mantido o do épico, com `transmission`.

## Pontos de atenção

1. **Fonte da verdade:** as specs agora existem no repo e no Linear. Sugestão: tratar o repo como fonte da verdade
   Cada `.md` de story recebeu a linha `**Linear:** [HRMX-n](...)` logo após a prioridade (feito a pedido do usuário).
2. **Edição futura:** qualquer mudança numa spec local precisa ser replicada manualmente na issue (não há sincronização
   automática).
