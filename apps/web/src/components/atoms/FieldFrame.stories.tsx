/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do átomo FieldFrame: moldura dos campos nos três tons e nos estados do Figma.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FieldFrame } from './FieldFrame';
import { Icon } from './Icon';

const meta = {
  title: 'Átomos/FieldFrame',
  component: FieldFrame,
  args: { tone: 'neutral' },
  argTypes: { tone: { control: 'inline-radio', options: ['neutral', 'inverse', 'secondary'] } },
  render: (args) => (
    <FieldFrame {...args}>
      <Icon name="search" />
      <span>O que você procura?</span>
    </FieldFrame>
  ),
} satisfies Meta<typeof FieldFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutro: Story = {};

export const Invertido: Story = {
  args: { tone: 'inverse' },
  globals: { backgrounds: { value: 'primary' } },
};

export const Secundario: Story = {
  args: { tone: 'secondary' },
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
        <FieldFrame key={label} {...args} className={className}>
          <Icon name="search" />
          <span>{label}</span>
        </FieldFrame>
      ))}
    </div>
  ),
};
