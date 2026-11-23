/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories da molécula FormField: campo com rótulo, com e sem erro.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FormField } from './FormField';

const meta = {
  title: 'Moléculas/FormField',
  component: FormField,
  args: { id: 'email', label: 'Email', type: 'email', placeholder: 'voce@exemplo.com' },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const ComErro: Story = {
  args: { error: 'Informe um email válido.', defaultValue: 'maria@' },
};
