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
  { src: '/images/instagram/rebar_food_screenshot_01.jpg', alt: 'Rebar menu highlights', cat: 'food' },
  { src: '/images/instagram/rebar_atmosphere_01.jpg', alt: 'Bar ambiance at Rebar', cat: 'ambiance' },
  { src: '/images/instagram/rebar_cocktail_01.jpg', alt: 'Craft cocktail detail', cat: 'cocktails' },
  { src: '/images/instagram/rebar_steak_01.jpg', alt: 'Events and dining at Rebar', cat: 'events' },
  { src: '/images/instagram/rebar_food_01.jpg', alt: 'Chef-driven food presentation', cat: 'food' },
  { src: '/images/instagram/rebar_cocktail_01.jpg', alt: 'Handcrafted drinks', cat: 'cocktails' },
  { src: '/images/instagram/rebar_atmosphere_01.jpg', alt: 'Rebar dining room', cat: 'ambiance' },
  { src: '/images/instagram/rebar_food_screenshot_01.jpg', alt: 'Rebar bar glow', cat: 'ambiance' },
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
