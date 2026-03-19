'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { createClient } from '@/utils/supabase/client';
import styles from './page.module.css';

const DAY_KEYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const;
const DB_KEY: Record<string, string> = {
  monday:'hours_mon', tuesday:'hours_tue', wednesday:'hours_wed',
  thursday:'hours_thu', friday:'hours_fri', saturday:'hours_sat', sunday:'hours_sun',
};
const FALLBACK: Record<string, string | null> = {
  monday:'4:00 PM – 10:00 PM', tuesday: null, wednesday:'4:00 PM – 10:00 PM',
  thursday:'4:00 PM – 10:00 PM', friday:'4:00 PM – 11:00 PM',
  saturday:'4:00 PM – 11:00 PM', sunday:'2:30 PM – 9:00 PM',
};

type FormData = { name: string; email: string; date: string; time: string; partySize: string; specialRequests: string };
type FormErrors = Partial<Record<keyof FormData, string>>;

function validateReservation(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim() || form.name.trim().length < 2) errors.name = 'Name is required.';
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim() || !emailRe.test(form.email.trim())) errors.email = 'Please enter a valid email address. (invalid)';
  if (!form.date) errors.date = 'Date is required.';
  if (!form.time) errors.time = 'Time is required.';
  const ps = Number(form.partySize);
  if (!form.partySize || isNaN(ps) || !Number.isInteger(ps)) errors.partySize = 'Party Size must be a valid whole number.';
  else if (ps <= 0) errors.partySize = 'Party Size must be at least 1 guest.';
  return errors;
}

