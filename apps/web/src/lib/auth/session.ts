/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Helpers de sessão para o servidor (Server Components, Route Handlers e Server
 *   Actions). Isolam o restante do app da biblioteca de autenticação usada (Auth.js).
 */
import 'server-only';
import type { Session } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

/**
 * Retorna a sessão atual.
 *
 * @returns A sessão, ou `null` se o usuário não estiver autenticado.
 */
export async function getSession(): Promise<Session | null> {
  return auth();
}

/**
 * Exige uma sessão válida; caso contrário redireciona para o login.
 *
 * @returns A sessão do usuário autenticado.
 * @throws Redirecionamento do Next (`redirect`) para `/login` se não houver sessão.
 */
export async function requireSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  return session;
}

/**
 * Lê o JWT da API Nest guardado no token de sessão do Auth.js (cookie criptografado).
 *
 * @param requestHeaders - Headers da requisição; se omitidos, usa os da requisição atual.
 * @returns O accessToken da API, ou `null` se não houver sessão.
 * @throws {Error} Se `AUTH_SECRET` não estiver configurado.
 */
export async function getAccessToken(requestHeaders?: Headers): Promise<string | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET não configurado');
  }

  const token = await getToken({
    req: { headers: requestHeaders ?? (await headers()) },
    secret,
    secureCookie: process.env.AUTH_URL?.startsWith('https://') ?? false,
  });
  return token?.accessToken ?? null;
}
