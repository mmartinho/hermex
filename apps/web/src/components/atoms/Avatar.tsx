/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-20
 * Descrição: Átomo Avatar. Mostra a foto do usuário (ex.: vinda do Google/Facebook) ou suas
 *   iniciais quando não há foto.
 */
import Image from 'next/image';

export interface AvatarProps {
  /** Nome do usuário (usado no alt e nas iniciais). */
  name?: string | null;
  /** URL da foto. */
  src?: string | null;
  /** Tamanho em pixels (padrão: 36). */
  size?: number;
}

/**
 * Extrai até duas iniciais de um nome.
 *
 * @param name - Nome completo.
 * @returns Iniciais em maiúsculas, ou `?` se o nome for vazio.
 */
export function getInitials(name?: string | null): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}

/**
 * Avatar circular do usuário.
 *
 * @param props - Nome, foto e tamanho.
 * @returns Imagem ou iniciais dentro de um círculo.
 */
export function Avatar({ name, src, size = 36 }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? 'Foto do usuário'}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <span
      aria-label={name ?? 'Usuário'}
      style={{ width: size, height: size }}
      className="inline-flex items-center justify-center rounded-full bg-primary-light text-body-sm font-bold text-secondary"
    >
      {getInitials(name)}
    </span>
  );
}
