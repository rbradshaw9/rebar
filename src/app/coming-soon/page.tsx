import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coming Soon | Rebar Gastronomía & Cocteles',
  description: 'Something delicious is brewing. Rebar Gastronomía & Cocteles is coming soon to Aguadilla, Puerto Rico.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ComingSoonPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cs-root {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #0a0806;
          font-family: 'Inter', sans-serif;
          z-index: 9999;
        }

        /* Background image + overlay */
        .cs-bg {
          position: absolute;
          inset: 0;
          background-image: url('/images/instagram/rebar_food_01.jpg');
          background-size: cover;
          background-position: center 30%;
          filter: brightness(0.22) saturate(0.6);
          transform: scale(1.04);
          animation: slowZoom 30s ease-in-out infinite alternate;
        }

        @keyframes slowZoom {
          from { transform: scale(1.04); }
          to   { transform: scale(1.12); }
        }

        /* Radial vignette */
        .cs-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 30%, rgba(10,8,6,0.85) 100%);
          pointer-events: none;
        }

        /* Gold accent line */
        .cs-accent-line {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a96e, transparent);
          margin-bottom: 2rem;
          animation: fadeIn 1.2s ease forwards;
        }

        .cs-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem;
          max-width: 600px;
          animation: fadeUp 1.4s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .cs-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 1.4rem;
        }

        .cs-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 8vw, 5.5rem);
          font-weight: 300;
          line-height: 1.05;
          color: #f5f0e8;
          margin-bottom: 0.3rem;
          letter-spacing: -0.01em;
        }

        .cs-heading em {
          font-style: italic;
          color: #e8d5b0;
        }

        .cs-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          font-weight: 300;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9a896e;
          margin-bottom: 2.8rem;
        }

        .cs-divider {
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a96e55, transparent);
          margin-bottom: 2.4rem;
        }

        .cs-body {
          font-size: 0.875rem;
          font-weight: 300;
          line-height: 1.85;
          color: #a09080;
          letter-spacing: 0.02em;
          margin-bottom: 2.8rem;
          max-width: 420px;
        }

        .cs-location {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #7a6a55;
          margin-bottom: 2.8rem;
        }

        .cs-location svg {
          color: #c9a96e;
          flex-shrink: 0;
        }

        .cs-socials {
          display: flex;
          gap: 1.2rem;
        }

        .cs-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: 1px solid #3a3020;
          border-radius: 50%;
          color: #9a8870;
          text-decoration: none;
          transition: border-color 0.3s ease, color 0.3s ease, background 0.3s ease;
        }

        .cs-social-link:hover {
          border-color: #c9a96e;
          color: #c9a96e;
          background: rgba(201,169,110,0.08);
        }

        /* Bottom copyright */
        .cs-footer {
          position: absolute;
          bottom: 1.5rem;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: #4a3f30;
          text-transform: uppercase;
        }
      `}</style>

      <div className="cs-root">
        <div className="cs-bg" />
        <div className="cs-vignette" />

        <div className="cs-content">
          <div className="cs-accent-line" />
          <p className="cs-eyebrow">Aguadilla, Puerto Rico</p>

          <h1 className="cs-heading">
            Rebar<br />
            <em>Gastronomía</em>
          </h1>
          <p className="cs-sub">&amp; Cocteles</p>

          <div className="cs-divider" />

          <p className="cs-body">
            Something exceptional is being prepared. Our new website is on its way — chef-driven cuisine, handcrafted cocktails, and the full Rebar experience, all in one place.
          </p>

          <div className="cs-location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Carr. 110 Km 32.4 · Aguadilla, PR
          </div>

          <div className="cs-socials">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/rebarpr"
              target="_blank"
              rel="noopener noreferrer"
              className="cs-social-link"
              aria-label="Rebar on Instagram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/p/Rebar-Gastronom%C3%ADa-100093088920480/"
              target="_blank"
              rel="noopener noreferrer"
              className="cs-social-link"
              aria-label="Rebar on Facebook"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>

            {/* Phone */}
            <a
              href="tel:+17876581669"
              className="cs-social-link"
              aria-label="Call Rebar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.77a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .9h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </a>
          </div>
        </div>

        <p className="cs-footer">© {new Date().getFullYear()} Rebar Gastronomía & Cocteles — All rights reserved</p>
      </div>
    </>
  );
}
