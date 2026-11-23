/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories da molécula Dropdown: "Filtro" de categoria e "Dropdown horário" do Figma,
 *   fechados e abertos, além de um exemplo interativo (estado controlado pela própria story).
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Dropdown, type DropdownProps } from './Dropdown';

const CATEGORIES = ['Hatch', 'Sedan', 'Pickups', 'Esportivo', 'Crossover'].map((label) => ({
  value: label.toLowerCase(),
  label,
}));

const TIMES = ['10:00', '10:30', '11:00', '11:30'].map((time) => ({ value: time, label: time }));

const meta = {
  title: 'Moléculas/Dropdown',
  component: Dropdown,
  args: {
    label: 'Categoria',
    placeholder: 'Selecione a categoria',
    options: CATEGORIES,
    tone: 'secondary',
  },
  argTypes: { tone: { control: 'inline-radio', options: ['inverse', 'secondary'] } },
  // Espaço para a lista aberta, que fica sobreposta ao conteúdo.
  decorators: [(Story) => <div className="min-h-64 p-4">{Story()}</div>],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filtro: Story = {};

export const FiltroAberto: Story = {
  args: { open: true, value: 'hatch' },
};

export const Horario: Story = {
  args: {
    label: 'Horário de retirada',
    placeholder: 'Horário',
    options: TIMES,
    tone: 'inverse',
    className: 'w-32',
  },
  globals: { backgrounds: { value: 'primary' } },
};

export const HorarioAberto: Story = {
  args: { ...Horario.args, open: true, value: '10:00' },
  globals: { backgrounds: { value: 'primary' } },
};

/**
 * Exemplo com estado local, só para experimentar no Storybook.
 *
 * @param props - Props do Dropdown.
 * @returns Dropdown que abre, fecha e seleciona.
 */
function InteractiveDropdown(props: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>();
  return (
    <Dropdown
      {...props}
      open={open}
      value={value}
      onToggle={() => setOpen((current) => !current)}
      onSelect={(selected) => {
        setValue(selected);
        setOpen(false);
      }}
    />
  );
}

export const Interativo: Story = {
  render: (args) => <InteractiveDropdown {...args} />,
};
