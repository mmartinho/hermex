/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Organismo ProfileCard. Exibe os dados do usuário retornados pela query `me`.
 */
import { Avatar } from '@/components/atoms';
import type { MeQuery } from '@/gql/graphql';

export interface ProfileCardProps {
  /** Usuário retornado pela query `me`. */
  user: MeQuery['me'];
}

const ROLE_LABELS: Record<string, string> = { ADMIN: 'Administrador', CUSTOMER: 'Cliente' };

/**
 * Cartão com os dados do perfil.
 *
 * @param props - Usuário a exibir.
 * @returns Cartão com avatar, nome, email, papel e data de cadastro.
 */
export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <section className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Avatar name={user.name} src={user.image} size={64} />
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-sm text-slate-500">{user.email}</p>
        <p className="text-xs text-slate-400">
          {ROLE_LABELS[user.role] ?? user.role} · cliente desde{' '}
          {new Date(user.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </section>
  );
}
