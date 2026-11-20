/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Formatação dos erros GraphQL da API. Converte o status HTTP das exceções do Nest
 *   (ex.: ConflictException = 409) em códigos estáveis em `extensions.code`, para que os
 *   clientes tratem erros sem depender do texto da mensagem.
 */
import type { GraphQLFormattedError } from 'graphql';

/** Mapa de status HTTP -> código GraphQL. */
const STATUS_TO_CODE: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
};

/**
 * Cria a função `formatError` do Apollo Server.
 *
 * @param includeStacktrace - Mantém o stacktrace nas extensões (somente em desenvolvimento).
 * @returns Função que recebe o erro formatado pelo Apollo e devolve o erro final ao cliente.
 */
export function createFormatError(
  includeStacktrace: boolean,
): (formatted: GraphQLFormattedError) => GraphQLFormattedError {
  return (formatted) => {
    const extensions = { ...(formatted.extensions ?? {}) };
    const original = extensions.originalError as { statusCode?: number } | undefined;
    const mapped = original?.statusCode ? STATUS_TO_CODE[original.statusCode] : undefined;

    if (mapped) {
      extensions.code = mapped;
    }
    if (!includeStacktrace) {
      delete extensions.stacktrace;
    }
    return { ...formatted, extensions };
  };
}
