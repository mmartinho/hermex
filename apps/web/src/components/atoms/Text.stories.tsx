/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do átomo Text: escala de texto (body) do Figma.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Text } from './Text';

const SIZES = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;

const meta = {
  title: 'Átomos/Text',
  component: Text,
  args: { size: 'md', children: 'O carro ideal para sua ocasião' },
  argTypes: { size: { control: 'inline-radio', options: SIZES } },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Escala: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2 text-neutral-text">
      {SIZES.map((size) => (
        <Text key={size} {...args} size={size}>
          body-{size} — O carro ideal para sua ocasião
        </Text>
      ))}
    </div>
  ),
};
