/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do átomo Divider: tons de linha disponíveis.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Divider } from './Divider';

const meta = {
  title: 'Átomos/Divider',
  component: Divider,
  args: { tone: 'divisor' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['divisor', 'details', 'secondary-light', 'white'] },
  },
  decorators: [(Story) => <div className="w-40 p-4">{Story()}</div>],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Divisor: Story = {};

export const Detalhes: Story = { args: { tone: 'details' } };

export const SecundarioClaro: Story = {
  args: { tone: 'secondary-light' },
  globals: { backgrounds: { value: 'primary' } },
};

export const Branco: Story = {
  args: { tone: 'white' },
  globals: { backgrounds: { value: 'secondary' } },
};
