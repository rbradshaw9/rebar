'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './page.module.css';

const CATEGORIES_KEYS = ['tapas', 'bao', 'mains', 'pasta', 'seafood', 'cocktails', 'wine', 'desserts'] as const;

// Rebar photos mapped to menu categories
const CATEGORY_PHOTOS: Record<string, string> = {
  mains: '/images/instagram/rebar_steak_01.jpg',
  cocktails: '/images/instagram/rebar_cocktail_01.jpg',
  tapas: '/images/instagram/rebar_food_01.jpg',
  seafood: '/images/instagram/rebar_food_01.jpg',
};

// Seed menu fallback
const SEED_MENU = [
  { category: 'tapas', name_en: 'Calamari Frito', name_es: 'Calamari Frito', description_en: 'Crispy fried calamari with house aioli', description_es: 'Calamari frito con aioli de la casa', price: 12, is_featured: false },
  { category: 'tapas', name_en: 'Dragonfire Wings', name_es: 'Dragonfire Wings', description_en: 'Crispy wings tossed in our signature spicy glaze', description_es: 'Alitas crujientes con glaseado picante de la casa', price: 12, is_featured: true },
  { category: 'tapas', name_en: 'Croquetas de Chorizo', name_es: 'Croquetas de Chorizo', description_en: 'Chorizo & manchego croquettes, golden-fried', description_es: 'Croquetas de chorizo y manchego', price: 14, is_featured: false },
  { category: 'tapas', name_en: 'Ceviche de Mero', name_es: 'Ceviche de Mero', description_en: 'Fresh grouper, citrus, and crisp herbs', description_es: 'Mero fresco, cítricos y hierbas frescas', price: 14, is_featured: false },
  { category: 'tapas', name_en: 'Monkey Nachos', name_es: 'Monkey Nachos', description_en: 'Malanga chips with churrasco or chicken, house toppings', description_es: 'Chips de malanga con churrasco o pollo', price: 16, is_featured: false },
  { category: 'tapas', name_en: 'Chorizo al Vino', name_es: 'Chorizo al Vino', description_en: 'Pan-seared chorizo in red wine reduction with manchego & pita', description_es: 'Chorizo al vino tinto con manchego y pan pita', price: 14, is_featured: false },
  { category: 'bao', name_en: 'Mongolian Beef Bao', name_es: 'Bao de Res Mongol', description_en: 'Steamed bao buns with glazed Mongolian beef & scallions', description_es: 'Baos al vapor con res glaseada y cebollino', price: 16, is_featured: true },
  { category: 'mains', name_en: 'Ribeye', name_es: 'Ribeye', description_en: "Prime 16oz ribeye, chef's choice accompaniment", description_es: 'Ribeye premium 16oz, acompañante a elección', price: 58, is_featured: true },
  { category: 'mains', name_en: 'New York Strip', name_es: 'New York Strip', description_en: '10oz New York strip, house seasoning, red wine reduction', description_es: 'New York Strip 10oz con reducción de vino tinto', price: 36, is_featured: false },
  { category: 'mains', name_en: 'Churrasco', name_es: 'Churrasco', description_en: 'Skirt steak with chimichurri, tostones & salad', description_es: 'Churrasco con chimichurri, tostones y ensalada', price: 28, is_featured: false },
  { category: 'mains', name_en: 'Mongolian Beef Entrée', name_es: 'Res Mongol Entrée', description_en: 'Glazed beef with fried rice & tostones', description_es: 'Res glaseada con arroz frito y tostones', price: 22, is_featured: false },
  { category: 'mains', name_en: 'Costillas', name_es: 'Costillas', description_en: 'Slow-braised ribs — half rack or full rack', description_es: 'Costillas braseadas — medio o rack completo', price: 18, is_featured: false },
  { category: 'seafood', name_en: 'Pulpo a la Brasa', name_es: 'Pulpo a la Brasa', description_en: 'Char-grilled octopus with chimichurri & house salad', description_es: 'Pulpo a la brasa con chimichurri y ensalada', price: 28, is_featured: true },
  { category: 'seafood', name_en: 'Mahi Mahi', name_es: 'Mahi Mahi', description_en: 'Grilled mahi with tropical butter & seasonal veg', description_es: 'Mahi a la parrilla con mantequilla tropical', price: 24, is_featured: false },
  { category: 'seafood', name_en: 'Salmon', name_es: 'Salmón', description_en: 'Pan-seared salmon with gnocchi & herb cream', description_es: 'Salmón a la sartén con ñoqui y crema de hierbas', price: 24, is_featured: false },
  { category: 'pasta', name_en: 'Fettuccine Alfredo', name_es: 'Fettuccine Alfredo', description_en: 'Classic alfredo — add chicken, churrasco, NY strip, or shrimp', description_es: 'Fettuccine alfredo — elige proteína', price: 18, is_featured: false },
  { category: 'pasta', name_en: 'Manhattan Lo-Mein', name_es: 'Lo-Mein Manhattan', description_en: 'Lo-mein noodles with NY strip, vegetables & house sauce', description_es: 'Lo-mein con New York Strip y salsa de la casa', price: 36, is_featured: true },
  { category: 'cocktails', name_en: 'Querido Viejo', name_es: 'Querido Viejo', description_en: 'Abuelo rum, espresso, tobacco bitters — the signature slow sipper', description_es: 'Ron Abuelo, espresso, bitters de tabaco', price: 14, is_featured: true },
  { category: 'cocktails', name_en: 'House Old Fashioned', name_es: 'Old Fashioned de la Casa', description_en: 'Bourbon, house bitters, smoked orange peel', description_es: 'Bourbon, bitters artesanales, cáscara de naranja ahumada', price: 9, is_featured: false },
  { category: 'cocktails', name_en: 'Coctel Secreto', name_es: 'Coctel Secreto', description_en: 'Wednesday special — the mystery cocktail. Ask your server.', description_es: 'Especial de miércoles — el cóctel misterioso', price: 8, is_featured: false },
  { category: 'cocktails', name_en: 'Margarita', name_es: 'Margarita', description_en: 'Classic or house twist — Thursday 2×1', description_es: 'Clásica o con toque de la casa — 2×1 jueves', price: 12, is_featured: false },
];

