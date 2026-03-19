'use client';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import EditableText from '@/components/EditableText';
import styles from './Footer.module.css';

export default function Footer() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  const HOURS = [
    { dayKey: 'monday', hours: '4:00 PM – 10:00 PM', closed: false },
    { dayKey: 'tuesday', hours: t.reservations.days.closed, closed: true },
    { dayKey: 'wednesday', hours: '4:00 PM – 10:00 PM', closed: false },
    { dayKey: 'thursday', hours: '4:00 PM – 10:00 PM', closed: false },
    { dayKey: 'friday', hours: '4:00 PM – 11:00 PM', closed: false },
    { dayKey: 'saturday', hours: '4:00 PM – 11:00 PM', closed: false },
    { dayKey: 'sunday', hours: '2:30 PM – 9:00 PM', closed: false },
  ];

  const navLinks = [
    [t.nav.menu, '/menu'],
    [t.nav.events, '/events'],
    [t.nav.gallery, '/gallery'],
    [t.nav.about, '/about'],
    [lang === 'es' ? 'Reservaciones' : 'Reservations', '/reservations'],
    [t.nav.contact, '/contact'],
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.mapStrip}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.!2d-67.11725!3d18.503836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMwJzEzLjgiTiA2N8KwMDcnMDIuMSJX!5e0!3m2!1sen!2sus!4v1"
          width="100%"
          height="220"
          style={{ border: 0, filter: 'grayscale(0.6) brightness(0.75) contrast(1.05)' }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Rebar location map"
        />
      </div>

      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoMark}>×</span>
              <span className={styles.logoText}>REBAR</span>
            </div>
            <EditableText translationKey="footer.tagline" value={t.footer.tagline} lang={lang} as="p" className={styles.tagline} />
            <EditableText
              translationKey={lang === 'es' ? 'footer.descEs' : 'footer.desc'}
              value={lang === 'es' ? 'Gastronomía y cócteles artesanales en Aguadilla, Puerto Rico.' : 'Chef-driven cuisine and handcrafted cocktails in Aguadilla, Puerto Rico.'}
              lang={lang}
              as="p"
              className={styles.desc}
            />
            <div className={styles.socials}>
              <a href="https://instagram.com/rebarpr" target="_blank" rel="noopener noreferrer" aria-label="Instagram @rebarpr">
                <InstagramIcon />
              </a>
              <a href="https://www.facebook.com/p/Rebar-Gastronom%C3%ADa-100093088920480/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t.footer.navigate}</h4>
            <ul className={styles.colLinks}>
              {navLinks.map(([label, href]) => (
                <li key={href}><Link href={href} className={styles.colLink}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t.footer.hours}</h4>
            <ul className={styles.hours}>
              {HOURS.map(({ dayKey, hours, closed }) => (
                <li key={dayKey} className={closed ? styles.closed : ''}>
                  <span>{(t.reservations.days as Record<string, string>)[dayKey]}</span>
                  <span>{hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t.footer.contact}</h4>
            <address className={styles.address}>
              <p>Carr. 110 Km 32.4</p>
              <p>Bo. Maleza Alta</p>
              <p>Aguadilla, PR 00603</p>
            </address>
            <a href="tel:+17876581669" className={styles.phone}>787-658-1669</a>
            <a href="mailto:rebargastronomia@gmail.com" className={styles.email}>rebargastronomia@gmail.com</a>
            <Link href="/reservations" className={styles.reserveBtn}>
              {t.nav.reserve}
            </Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} {t.footer.copyright}</p>
          <p className={styles.credit}>Aguadilla, Puerto Rico</p>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
