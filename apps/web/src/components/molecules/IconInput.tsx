/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Molécula IconInput. Campo com ícone à esquerda (FieldFrame + Icon + Input sem
 *   moldura). Cobre os campos "Campo de busca", "Campo de busca localização" e "Campo de data"
 *   do Figma. O rótulo é só para leitores de tela, pois o Figma não mostra rótulo visível.
 */
import { useId } from 'react';
import {
  FieldFrame,
  type FieldTone,
  Icon,
  Input,
  type InputProps,
  type MaterialIconName,
} from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface IconInputProps extends Omit<InputProps, 'bare' | 'tone'> {
  /** Ícone Material Icons à esquerda (ex.: `search`, `location_on`, `calendar_month`). */
  icon: MaterialIconName;
  /** Rótulo acessível do campo (não é exibido). */
  label: string;
  /** Tom do campo (padrão: `neutral`). */
  tone?: FieldTone;
  /** Classes da moldura (largura, por exemplo). */
  className?: string;
  /** Classes do `<input>` interno. */
  inputClassName?: string;
}

/**
 * Campo de texto com ícone.
 *
 * @param props - Ícone, rótulo acessível, tom, classes e atributos nativos do input.
 * @returns Moldura com ícone e input, rótulo associado via `<label>` oculto.
 */
export function IconInput({
  icon,
  label,
  tone = 'neutral',
  invalid,
  id,
  className,
  inputClassName,
  ...inputProps
}: IconInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FieldFrame tone={tone} invalid={invalid} className={className}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <Icon name={icon} />
      <Input
        id={inputId}
        bare
        tone={tone}
        invalid={invalid}
        className={cn(
          // Esconde o ícone nativo do calendário: o ícone do Figma fica à esquerda.
          '[&::-webkit-calendar-picker-indicator]:hidden',
          inputClassName,
        )}
        {...inputProps}
      />
    </FieldFrame>
  );
}
