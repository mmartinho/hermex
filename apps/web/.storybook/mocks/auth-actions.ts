/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Mock das Server Actions de autenticação (`@/lib/auth/actions`) para o Storybook.
 *   Mantém a mesma API, mas só registra as chamadas no painel Actions, sem servidor nem redirect.
 */

import { action } from 'storybook/actions';

/** Provedores sociais disponíveis no front. */
export type SocialProvider = 'google' | 'facebook';

/** Estado do formulário de login com email/senha. */
export interface LoginFormState {
  error?: string;
}

/**
 * Simula o início do login social.
 *
 * @param provider - Provedor escolhido.
 * @param callbackUrl - Caminho de retorno.
 * @returns Promessa resolvida sem efeito.
 */
export async function loginWithProvider(
  provider: SocialProvider,
  callbackUrl?: string,
): Promise<void> {
  action('loginWithProvider')({ provider, callbackUrl });
}

/**
 * Simula o login com email/senha, sempre falhando para exibir a mensagem de erro.
 *
 * @param _prev - Estado anterior (não utilizado).
 * @param formData - Campos do formulário.
 * @returns Estado com mensagem de erro de exemplo.
 */
export async function loginWithCredentials(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  action('loginWithCredentials')(Object.fromEntries(formData));
  return { error: 'Email ou senha inválidos. (mock do Storybook)' };
}

/**
 * Simula o logout.
 *
 * @returns Promessa resolvida sem efeito.
 */
export async function logout(): Promise<void> {
  action('logout')();
}
