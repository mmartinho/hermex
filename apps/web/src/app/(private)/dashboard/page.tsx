/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Página inicial da área logada. Busca o usuário autenticado na API (query `me`)
 *   via Apollo em Server Component, sob Suspense.
 */
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Spinner } from '@/components/atoms';
import { ProfileCard } from '@/components/organisms';
import { MeDocument } from '@/gql/graphql';
import { authenticatedQuery } from '@/lib/apollo/server';

export const metadata: Metadata = { title: 'Minha conta' };

/**
 * Carrega e exibe o perfil do usuário.
 *
 * @returns Cartão de perfil.
 * @throws Redirecionamento para `/login` se não houver sessão.
 */
async function Profile() {
  const { me } = await authenticatedQuery(MeDocument);
  return <ProfileCard user={me} />;
}

/**
 * Dashboard do usuário.
 *
 * @returns Página com saudação e perfil.
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Minha conta</h1>
      <Suspense fallback={<Spinner size="lg" />}>
        <Profile />
      </Suspense>
    </div>
  );
}
