import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact · Rebar Gastronomía & Cocteles',
  description: 'Get in touch with Rebar — email, phone, WhatsApp, or our contact form. Located in Aguadilla, Puerto Rico.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
