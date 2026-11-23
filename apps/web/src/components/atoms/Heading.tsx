/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Átomo Heading. Títulos em Exo 2 Bold na escala do Figma (font-heading-xxl…xs,
 *   base 16 e escala 1.25), com a tag HTML escolhida separadamente do tamanho visual.
 */
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/** Tamanhos de título do Figma: xxl 76, xl 61, lg 49, md 39, sm 31, xs 25 (px). */
export type HeadingSize = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

/** Tags aceitas pelo Heading. */
export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Tamanho visual (padrão: `md`). */
  size?: HeadingSize;
  /** Tag HTML; se omitida, segue o tamanho (xxl→h1 … xs→h6). */
  as?: HeadingTag;
}

const SIZE_CLASSES: Record<HeadingSize, string> = {
  xxl: 'text-heading-xxl',
  xl: 'text-heading-xl',
  lg: 'text-heading-lg',
  md: 'text-heading-md',
  sm: 'text-heading-sm',
  xs: 'text-heading-xs',
};

const DEFAULT_TAG: Record<HeadingSize, HeadingTag> = {
  xxl: 'h1',
  xl: 'h2',
  lg: 'h3',
  md: 'h4',
  sm: 'h5',
  xs: 'h6',
};

/**
 * Título do design system.
 *
 * @param props - Tamanho, tag e atributos nativos.
 * @returns Elemento de título estilizado.
 */
export function Heading({ size = 'md', as, className, ...rest }: HeadingProps) {
  const Tag = as ?? DEFAULT_TAG[size];
  return <Tag className={cn('font-heading font-bold', SIZE_CLASSES[size], className)} {...rest} />;
}
