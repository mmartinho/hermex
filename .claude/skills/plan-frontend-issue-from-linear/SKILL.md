---
name: plan-frontend-issue-from-linear 
description: Planeja e executa uma issue de frontend de ponta a ponta a partir do Linear, atualizando o status da issue conforme evolui. Use quando o usuário passar um id ou link de issue do Linear descrevendo trabalho no frontend (componentes de UI, design, fluxos, telas, templates). 
---

# Planejar Issue do Frontend

Fluxo completo para buscar uma issue no Linear e entregá-la pronta, testada e verificada contra a spec — **mantendo o status da issue atualizado no Linear a cada fase**.

> **O fluxo tem duas fases separadas por uma aprovação do usuário:**
>
> 1. **Planejamento (passos 0–4):** só leitura (Linear, Figma, código) e escrita do arquivo de plano em `plans/`. **Nenhum arquivo de código é criado ou alterado** e o status da issue **não muda**.
> 2. **Execução (passos 5–10):** só começa depois de o usuário **aprovar explicitamente** o plano no chat ("aprovado", "pode implementar"...). Perguntas, comentários ou pedidos de ajuste no plano **não** contam como aprovação: ajuste o plano e peça aprovação de novo.

## 0. Pré-requisitos 

- Use MCP do Linear disponível no projeto (`mcp__linear-server__*`) para interagir com as issues
- Antes de mover status, confira os nomes válidos no time com `mcp__linear-server__list_issue_statuses`. Os nomes podem variar (ex.: "In Progress", "Em andamento", "In Review", "Code Review", "Done").
- Se a Issue apontar para um design, use o MCP do Figma (`mcp__plugin_figma_figma__*`) para ler o design.
- Antes de chamar `mcp__plugin_figma_figma__get_design_context`, carregue a skill `figma:figma-design-to-code`.

## 1. Obter a spec

- Use `mcp__linear-server__get_issue` com o id/identifier (ex.: `HRMX-12`) para buscar a issue.
- Se o usuário passou só um link, extraia o identifier da URL.
- Se houver link do Figma nos anexos/descrição, guarde para o passo 3.

## 2. Ler a spec

Extrair da spec:

- contexto e objetivo de UX
- telas / fluxos / estados (loading, erro, vazio, sucesso)
- componentes envolvidos (reaproveitar × criar novos)
- integrações (queries GraphQL, auth, rotas)
- responsividade e acessibilidade
- critérios de aceite
- plano de verificação (golden path + edge cases)

## 3. Se houver design no Figma

- Use `figma:figma-design-to-code` como skill auxiliar.
- Colete tokens, variantes e screenshots necessários antes de codar.
- Mapeie elementos do design para componentes já existentes em `apps/web/src/components/{atoms,molecules,organisms,templates}` antes de criar novos.

## 4. Planejar (escrever o plano e PARAR)

- Escreva o plano em `plans/NN-usXX-<slug>.md` (NN = próximo número em `plans/`), no mesmo formato dos planos anteriores (ex.: `plans/06-us01-campos-vehicle.md`): cabeçalho com **Status: AGUARDANDO APROVAÇÃO**, branch e issue; seções numeradas seguindo os passos desta skill (spec obtida, leitura da spec em tabela, design do Figma, planejamento com referências no código, **divergências spec × Figma × código**, decisões do usuário, decisões técnicas, ToDo, implementação, validação no navegador, conferência contra a spec, status e commit).
- O plano deve listar os arquivos que serão criados/alterados e o que muda em cada um.
- Divergências entre spec, Figma e código: pergunte ao usuário (AskUserQuestion) **durante o planejamento** e registre as respostas em "Decisões do usuário".
- Antes de finalizar, releia a spec e garanta que o plano:
  - respeitar **Atomic Design** (`atoms` → `molecules` → `organisms` → `templates`) com barrel `index.ts` em cada pasta
  - reaproveitar componentes existentes antes de criar novos
  - seguir convenções do Next.js 16 (App Router) — **consultar `node_modules/next/dist/docs/` antes de usar APIs do Next**, conforme `apps/web/AGENTS.md`
  - não introduzir regressão em telas vizinhas
