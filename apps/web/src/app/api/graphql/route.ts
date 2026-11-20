/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Proxy GraphQL para o Apollo Client do navegador. Recebe a operação na mesma
 *   origem (autenticada pelo cookie do Auth.js), anexa o JWT da API Nest no servidor e
 *   repassa para a API. Assim o token da API nunca chega ao JavaScript do navegador.
 */
import { getApiGraphqlUrl } from '@/lib/api/nest-client';
import { getAccessToken } from '@/lib/auth/session';

/**
 * Encaminha uma operação GraphQL para a API Nest.
 *
 * @param request - Requisição POST com o corpo GraphQL (JSON).
 * @returns A resposta da API, com o mesmo status e corpo.
 */
export async function POST(request: Request): Promise<Response> {
  const accessToken = await getAccessToken(request.headers);

  const upstream = await fetch(getApiGraphqlUrl(), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
    },
    body: await request.text(),
    cache: 'no-store',
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
  });
}
