'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import adminStyles from '../menu/page.module.css';
import styles from './page.module.css';

// Flat list of all editable translation keys grouped by section
// Format: { key: 'dotted.path', label: 'Human label', multiline?: true }
const SECTIONS: { title: string; keys: { key: string; label: string; multiline?: boolean }[] }[] = [
  {
    title: 'Home Page',
    keys: [
      { key: 'home.location', label: 'Location Tag' },
      { key: 'home.tagline', label: 'Tagline (Gastronomy · Cocktails)' },
      { key: 'home.subTagline', label: 'Sub-tagline', multiline: true },
      { key: 'home.heroReserve', label: 'Hero Button: Reserve' },
      { key: 'home.heroMenu', label: 'Hero Button: Menu' },
      { key: 'home.storyHeading', label: 'Story Heading' },
      { key: 'home.storyBody', label: 'Story Body', multiline: true },
      { key: 'home.storyQuote', label: 'Story Quote', multiline: true },
      { key: 'home.storyQuoteAttr', label: 'Quote Attribution' },
      { key: 'home.featuredHeading', label: 'Featured Section Heading' },
      { key: 'home.reserveHeading', label: 'Reserve Section Heading' },
      { key: 'home.reserveBody', label: 'Reserve Section Body', multiline: true },
      { key: 'home.featuredFood.name', label: 'Feature 1: Name' },
      { key: 'home.featuredFood.desc', label: 'Feature 1: Description', multiline: true },
      { key: 'home.featuredFood.tag', label: 'Feature 1: Tag' },
      { key: 'home.featuredCocktail.name', label: 'Feature 2: Name' },
      { key: 'home.featuredCocktail.desc', label: 'Feature 2: Description', multiline: true },
      { key: 'home.featuredCocktail.tag', label: 'Feature 2: Tag' },
      { key: 'home.featuredGrill.name', label: 'Feature 3: Name' },
      { key: 'home.featuredGrill.desc', label: 'Feature 3: Description', multiline: true },
      { key: 'home.featuredGrill.tag', label: 'Feature 3: Tag' },
    ],
  },
  {
    title: 'Navigation',
    keys: [
      { key: 'nav.menu', label: 'Menu Link' },
      { key: 'nav.events', label: 'Events Link' },
      { key: 'nav.gallery', label: 'Gallery Link' },
      { key: 'nav.about', label: 'About Link' },
      { key: 'nav.contact', label: 'Contact Link' },
      { key: 'nav.reserve', label: 'Reserve Button' },
    ],
  },
  {
    title: 'Events Page',
    keys: [
      { key: 'events.heading', label: 'Page Heading' },
      { key: 'events.subHeading', label: 'Sub-heading', multiline: true },
      { key: 'events.weeklyHeading', label: 'Weekly Section Heading' },
      { key: 'events.weekly.mon_thu.day', label: 'Mon–Thu: Day Label' },
      { key: 'events.weekly.mon_thu.name', label: 'Mon–Thu: Event Name' },
      { key: 'events.weekly.mon_thu.desc', label: 'Mon–Thu: Description', multiline: true },
      { key: 'events.weekly.wed.name', label: 'Wednesday: Event Name' },
      { key: 'events.weekly.wed.desc', label: 'Wednesday: Description', multiline: true },
      { key: 'events.weekly.thu.name', label: 'Thursday: Event Name' },
      { key: 'events.weekly.thu.desc', label: 'Thursday: Description', multiline: true },
      { key: 'events.weekly.fri.name', label: 'Friday: Event Name' },
      { key: 'events.weekly.fri.desc', label: 'Friday: Description', multiline: true },
      { key: 'events.privateHeading', label: 'Private Events Heading' },
      { key: 'events.privateBody', label: 'Private Events Body', multiline: true },
    ],
  },
  {
    title: 'About Page',
    keys: [
      { key: 'about.heading', label: 'Page Heading' },
      { key: 'about.originHeading', label: 'Origin Section Heading' },
      { key: 'about.originP1', label: 'Origin Paragraph 1', multiline: true },
      { key: 'about.originP2', label: 'Origin Paragraph 2', multiline: true },
      { key: 'about.originQuote', label: 'Quote', multiline: true },
      { key: 'about.kitchenTitle', label: 'Kitchen Section Title' },
      { key: 'about.kitchenText', label: 'Kitchen Text', multiline: true },
      { key: 'about.barTitle', label: 'Bar Section Title' },
      { key: 'about.barText', label: 'Bar Text', multiline: true },
      { key: 'about.atmosphereHeading', label: 'Atmosphere Heading' },
      { key: 'about.atmosphereText', label: 'Atmosphere Text', multiline: true },
      { key: 'about.closingText', label: 'Closing / Address', multiline: true },
    ],
  },
  {
    title: 'Reservations Page',
    keys: [
      { key: 'reservations.heading', label: 'Page Heading' },
      { key: 'reservations.subheading', label: 'Sub-heading', multiline: true },
      { key: 'reservations.callBtn', label: 'Call Button' },
      { key: 'reservations.waBtn', label: 'WhatsApp Button' },
      { key: 'reservations.privateTitle', label: 'Private Events Title' },
      { key: 'reservations.privateText', label: 'Private Events Text', multiline: true },
      { key: 'reservations.hoursNote', label: 'Hours Note' },
    ],
  },
  {
    title: 'Footer',
    keys: [
      { key: 'footer.tagline', label: 'Tagline' },
      { key: 'footer.copyright', label: 'Copyright Text' },
      { key: 'footer.address', label: 'Address' },
    ],
  },
];