const DIETARY_ICONS: Record<string, string> = {
  vegetarian: '🌿',
  vegan: '🌱',
  'gluten-free': 'GF',
  spicy: '🌶',
};

function GoldStar() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--ember-gold)" style={{ marginRight: 4 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}
function WhatsAppIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>;
}

export default function MenuContent({ menuItems }: { menuItems: any[] | null }) {
  const { t, lang } = useLanguage();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState('');

  const openLightbox = (src: string, alt: string) => { setLightboxSrc(src); setLightboxAlt(alt); };
  const closeLightbox = () => setLightboxSrc(null);

  const items = (menuItems && menuItems.length > 0) ? menuItems : SEED_MENU;

  const byCategory: Record<string, typeof items> = {};
  for (const key of CATEGORIES_KEYS) {
    byCategory[key] = items.filter((i: any) => i.category === key);
  }

  const getCategoryLabel = (key: string) =>
    (t.menu.categories as Record<string, string>)[key] || key;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/images/instagram/rebar_food_01.jpg" alt="Rebar menu — chef-driven cuisine" fill className={styles.heroBgImg} />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <span className="label">{t.menu.label}</span>
          <h1>{t.menu.heading}</h1>
          <p className={styles.heroSub}>{t.menu.subheading}</p>
        </div>
      </section>

      {/* Menu Content */}
      <div className={styles.menuWrap}>
        {/* Sticky Category Nav */}
        <nav className={styles.catNav} aria-label="Menu categories">
          {CATEGORIES_KEYS.map(key =>
            byCategory[key]?.length > 0 ? (
              <a key={key} href={`#${key}`} className={styles.catLink}>{getCategoryLabel(key)}</a>
            ) : null
          )}
        </nav>

        {/* Sections */}
        <div className={styles.menuSections}>
          {CATEGORIES_KEYS.map(key => {
            const catItems = byCategory[key];
            if (!catItems || catItems.length === 0) return null;
            const catPhoto = CATEGORY_PHOTOS[key];

            return (
              <section key={key} id={key} className={styles.menuSection}>
                <div className={styles.sectionHeadingWrap}>
                  {catPhoto && (
                    <div className={styles.sectionThumb}>
                      <Image src={catPhoto} alt={getCategoryLabel(key)} width={80} height={80} className={styles.sectionThumbImg} />
                    </div>
                  )}
                  <div>
                    <div className="gold-line" />
                    <h2 className={styles.sectionHeading}>{getCategoryLabel(key)}</h2>
                  </div>
                </div>
                <div className={styles.itemsGrid}>
                  {catItems.map((item: any, i: number) => (
                    <article key={item.id || i} className={`${styles.menuItem} ${item.is_featured ? styles.featured : ''}`}>
                      <div className={styles.itemInner}>
                        <div className={styles.itemText}>
                          <div className={styles.itemHeader}>
                            <h3 className={styles.itemName}>{lang === 'es' ? item.name_es : item.name_en}</h3>
                            <span className={styles.itemPrice}>${Number(item.price).toFixed(0)}</span>
                          </div>
                          {(lang === 'es' ? item.description_es : item.description_en) && (
                            <p className={styles.itemDesc}>{lang === 'es' ? item.description_es : item.description_en}</p>
                          )}
                          <div className={styles.itemMeta}>
                            {item.is_featured && (
                              <span className={styles.chefBadge}>
                                <GoldStar />{t.menu.chefPick}
                              </span>
                            )}
                            {item.is_seasonal && (
                              <span className={styles.seasonalBadge}>{t.menu.seasonal}</span>
                            )}
                            {item.dietary_tags?.length > 0 && (
                              <div className={styles.dietaryTags}>
                                {item.dietary_tags.map((tag: string) => (
                                  <span key={tag} className={styles.dietaryTag}>{DIETARY_ICONS[tag] || tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {item.is_featured && item.image_url && (
                          <button
                            className={styles.itemThumb}
                            onClick={() => openLightbox(item.image_url, lang === 'es' ? item.name_es : item.name_en)}
                            aria-label={`View photo of ${lang === 'es' ? item.name_es : item.name_en}`}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                          >
                            <Image src={item.image_url} alt={lang === 'es' ? item.name_es : item.name_en} width={90} height={90} className={styles.itemThumbImg} />
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className={styles.bottomCta}>
        <p className={styles.bottomNote}>{t.menu.bottomNote}</p>
        <div className={styles.bottomActions}>
          <Link href="/reservations" className="btn-primary">{t.menu.reserve}</Link>
          <a href="tel:+17876581669" className={styles.callLink}>{t.menu.callOrder}</a>
          <a href="https://wa.me/17876581669" target="_blank" rel="noopener noreferrer" className={styles.waLink}>
            <WhatsAppIcon />{t.menu.whatsapp}
          </a>
        </div>
      </div>

      {/* Menu Image Lightbox */}
      {lightboxSrc && (
        <div
          role="dialog"
          aria-label="Menu item photo"
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <button
            onClick={closeLightbox}
            aria-label="Close"
            style={{
              position: 'absolute', top: 20, right: 24,
              background: 'none', border: 'none', color: '#fff',
              fontSize: '2rem', cursor: 'pointer', lineHeight: 1,
            }}
          >✕</button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }}>
            <Image
              src={lightboxSrc}
              alt={lightboxAlt}
              width={600}
              height={600}
              style={{ objectFit: 'contain', maxHeight: '85vh', width: 'auto', height: 'auto' }}
            />
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: 12, fontSize: '0.85rem' }}>{lightboxAlt}</p>
          </div>
        </div>
      )}
    </div>
  );
}
