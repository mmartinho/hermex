/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Átomo Logo. Marca Hermex (180×60) a partir dos SVGs exportados do Figma
 *   ("Hermex logo 1" para fundo claro e "Hermex logo 2" para fundo escuro). O logo é composto
 *   por duas camadas — "hermex" e "locadora" — posicionadas exatamente como no Figma.
 */
import Image from 'next/image';
import { cn } from '@/lib/cn';

/** `default`: para fundo claro; `inverse`: para fundo escuro (rodapé). */
export type LogoVariant = 'default' | 'inverse';

export interface LogoProps {
  /** Variante de cor (padrão: `default`). */
  variant?: LogoVariant;
  className?: string;
}

/** Arquivos (em `public/brand`) das duas camadas de cada variante. */
const SOURCES: Record<LogoVariant, { mark: string; tagline: string }> = {
  default: {
    mark: '/brand/hermex-logo-mark.svg',
    tagline: '/brand/hermex-logo-tagline.svg',
  },
  inverse: {
    mark: '/brand/hermex-logo-inverse-mark.svg',
    tagline: '/brand/hermex-logo-inverse-tagline.svg',
  },
};

/**
 * Logo da Hermex.
 *
 * @param props - Variante de cor e classes extras.
 * @returns Bloco 180×60 com o logo (rotulado como imagem para leitores de tela).
 */
export function Logo({ variant = 'default', className }: LogoProps) {
  const { mark, tagline } = SOURCES[variant];

  return (
    <span
      role="img"
      aria-label="Hermex locadora"
      className={cn('relative block h-[60.472px] w-[180px] shrink-0 overflow-hidden', className)}
    >
      {/* Posições (inset em %) copiadas do Figma, nodes 73:1050 e 73:1064. */}
      <span className="absolute inset-[9.94%_7.95%_41.59%_7.95%]">
        <Image src={mark} alt="" fill unoptimized priority />
      </span>
      <span className="absolute inset-[65.71%_8.64%_16.45%_48.32%]">
        <Image src={tagline} alt="" fill unoptimized priority />
      </span>
    </span>
  );
}