type Overrides = Record<string, string>;

export default function AdminTranslationsPage() {
  const supabase = createClient();
  const [overrides, setOverrides] = useState<Overrides>({});
  const [pending, setPending] = useState<Overrides>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeSection, setActiveSection] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('settings').select('key, value').like('key', 'trans_%');
    const map: Overrides = {};
    (data ?? []).forEach((r: { key: string; value: string }) => { map[r.key] = r.value; });
    setOverrides(map);
    setPending(map);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const getValue = (translationKey: string, lang: 'en' | 'es') => {
    const dbKey = `trans_${lang}_${translationKey}`;
    return pending[dbKey] ?? '';
  };

  const setValue = (translationKey: string, lang: 'en' | 'es', value: string) => {
    const dbKey = `trans_${lang}_${translationKey}`;
    setPending(p => ({ ...p, [dbKey]: value }));
  };

  const isDirty = JSON.stringify(pending) !== JSON.stringify(overrides);

  const save = async () => {
    setSaving(true);
    setMsg('');
    const rows = Object.entries(pending)
      .filter(([k, v]) => v !== '' && v !== overrides[k])
      .map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));

    if (rows.length === 0) {
      setSaving(false);
      setMsg('No changes to save.');
      return;
    }

    const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' });
    if (error) {
      setMsg(`Error: ${error.message}`);
    } else {
      setOverrides({ ...pending });
      setMsg(`✓ ${rows.length} translation${rows.length > 1 ? 's' : ''} saved. Changes are live on the site.`);
    }
    setSaving(false);
  };

  const reset = () => { setPending(overrides); setMsg(''); };

  const section = SECTIONS[activeSection];

  return (
    <div className={adminStyles.page}>
      <div className={adminStyles.topbar}>
        <div>
          <Link href="/admin" className={adminStyles.back}>← Admin</Link>
          <h1 className={adminStyles.title}>Site Text</h1>
          <p className={adminStyles.subtitle}>Edit English and Spanish text for each section. Changes are live immediately after saving.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {isDirty && <button className={adminStyles.btnOutline} onClick={reset}>Reset</button>}
          <button className={adminStyles.btnPrimary} onClick={save} disabled={saving || !isDirty}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {msg && <p className={msg.startsWith('✓') ? adminStyles.success : adminStyles.error} style={{ marginBottom: '1.5rem' }}>{msg}</p>}

      <div className={styles.layout}>
        {/* Section sidebar */}
        <nav className={styles.sidebar}>
          {SECTIONS.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActiveSection(i)}
              className={`${styles.sectionBtn} ${i === activeSection ? styles.sectionActive : ''}`}
            >
              {s.title}
            </button>
          ))}
        </nav>

        {/* Translation fields */}
        <div className={styles.fields}>
          {loading ? <p className={adminStyles.loading}>Loading translations…</p> : (
            <>
              <div className={styles.langHeader}>
                <span />
                <span className={styles.langLabel}>English</span>
                <span className={styles.langLabel}>Español</span>
              </div>
              {section.keys.map(({ key, label, multiline }) => {
                const enVal = getValue(key, 'en');
                const esVal = getValue(key, 'es');
                const enChanged = enVal !== (overrides[`trans_en_${key}`] ?? '');
                const esChanged = esVal !== (overrides[`trans_es_${key}`] ?? '');
                return (
                  <div key={key} className={styles.row}>
                    <span className={styles.fieldLabel}>
                      {label}
                      {(enChanged || esChanged) && <span className={styles.dot} title="Unsaved changes" />}
                    </span>
                    {multiline ? (
                      <textarea
                        value={enVal}
                        onChange={e => setValue(key, 'en', e.target.value)}
                        className={`${adminStyles.textarea} ${enChanged ? styles.changed : ''}`}
                        rows={3}
                        placeholder="English text…"
                      />
                    ) : (
                      <input
                        value={enVal}
                        onChange={e => setValue(key, 'en', e.target.value)}
                        className={`${adminStyles.input} ${enChanged ? styles.changed : ''}`}
                        placeholder="English text…"
                      />
                    )}
                    {multiline ? (
                      <textarea
                        value={esVal}
                        onChange={e => setValue(key, 'es', e.target.value)}
                        className={`${adminStyles.textarea} ${esChanged ? styles.changed : ''}`}
                        rows={3}
                        placeholder="Texto en español…"
                      />
                    ) : (
                      <input
                        value={esVal}
                        onChange={e => setValue(key, 'es', e.target.value)}
                        className={`${adminStyles.input} ${esChanged ? styles.changed : ''}`}
                        placeholder="Texto en español…"
                      />
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
