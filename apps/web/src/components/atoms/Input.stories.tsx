/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do átomo Input: tons do Figma (neutro, invertido, secundário), estados
 *   (padrão, hover, pressed, foco) e erro.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from './Input';

const meta = {
  title: 'Átomos/Input',
  component: Input,
  args: { placeholder: 'Digite aqui', tone: 'neutral', 'aria-label': 'Campo de exemplo' },
  argTypes: { tone: { control: 'inline-radio', options: ['neutral', 'inverse', 'secondary'] } },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
} satisfies Meta<typeof Input>;

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
  args: { invalid: true, defaultValue: 'valor inválido' },
};

export const Estados: Story = {
  parameters: {
    pseudo: { hover: ['.is-hover'], active: ['.is-pressed'], focusWithin: ['.is-focus'] },
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Input {...args} placeholder="Padrão" />
      <Input {...args} placeholder="Hover" className="is-hover" />
      <Input {...args} placeholder="Pressed" className="is-pressed" />
      <Input {...args} placeholder="Foco" className="is-focus" />
    </div>
  ),
};
