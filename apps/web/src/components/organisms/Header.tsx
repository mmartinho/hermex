/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-26
 * Descrição: Organismo Header (US07 / HRMX-7). Cabeçalho da aplicação conforme o componente
 *   "Header" do Figma (node 66:997): fundo branco, logo à esquerda, campo de busca
 *   "O que você procura?" ao centro e links "Cadastro"/"Login" à direita.
 *
 *   É puramente presentacional: não busca dados, não tem lógica de autenticação nem de busca
 *   (o campo é só visual por enquanto). A área da direita pode ser trocada pelo template via
 *   `actions` (ex.: menu do usuário na área logada). Responsivo em três faixas, como no Figma:
 *   desktop (≥1024px), tablet (768px) e mobile (<768px, busca numa segunda linha).
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '@/components/atoms';
import { IconInput, NavLink } from '@/components/molecules';

export interface HeaderProps {
  /**
   * Conteúdo da área direita. Se omitido (`undefined`), mostra os links padrão "Cadastro" e
   * "Login"; passe `null` para não mostrar nada ou outro nó (ex.: `UserMenu`) para substituí-los.
   */
  actions?: ReactNode;
  /** Destino do clique no logo (padrão: `/`). */
  homeHref?: string;
}

/**
 * Classes dos links do header por faixa de tela (Figma):
 * - mobile: "Botão fantasma" small, ícone sobre o rótulo (body-xs) com padding;
 * - tablet: "Botão fantasma" com ícone ao lado do rótulo e padding;
 * - desktop: link simples, sem padding.
 * O ícone fica sempre com 16px, mesmo quando o texto diminui no mobile.
 */
const HEADER_LINK_CLASSES =
  'px-4 py-3 max-md:flex-col max-md:text-body-xs lg:p-0 [&>.material-icons]:text-base';

/**
 * Links padrão do visitante não autenticado.
 *
 * @returns Links "Cadastro" e "Login".
 */
function GuestLinks() {
  return (
    <>
      <NavLink href="/cadastro" icon="account_circle" className={HEADER_LINK_CLASSES}>
        Cadastro
      </NavLink>
      <NavLink href="/login" icon="login" className={HEADER_LINK_CLASSES}>
        Login
      </NavLink>
    </>
  );
}

/**
 * Cabeçalho da aplicação.
 *
 * @param props - Conteúdo da área direita e destino do logo.
 * @returns Elemento `<header>` com logo, campo de busca e navegação.
 */
export function Header({ actions = <GuestLinks />, homeHref = '/' }: HeaderProps) {
  return (
    <header className="w-full bg-neutral-white">
      <div className="mx-auto flex max-w-300 flex-wrap items-center justify-between gap-4 p-4 md:flex-nowrap md:px-15">
        <Link
          href={homeHref}
          className="rounded outline-none focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-focus"
        >
          {/* Figma: 180×60 no desktop e 120×40 no tablet/mobile. */}
          <Logo className="max-lg:h-10 max-lg:w-30" />
        </Link>

        {/* Campo apenas visual (sem submit/redirect): a busca é outra story. */}
        <div role="search" className="order-last w-full md:order-none md:w-auto">
          <IconInput
            icon="search"
            label="Buscar"
            type="search"
            name="q"
            placeholder="O que você procura?"
            // Largura suficiente para o placeholder inteiro (no Figma o campo abraça o texto).
            className="w-full md:w-60"
          />
        </div>

        {/* `undefined` já virou os links padrão (valor default); `null` esconde a navegação. */}
        {actions !== null && (
          <nav aria-label="Conta" className="flex items-center gap-2 lg:gap-6">
            {actions}
          </nav>
        )}
      </div>
    </header>
  );
}
