/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Layout do grupo de rotas privadas (área logada). Aplica o PrivateTemplate; a
 *   proteção é feita pelo proxy (otimista) e pelas consultas autenticadas (definitiva).
 */
import { PrivateTemplate } from '@/components/templates';

/**
 * Layout da área logada.
 *
 * @param props.children - Página privada.
 * @returns A página dentro do template privado.
 */
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <PrivateTemplate>{children}</PrivateTemplate>;
}
