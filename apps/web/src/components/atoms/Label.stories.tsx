/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do átomo Label.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from './Label';

const meta = {
  title: 'Átomos/Label',
  component: Label,
  args: { children: 'Email', htmlFor: 'email' },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
