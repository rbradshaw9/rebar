'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { useAdminEdit } from '@/lib/AdminEditContext';
import { createClient } from '@/utils/supabase/client';

interface EditableImageProps {
  /** Unique key used to store the override, e.g. 'home.hero' */
  imageKey: string;
  /** Fallback src when no override exists */
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

export default function EditableImage({
  imageKey,
  src,
  alt,
  fill,
  width,
  height,
  className,
  style,
  priority,
}: EditableImageProps) {
  const { editMode, overrides, saveOverride } = useAdminEdit();
  const dbKey = `img_${imageKey}`;
  const activeSrc = overrides[dbKey] || src;

  const inputRef = useRef<HTMLInputElement>(null);
  const [hovering, setHovering] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const filename = `site/${imageKey.replace(/\./g, '/')}/${Date.now()}.${ext}`;

    try {
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filename, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('media').getPublicUrl(filename);
      await saveOverride(dbKey, data.publicUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const wrapperStyle: React.CSSProperties = fill
    ? { position: 'absolute', inset: 0 }
    : { position: 'relative', display: 'inline-block', width, height };

  if (!editMode) {
    return fill ? (
      <Image src={activeSrc} alt={alt} fill className={className} style={style} priority={priority} />
    ) : (
      <Image src={activeSrc} alt={alt} width={width!} height={height!} className={className} style={style} priority={priority} />
    );
  }

  return (
    <span
      style={wrapperStyle}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {fill ? (
        <Image src={activeSrc} alt={alt} fill className={className} style={style} priority={priority} />
      ) : (
        <Image src={activeSrc} alt={alt} width={width!} height={height!} className={className} style={style} priority={priority} />
      )}

      {/* Hover overlay */}
      {hovering && (
        <span
          onClick={() => inputRef.current?.click()}
          style={{
            position: 'absolute', inset: 0, zIndex: 50,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.55)', cursor: 'pointer', gap: '0.4rem',
            backdropFilter: 'blur(2px)',
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>{uploading ? '⏳' : '📷'}</span>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
            {uploading ? 'Uploading…' : 'Replace Photo'}
          </span>
          {error && <span style={{ fontSize: '0.7rem', color: '#ff6b6b' }}>{error}</span>}
        </span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
    </span>
  );
}
