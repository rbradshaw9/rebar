import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Rebar Gastronomía & Cocteles',
  description: 'Learn the story of Rebar — a modern bar and restaurant in Aguadilla, Puerto Rico, crafting eclectic cuisine and handcrafted cocktails.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
