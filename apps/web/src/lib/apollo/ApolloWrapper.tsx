/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Provider do Apollo Client para Client Components. Aponta para o proxy
 *   /api/graphql da própria aplicação, que anexa o JWT da API no servidor.
 */
'use client';

import { HttpLink } from '@apollo/client';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import type { ReactNode } from 'react';

/**
 * Cria uma instância do Apollo Client (uma por requisição no SSR, uma no navegador).
 *
 * @returns Nova instância do Apollo Client.
 */
function makeClient(): ApolloClient {
  const baseUrl =
    typeof window === 'undefined'
      ? (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')
      : '';

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: `${baseUrl}/api/graphql` }),
  });
}

/**
 * Disponibiliza o Apollo Client para os Client Components.
 *
 * @param props.children - Árvore de componentes da aplicação.
 * @returns O provider do Apollo envolvendo `children`.
 */
export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
