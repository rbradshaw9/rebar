import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events · Rebar Gastronomía & Cocteles',
  description: 'Upcoming events, weekly specials, and private event hosting at Rebar in Aguadilla, Puerto Rico.',
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
