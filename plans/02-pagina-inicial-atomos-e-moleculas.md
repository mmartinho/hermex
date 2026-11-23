# Plano — Átomos e moléculas da Página Inicial (Figma)

> **Status: IMPLEMENTADO** (2026-11-20) — átomos, moléculas e Storybook; organismos/template ficam para o próximo plano.
> Branch: `aula-1`.
>
> **Escopo pedido pelo usuário:** só os componentes (visual), sem funcionalidade; Atomic Design + Tailwind; depois,
> Storybook com todos os componentes.
>
> **Decisões tomadas na implementação (respondem às "Dúvidas" do fim):**
> 1. Dark mode: removido — o Figma só tem modo claro; `dark:` ficou presa à classe `.dark` (nunca aplicada).
> 2. Campo de data: `<input type="date">` nativo com o ícone do Figma (indicador nativo escondido).
> 3. Dropdown: implementação própria e **apresentacional** (`open`/`value` por props, callbacks opcionais), sem biblioteca.
> 4. Ícones: fonte Material Icons via `@fontsource/material-icons` (fiel ao Figma).
> 5. Horário: exemplos em 24h ("10:00").
>
> **Desvios:** além de `FieldFrame`, os tokens de tipografia cobrem a escala completa do Guia de estilos (heading
> xxl…xs e body xxl…xs). O logo usa as duas camadas SVG do Figma posicionadas como no original. A linha entre as opções
> do "Filtro aberto" é branca no Figma (invisível sobre fundo branco) — mantida como no design.
>
> **Storybook:** `pnpm storybook` (porta 6006) / `pnpm build:storybook`; Storybook 10.6.7 com `@storybook/nextjs-vite`,
> addons docs, a11y e pseudo-states (stories "Estados" mostram hover/pressed/foco do Figma). Server Actions de auth são
> trocadas por mock (`.storybook/mocks/auth-actions.ts`). Sem story: `UserMenu` e `PrivateTemplate` (Server Components
> assíncronos que leem a sessão).
> Fonte: Figma "Hermex | Locadora de veículos", tela **`1920 | Página Inicial`** (node `2:3`)
> — https://www.figma.com/design/xH1Iw9FAFUBUN28zYdWBJH/Hermex-%7C-Locadora-de-ve%C3%ADculos?node-id=2-3
> Componentes de referência: seção **Componentes** (node `73:1024`) e **Guia de estilos** (node `73:840`) da página "Projeto"; tokens na página "Estilos" (node `4:31`).

## Contexto

A tela inicial é composta, de cima para baixo, por:

1. **Header** (deslogado): logo, campo "O que você procura?", links "Cadastro" e "Login" com ícone.
2. **Busca de carros** (faixa laranja): local de retirada/devolução, data, horário (×2 linhas) e botão "Buscar".
3. **Banner**: título "Encontre o carro ideal para todas as ocasiões" (parte em laranja), foto e chevrons decorativos.
4. **Filtro** "Selecione a categoria" + **grade de cards** de carros (imagem, nome, categoria, preço/diária, botão "Ver detalhes").
5. **Rodapé**: logo invertido, slogan, crédito Alura, "Siga nossas redes:" e ícones de WhatsApp, Instagram e TikTok.

Este plano cobre **apenas átomos e moléculas** (mais os tokens que eles exigem). Os organismos e o template da página
estão listados no fim só para mostrar quem consome cada peça — serão um plano à parte.

O `apps/web` já tem átomos/moléculas do bootstrap (`Button`, `Input`, `Label`, `Spinner`, `Avatar`, `FormField`,
`NavLink`, `SocialLoginButton`), estilizados com uma paleta azul provisória (`brand-50…800`) e `slate`. Este plano
**reaproveita e reestiliza** o que já existe em vez de duplicar, e **substitui** a paleta provisória pelos tokens do Figma.

Regras que valem para todo arquivo criado/alterado: cabeçalho (Autor(es) / Data Criação / Data Atualização / Descrição)
e JSDoc com params/retorno/exceções; exportar pelo barrel `index.ts` do nível; commits em Conventional Commits pt-BR.

---

## Etapa 0 — Tokens de design (`apps/web/src/app/globals.css` + `layout.tsx`)

Pré-requisito de todos os componentes. Valores extraídos das variáveis do Figma.

### Cores (`@theme`)