- Revise o `CLAUDE.md` do projeto para convenções.
- **Pare aqui.** Apresente ao usuário um resumo do plano (caminho do arquivo, decisões e divergências) e **peça aprovação**. Não edite código, não mova o status da issue nem suba servidores enquanto não houver aprovação explícita.
- Aprovado: mude o cabeçalho do plano para **Status: APROVADO** (com a data) e siga para o passo 5. Ao final, marque **IMPLEMENTADO** e os itens da ToDo/checklist, como nos planos anteriores.

## 5. Marcar como "In Progress" no Linear

**Só depois da aprovação do plano** e antes de começar a codar, **atualize o status** da issue:

```
mcp__linear-server__save_issue(id: "HRMX-XX", state: "In Progress")
```

Se o time usa outro nome para esse estado (confirmado no passo 0), use-o.

## 6. Implementar

- Respeite a stack e o plano aprovado. Se surgir algo que obrigue a desviar do plano (novo arquivo, mudança de API de componente, regressão), **pare e pergunte**, depois registre o desvio no plano.
- Crie a ToDo list (TodoWrite) a partir da seção ToDo do plano.
- Novo componente? Crie no nível atômico correto e exporte via barrel `index.ts`.
- Use Tailwind e os tokens do design system — evite valores hardcoded quando houver token equivalente.
- Nunca edite `package.json` à mão — use `pnpm add`/`pnpm install`.
- Atualize a ToDo list conforme avança.

## 7. Validar no navegador

**Obrigatório para mudanças de UI:**

- Suba o dev server (`pnpm dev:web`) e abra no navegador.
- Teste o golden path e os edge cases (loading, erro, vazio, responsivo).
- Monitore o console por erros/warnings.
- Se não for possível testar no navegador, diga explicitamente — type-check e lint não substituem verificação visual.

## 8. Conferir contra a spec

- Escreva um checklist com os critérios de aceite e valide um por um.
- Rode lint (`pnpm --filter web lint`) e build (`pnpm build:web`).
- Se houver testes, execute-os.

## 9. Marcar como "In Review" no Linear

Quando o código estiver pronto, verificado no navegador e critérios de aceite validados, **mova o status para review**:

```
mcp__linear-server__save_issue(id: "HRMX-XX", state: "In Review")
```

Adicione um comentário resumindo o que foi entregue:

```
mcp__linear-server__save_comment(issueId: "HRMX-XX", body: "...")
```

O comentário deve conter:
- resumo curto do que foi implementado
- componentes criados/alterados e rotas afetadas
- checklist dos critérios de aceite marcados
- instruções de verificação (rota pra abrir, dados de teste, como reproduzir edge cases)
- (se houver) screenshots ou nota sobre responsividade

## 10. Commit e próximos passos

- Faça commit seguindo conventional commits em pt-BR (ex.: `feat(web): ...`).
- Se o usuário pedir, abra o PR — o merge move a issue para "Done" automaticamente via integração Linear↔GitHub (se configurada). Sem integração, atualize o status manualmente após o merge.

## Regras de ouro

- **Plano antes, código depois da aprovação**: nenhuma linha de código antes de o usuário aprovar o plano em `plans/`.
- **Nunca pule atualizações de status**: in progress ao começar a codar (após a aprovação), in review quando entregar.
- **Nada de "pronto" sem abrir o navegador** quando houve mudança visual.
- **Um status por vez**: se a issue ficar bloqueada (esperando design, endpoint inexistente, dúvida de UX), mova para "Blocked"/"Canceled" com comentário explicando.
- Se a spec for ambígua, **pergunte antes** de assumir — não mude o status pra review com dúvidas em aberto.
