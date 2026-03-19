import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu · Rebar Gastronomía & Cocteles',
  description: 'Explore our full menu — chef-driven tapas, bao, entrées, seafood, handcrafted cocktails, and more at Rebar in Aguadilla, Puerto Rico.',
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
