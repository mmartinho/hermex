/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Proxy do Next.js (antigo middleware). Faz a checagem otimista de sessão:
 *   visitante sem sessão em rota privada vai para /login; usuário logado em /login vai para
 *   /dashboard. A checagem definitiva continua no servidor (requireSession / API).
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

/** Prefixos de rotas que exigem login. */
const PRIVATE_PREFIXES = ['/dashboard'];

export default auth((request) => {
  const { pathname, search } = request.nextUrl;
  const isLoggedIn = !!request.auth?.user;
  const isPrivate = PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isPrivate && !isLoggedIn) {
    const loginUrl = new URL('/login', request.nextUrl);
    loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
