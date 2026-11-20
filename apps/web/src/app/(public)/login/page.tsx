/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Página de login. Lê `?error=` e `?callbackUrl=` da URL (dados da requisição, por
 *   isso sob Suspense com Cache Components) e renderiza o formulário de login.
 */
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Spinner } from '@/components/atoms';
import { LoginForm } from '@/components/organisms';
import { PublicTemplate } from '@/components/templates';
import { getAuthErrorMessage, safeRedirectPath } from '@/lib/auth/errors';

export const metadata: Metadata = { title: 'Entrar' };

/** Parâmetros de busca da página de login. */
type LoginSearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Conteúdo dinâmico do login (depende da query string).
 *
 * @param props.searchParams - Parâmetros de busca da URL.
 * @returns O formulário de login com erro e URL de retorno.
 */
async function LoginContent({ searchParams }: { searchParams: LoginSearchParams }) {
  const params = await searchParams;
  const callbackUrl = safeRedirectPath(
    Array.isArray(params.callbackUrl) ? params.callbackUrl[0] : params.callbackUrl,
  );
  return <LoginForm callbackUrl={callbackUrl} initialError={getAuthErrorMessage(params.error)} />;
}

/**
 * Página de login.
 *
 * @param props.searchParams - Parâmetros de busca da URL.
 * @returns Página com o formulário de login centralizado.
 */
export default function LoginPage({ searchParams }: { searchParams: LoginSearchParams }) {
  return (
    <PublicTemplate showLogin={false}>
      <div className="flex flex-1 items-center justify-center">
        <Suspense fallback={<Spinner size="lg" />}>
          <LoginContent searchParams={searchParams} />
        </Suspense>
      </div>
    </PublicTemplate>
  );
}
