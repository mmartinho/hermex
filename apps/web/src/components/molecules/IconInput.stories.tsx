/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories da molécula IconInput: campo de busca do header, campos de local e data da
 *   busca de carros e os estados do Figma.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconInput } from './IconInput';

const meta = {
  title: 'Moléculas/IconInput',
  component: IconInput,
  args: { icon: 'search', label: 'Buscar', placeholder: 'O que você procura?', tone: 'neutral' },
  argTypes: { tone: { control: 'inline-radio', options: ['neutral', 'inverse', 'secondary'] } },
} satisfies Meta<typeof IconInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Busca: Story = {};

export const Localizacao: Story = {
  args: {
    icon: 'location_on',
    label: 'Local de retirada',
    placeholder: 'Local de retirada',
    tone: 'inverse',
    className: 'w-[420px]',
  },
  globals: { backgrounds: { value: 'primary' } },
};

export const Data: Story = {
  args: {
    icon: 'calendar_month',
    label: 'Data de retirada',
    placeholder: 'Data',
    tone: 'inverse',
    className: 'w-32',
  },
  globals: { backgrounds: { value: 'primary' } },
};

export const Invalido: Story = {
  args: { invalid: true },
};

const STATES = [
  { label: 'Padrão', className: '' },
  { label: 'Hover', className: 'is-hover' },
  { label: 'Pressed', className: 'is-pressed' },
  { label: 'Foco', className: 'is-focus' },
];

export const Estados: Story = {
  parameters: {
    pseudo: { hover: ['.is-hover'], active: ['.is-pressed'], focusWithin: ['.is-focus'] },
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      {STATES.map(({ label, className }) => (
        <IconInput key={label} {...args} placeholder={label} className={className} />
      ))}
    </div>
  ),
};
