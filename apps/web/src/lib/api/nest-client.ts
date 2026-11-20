/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Cliente HTTP mínimo (somente servidor) para executar operações GraphQL tipadas na
 *   API Nest. Usado pelo Auth.js nos fluxos de login, onde ainda não existe sessão, e é o único
 *   ponto do front que envia a chave interna (`x-internal-api-key`).
 */
import 'server-only';
import type { TypedDocumentNode } from '@apollo/client';
import { INTERNAL_API_KEY_HEADER } from '@hermex/shared';
import { print } from 'graphql';

/** Erro retornado pela API Nest (primeiro erro GraphQL da resposta). */
export class NestApiError extends Error {
  /**
   * @param message - Mensagem do erro.
   * @param code - Código em `extensions.code` (ex.: `UNAUTHENTICATED`, `CONFLICT`).
   */
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'NestApiError';
  }
}

/** Opções de uma requisição à API Nest. */
export interface NestRequestOptions {
  /** JWT da API para operações autenticadas. */
  accessToken?: string | null;
  /** Envia a chave interna (somente para mutations de uso interno). */
  internal?: boolean;
}

/** Formato da resposta GraphQL. */
interface GraphQLResponse<TData> {
  data?: TData | null;
  errors?: { message: string; extensions?: { code?: string } }[];
}

/**
 * Retorna a URL do endpoint GraphQL da API.
 *
 * @returns URL definida em `API_GRAPHQL_URL`.
 * @throws {Error} Se a variável não estiver configurada.
 */
export function getApiGraphqlUrl(): string {
  const url = process.env.API_GRAPHQL_URL;
  if (!url) {
    throw new Error('API_GRAPHQL_URL não configurada');
  }
  return url;
}

/**
 * Executa uma operação GraphQL na API Nest.
 *
 * @param document - Documento tipado gerado pelo GraphQL Codegen.
 * @param variables - Variáveis da operação.
 * @param options - Token de acesso e/ou uso da chave interna.
 * @returns O campo `data` da resposta.
 * @throws {NestApiError} Se a API responder com erros GraphQL ou sem dados.
 * @throws {Error} Se `INTERNAL_API_KEY` for exigida e não estiver configurada.
 */
export async function nestRequest<TData, TVariables>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
  options: NestRequestOptions = {},
): Promise<TData> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };

  if (options.accessToken) {
    headers.authorization = `Bearer ${options.accessToken}`;
  }
  if (options.internal) {
    const key = process.env.INTERNAL_API_KEY;
    if (!key) {
      throw new Error('INTERNAL_API_KEY não configurada');
    }
    headers[INTERNAL_API_KEY_HEADER] = key;
  }

  const response = await fetch(getApiGraphqlUrl(), {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: print(document), variables }),
    cache: 'no-store',
  });

  const json = (await response.json()) as GraphQLResponse<TData>;
  const firstError = json.errors?.[0];
  if (firstError) {
    throw new NestApiError(firstError.message, firstError.extensions?.code);
  }
  if (!json.data) {
    throw new NestApiError(`Resposta inválida da API (HTTP ${response.status})`);
  }
  return json.data;
}
