/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Apollo Client para React Server Components. Conecta direto na API Nest e expõe
 *   `authenticatedQuery`, que injeta o JWT da API lido da sessão do Auth.js.
 */
import 'server-only';
import { HttpLink, type OperationVariables, type TypedDocumentNode } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs';
import { redirect } from 'next/navigation';
import { getApiGraphqlUrl } from '@/lib/api/nest-client';
import { getAccessToken } from '@/lib/auth/session';

export const { getClient } = registerApolloClient(
  () =>
    new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({ uri: getApiGraphqlUrl() }),
    }),
);

/**
 * Executa uma query autenticada na API a partir de um Server Component.
 *
 * @param query - Documento tipado gerado pelo GraphQL Codegen.
 * @param variables - Variáveis da query.
 * @returns Os dados da query.
 * @throws Redirecionamento para `/login` se não houver sessão.
 * @throws {Error} Erros GraphQL/rede retornados pela API (ex.: token expirado).
 */
export async function authenticatedQuery<TData, TVariables extends OperationVariables>(
  query: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
): Promise<TData> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect('/login');
  }

  const { data } = await getClient().query<TData, TVariables>({
    query,
    variables: variables as TVariables,
    fetchPolicy: 'no-cache',
    context: { headers: { authorization: `Bearer ${accessToken}` } },
  });

  if (!data) {
    throw new Error('A API não retornou dados');
  }
  return data;
}
