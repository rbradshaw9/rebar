'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './page.module.css';

const PHOTOS = [
  { src: '/images/instagram/rebar_food_01.jpg', alt: 'Rebar signature dishes', cat: 'food' },
  { src: '/images/instagram/rebar_cocktail_01.jpg', alt: 'Handcrafted cocktails at Rebar', cat: 'cocktails' },
  { src: '/images/instagram/rebar_steak_01.jpg', alt: 'Prime cuts from the grill', cat: 'food' },
  { src: '/images/instagram/rebar_atmosphere_01.jpg', alt: 'Rebar dining atmosphere', cat: 'ambiance' },
  { src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop', alt: 'Grilled meats', cat: 'food' },
  { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=600&fit=crop', alt: 'Bar ambiance', cat: 'ambiance' },
  { src: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=600&fit=crop', alt: 'Cocktail detail', cat: 'cocktails' },
  { src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=600&fit=crop', alt: 'Live music event', cat: 'events' },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop', alt: 'Food presentation', cat: 'food' },
  { src: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=600&h=600&fit=crop', alt: 'Wine service', cat: 'cocktails' },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=600&fit=crop', alt: 'Dining room', cat: 'ambiance' },
  { src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=600&fit=crop', alt: 'Warm bar lighting', cat: 'ambiance' },
];

export default function GalleryPage() {
  const { t } = useLanguage();
  const [activeCat, setActiveCat] = useState('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const CATS = [
    { key: 'all', label: t.gallery.categories.all },
    { key: 'food', label: t.gallery.categories.food },
    { key: 'cocktails', label: t.gallery.categories.cocktails },
    { key: 'ambiance', label: t.gallery.categories.ambiance },
    { key: 'events', label: t.gallery.categories.events },
  ];

  const filtered = activeCat === 'all' ? PHOTOS : PHOTOS.filter(p => p.cat === activeCat);

  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null);
  const next = () => setLightbox(i => i !== null ? (i + 1) % filtered.length : null);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className="label">{t.gallery.label}</span>
        <h1>{t.gallery.heading}</h1>
        <p className={styles.headerSub}>{t.gallery.subheading}</p>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filters}>
        {CATS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCat(key)}
            className={`${styles.filterBtn} ${activeCat === key ? styles.active : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className={`container ${styles.grid}`}>
        {filtered.map((photo, i) => (
          <button
            key={`${photo.src}-${i}`}
            className={styles.photoItem}
            onClick={() => setLightbox(i)}
            aria-label={`View ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={600}
              height={600}
              className={styles.photo}
              loading="lazy"
            />
            <div className={styles.photoOverlay}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </div>
          </button>
        ))}
      </div>

      {/* Instagram CTA */}
      <div className={styles.instaCta}>
        <p>{t.gallery.subheading}</p>
        <a href="https://instagram.com/rebarpr" target="_blank" rel="noopener noreferrer" className="btn-outline">{t.gallery.instaFollow}</a>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className={styles.lightbox} onClick={closeLightbox} role="dialog" aria-label="Photo lightbox">
          <button className={styles.lbClose} onClick={closeLightbox} aria-label="Close">✕</button>
          <button className={`${styles.lbNav} ${styles.lbPrev}`} onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous">‹</button>
          <div className={styles.lbImgWrap} onClick={e => e.stopPropagation()}>
            <Image
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
              width={900}
              height={900}
              className={styles.lbImg}
              priority
            />
          </div>
          <button className={`${styles.lbNav} ${styles.lbNext}`} onClick={e => { e.stopPropagation(); next(); }} aria-label="Next">›</button>
          <p className={styles.lbCaption}>{filtered[lightbox].alt}</p>
        </div>
      )}
    </div>
  );
}
