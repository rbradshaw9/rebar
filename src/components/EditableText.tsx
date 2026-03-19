'use client';
import { useState, useRef, useEffect } from 'react';
import { useAdminEdit } from '@/lib/AdminEditContext';

interface EditableTextProps {
  /** The dot-path key in the translation JSON, e.g. 'home.tagline' */
  translationKey: string;
  /** The current text value (from useLanguage) */
  value: string;
  /** Which language this value is for ('en' | 'es') */
  lang: 'en' | 'es';
  /** Render as block (div) or inline (span) */
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function EditableText({
  translationKey,
  value,
  lang,
  as: Tag = 'span',
  className,
  style,
  children,
}: EditableTextProps) {
  const { editMode, overrides, saveOverride } = useAdminEdit();
  const dbKey = `trans_${lang}_${translationKey}`;

  // Use DB override if present, else the passed value
  const displayValue = overrides[dbKey] ?? value;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(displayValue);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setDraft(overrides[dbKey] ?? value); }, [overrides, dbKey, value]);

  const openEditor = () => {
    if (!editMode) return;
    setDraft(displayValue);
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const save = async () => {
    setSaving(true);
    await saveOverride(dbKey, draft);
    setSaving(false);
    setEditing(false);
  };

  const cancel = () => setEditing(false);

  if (!editMode) {
    return <Tag className={className} style={style}>{children ?? displayValue}</Tag>;
  }

  return (
    <Tag
      className={className}
      style={{
        ...style,
        position: 'relative',
        outline: editing ? '2px solid var(--ember-gold)' : '1px dashed rgba(200,146,42,0.5)',
        outlineOffset: 2,
        cursor: 'text',
        minWidth: 20,
      }}
      onClick={openEditor}
      title="Click to edit"
    >
      {children ?? displayValue}

      {editing && (
        <span
          style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)' }}
          onClick={e => { if (e.target === e.currentTarget) cancel(); }}
        >
          <span style={{ background: 'var(--bg-card)', border: '1px solid var(--ember-gold)', padding: '1.5rem', borderRadius: 8, width: 480, maxWidth: '90vw', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ember-gold)' }}>
              Editing: {lang.toUpperCase()} · {translationKey}
            </span>
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              rows={4}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-card)', color: 'var(--cream-white)', padding: '0.6rem 0.75rem', fontFamily: 'var(--font-sans)', fontSize: '1rem', resize: 'vertical', outline: 'none', width: '100%', boxSizing: 'border-box' }}
            />
            <span style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={cancel} style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-card)', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={save} disabled={saving} style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--ember-gold)', color: '#0d0d0d', border: 'none', padding: '0.5rem 1.2rem', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </span>
          </span>
        </span>
      )}
    </Tag>
  );
}
