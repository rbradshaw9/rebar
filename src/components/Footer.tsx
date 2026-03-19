'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import EditableText from '@/components/EditableText';
import { createClient } from '@/utils/supabase/client';
import { DAYS, DayKey, parseHoursFromSettings, formatDayHours } from '@/lib/formatHours';
import styles from './Footer.module.css';

const DAY_KEYS_TO_FULL: Record<DayKey, string> = {
  mon: 'monday', tue: 'tuesday', wed: 'wednesday',
  thu: 'thursday', fri: 'friday', sat: 'saturday', sun: 'sunday',
};

export default function Footer() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  const [hoursDisplay, setHoursDisplay] = useState<{ dayKey: string; label: string; closed: boolean }[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('settings').select('key, value').like('key', 'hours_%').then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: { key: string; value: string }) => { map[r.key] = r.value; });
      const parsed = parseHoursFromSettings(map);
      setHoursDisplay(DAYS.map(day => ({
        dayKey: DAY_KEYS_TO_FULL[day],
        label: formatDayHours(parsed[day].open, parsed[day].close, String(parsed[day].closed)),
        closed: parsed[day].closed,
      })));
    });
  }, []);

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

          {/* Hours — live from Supabase */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t.footer.hours}</h4>
            <ul className={styles.hours}>
              {hoursDisplay.length > 0
                ? hoursDisplay.map(({ dayKey, label, closed }) => (
                  <li key={dayKey} className={closed ? styles.closed : ''}>
                    <span>{(t.reservations.days as Record<string, string>)[dayKey]}</span>
                    <span>{label}</span>
                  </li>
                ))
                : /* skeleton while loading */ DAYS.map(day => (
                  <li key={day} style={{ opacity: 0.3 }}>
                    <span>—</span><span>—</span>
                  </li>
                ))
              }
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
