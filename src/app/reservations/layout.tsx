import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservations · Rebar Gastronomía & Cocteles',
  description: 'Reserve your table at Rebar — call, WhatsApp, or email us. Private events welcome. Aguadilla, Puerto Rico.',
};

export default function ReservationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
