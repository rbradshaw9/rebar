import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery · Rebar Gastronomía & Cocteles',
  description: 'A visual tour of Rebar — food, cocktails, ambiance, and events at our restaurant in Aguadilla, Puerto Rico.',
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
