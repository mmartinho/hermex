/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do átomo Logo: variantes para fundo claro e escuro.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Logo } from './Logo';

const meta = {
  title: 'Átomos/Logo',
  component: Logo,
  args: { variant: 'default' },
  argTypes: { variant: { control: 'inline-radio', options: ['default', 'inverse'] } },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Invertido: Story = {
  args: { variant: 'inverse' },
  globals: { backgrounds: { value: 'secondary' } },
};