export default function ReservationsPage() {
  const { t } = useLanguage();
  const [hours, setHours] = useState<Record<string, string | null>>(FALLBACK);
  const [form, setForm] = useState<FormData>({ name: '', email: '', date: '', time: '', partySize: '', specialRequests: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  useEffect(() => {
    const supabase = createClient();
    supabase.from('settings').select('key, value').like('key', 'hours_%').then(({ data }) => {
      if (!data) return;
      const map: Record<string, string | null> = { ...FALLBACK };
      data.forEach((r: { key: string; value: string }) => {
        const day = Object.keys(DB_KEY).find(d => DB_KEY[d] === r.key);
        if (day) map[day] = r.value === 'Closed' ? null : r.value;
      });
      setHours(map);
    });
  }, []);

  const HOURS = DAY_KEYS.map(day => ({ key: day, hours: hours[day] ?? null }));

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (touched) setErrors(validateReservation(updated));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errs = validateReservation(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('sending');
    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, partySize: Number(form.partySize) }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setForm({ name: '', email: '', date: '', time: '', partySize: '', specialRequests: '' });
    setErrors({});
    setTouched(false);
    setStatus('idle');
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/images/instagram/rebar_atmosphere_01.jpg"
            alt="Rebar dining room"
            fill
            className={styles.heroBgImg}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <span className="label">{t.reservations.label}</span>
          <h1>{t.reservations.heading}</h1>
          <p className={styles.heroSub}>{t.reservations.subheading}</p>
        </div>
      </section>

      {/* ── RESERVATION FORM ── */}
      <section className={styles.formSection} aria-label="reservation form">
        {status === 'done' ? (
          <div className={styles.formSuccess}>
            <div className={styles.formSuccessIcon}>✓</div>
            <h2>Request Received!</h2>
            <p>We&apos;ll confirm your table within a few hours. For urgent bookings, call us at <strong>787-658-1669</strong>.</p>
            <button className="btn-outline" onClick={reset}>Make Another Request</button>
          </div>
        ) : (
          <>
            <div className="gold-line" />
            <h2>{t.reservations.heading}</h2>
            <p className={styles.formSub}>Fill out the form below and we&apos;ll confirm your table. For groups of 8+ or same-day reservations, please call us directly.</p>
            <form onSubmit={submit} noValidate aria-label="reservation form">
              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel} htmlFor="res-name">Full Name <span style={{ color: 'var(--ember-gold)' }}>*</span></label>
                  <input
                    id="res-name" name="name" value={form.name} onChange={change} required
                    placeholder="Your name"
                    className={`${styles.formInput}${errors.name ? ' ' + styles.hasError : ''}`}
                  />
                  {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                </div>
                <div>
                  <label className={styles.formLabel} htmlFor="res-email">Email <span style={{ color: 'var(--ember-gold)' }}>*</span></label>
                  <input
                    id="res-email" type="email" name="email" value={form.email} onChange={change} required
                    placeholder="you@email.com"
                    className={`${styles.formInput}${errors.email ? ' ' + styles.hasError : ''}`}
                  />
                  {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>
                <div>
                  <label className={styles.formLabel} htmlFor="res-date">Date <span style={{ color: 'var(--ember-gold)' }}>*</span></label>
                  <input
                    id="res-date" type="date" name="date" value={form.date} onChange={change} required
                    min={new Date().toISOString().split('T')[0]}
                    className={`${styles.formInput}${errors.date ? ' ' + styles.hasError : ''}`}
                  />
                  {errors.date && <span className={styles.fieldError}>{errors.date}</span>}
                </div>
                <div>
                  <label className={styles.formLabel} htmlFor="res-time">Preferred Time <span style={{ color: 'var(--ember-gold)' }}>*</span></label>
                  <input
                    id="res-time" type="time" name="time" value={form.time} onChange={change} required
                    className={`${styles.formInput}${errors.time ? ' ' + styles.hasError : ''}`}
                  />
                  {errors.time && <span className={styles.fieldError}>{errors.time}</span>}
                </div>
                <div>
                  <label className={styles.formLabel} htmlFor="res-partySize">Party Size <span style={{ color: 'var(--ember-gold)' }}>*</span></label>
                  <input
                    id="res-partySize" type="number" name="partySize" value={form.partySize} onChange={change} required
                    min="1" max="50" placeholder="e.g. 2"
                    className={`${styles.formInput}${errors.partySize ? ' ' + styles.hasError : ''}`}
                  />
                  {errors.partySize && <span className={styles.fieldError}>{errors.partySize}</span>}
                </div>
                <div className={styles.fullCol}>
                  <label className={styles.formLabel} htmlFor="res-specialRequests">Special Requests</label>
                  <textarea
                    id="res-specialRequests" name="specialRequests" value={form.specialRequests} onChange={change}
                    rows={3} placeholder="Window seat, dietary needs, celebrations…"
                    className={styles.formTextarea}
                  />
                </div>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" disabled={status === 'sending'} style={{ width: '100%', justifyContent: 'center' }}>
                  {status === 'sending' ? 'Submitting…' : 'Submit'}
                </button>
              </div>
              {status === 'error' && <p className={styles.formErrMsg}>Something went wrong. Please call us at 787-658-1669.</p>}
            </form>

            <div className={styles.divider}>OR REACH US DIRECTLY</div>

            <div className={styles.ctaActions}>
              <a href="tel:+17876581669" className="btn-primary">
                <PhoneIcon /> {t.reservations.callBtn}
              </a>
              <a
                href="https://wa.me/17876581669?text=Hola%20Rebar!%20Me%20gustar%C3%ADa%20hacer%20una%20reservaci%C3%B3n."
                target="_blank" rel="noopener noreferrer"
                className={styles.waBtn}
              >
                <WhatsAppIcon /> {t.reservations.waBtn}
              </a>
            </div>
          </>
        )}
      </section>

      <div className="container">
        <div className={styles.grid}>
          {/* Private Events */}
          <div className={styles.ctaPanel}>
            <div className={styles.privateBox}>
              <span className="label">{t.reservations.privateLabel}</span>
              <h3 className={styles.privateTitle}>{t.reservations.privateTitle}</h3>
              <p className={styles.privateText}>{t.reservations.privateText}</p>
              <Link href="/contact?subject=Private Events" className="btn-outline">
                {t.reservations.privateCta}
              </Link>
            </div>
          </div>

          {/* Hours + Info */}
          <div className={styles.infoPanel}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>{t.reservations.hoursTitle}</h3>
              <ul className={styles.hoursList}>
                {HOURS.map(({ key, hours: h }) => (
                  <li key={key} className={!h ? styles.closed : ''}>
                    <span>{t.reservations.days[key as keyof typeof t.reservations.days]}</span>
                    <span>{h ?? t.reservations.days.closed}</span>
                  </li>
                ))}
              </ul>
              <p className={styles.hoursNote}>
                {t.reservations.hoursNote}{' '}
                <a href="https://instagram.com/rebarpr" target="_blank" rel="noopener noreferrer">@rebarpr</a>{' '}
                {t.reservations.hoursNoteFor}
              </p>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>{t.reservations.locationTitle}</h3>
              <address className={styles.address}>
                Carr. 110 Km 32.4<br />
                Bo. Maleza Alta<br />
                Aguadilla, PR 00603
              </address>
              <div className={styles.mapEmbed}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.2186!2d-67.11725!3d18.503836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMwJzEzLjgiTiA2N8KwMDcnMDIuMSJX!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="180"
                  style={{ border: 0, filter: 'grayscale(0.6) brightness(0.75) contrast(1.05)' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Rebar location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:8}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .01h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-.83a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
}
function WhatsAppIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:8}}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
}
