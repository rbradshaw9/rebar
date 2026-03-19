'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './page.module.css';

type Event = {
  id: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  event_date: string;
  event_time?: string;
  cover_image_url?: string;
  ticket_url?: string;
};

export default function EventsContent({ upcoming, past }: { upcoming: Event[] | null; past: Event[] | null }) {
  const { t, lang } = useLanguage();

  const WEEKLY = [
    { ...t.events.weekly.mon_thu, color: '#8B4A1A' },
    { ...t.events.weekly.wed, color: '#C4877A' },
    { ...t.events.weekly.thu, color: '#C8922A' },
    { ...t.events.weekly.fri, color: '#3D5A3E' },
  ];

  const locale = lang === 'es' ? 'es-PR' : 'en-US';

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1400&h=500&fit=crop" alt="Events hero" fill className={styles.heroBgImg} />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <span className="label">{t.events.label}</span>
          <h1>{t.events.heading}</h1>
          <p className={styles.heroSub}>{t.events.subHeading}</p>
        </div>
      </section>

      {/* Weekly Recurring */}
      <section className={styles.weekly}>
        <div className="container">
          <span className="label">{t.events.weeklyLabel}</span>
          <h2 className={styles.sectionH2}>{t.events.weeklyHeading}</h2>
          <div className={styles.weeklyGrid}>
            {WEEKLY.map((e) => (
              <div key={e.name} className={styles.weeklyCard} style={{ '--accent': e.color } as React.CSSProperties}>
                <span className={styles.dayBadge}>{e.day}</span>
                <h3 className={styles.weeklyName}>{e.name}</h3>
                <p className={styles.weeklyDesc}>{e.desc}</p>
                <Link href="/reservations" className={styles.weeklyCta}>
                  {t.events.reserveCta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Events — only shown if there are any */}
      {upcoming && upcoming.length > 0 && (
        <section className={styles.special}>
          <div className="container">
            <span className="label">{t.events.specialLabel}</span>
            <h2 className={styles.sectionH2}>{t.events.specialHeading}</h2>
            <div className={styles.eventsGrid}>
              {upcoming.map((e) => (
                <article key={e.id} className={`card ${styles.eventCard}`}>
                  {e.cover_image_url && (
                    <div className={styles.eventImgWrap}>
                      <Image src={e.cover_image_url} alt={lang === 'es' ? e.title_es : e.title_en} fill className={styles.eventImg} />
                    </div>
                  )}
                  <div className={styles.eventBody}>
                    <time className={styles.eventDate} dateTime={e.event_date}>
                      {new Date(e.event_date + 'T12:00:00').toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })}
                      {e.event_time && <> · {e.event_time}</>}
                    </time>
                    <h3 className={styles.eventTitle}>{lang === 'es' ? e.title_es : e.title_en}</h3>
                    <p className={styles.eventDesc}>{lang === 'es' ? e.description_es : e.description_en}</p>
                    <div className={styles.eventActions}>
                      <Link href="/reservations" className="btn-outline">{t.events.reserveCta}</Link>
                      {e.ticket_url && (
                        <a href={e.ticket_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                          {t.events.ticketsCta}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Private Events CTA */}
      <section className={styles.privateCta}>
        <div className="container">
          <div className={styles.privateBox}>
            <span className="label">{t.events.privateLabel}</span>
            <h2 className={styles.privateH2}>{t.events.privateHeading}</h2>
            <p className={styles.privateDesc}>{t.events.privateBody}</p>
            <Link href="/contact?subject=private-event" className="btn-primary">
              {t.events.privateCta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
