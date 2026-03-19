'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import ImageUploader from '@/components/ImageUploader';
import styles from '../menu/page.module.css';

type Event = {
  id: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  event_date: string;
  event_time: string;
  cover_image_url: string;
  ticket_url: string;
  is_published: boolean;
};

const emptyEvent = (): Omit<Event, 'id'> => ({
  title_en: '', title_es: '', description_en: '', description_es: '',
  event_date: '', event_time: '', cover_image_url: '', ticket_url: '', is_published: true,
});

export default function AdminEventsPage() {
  const supabase = createClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Event | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyEvent());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
    setEvents(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const openEdit = (ev: Event) => { setEditing(ev); setCreating(false); setForm({ ...ev }); setMsg(''); };
  const openCreate = () => { setEditing(null); setCreating(true); setForm(emptyEvent()); setMsg(''); };
  const cancel = () => { setEditing(null); setCreating(false); setMsg(''); };
  const fc = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title_en || !form.event_date) { setMsg('Title and date are required.'); return; }
    setSaving(true); setMsg('');
    if (editing) {
      const { error } = await supabase.from('events').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id);
      setMsg(error ? `Error: ${error.message}` : '✓ Saved');
    } else {
      const { error } = await supabase.from('events').insert({ ...form });
      setMsg(error ? `Error: ${error.message}` : '✓ Event created');
    }
    setSaving(false);
    load();
  };

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const deleteEvent = async (id: string) => {
    await supabase.from('events').delete().eq('id', id);
    setConfirmDelete(null);
    cancel();
    load();
  };

  const togglePublish = async (ev: Event) => {
    await supabase.from('events').update({ is_published: !ev.is_published }).eq('id', ev.id);
    load();
  };

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <Link href="/admin" className={styles.back}>← Admin</Link>
          <h1 className={styles.title}>Events</h1>
          <p className={styles.subtitle}>{events.length} events total</p>
        </div>
        <button className={styles.btnPrimary} onClick={openCreate}>+ Create Event</button>
      </div>

      {(editing || creating) && (
        <div className={styles.editor}>
          <h2 className={styles.editorTitle}>{creating ? 'New Event' : 'Edit Event'}</h2>
          <div className={styles.formGrid}>
            <Field label="Title (English)"><input value={form.title_en} onChange={e => fc('title_en', e.target.value)} className={styles.input} /></Field>
            <Field label="Title (Español)"><input value={form.title_es} onChange={e => fc('title_es', e.target.value)} className={styles.input} /></Field>
            <Field label="Description (EN)"><textarea value={form.description_en} onChange={e => fc('description_en', e.target.value)} className={styles.textarea} rows={3} /></Field>
            <Field label="Description (ES)"><textarea value={form.description_es} onChange={e => fc('description_es', e.target.value)} className={styles.textarea} rows={3} /></Field>
            <Field label="Date"><input type="date" value={form.event_date} onChange={e => fc('event_date', e.target.value)} className={styles.input} /></Field>
            <Field label="Time (e.g. 7:00 PM)"><input value={form.event_time} onChange={e => fc('event_time', e.target.value)} className={styles.input} placeholder="7:00 PM" /></Field>
            <div style={{gridColumn: '1 / -1'}}><ImageUploader value={form.cover_image_url} onChange={url => fc('cover_image_url', url)} folder="events" label="Cover Image" /></div>
            <Field label="Ticket / Info URL" full><input value={form.ticket_url} onChange={e => fc('ticket_url', e.target.value)} className={styles.input} placeholder="https://..." /></Field>
          </div>
          <div className={styles.toggleRow}>
            <Toggle label="Published (visible on site)" value={form.is_published} onChange={v => fc('is_published', v)} />
          </div>
          <div className={styles.editorActions}>
            {editing && (
              confirmDelete === editing.id ? (
                <>
                  <span style={{ fontSize: '0.85rem', color: '#e05252', marginRight: 8 }}>Delete &quot;{editing.title_en}&quot;?</span>
                  <button className={styles.btnDelete} onClick={() => deleteEvent(editing.id)}>Confirm</button>
                  <button className={styles.btnOutline} onClick={() => setConfirmDelete(null)}>Cancel</button>
                </>
              ) : (
                <button className={styles.btnDelete} onClick={() => setConfirmDelete(editing.id)}>Delete</button>
              )
            )}
            {confirmDelete !== editing?.id && (
              <>
                <button className={styles.btnOutline} onClick={cancel}>Cancel</button>
                <button className={styles.btnPrimary} onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              </>
            )}
          </div>
          {msg && <p className={msg.startsWith('✓') ? styles.success : styles.error}>{msg}</p>}
        </div>
      )}

      {loading ? <p className={styles.loading}>Loading…</p> : events.length === 0 ? (
        <div className={styles.empty}>
          <p>No events yet. Click <strong>+ Add Event</strong> to create your first one.</p>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Event</span><span>Date</span><span>Time</span><span>Published</span>
          </div>
          {events.map(ev => (
            <div key={ev.id} className={`${styles.tableRow} ${!ev.is_published ? styles.dimmed : ''}`} onClick={() => openEdit(ev)}>
              <span className={styles.itemName}>{ev.title_en}</span>
              <span>{ev.event_date}</span>
              <span>{ev.event_time || '—'}</span>
              <span onClick={e => { e.stopPropagation(); togglePublish(ev); }} className={styles.pill} style={{ background: ev.is_published ? 'var(--forest-herb)' : 'var(--charcoal-slate)' }}>
                {ev.is_published ? 'Live' : 'Draft'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', gridColumn: full ? '1 / -1' : undefined }}>
      <label style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.875rem' }}>
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--ember-gold)', cursor: 'pointer' }} />
      {label}
    </label>
  );
}
