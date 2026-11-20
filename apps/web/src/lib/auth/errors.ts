/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Códigos de erro de autenticação (vindos do Auth.js ou definidos pelo Hermex na
 *   query string `?error=` da página de login) e suas mensagens para o usuário.
 */

/** Email já cadastrado e o provedor não garantiu a verificação do email. */
export const AUTH_ERROR_ACCOUNT_CONFLICT = 'AccountConflict';

/** Provedor social não suportado pela API. */
export const AUTH_ERROR_UNSUPPORTED_PROVIDER = 'UnsupportedProvider';

const MESSAGES: Record<string, string> = {
  [AUTH_ERROR_ACCOUNT_CONFLICT]:
    'Este email já está cadastrado. Entre com o método que você usou da primeira vez.',
  [AUTH_ERROR_UNSUPPORTED_PROVIDER]: 'Este provedor de login não é suportado.',
  OAuthAccountNotLinked: 'Esta conta já está vinculada a outro usuário.',
  AccessDenied: 'Acesso negado.',
  Configuration: 'O login está temporariamente indisponível. Tente novamente mais tarde.',
};

/**
 * Traduz um código de erro de autenticação em mensagem amigável.
 *
 * @param code - Valor de `?error=` na URL (pode ser vazio ou uma lista).
 * @returns A mensagem a exibir, ou `null` se não houver erro.
 */
export function getAuthErrorMessage(code: string | string[] | undefined): string | null {
  const value = Array.isArray(code) ? code[0] : code;
  if (!value) {
    return null;
  }
  return MESSAGES[value] ?? 'Não foi possível entrar. Tente novamente.';
}

/**
 * Garante que a URL de retorno após o login seja interna (evita open redirect).
 *
 * @param url - URL recebida (ex.: `callbackUrl` da query string).
 * @param fallback - Caminho usado quando a URL é ausente ou externa.
 * @returns Um caminho relativo seguro.
 */
export function safeRedirectPath(url: unknown, fallback = '/dashboard'): string {
  if (typeof url !== 'string' || !url.startsWith('/') || url.startsWith('//')) {
    return fallback;
  }
  return url;
}
