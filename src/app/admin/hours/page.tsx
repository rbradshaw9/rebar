'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import styles from '../menu/page.module.css';

const DAYS = [
  { key: 'hours_mon', label: 'Monday' },
  { key: 'hours_tue', label: 'Tuesday' },
  { key: 'hours_wed', label: 'Wednesday' },
  { key: 'hours_thu', label: 'Thursday' },
  { key: 'hours_fri', label: 'Friday' },
  { key: 'hours_sat', label: 'Saturday' },
  { key: 'hours_sun', label: 'Sunday' },
];

export default function AdminHoursPage() {
  const supabase = createClient();
  const [hours, setHours] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('settings').select('key, value').like('key', 'hours_%');
    const map: Record<string, string> = {};
    (data ?? []).forEach((row: { key: string; value: string }) => { map[row.key] = row.value; });
    setHours(map);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true); setMsg('');
    const updates = DAYS.map(d => ({
      key: d.key,
      value: hours[d.key] ?? 'Closed',
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('settings').upsert(updates, { onConflict: 'key' });
    setMsg(error ? `Error: ${error.message}` : '✓ Hours saved! The website will update immediately.');
    setSaving(false);
  };

  const setDay = (key: string, value: string) => setHours(h => ({ ...h, [key]: value }));

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <Link href="/admin" className={styles.back}>← Admin</Link>
          <h1 className={styles.title}>Business Hours</h1>
          <p className={styles.subtitle}>These hours appear on the Reservations page.</p>
        </div>
        <button className={styles.btnPrimary} onClick={save} disabled={saving || loading}>
          {saving ? 'Saving…' : 'Save Hours'}
        </button>
      </div>

      {loading ? <p className={styles.loading}>Loading…</p> : (
        <div className={styles.hoursGrid}>
          {DAYS.map(({ key, label }) => (
            <div key={key} className={styles.dayRow}>
              <span className={styles.dayLabel}>{label}</span>
              <input
                value={hours[key] ?? ''}
                onChange={e => setDay(key, e.target.value)}
                className={styles.input}
                placeholder='e.g. 4:00 PM – 10:00 PM or "Closed"'
              />
            </div>
          ))}
          <p className={styles.hint}>
            Type exactly as you want it displayed, e.g. <em>4:00 PM – 11:00 PM</em> or <em>Closed</em>
          </p>
        </div>
      )}

      {msg && <p className={msg.startsWith('✓') ? styles.success : styles.error} style={{ marginTop: '1.5rem' }}>{msg}</p>}
    </div>
  );
}
