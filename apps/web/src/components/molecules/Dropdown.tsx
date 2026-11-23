/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Molécula Dropdown. Seletor visual dos componentes "Dropdown horário" / "Dropdown
 *   horário aberto" e "Filtro" / "Filtro aberto" do Figma: gatilho com texto e seta e, quando
 *   aberto, a lista de opções separadas por linhas. É apresentacional: o estado (aberto e valor)
 *   vem por props, e a lógica de abrir/selecionar fica com quem o usa.
 */
import {
  Divider,
  type DividerTone,
  FIELD_BASE_CLASSES,
  FIELD_STATE_CLASSES,
  FIELD_TONE_CLASSES,
  Icon,
} from '@/components/atoms';
import { cn } from '@/lib/cn';

/** Tons do dropdown: `inverse` (sobre a faixa laranja) e `secondary` (filtro de categoria). */
export type DropdownTone = 'inverse' | 'secondary';

/** Opção do dropdown. */
export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  /** Rótulo acessível do seletor. */
  label: string;
  /** Texto exibido quando não há valor selecionado. */
  placeholder: string;
  /** Opções da lista. */
  options: DropdownOption[];
  /** Valor selecionado. */
  value?: string;
  /** Lista aberta (padrão: `false`). */
  open?: boolean;
  /** Tom (padrão: `secondary`). */
  tone?: DropdownTone;
  /** Chamado ao clicar no gatilho. */
  onToggle?: () => void;
  /** Chamado ao clicar numa opção. */
  onSelect?: (value: string) => void;
  /** Classes do contêiner (largura, por exemplo). */
  className?: string;
}

/** Cores do texto das opções (selecionada e demais) e das linhas, por tom — conforme o Figma. */
const TONE_STYLES: Record<
  DropdownTone,
  { selected: string; option: string; divider: DividerTone }
> = {
  inverse: { selected: 'text-secondary', option: 'text-neutral-white', divider: 'secondary-light' },
  secondary: { selected: 'text-primary-dark', option: 'text-secondary', divider: 'white' },
};

/**
 * Seletor com lista de opções.
 *
 * @param props - Rótulo, opções, valor, estado aberto, tom e callbacks.
 * @returns Gatilho e, se aberto, a lista de opções (padrão WAI-ARIA listbox).
 */
export function Dropdown({
  label,
  placeholder,
  options,
  value,
  open = false,
  tone = 'secondary',
  onToggle,
  onSelect,
  className,
}: DropdownProps) {
  const styles = TONE_STYLES[tone];
  const selected = options.find((option) => option.value === value);

  return (
    <div className={cn('relative inline-flex flex-col', className)}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={onToggle}
        className={cn(
          FIELD_BASE_CLASSES,
          FIELD_TONE_CLASSES[tone],
          FIELD_STATE_CLASSES,
          'w-full cursor-pointer text-left outline-none',
          open && 'rounded-b-none',
        )}
      >
        <span className="flex-1 whitespace-nowrap">{selected?.label ?? placeholder}</span>
        <Icon name={open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className={cn(
            'absolute top-full z-10 -mt-px flex w-max min-w-full flex-col items-center gap-2 rounded-b border px-4 py-3 text-body-md',
            tone === 'inverse'
              ? 'border-neutral-white bg-primary-dark'
              : 'border-secondary bg-neutral-white',
          )}
        >
          {options.map((option, index) => (
            <li key={option.value} className="flex w-full flex-col items-center gap-2">
              {index > 0 && <Divider tone={styles.divider} className="max-w-40" />}
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => onSelect?.(option.value)}
                className={cn(
                  'w-full cursor-pointer text-center hover:underline',
                  option.value === value ? styles.selected : styles.option,
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
