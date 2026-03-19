import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/lib/LanguageContext';
import { AdminEditProvider } from '@/lib/AdminEditContext';
import AdminEditBar from '@/components/AdminEditBar';

export const metadata: Metadata = {
  title: 'Rebar Gastronomía & Cocteles | Upscale Restaurant & Cocktail Bar in Aguadilla, PR',
  description: 'Experience chef-driven cuisine and handcrafted cocktails at Rebar Gastronomía & Cocteles — Aguadilla\'s premier gastronomy and cocktail bar. Open Mon & Wed–Sun. Call 787-658-1669.',
  keywords: 'restaurant Aguadilla PR, cocktail bar Aguadilla, upscale dining Puerto Rico, gastronomia aguadilla, rebar PR, rebar aguadilla, restaurante aguadilla, cocteles aguadilla, best restaurant northwest puerto rico',
  metadataBase: new URL('https://rebarpr.com'),
  alternates: { canonical: 'https://rebarpr.com' },
  icons: { icon: '/favicon.png', shortcut: '/favicon.png', apple: '/favicon.png' },
  openGraph: {
    title: 'Rebar Gastronomía & Cocteles | Aguadilla, PR',
    description: 'Chef-driven cuisine and handcrafted cocktails in Aguadilla, Puerto Rico. Open Mon & Wed–Sun from 4PM.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Rebar Gastronomía & Cocteles',
    url: 'https://rebarpr.com',
    images: [{ url: '/images/instagram/rebar_food_01.jpg', width: 1200, height: 630, alt: 'Rebar Gastronomía & Cocteles — Aguadilla, Puerto Rico' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rebar Gastronomía & Cocteles | Aguadilla, PR',
    description: 'Chef-driven cuisine and handcrafted cocktails in Aguadilla, Puerto Rico.',
    images: ['/images/instagram/rebar_food_01.jpg'],
  },
  other: {
    'geo.region': 'US-PR',
    'geo.placename': 'Aguadilla, Puerto Rico',
    'geo.position': '18.503836;-67.11725',
    'ICBM': '18.503836, -67.11725',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              name: 'Rebar Gastronomía & Cocteles',
              image: 'https://rebarpr.com/images/instagram/rebar_food_01.jpg',
              '@id': 'https://rebarpr.com',
              url: 'https://rebarpr.com',
              telephone: '+17876581669',
              email: 'rebargastronomia@gmail.com',
              priceRange: '$$',
              servesCuisine: ['Puerto Rican', 'Caribbean', 'Asian Fusion', 'Mediterranean', 'American'],
              currenciesAccepted: 'USD',
              paymentAccepted: 'Cash, Credit Card',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Carr. 110 Km 32.4, Bo. Maleza Alta',
                addressLocality: 'Aguadilla',
                addressRegion: 'PR',
                postalCode: '00603',
                addressCountry: 'US',
              },
              geo: { '@type': 'GeoCoordinates', latitude: 18.503836, longitude: -67.11725 },
              hasMap: 'https://maps.google.com/?q=Rebar+Gastronom%C3%ADa+%26+Cocteles,+Aguadilla,+PR',
              menu: 'https://rebarpr.com/menu',
              acceptsReservations: true,
              sameAs: [
                'https://www.instagram.com/rebarpr',
                'https://www.facebook.com/p/Rebar-Gastronom%C3%ADa-100093088920480/',
              ],
              openingHoursSpecification: [
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday'], opens: '16:00', closes: '22:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Wednesday', 'Thursday'], opens: '16:00', closes: '22:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '16:00', closes: '23:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '14:30', closes: '21:00' },
              ],
            }),
          }}
        />
      </head>
      <body>
        <AdminEditProvider>
          <LanguageProvider>
            <Nav />
            <main>{children}</main>
            <Footer />
            <AdminEditBar />
          </LanguageProvider>
        </AdminEditProvider>
      </body>
    </html>
  );
}
