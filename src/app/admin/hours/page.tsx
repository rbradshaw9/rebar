'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { DAYS, DayKey, parseHoursFromSettings, DayHours } from '@/lib/formatHours';
import styles from '../menu/page.module.css';

const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
  thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};

type HoursState = Record<DayKey, DayHours>;

const DEFAULT_HOURS: HoursState = {
  mon: { open: '16:00', close: '22:00', closed: false },
  tue: { open: '16:00', close: '22:00', closed: true },
  wed: { open: '16:00', close: '22:00', closed: false },
  thu: { open: '16:00', close: '22:00', closed: false },
  fri: { open: '16:00', close: '23:00', closed: false },
  sat: { open: '16:00', close: '23:00', closed: false },
  sun: { open: '14:30', close: '21:00', closed: false },
};

export default function AdminHoursPage() {
  const supabase = createClient();
  const [hours, setHours] = useState<HoursState>(DEFAULT_HOURS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [msg, setMsg] = useState('');
  const [gmbMsg, setGmbMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('settings').select('key, value').like('key', 'hours_%');
    if (data && data.length > 0) {
      const map: Record<string, string> = {};
      data.forEach((r: { key: string; value: string }) => { map[r.key] = r.value; });
      setHours(parseHoursFromSettings(map));
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const setDay = (day: DayKey, field: keyof DayHours, value: string | boolean) => {
    setHours(h => ({ ...h, [day]: { ...h[day], [field]: value } }));
  };

  const save = async () => {
    setSaving(true); setMsg('');
    const rows: { key: string; value: string; updated_at: string }[] = [];
    const now = new Date().toISOString();
    for (const day of DAYS) {
      rows.push({ key: `hours_${day}_open`,   value: hours[day].open,                updated_at: now });
      rows.push({ key: `hours_${day}_close`,  value: hours[day].close,               updated_at: now });
      rows.push({ key: `hours_${day}_closed`, value: String(hours[day].closed),      updated_at: now });
    }
    const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' });
    setMsg(error ? `Error: ${error.message}` : '✓ Hours saved! Website updated immediately.');
    setSaving(false);
  };

  const pushToGMB = async () => {
    setPushing(true); setGmbMsg('');
    try {
      const res = await fetch('/api/gmb-hours', { method: 'POST' });
      const json = await res.json();
      if (json.ok) {
        setGmbMsg('✓ Hours pushed to Google My Business!');
      } else {
        setGmbMsg(`ℹ️ ${json.error}`);
      }
    } catch {
      setGmbMsg('Error connecting to GMB API.');
    }
    setPushing(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <Link href="/admin" className={styles.back}>← Admin</Link>
          <h1 className={styles.title}>Business Hours</h1>
          <p className={styles.subtitle}>Set open/close times per day. These update the website and can be pushed to Google.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className={styles.btnSecondary} onClick={pushToGMB} disabled={pushing || saving || loading}>
            {pushing ? 'Pushing…' : '📍 Push to Google'}
          </button>
          <button className={styles.btnPrimary} onClick={save} disabled={saving || loading}>
            {saving ? 'Saving…' : 'Save Hours'}
          </button>
        </div>
      </div>

      {loading ? <p className={styles.loading}>Loading…</p> : (
        <div className={styles.hoursGrid}>
          {DAYS.map(day => (
            <div key={day} className={`${styles.dayRow} ${hours[day].closed ? styles.dayRowClosed : ''}`}>
              <div className={styles.dayMeta}>
                <span className={styles.dayLabel}>{DAY_LABELS[day]}</span>
                <label className={styles.closedToggle}>
                  <input
                    type="checkbox"
                    checked={hours[day].closed}
                    onChange={e => setDay(day, 'closed', e.target.checked)}
                  />
                  <span>Closed</span>
                </label>
              </div>
              <div className={styles.timePickers} style={{ opacity: hours[day].closed ? 0.35 : 1 }}>
                <label className={styles.timeLabel}>
                  Opens
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={hours[day].open}
                    onChange={e => setDay(day, 'open', e.target.value)}
                    disabled={hours[day].closed}
                  />
                </label>
                <span className={styles.timeSep}>–</span>
                <label className={styles.timeLabel}>
                  Closes
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={hours[day].close}
                    onChange={e => setDay(day, 'close', e.target.value)}
                    disabled={hours[day].closed}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {msg && <p className={msg.startsWith('✓') ? styles.success : styles.error} style={{ marginTop: '1.5rem' }}>{msg}</p>}
      {gmbMsg && (
        <div className={styles.gmbNote} style={{ marginTop: '1.5rem' }}>
          <p>{gmbMsg}</p>
          {gmbMsg.includes('credentials') && (
            <p className={styles.hint} style={{ marginTop: '0.5rem' }}>
              To activate: add <code>GOOGLE_GMB_LOCATION_ID</code>, <code>GOOGLE_CLIENT_ID</code>,
              {' '}<code>GOOGLE_CLIENT_SECRET</code>, and <code>GOOGLE_REFRESH_TOKEN</code> to your Vercel environment variables.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
