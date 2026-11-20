/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-19
 * Data Atualização: 2026-11-19
 * Descrição: Molécula FormField. Combina Label + Input + mensagem de erro, com os atributos de
 *   acessibilidade já ligados.
 */
import { Input, type InputProps, Label } from '@/components/atoms';

export interface FormFieldProps extends InputProps {
  /** Id do campo (também usado no `name` se este não for informado). */
  id: string;
  /** Texto do rótulo. */
  label: string;
  /** Mensagem de erro do campo. */
  error?: string;
}

/**
 * Campo de formulário com rótulo e erro.
 *
 * @param props - Id, rótulo, erro e atributos do input.
 * @returns Bloco de campo de formulário.
 */
export function FormField({ id, label, error, name, ...inputProps }: FormFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name ?? id}
        invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
