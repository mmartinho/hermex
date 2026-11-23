/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Stories do átomo Icon: ícones Material Icons usados no design system.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Icon } from './Icon';

const ICONS = [
  'search',
  'account_circle',
  'login',
  'logout',
  'location_on',
  'calendar_month',
  'keyboard_arrow_down',
  'keyboard_arrow_up',
  'add',
];

const meta = {
  title: 'Átomos/Icon',
  component: Icon,
  args: { name: 'search' },
  argTypes: { name: { control: 'select', options: ICONS }, size: { control: 'number' } },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Grande: Story = {
  args: { size: 48, className: 'text-primary' },
};

export const Catalogo: Story = {
  render: () => (
    <ul className="grid grid-cols-3 gap-6 text-neutral-text">
      {ICONS.map((name) => (
        <li key={name} className="flex flex-col items-center gap-2">
          <Icon name={name} size={32} />
          <code className="text-body-sm">{name}</code>
        </li>
      ))}
    </ul>
  ),
};