| Token Figma | Valor | Utilitário Tailwind proposto |
|---|---|---|
| `neutral-background` | `#FBFBFB` | `bg-neutral-background` |
| `neutral-text` | `#444444` | `text-neutral-text` |
| `neutral-divisor` | `#F2F2F2` | `border-neutral-divisor` |
| `neutral-details` | `#E7E7E7` | `border-neutral-details`, `bg-neutral-details` |
| `neutral-white` / `neutral-black` | `#FFFFFF` / `#000000` | `neutral-white` / `neutral-black` |
| `brand-color-primary-dark/pure/light` | `#E28634` / `#F29849` / `#FFDAB8` | `primary-dark`, `primary`, `primary-light` |
| `brand-color-secondary-dark/pure/light` | `#23384D` / `#1D2F40` / `#2E4B66` | `secondary-dark`, `secondary`, `secondary-light` |
| `color-focus` | `#FF00D0` | `focus` (borda/outline de foco) |
| `color-feedback-attention/negative/positive` | `#FFD400` / `#FF3F48` / `#6EDC3B` | `attention`, `negative`, `positive` |

- **Remover** `--color-brand-50…800` (azul provisório) e atualizar quem usa (`Avatar`, `Header`, `NavLink`, `Button`,
  `Input`, `LoginForm`, templates).
- O Figma só define **Light mode**: remover o bloco `prefers-color-scheme: dark` e as classes `dark:` dos componentes
  tocados (ou manter neutras) — **decisão a confirmar** (ver "Dúvidas").

### Sombras (Elevation)

| Token | Figma | CSS |
|---|---|---|
| `shadow-elevation-1` | `#848484` 10%, blur 10 | `0 0 10px rgb(132 132 132 / 0.10)` |
| `shadow-elevation-2` | `#848484` 20%, blur 20 | `0 0 20px rgb(132 132 132 / 0.20)` (usada nos cards) |
| `shadow-elevation-3` | `#848484` 25%, blur 30 | `0 0 30px rgb(132 132 132 / 0.25)` |

### Espaçamento e bordas

`spacing-xxs 4 / xs 8 / sm 12 / md 16 / lg 32` e `border-xs 4` **coincidem** com a escala padrão do Tailwind
(`1/2/3/4/8` e `rounded`) — não é preciso criar tokens; só usar a escala padrão.

### Tipografia

| Estilo Figma | Fonte | Tamanho / altura de linha | Utilitário proposto |
|---|---|---|---|
| `font-heading-xxl` | Exo 2 Bold | 76 / 1.25 | `text-heading-xxl` |
| `font-heading-xs` | Exo 2 Bold | 25 / 1.25 | `text-heading-xs` |
| `font-body-lg` | Inter Regular | 20 / 1.2 | `text-body-lg` |
| `font-body-md` | Inter Regular | 16 / 1.2 | `text-body-md` |

- Os níveis intermediários de heading (xl…sm) estão no Guia de estilos (node `73:844`); ler na implementação e
  completar a escala, mesmo que esta tela não use todos.
- `layout.tsx`: trocar Geist por **Inter** (`--font-sans`) e **Exo 2** (`--font-heading`) via `next/font/google`.
- **Ícones**: o Figma usa a fonte **Material Icons** (ligaduras: `search`, `account_circle`, `login`, `location_on`,
  `calendar_month`, `keyboard_arrow_down/up`). Proposta: pacote `@fontsource/material-icons` (self-hosted, sem
  requisição externa), importado no `layout.tsx`.

---

## Átomos (`apps/web/src/components/atoms`)

### A1. `Icon` — **novo**
- Renderiza um ícone Material Icons por nome (ligadura): `<span aria-hidden className="material-icons">{name}</span>`.
- Props: `name: MaterialIconName` (união dos nomes usados, extensível), `size?` (padrão 16px = `text-body-md`),
  `className?`, `label?` (quando informado, vira `role="img"` + `aria-label`; senão `aria-hidden`).
- Usado por: `IconInput`, `Dropdown`, `NavLink`, `Button` (variante com ícone `add` do Figma).

### A2. `Logo` — **novo**
- Logo Hermex (180×60) em SVG. Duas variantes do Figma: `default` (fundo claro — "Hermex logo 1", node `70:1331`)
  e `inverse` (fundo escuro — "Hermex logo 2", node `73:1025`).
- Assets: baixar os SVGs desses nodes para `apps/web/public/brand/` (`hermex-logo.svg`, `hermex-logo-inverse.svg`);
  **não** recriar/desenhar os vetores. Renderizar com `next/image` mantendo width/height originais.
- Props: `variant?: 'default' | 'inverse'`, `className?`. `alt="Hermex locadora"`.
- Também existem favicons no Guia de estilos (`127:2182`, `127:2189`) — anotar para o template, fora deste escopo.

