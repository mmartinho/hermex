/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Átomo Thumbnail. Moldura de imagem do card de carro (280×160 no Figma) com fundo
 *   cinza (neutral-details) e a foto contida e centralizada.
 */
import Image from 'next/image';
import { cn } from '@/lib/cn';

export interface ThumbnailProps {
  /** URL da imagem (local ou de domínio liberado no next.config). */
  src: string;
  /** Texto alternativo da imagem. */
  alt: string;
  /** Valor de `sizes` do next/image (padrão: 280px, largura do card no Figma). */
  sizes?: string;
  className?: string;
}

/**
 * Imagem com moldura de proporção fixa.
 *
 * @param props - Imagem, texto alternativo, `sizes` e classes extras.
 * @returns Moldura com a imagem ajustada (`object-contain`).
 */
export function Thumbnail({ src, alt, sizes = '280px', className }: ThumbnailProps) {
  return (
    <div
      className={cn(
        'relative aspect-[7/4] w-[280px] max-w-full overflow-hidden bg-neutral-details',
        className,
      )}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-contain p-3" />
    </div>
  );
}
