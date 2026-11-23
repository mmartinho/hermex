/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories da molécula Price: preço da diária do card de carro.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Price } from './Price';

const meta = {
  title: 'Moléculas/Price',
  component: Price,
  args: { amount: 120 },
} satisfies Meta<typeof Price>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Diaria: Story = {};

export const ComCentavos: Story = { args: { amount: 149.9 } };

export const OutroPeriodo: Story = { args: { amount: 690, period: '/semana' } };