### A3. `Button` — **reestilizar** (existente)
Manter a API atual (`variant`, `loading`, `fullWidth`, atributos nativos) e trocar os estilos pelos do Figma
(raio 4, `px-4 py-3`, gap 8, `text-body-md`, opcional ícone à esquerda via prop `icon?: MaterialIconName`).

| Variante | Padrão | Hover | Pressed (`:active`) | Foco (`:focus-visible`) |
|---|---|---|---|---|
| `primary` ("Botão primário", `22:263`) | bg `primary`, texto branco | bg `primary-light`, texto `neutral-text` | bg `primary-dark`, texto branco | borda 2px `focus` |
| `secondary` ("Botão secundário", `23:351`) | bg `secondary`, texto branco | bg `secondary-dark` | bg `secondary-light` | borda 2px `focus` |
| `ghost` ("Botão fantasma", `28:99`) | estilos a ler do node `28:99` na implementação (não aparece nesta tela) | | | |

- Na tela: "Buscar" = `secondary`; "Ver detalhes" = `primary` + `fullWidth`.
- **Atenção**: hoje `secondary` é um botão branco com borda, usado por `SocialLoginButton`. No Figma o botão do Google é
  outro componente ("Botão fantasma google", `68:1341`) → `SocialLoginButton` passa a usar `ghost` (ou variante própria
  quando a tela de login for planejada). Verificar `LoginForm` após a troca.
- Foco: usar borda/outline de 2px sem deslocar o layout (ex.: `outline-2 outline-focus` ou `ring`), equivalente
  visual à borda do Figma.

### A4. `Input` — **reestilizar** (existente)
- Continua sendo o `<input>` puro usado por `FormField` (login/cadastro). Ganha prop `tone` para os três contextos
  do Figma e passa a poder ser usado "sem moldura" dentro de `IconInput`:
  - `tone="neutral"` (padrão): borda `neutral-details`, texto/placeholder `neutral-text` — "Campo de busca", "Campo de texto".
  - `tone="inverse"`: borda e texto brancos, fundo transparente — campos sobre a faixa laranja.
  - `tone="secondary"`: borda e texto `secondary` — "Filtro".
- Estados comuns a todos os campos do Figma (`5:34`, `5:76`, `7:15`, `10:34`, `27:144`):
  hover → borda `primary-light`; pressed/ativo → borda `primary-dark`; foco → borda `focus`.
- `invalid` mantém a borda `negative` (`#FF3F48`) — alinhar ao "Campo de senha / Erro" (`70:759`) quando o login
  for planejado.
- Prop `bare?: boolean`: remove borda/padding para o input ser embutido numa moldura (`FieldFrame`).

### A5. `FieldFrame` — **novo**
- A "moldura" compartilhada por todos os campos com ícone da tela (busca, localização, data, horário, filtro):
  `div` com borda 1px, `rounded`, `px-4 py-3`, `gap-2`, `items-center`, `text-body-md`, e os estados de borda acima
  aplicados via `hover:`, `active:` e **`focus-within:`** (o foco real fica no input/botão interno).
- Props: `tone: 'neutral' | 'inverse' | 'secondary'`, `invalid?`, `className?`, `children`.
- Motivo de existir: evita repetir a tabela de estados em `IconInput` e `Dropdown`.

### A6. `Divider` — **novo**
- Linha horizontal entre opções das listas abertas ("Line 11" em `27:129` e `27:166`). Props: `tone?` (cor da linha),
  `className?`. `<hr>` com `role="separator"`/`aria-hidden` conforme o uso.
- Cor exata da linha: ler o SVG `Line 11` na implementação (não veio como variável).

### A7. `Heading` — **novo**
- Títulos em Exo 2 Bold. Props: `as?: 'h1'…'h6' | 'p'`, `size: 'xxl' | 'xs' | …` (escala da Etapa 0), `className?`.
- Na tela: título do banner (`xxl`, cor branca com trecho em `primary` passado como `children`), "Siga nossas redes:"
  (`xs`), valor do preço (`xs`).

### A8. `Text` — **novo**
- Parágrafo/span em Inter. Props: `as?: 'p' | 'span'`, `size?: 'md' | 'lg'`, `className?`.
- Na tela: subtítulo do card (md), "/diária" e nome do carro (lg), slogan/crédito do rodapé (md, branco).

### A9. `Surface` (card base) — **novo**
- Superfície do componente "Card" (`10:156`): fundo `neutral-white`, `shadow-elevation-2`, `rounded`, `p-8`, `gap-4`,
  coluna centralizada; **hover**: borda 1px `primary-light` (variante "Lg/Sm Hover" — reservar a borda transparente no
  estado padrão para não "pular" 1px).
