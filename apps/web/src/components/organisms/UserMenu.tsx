/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Organismo UserMenu (Server Component). Lê a sessão e mostra avatar, nome e o
 *   botão de sair. Por ler dados da requisição, deve ser renderizado dentro de `<Suspense>`.
 */
import { Avatar, Button } from '@/components/atoms';
import { logout } from '@/lib/auth/actions';
import { requireSession } from '@/lib/auth/session';

/**
 * Menu do usuário autenticado.
 *
 * @returns Avatar, nome e botão de logout.
 * @throws Redirecionamento para `/login` se não houver sessão.
 */
export async function UserMenu() {
  const { user } = await requireSession();

  return (
    <div className="flex items-center gap-3">
      <Avatar name={user.name} src={user.image} />
      <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
      <form action={logout}>
        <Button type="submit" variant="ghost">
          Sair
        </Button>
      </form>
    </div>
  );
}
