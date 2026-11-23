/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do átomo Surface: superfície do card, estática e interativa (hover).
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Surface } from './Surface';
import { Text } from './Text';

const meta = {
  title: 'Átomos/Surface',
  component: Surface,
  args: { interactive: true, className: 'w-[360px]' },
  parameters: { layout: 'padded' },
  render: (args) => (
    <Surface {...args}>
      <Text>Conteúdo do card</Text>
    </Surface>
  ),
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
};

export const Estatica: Story = {
  args: { interactive: false },
};
