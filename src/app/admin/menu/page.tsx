'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import ImageUploader from '@/components/ImageUploader';
import styles from './page.module.css';

const CATEGORIES = [
  'tapas', 'bao', 'mains', 'pasta', 'seafood', 'cocktails', 'wine', 'desserts',
];

type MenuItem = {
  id: string;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  price: number;
  category: string;
  photo_url: string;
  is_featured: boolean;
  is_available: boolean;
  sort_order: number;
};

const empty = (): Omit<MenuItem, 'id'> => ({
  name_en: '', name_es: '', description_en: '', description_es: '',
  price: 0, category: CATEGORIES[0], photo_url: '',
  is_featured: false, is_available: true, sort_order: 0,
});

export default function AdminMenuPage() {
  const supabase = createClient();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('menu_items').select('*').order('category').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setCreating(false);
    setForm({ ...item });
    setMsg('');
  };

  const openCreate = () => {
    setEditing(null);
    setCreating(true);
    setForm(empty());
    setMsg('');
  };

  const cancel = () => { setEditing(null); setCreating(false); setMsg(''); };

  const save = async () => {
    setSaving(true);
    setMsg('');
    if (editing) {
      const { error } = await supabase.from('menu_items').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id);
      setMsg(error ? `Error: ${error.message}` : '✓ Saved');
    } else {
      const { error } = await supabase.from('menu_items').insert({ ...form });
      setMsg(error ? `Error: ${error.message}` : '✓ Item created');
    }
    setSaving(false);
    load();
  };

  const toggleAvail = async (item: MenuItem) => {
    await supabase.from('menu_items').update({ is_available: !item.is_available, updated_at: new Date().toISOString() }).eq('id', item.id);
    load();
  };

  const toggleFeatured = async (item: MenuItem) => {
    await supabase.from('menu_items').update({ is_featured: !item.is_featured, updated_at: new Date().toISOString() }).eq('id', item.id);
    load();
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item permanently?')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    setEditing(null);
    setCreating(false);
    load();
  };

  const fc = (k: string, v: string | number | boolean) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <Link href="/admin" className={styles.back}>← Admin</Link>
          <h1 className={styles.title}>Menu Items</h1>
          <p className={styles.subtitle}>{items.length} items across {CATEGORIES.length} categories</p>
        </div>
        <button className={styles.btnPrimary} onClick={openCreate}>+ Add Item</button>
      </div>

      {/* Category filter */}
      <div className={styles.filterRow}>
        {['all', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`${styles.filterBtn} ${filter === c ? styles.active : ''}`}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Slide-in Editor */}
      {(editing || creating) && (
        <div className={styles.editor}>
          <h2 className={styles.editorTitle}>{creating ? 'New Item' : 'Edit Item'}</h2>
          <div className={styles.formGrid}>
            <Field label="Name (English)"><input value={form.name_en} onChange={e => fc('name_en', e.target.value)} className={styles.input} /></Field>
            <Field label="Name (Español)"><input value={form.name_es} onChange={e => fc('name_es', e.target.value)} className={styles.input} /></Field>
            <Field label="Description (EN)"><textarea value={form.description_en} onChange={e => fc('description_en', e.target.value)} className={styles.textarea} rows={2} /></Field>
            <Field label="Description (ES)"><textarea value={form.description_es} onChange={e => fc('description_es', e.target.value)} className={styles.textarea} rows={2} /></Field>
            <Field label="Price ($)"><input type="number" step="0.01" value={form.price} onChange={e => fc('price', parseFloat(e.target.value))} className={styles.input} /></Field>
            <Field label="Category">
              <select value={form.category} onChange={e => fc('category', e.target.value)} className={styles.input}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <div style={{gridColumn: '1 / -1'}}><ImageUploader value={form.photo_url} onChange={url => fc('photo_url', url)} folder="menu" label="Photo" /></div>
            <Field label="Sort Order"><input type="number" value={form.sort_order} onChange={e => fc('sort_order', parseInt(e.target.value))} className={styles.input} /></Field>
          </div>
          <div className={styles.toggleRow}>
            <Toggle label="Available" value={form.is_available} onChange={v => fc('is_available', v)} />
            <Toggle label="Featured (Chef's Pick)" value={form.is_featured} onChange={v => fc('is_featured', v)} />
          </div>
          <div className={styles.editorActions}>
            {editing && <button className={styles.btnDelete} onClick={() => deleteItem(editing.id)}>Delete</button>}
            <button className={styles.btnOutline} onClick={cancel}>Cancel</button>
            <button className={styles.btnPrimary} onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
          {msg && <p className={msg.startsWith('✓') ? styles.success : styles.error}>{msg}</p>}
        </div>
      )}

      {/* Table */}
      {loading ? <p className={styles.loading}>Loading…</p> : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Item</span><span>Category</span><span>Price</span><span>Available</span><span>Featured</span>
          </div>
          {filtered.map(item => (
            <div key={item.id} className={`${styles.tableRow} ${!item.is_available ? styles.dimmed : ''}`} onClick={() => openEdit(item)}>
              <span className={styles.itemName}>{item.name_en}</span>
              <span className={styles.tag}>{item.category}</span>
              <span>${Number(item.price).toFixed(2)}</span>
              <span onClick={e => { e.stopPropagation(); toggleAvail(item); }} className={styles.pill} style={{ background: item.is_available ? 'var(--forest-herb)' : 'var(--charcoal-slate)' }}>
                {item.is_available ? 'Yes' : 'No'}
              </span>
              <span onClick={e => { e.stopPropagation(); toggleFeatured(item); }} className={styles.pill} style={{ background: item.is_featured ? 'var(--ember-gold)' : 'var(--charcoal-slate)', color: item.is_featured ? '#0d0d0d' : 'inherit' }}>
                {item.is_featured ? '★' : '—'}
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