- Props: `as?`, `interactive?` (aplica o hover), `className?`, `children`.

### A10. `Thumbnail` — **novo**
- Moldura de imagem 280×160 com fundo `neutral-details` e imagem `object-contain` centralizada (`next/image`, `fill`
  + `sizes`). Props: `src`, `alt`, `className?`.
- As fotos dos carros vêm de **dados** (API/seed), não são assets estáticos do layout — o Figma posiciona cada foto
  com recortes manuais; no código padronizar com `object-contain` + padding.

> Existentes sem mudança de papel nesta tela: `Label` (reestilizar só cores para `neutral-text`), `Spinner`, `Avatar`
> (trocar `brand-100/700` pelos novos tokens).

---

## Moléculas (`apps/web/src/components/molecules`)

### M1. `IconInput` — **novo**
- `FieldFrame` + `Icon` à esquerda + `Input bare`. Props: `icon: MaterialIconName`, `tone`, `label` (obrigatório,
  vira `aria-label` ou `<Label className="sr-only">` — o Figma não mostra rótulo visível) + atributos de `<input>`.
- Instâncias na tela:

| Uso | Ícone | Tone | Placeholder | Node Figma |
|---|---|---|---|---|
| Busca do header | `search` | `neutral` | "O que você procura?" | `5:34` |
| Local de retirada / devolução | `location_on` | `inverse` | "Local de retirada" / "Local de devolução" | `5:76` |
| Data (×2) | `calendar_month` | `inverse` | "Data" | `7:15` |

- **Data**: usar `<input type="date">` com o ícone do Figma e esconder o indicador nativo do navegador
  (`::-webkit-calendar-picker-indicator`) abrindo o seletor com `showPicker()` ao clicar — ou trocar por um date
  picker próprio. **Decisão a confirmar** (ver "Dúvidas").
- Observação: no Figma o placeholder do campo de localização muda nos estados ("Onde você quer retirar/pegar o carro?"),
  enquanto a tela usa "Local de retirada" — tratar como texto passado por prop.

### M2. `Dropdown` — **novo** (Client Component)
- Seleção com lista customizada, cobrindo "Dropdown horário" (`10:34` fechado, `27:129` aberto) e "Filtro"
  (`27:144` fechado, `27:166` aberto).
- Composição: botão gatilho em `FieldFrame` (texto à esquerda + `Icon` `keyboard_arrow_down`/`keyboard_arrow_up`) e,
  aberto, uma lista colada embaixo (gatilho perde o raio inferior, lista com borda do mesmo tom) com opções centralizadas
  separadas por `Divider`.
- Props: `label` (acessível), `placeholder`, `options: { value: string; label: string }[]`, `value?`, `onChange?`,
  `tone: 'inverse' | 'secondary'`, `name?` (input hidden para funcionar em `<form>`/Server Action), `className?`.
- Cores das opções: `secondary` → opção selecionada em `primary-dark`, demais em `secondary`; `inverse` → opção
  selecionada/ativa em `secondary`, demais em branco (conforme `27:129`).
- Acessibilidade: padrão WAI-ARIA *listbox* (botão com `aria-haspopup="listbox"`/`aria-expanded`, `role="option"`,
  `aria-selected`, setas/Home/End/Enter/Esc, fechar ao clicar fora). Sem biblioteca nova, a menos que se prefira
  Headless UI/Radix — **decisão a confirmar**.
- Instâncias: "Horário" (×2, `inverse`, opções em intervalos de 30 min, ex.: "10:00 AM") e "Selecione a categoria"
  (`secondary`, opções "Hatch", "Sedan", "Pickups", "Esportivo", "Crossover"). As opções de categoria devem vir de
  `@hermex/shared` ou da API, não fixas no componente.

### M3. `NavLink` — **reestilizar/estender** (existente)
- Segue o componente "Links" (`5:57`): texto `neutral-text` `text-body-md`; hover → `primary-light` + sublinhado;
  pressed → `primary-dark` + sublinhado; foco → borda 1px `focus` com `p-2`.
- Nova prop `icon?: MaterialIconName` (ícone à esquerda, gap 8) para "Cadastro" (`account_circle`) e "Login" (`login`).
- A prop `highlight` (pílula azul do bootstrap) não existe no Figma: remover ou mapear para `Button` — verificar usos
  em `PublicTemplate`/`UserMenu`.

