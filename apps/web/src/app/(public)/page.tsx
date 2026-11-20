/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Página inicial pública (home) da locadora Hermex.
 */
import { NavLink } from '@/components/molecules';
import { PublicTemplate } from '@/components/templates';

/**
 * Home pública.
 *
 * @returns Página de apresentação com chamada para login.
 */
export default function HomePage() {
  return (
    <PublicTemplate>
      <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          O carro certo para a sua próxima viagem.
        </h1>
        <p className="max-w-xl text-lg text-slate-500">
          Reserve em minutos, retire sem fila. Entre com sua conta Google ou Facebook.
        </p>
        <NavLink href="/login" highlight className="px-6 py-3 text-base">
          Começar agora
        </NavLink>
      </section>
    </PublicTemplate>
  );
}
