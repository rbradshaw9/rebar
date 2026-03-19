'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

interface ImageUploaderProps {
  value: string;           // current photo_url
  onChange: (url: string) => void;
  folder?: string;         // e.g. 'menu', 'events'
  label?: string;
}

export default function ImageUploader({ value, onChange, folder = 'uploads', label = 'Photo' }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    try {
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filename, file, { upsert: false, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('media').getPublicUrl(filename);
      onChange(data.publicUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => onChange('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {label}
      </label>

      {/* Preview */}
      {value ? (
        <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
          <Image
            src={value}
            alt="Preview"
            width={280}
            height={160}
            style={{ objectFit: 'cover', display: 'block', border: '1px solid var(--border-card)' }}
            unoptimized
          />
          <button
            type="button"
            onClick={handleRemove}
            title="Remove image"
            style={{
              position: 'absolute', top: 6, right: 6,
              background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none',
              borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer',
            }}
          >
            ✕ Remove
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            width: '100%', maxWidth: 280, height: 120,
            border: '1px dashed var(--border-card)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '0.4rem', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.85rem',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ember-gold)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-card)')}
        >
          <span style={{ fontSize: '1.5rem' }}>📷</span>
          <span>{uploading ? 'Uploading…' : 'Click to upload'}</span>
          <span style={{ fontSize: '0.72rem' }}>JPG, PNG, WebP · max 5MB</span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFile}
        disabled={uploading}
        style={{ display: 'none' }}
      />

      {/* Upload button when image already set (swap photo) */}
      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{ fontFamily: 'var(--font-label)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-card)', padding: '0.4rem 0.75rem', cursor: 'pointer', alignSelf: 'flex-start' }}
        >
          {uploading ? 'Uploading…' : '↑ Replace Photo'}
        </button>
      )}

      {error && <span style={{ fontSize: '0.78rem', color: '#e05252' }}>{error}</span>}
    </div>
  );
}
