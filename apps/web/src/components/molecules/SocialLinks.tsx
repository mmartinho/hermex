/**
 * Autor(es): Marcus Antonio Martinho Silva <marcus.antonio.martinho.silva@gmail.com>, Claude Code
 * Data Criação: 2026-11-20
 * Data Atualização: 2026-11-20
 * Descrição: Molécula SocialLinks. Lista de ícones (32×32) com link para as redes sociais da
 *   Hermex — WhatsApp, Instagram e TikTok — usando os SVGs exportados do Figma (rodapé).
 */
import Image from 'next/image';
import { cn } from '@/lib/cn';

/** Redes sociais suportadas. */
export type SocialNetwork = 'whatsapp' | 'instagram' | 'tiktok';

/** Link de uma rede social. */
export interface SocialLink {
  network: SocialNetwork;
  href: string;
}

export interface SocialLinksProps {
  /** Links a exibir, na ordem desejada. */
  links: SocialLink[];
  className?: string;
}

/** Ícone (em `public/social`) e nome legível de cada rede. */
const NETWORKS: Record<SocialNetwork, { icon: string; name: string }> = {
  whatsapp: { icon: '/social/whatsapp.svg', name: 'WhatsApp' },
  instagram: { icon: '/social/instagram.svg', name: 'Instagram' },
  tiktok: { icon: '/social/tiktok.svg', name: 'TikTok' },
};

/**
 * Ícones das redes sociais.
 *
 * @param props - Links das redes e classes extras.
 * @returns Lista horizontal de links que abrem em nova aba.
 */
export function SocialLinks({ links, className }: SocialLinksProps) {
  return (
    <ul className={cn('flex items-start gap-2', className)}>
      {links.map(({ network, href }) => {
        const { icon, name } = NETWORKS[network];
        return (
          <li key={network}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Hermex no ${name}`}
              className="block rounded transition-opacity outline-none hover:opacity-80 focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <Image src={icon} alt="" width={32} height={32} unoptimized />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
