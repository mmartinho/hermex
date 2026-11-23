/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Átomo Text. Texto corrido em Inter Regular na escala "body" do Figma
 *   (font-body-xxl…xs, altura de linha 120%).
 */
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/** Tamanhos de texto do Figma: xxl 31, xl 25, lg 20, md 16, sm 13, xs 10 (px). */
export type TextSize = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Tamanho (padrão: `md`). */
  size?: TextSize;
  /** Tag HTML (padrão: `p`). */
  as?: 'p' | 'span' | 'div' | 'small' | 'strong';
}

const SIZE_CLASSES: Record<TextSize, string> = {
  xxl: 'text-body-xxl',
  xl: 'text-body-xl',
  lg: 'text-body-lg',
  md: 'text-body-md',
  sm: 'text-body-sm',
  xs: 'text-body-xs',
};

/**
 * Texto do design system.
 *
 * @param props - Tamanho, tag e atributos nativos.
 * @returns Elemento de texto estilizado.
 */
export function Text({ size = 'md', as: Tag = 'p', className, ...rest }: TextProps) {
  return <Tag className={cn('font-sans font-normal', SIZE_CLASSES[size], className)} {...rest} />;
}
