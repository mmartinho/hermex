# Plano — US07: organismo Header (HRMX-7)

> **Status: IMPLEMENTADO** em 2026-11-26 (commit `8b80f1f`; plano aprovado na mesma data), conforme o workflow da skill `/plan-frontend-issue-from-linear`.
> Branch: `aula-4` (a atual; sem branch nova).
> Issue: [HRMX-7](https://linear.app/mmartinho/issue/HRMX-7) — **In Review**, prioridade High, milestone Frontend, projeto Home Page.
>
> **Nota:** uma primeira implementação foi feita antes deste plano, fora do fluxo, e guardada em `git stash`.
> Após a aprovação ela foi reaplicada (conferida contra o plano) e verificada novamente.

## 0. Pré-requisitos

- MCP do Linear disponível (conferido).
- Estados do Hermex Team (conferidos): Backlog, Todo, **In Progress**, **In Review**, Done, Canceled, Duplicate.
- MCP do Figma disponível; skill `figma:figma-design-to-code` carregada antes de `get_design_context`.

## 1. Spec obtida

`get_issue HRMX-7` (com relações), sem comentários e sem anexos. Bloqueia a HRMX-13 (US12 — template HomePage).
A issue não tem link do Figma. Design (link informado pelo usuário): arquivo "Hermex | Locadora de veículos",
componente **Header** (node `66:997`) — [variantes do Header no Figma](https://www.figma.com/design/xH1Iw9FAFUBUN28zYdWBJH/Hermex-%7C-Locadora-de-ve%C3%ADculos?node-id=66-997&t=5dAGKj56HlhQb6Og-4).

## 2. Leitura da spec

| Item | Conteúdo |
|------|----------|
| Contexto | Header no topo de todas as páginas: logo, busca textual e links de navegação |
| Telas/estados | Só o estado deslogado; sem loading/erro/vazio (componente presentacional, sem dados) |
| Componentes | Reaproveitar `Logo`, campo de busca e `NavLink`; **não criar componentes novos** |
| Integrações | Nenhuma: sem fetch, sem lógica de auth (mostrar/esconder login), sem lógica de busca |
| Responsividade | Não quebrar em telas pequenas; no mobile a busca pode sumir ou virar ícone; links mantidos |
| Restrições | Sem `position: fixed`/`sticky` |
| Stack e padrões | `organisms/Header.tsx`, barrel `organisms/index.ts`, `Header.stories.tsx`, tokens de `globals.css` |
| Critérios de aceite | Ver o checklist da etapa 8 |
| Verificação | Navegador (`pnpm dev:web`), Storybook, comparação com o Figma, lista de itens não atendidos |

## 3. Design (Figma)

Variantes do Header: <https://www.figma.com/design/xH1Iw9FAFUBUN28zYdWBJH/Hermex-%7C-Locadora-de-ve%C3%ADculos?node-id=66-997&t=5dAGKj56HlhQb6Og-4>

Componente **Header** (`66:997`) com seis variantes: 1920/768/360 × Deslogado/Logado. Lidas com
`get_design_context` as três deslogadas:

| Variante | Node | Layout |
|----------|------|--------|
| 1920 Deslogado | `29:191` | Uma linha, `justify-between`, `px 360` / `py 16`, altura ≈ 92px. Logo 180×60. Busca com a largura do conteúdo. Links Cadastro → Login com `gap 24`, sem padding |
| 768 Deslogado | `88:939` | Uma linha, `px 60` / `py 16`. Logo 120×40. Links como "Botão fantasma" (`px 16` / `py 12`, `gap 8`), na ordem Login → Cadastro |
| 360 Deslogado | `88:1137` | Duas linhas, `p 16`, `gap 16`: logo 120×40 + links na 1ª linha; busca em largura total na 2ª. Links como "Botão fantasma small": ícone 16px sobre o rótulo em `body-xs` (10px) |

Tokens usados: fundo `neutral-white`, texto `neutral-text`, borda do campo `neutral-details`, tipografia `body-md`/`body-xs`.

### Mapeamento design → código existente

| Elemento do Figma | Componente |
|-------------------|------------|
| "Hermex logo 1" | átomo `Logo` (variant `default`) |
| "Campo de busca" (`5:34`) | molécula `IconInput` (tom `neutral`, ícone `search`) — o plano 02 já o mapeou como "Busca do header" |
| Links / "Botão fantasma" | molécula `NavLink` com ícone |

## 4. Planejamento

### Referências no código (coesão e não regressão)

- `organisms/Header.tsx` — já existe (versão do bootstrap, com a prop `actions`), será **refeito**.
- `templates/PublicTemplate.tsx` — passa o link "Entrar" (destaque) em `actions`; `showLogin={false}` na `/login`.
- `templates/PrivateTemplate.tsx` — passa o `UserMenu` (sob `Suspense`) em `actions` e `homeHref="/dashboard"`.
- `lib/cn.ts` — só concatena classes (não faz *merge* do Tailwind): para sobrescrever classes do `NavLink`/`Logo`
  é preciso usar variantes responsivas (`max-lg:`, `max-md:`), que o Tailwind gera depois das classes base.

### Divergências entre a spec, o Figma e o repositório

| Divergência | Tratamento |
|-------------|------------|
| Spec: fundo `brand-secondary-pure` (#1D2F40). Figma: `neutral-white` | **Seguir o Figma** (decisão do usuário) |
| Spec: logo invertido. Figma: logo padrão | **Seguir o Figma** |
| Spec: ícone `person_add` no Cadastro. Figma: `account_circle` | **Seguir o Figma** |
| Spec: no mobile a busca pode sumir. Figma 360: busca na 2ª linha | Seguir o Figma (a spec permite) |
| Figma 768/360: ordem Login → Cadastro; 1920 e spec: Cadastro → Login | Manter **Cadastro → Login** em todos os tamanhos |
| `TextField variant="outlined"` não existe | Usar `IconInput` (tom `neutral`) |
| `Logo variant="inverted"` não existe (é `inverse`) | Irrelevante após seguir o Figma: `Logo` padrão |
| Token `brand-secondary-pure` não existe (é `secondary`) | Irrelevante após seguir o Figma: `neutral-white` |
| O `Header` já existe e é usado pelos dois templates via `actions` | Manter `actions` opcional (decisão do usuário) |

### Decisões do usuário (2026-11-26)

1. **Visual do Figma** em vez do texto da spec (fundo branco, logo padrão, `account_circle`).
2. **`actions` opcional**: omitida → links padrão Cadastro/Login; `null` → sem links; outro nó → substitui os
   links (o `PrivateTemplate` continua com o `UserMenu`). Sem lógica de auth dentro do Header.
3. **Branch:** a HRMX-7 fica na `aula-4`; não será criada uma branch nova.

### Decisões técnicas

- Server Component, sem estado e sem `'use client'`.
- Container `max-w-300` (1200px = 1920 − 2×360) centralizado; `p-4` no mobile e `md:px-15` (60px) a partir do tablet.
- Breakpoints: mobile `< md` (768), tablet `md`–`lg`, desktop `≥ lg` (1024).
- Logo dentro de `next/link` para `homeHref` (padrão `/`), com foco visível `outline-focus`; tamanho
  `max-lg:h-10 max-lg:w-30` (120×40) abaixo do desktop.
- Busca: `<div role="search">` com `IconInput` (`type="search"`, `name="q"`, rótulo acessível "Buscar",
  placeholder "O que você procura?"), largura `w-full` no mobile (com `order-last`, para ir para a 2ª linha) e
  `md:w-60` acima disso, para o placeholder caber inteiro. Sem `<form>` nem submit.
- Links: `NavLink` com classes do header — `px-4 py-3` (botão fantasma), `lg:p-0` no desktop,
  `max-md:flex-col max-md:text-body-xs` no mobile e ícone fixo em 16px (`[&>.material-icons]:text-base`).
- `<nav aria-label="Conta">` só é renderizado quando `actions !== null`.
- Remover as classes `dark:` e `slate` do bootstrap (projeto só tem modo claro e tokens próprios).
- Sem dependências novas e sem novos componentes; barrel `organisms/index.ts` já exporta `Header`.

### Arquivos

| Arquivo | Alteração |
|---------|-----------|
| `apps/web/src/components/organisms/Header.tsx` | Reescrito conforme acima (cabeçalho e JSDoc atualizados) |
| `apps/web/src/components/organisms/Header.stories.tsx` | Stories `Deslogado`, `Tablet` e `Mobile` (viewport), `AcoesPersonalizadas` (avatar + "Sair") e `SemAcoes` (`actions: null`) |
| `apps/web/src/components/templates/PublicTemplate.tsx` | Deixa de passar o link "Entrar": usa os links padrão do Header; `showLogin={false}` passa `actions={null}`; doc de `showLogin` atualizada |
| `apps/web/src/components/templates/PrivateTemplate.tsx` | Sem alteração (continua passando `UserMenu` e `homeHref`) |

Efeito colateral: o link "Entrar" (destaque laranja) da home some, substituído por Cadastro/Login do Figma.
`/cadastro` ainda não existe (404 até a story de cadastro).

### ToDo

- [x] Plano aprovado pelo usuário
- [x] Mover a HRMX-7 para **In Progress**
- [x] Reescrever `Header.tsx`
- [x] Atualizar `PublicTemplate.tsx`
- [x] Reescrever `Header.stories.tsx`
- [x] Lint, typecheck e build
- [x] Validar no navegador (home, `/login`) e no Storybook (360, 768, 1024, 1440)
- [x] Checklist contra a spec
- [x] Commit
- [x] Mover para **In Review** e comentar na issue

## 5. Marcar como "In Progress"

`save_issue(id: "HRMX-7", state: "In Progress")` após a aprovação e antes da primeira alteração de código.

## 6. Implementação

Conforme "Decisões técnicas" e "Arquivos" acima. Qualquer desvio (ex.: precisar alterar `NavLink`, `IconInput`
ou `Logo`) será perguntado antes e registrado aqui.

## 7. Validação no navegador

- `pnpm dev:web` → `http://localhost:3000/`: header com ≈ 92px, logo 180×60, busca ao centro e links à direita;
  placeholder inteiro; console sem erros vindos do Header.
- `http://localhost:3000/login`: header sem links.
- `pnpm storybook` → Organismos/Header em 360, 768, 1024 e 1440 px: sem overflow horizontal; 768 em uma linha
  com logo 120×40; 360 com a busca na 2ª linha e links com ícone sobre o rótulo.
- Comparar lado a lado com os screenshots do Figma (`29:191`, `88:939`, `88:1137`).

## 8. Conferência contra a spec

- `pnpm --filter web lint`, `pnpm typecheck`, `pnpm build:web` (a web não tem Jest).

Checklist (critérios da spec, com as decisões acima):

- [x] Fundo do header conforme o design (branco do Figma, em vez de `brand-secondary-pure`)
- [x] Logo Hermex à esquerda (padrão do Figma, em vez de invertido)
- [x] Campo de busca com placeholder "O que você procura?" ao centro
- [x] Links Cadastro (`account_circle`) e Login (`login`) à direita
- [x] Responsivo: não quebra em telas pequenas
- [x] Story no Storybook renderiza corretamente
- [x] Sem `fixed`/`sticky`, sem fetch, sem lógica de auth/busca

Resultado: lint, typecheck, Prettier e `pnpm build:web` ok. Medido no navegador: 92px (1440 e 1024), 80px (768)
e 162px (360), logo 180×60 / 120×40, sem overflow horizontal, `position: static`; `/login` sem links.

Ressalvas:

- No 360 o header fica com ~162px contra 151px no Figma, por causa da altura de linha dos links empilhados.
- Sem links (`/login`, `actions={null}`), a busca vai para a direita no desktop/tablet, em vez do centro.
- Em 320px com barra de rolagem clássica (largura útil menor), os links descem para uma linha própria, sem
  overflow.
- A story `Mobile` usa o viewport `mobile1` (320px) e a `Tablet`, o `tablet` do Storybook.
- O erro de hidratação no console vem de um atributo inserido por extensão do navegador (`cz-shortcut-listen`).

## 9. Marcar como "In Review"

`save_issue(id: "HRMX-7", state: "In Review")` e comentário com resumo, arquivos, checklist, divergências e
instruções de verificação.

## 10. Commit e próximos passos

- Commit na `aula-4`: `feat(web): refaz o organismo Header a partir do Figma`.
- `apps/web/AGENTS.md` (gerado automaticamente pelo `next dev`) fica **fora** do commit.
- Push e PR só se o usuário pedir.
