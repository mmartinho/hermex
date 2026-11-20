/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Server Actions de autenticação usadas pelos formulários (login social, login com
 *   email/senha e logout).
 */
'use server';

import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { safeRedirectPath } from './errors';

/** Provedores sociais disponíveis no front. */
export type SocialProvider = 'google' | 'facebook';

/** Estado do formulário de login com email/senha. */
export interface LoginFormState {
  error?: string;
}

/**
 * Inicia o login com um provedor social (redireciona para o provedor).
 *
 * @param provider - Provedor escolhido.
 * @param callbackUrl - Caminho para onde voltar após o login.
 * @returns Nunca retorna normalmente: o Auth.js redireciona.
 * @throws Redirecionamento do Next para o provedor social.
 */
export async function loginWithProvider(
  provider: SocialProvider,
  callbackUrl?: string,
): Promise<void> {
  await signIn(provider, { redirectTo: safeRedirectPath(callbackUrl) });
}

/**
 * Login com email e senha (usado com `useActionState`).
 *
 * @param _prev - Estado anterior do formulário (não utilizado).
 * @param formData - Campos `email`, `password` e `callbackUrl`.
 * @returns Estado com mensagem de erro, se o login falhar.
 * @throws Redirecionamento do Next para a página de destino quando o login dá certo.
 */
export async function loginWithCredentials(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: safeRedirectPath(formData.get('callbackUrl')),
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          error.type === 'CredentialsSignin'
            ? 'Email ou senha inválidos.'
            : 'Não foi possível entrar. Tente novamente.',
      };
    }
    // O redirect de sucesso do Next é lançado como exceção e precisa ser propagado.
    throw error;
  }
}

/**
 * Encerra a sessão e volta para o login.
 *
 * @returns Nunca retorna normalmente: redireciona para `/login`.
 * @throws Redirecionamento do Next.
 */
export async function logout(): Promise<void> {
  await signOut({ redirectTo: '/login' });
}