### M4. `Price` — **novo**
- Valor da diária: `Heading size="xs"` (valor) + `Text size="lg"` ("/diária"), em linha.
- Props: `amount: number` (em reais), `period?: string` (padrão "/diária"), `currency?` (padrão `BRL`).
- Formatar com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })`.
  O Figma escreve "RS120" — provável erro de digitação de "R$120"; usar **R$**.

### M5. `SocialLinks` — **novo**
- Lista horizontal (gap 8) de ícones 32×32 com link: WhatsApp (`48:590`), Instagram (`48:593`), TikTok (`48:597`).
- Assets: baixar os SVGs desses nodes para `apps/web/public/social/` e usá-los sem alteração.
- Props: `links: { network: 'whatsapp' | 'instagram' | 'tiktok'; href: string }[]`. Cada link com `aria-label`
  ("Hermex no WhatsApp"…), `target="_blank" rel="noopener noreferrer"`. URLs reais: **a definir** (projeto fictício).
- O título "Siga nossas redes:" fica no organismo `Footer` (usa `Heading`).

> Existentes sem relação com esta tela: `FormField` (só reflete a reestilização de `Input`/`Label`) e
> `SocialLoginButton` (ver nota em `Button`).

---

## Fora do escopo — organismos e template (consumidores, para o próximo plano)

| Organismo | Figma | Usa |
|---|---|---|
| `Header` (reestilizar existente) | `66:997` (1920/768/360, deslogado/logado) | `Logo`, `IconInput` (busca), `NavLink` (+ `UserMenu` logado) |
| `CarSearchForm` | "Busca de carros" `29:355` (aberto/fechado, 3 larguras) | `IconInput`, `Dropdown`, `Button secondary` |
| `HeroBanner` | "Banner" `73:809` / `106:1880` / `123:2182` | `Heading xxl` + assets do banner (foto, chevrons, máscara) |
| `CarCard` | "Card" `10:156` (Lg/Sm, Padrão/Hover) | `Surface`, `Thumbnail`, `Text`, `Price`, `Button primary` |
| `CarGrid` (+ filtro) | `22:232` | `Dropdown` (categoria), `CarCard` |
| `Footer` | "Rodapé" `88:1226` (1920/768/360) | `Logo inverse`, `Text`, `Heading xs`, `SocialLinks` |
| Template `PublicTemplate` + página `/` | `2:3`, `106:1790`, `106:2263` | todos acima |

Responsividade: o Figma traz versões 1920, 768 e 360 de header, busca, banner, card (Lg 360×440 / Sm 312×408) e rodapé.
Os átomos/moléculas acima não dependem de largura fixa (usar `w-full`/flex); os tamanhos por breakpoint ficam nos organismos.

---

## Ordem de implementação sugerida

1. Etapa 0 (tokens, fontes, Material Icons) → ajustar usos de `brand-*`/`slate` nos componentes existentes.
2. Átomos: `Icon`, `Logo`, `Heading`, `Text`, `Divider`, `FieldFrame`, `Surface`, `Thumbnail`; reestilizar `Button`, `Input`, `Label`, `Avatar`.
3. Moléculas: `IconInput`, `NavLink`, `Price`, `SocialLinks`, `Dropdown` (por último, é o único com estado/teclado).
4. Atualizar barrels (`atoms/index.ts`, `molecules/index.ts`).
5. Baixar assets (logos, ícones sociais) a partir dos nodes do Figma para `public/`.

## Verificação

- `pnpm typecheck`, `pnpm lint`, `pnpm format:check`.
- Página temporária de catálogo (ex.: rota `(public)/dev/ui`, removida ou protegida antes do merge) exibindo cada
  átomo/molécula em todos os estados, comparada lado a lado com os componentes do Figma (screenshots via MCP).
- Navegar por teclado: foco visível com a cor `focus` em botões, links, campos e `Dropdown`; leitor de tela anuncia
  rótulos dos campos sem rótulo visível.
- Regressão: telas de login/perfil existentes continuam funcionando após a troca de tokens e da variante `secondary`.

## Dúvidas para decidir antes de implementar

1. **Dark mode**: remover (Figma só tem Light mode) ou manter um tema escuro derivado?
2. **Campo de data**: input nativo com ícone customizado ou date picker próprio?
3. **Dropdown**: implementação própria (WAI-ARIA listbox) ou adotar Headless UI / Radix?
4. **Ícones**: `@fontsource/material-icons` (fonte, fiel ao Figma) ou SVGs (ex.: `@material-symbols/svg-400`), mais leves por tree-shaking?
5. **Formato de horário**: o Figma usa "10:00 AM"; para pt-BR o natural é "10:00" (24h).
