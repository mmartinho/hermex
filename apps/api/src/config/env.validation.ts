/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Validação das variáveis de ambiente da API. É executada pelo ConfigModule na
 *   inicialização para falhar cedo (fail fast) quando alguma configuração obrigatória faltar.
 */

/** Variáveis de ambiente que precisam estar definidas para a API subir. */
const REQUIRED_KEYS = ['DATABASE_URL', 'JWT_SECRET', 'INTERNAL_API_KEY'] as const;

/** Tamanho mínimo aceito para segredos (JWT e chave interna). */
const MIN_SECRET_LENGTH = 16;

/**
 * Valida o objeto de configuração carregado do ambiente.
 *
 * @param config - Variáveis de ambiente brutas (process.env + .env).
 * @returns O mesmo objeto de configuração, com `PORT` convertido para número.
 * @throws {Error} Se uma variável obrigatória estiver ausente ou se um segredo for curto demais.
 */
export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const missing = REQUIRED_KEYS.filter((key) => !config[key]);
  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente obrigatórias ausentes: ${missing.join(', ')}`);
  }

  for (const key of ['JWT_SECRET', 'INTERNAL_API_KEY'] as const) {
    if (String(config[key]).length < MIN_SECRET_LENGTH) {
      throw new Error(`${key} deve ter pelo menos ${MIN_SECRET_LENGTH} caracteres`);
    }
  }

  return {
    ...config,
    PORT: config.PORT ? Number(config.PORT) : 4000,
  };
}
