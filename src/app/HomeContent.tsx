'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';
import styles from './page.module.css';

type Event = {
  id: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  event_date: string;
  cover_image_url?: string;
};

export default function HomeContent({ upcomingEvents }: { upcomingEvents: Event[] | null }) {
  const { t, lang } = useLanguage();

  const FEATURED = [
    {
      name: t.home.featuredFood.name,
      desc: t.home.featuredFood.desc,
      image: '/images/instagram/rebar_food_01.jpg',
      tag: t.home.featuredFood.tag,
      href: '/menu#tapas',
    },
    {
      name: t.home.featuredCocktail.name,
      desc: t.home.featuredCocktail.desc,
      image: '/images/instagram/rebar_cocktail_01.jpg',
      tag: t.home.featuredCocktail.tag,
      href: '/menu#cocktails',
    },
    {
      name: t.home.featuredGrill.name,
      desc: t.home.featuredGrill.desc,
      image: '/images/instagram/rebar_steak_01.jpg',
      tag: t.home.featuredGrill.tag,
      href: '/menu#mains',
    },
  ];

  const GALLERY_PHOTOS = [
    { src: '/images/instagram/rebar_food_01.jpg', alt: t.home.featuredFood.name },
    { src: '/images/instagram/rebar_cocktail_01.jpg', alt: t.home.featuredCocktail.name },
    { src: '/images/instagram/rebar_steak_01.jpg', alt: t.home.featuredGrill.name },
    { src: '/images/instagram/rebar_atmosphere_01.jpg', alt: t.home.reserveLabel },
    { src: '/images/instagram/rebar_food_01.jpg', alt: t.home.featuredFood.name },
    { src: '/images/instagram/rebar_cocktail_01.jpg', alt: t.home.featuredCocktail.name },
  ];

  const WEEKLY = [
    { key: 'mon_thu', day: t.events.weekly.mon_thu.day, title: t.events.weekly.mon_thu.name, desc: t.events.weekly.mon_thu.desc, color: '#8B4A1A' },
    { key: 'wed',     day: t.events.weekly.wed.day,     title: t.events.weekly.wed.name,     desc: t.events.weekly.wed.desc,     color: '#C4877A' },
    { key: 'thu',     day: t.events.weekly.thu.day,     title: t.events.weekly.thu.name,     desc: t.events.weekly.thu.desc,     color: '#C8922A' },
    { key: 'fri',     day: t.events.weekly.fri.day,     title: t.events.weekly.fri.name,     desc: t.events.weekly.fri.desc,     color: '#3D5A3E' },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-label="Hero">
        <div className={styles.heroBg}>
          <EditableImage
            imageKey="home.hero"
            src="/images/instagram/rebar_food_01.jpg"
            alt="Rebar restaurant — handcrafted cuisine and cocktails"
            fill
            priority
            className={styles.heroBgImg}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <EditableText translationKey="home.location" value={t.home.location} lang={lang} as="p" className={styles.heroPreLabel} />
          <div className={styles.heroLogo}>
            <span className={styles.heroX}>×</span>
            <h1 className={styles.heroTitle}>REBAR</h1>
          </div>
          <EditableText translationKey="home.tagline" value={t.home.tagline} lang={lang} as="p" className={styles.heroSub} />
          <EditableText translationKey="home.subTagline" value={t.home.subTagline} lang={lang} as="p" className={styles.heroTagline} />
          <div className={styles.heroCtas}>
            <Link href="/reservations" className="btn-primary">{t.home.heroReserve}</Link>
            <Link href="/menu" className="btn-outline">{t.home.heroMenu}</Link>
          </div>
        </div>
        <div className={styles.scrollIndicator} aria-hidden="true"><span /></div>
      </section>

      {/* ── BRAND STORY ── */}
      <section className={styles.story}>
        <div className={`container ${styles.storyInner}`}>
          <div className={styles.storyText}>
            <span className="label">{t.home.storyLabel}</span>
            <EditableText translationKey="home.storyHeading" value={t.home.storyHeading} lang={lang} as="h2" className={styles.storyHeading} />
            <EditableText translationKey="home.storyBody" value={t.home.storyBody} lang={lang} as="p" className={styles.storyBody} />
            <blockquote className="pull-quote">
              <EditableText translationKey="home.storyQuote" value={t.home.storyQuote} lang={lang} as="span" />
              <cite><EditableText translationKey="home.storyQuoteAttr" value={t.home.storyQuoteAttr} lang={lang} as="span" /></cite>
            </blockquote>
          </div>
          <div className={styles.storyImageWrap}>
            <EditableImage
              imageKey="home.story"
              src="/images/instagram/rebar_cocktail_01.jpg"
              alt="Rebar handcrafted cocktails"
              width={500}
              height={650}
              className={styles.storyImage}
            />
          </div>
        </div>
      </section>

      {/* ── FEATURED DISHES ── */}
      <section className={`section ${styles.featured}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="label">{t.home.featuredLabel}</span>
            <EditableText translationKey="home.featuredHeading" value={t.home.featuredHeading} lang={lang} as="h2" />
          </div>
          <div className={styles.featuredGrid}>
            {FEATURED.map((item, i) => (
              <Link key={item.name} href={item.href} className={`card ${styles.featuredCard}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
                <div className={styles.featuredImgWrap}>
                  <EditableImage
                    imageKey={`home.featured${i}`}
                    src={item.image}
                    alt={item.name}
                    width={480}
                    height={300}
                    className={styles.featuredImg}
                  />
                  <span className={styles.featuredTag}>{item.tag}</span>
                </div>
                <div className={styles.featuredBody}>
                  <div className="gold-line" />
                  <h3 className={styles.featuredName}>{item.name}</h3>
                  <p className={styles.featuredDesc}>{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className={styles.sectionCta}>
            <Link href="/menu" className="btn-outline">{t.home.featuredCta}</Link>
          </div>
        </div>
      </section>

      {/* ── GALLERY TEASER ── */}
      <section className={styles.galleryTeaser}>
        <div className={styles.galleryHeader}>
          <span className="label">{t.home.galleryLabel}</span>
          <h2>{t.home.galleryHeading}</h2>
        </div>
        <div className={styles.galleryStrip}>
          {GALLERY_PHOTOS.map((photo, i) => (
            <div key={i} className={styles.galleryItem}>
              <Image src={photo.src} alt={photo.alt} width={400} height={300} className={styles.galleryImg} />
            </div>
          ))}
        </div>
        <div className={styles.galleryCta}>
          <Link href="/gallery" className="btn-outline">{t.home.galleryCta}</Link>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section className={`section ${styles.events}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="label">{t.home.eventsLabel}</span>
            <h2>{t.home.eventsHeading}</h2>
          </div>
          <div className={styles.weeklyGrid}>
            {WEEKLY.map((e) => (
              <div key={e.title} className={styles.weeklyCard} style={{ '--accent': e.color } as React.CSSProperties}>
                <span className={styles.weeklyDay}>{e.day}</span>
                <EditableText translationKey={`events.weekly.${e.key}.name`} value={e.title} lang={lang} as="h3" className={styles.weeklyTitle} />
                <EditableText translationKey={`events.weekly.${e.key}.desc`} value={e.desc} lang={lang} as="p" className={styles.weeklyDesc} />
              </div>
            ))}
          </div>
          {upcomingEvents && upcomingEvents.length > 0 && (
            <>
              <div className={styles.sectionSubheader}>
                <span className="label">{t.events.specialLabel}</span>
              </div>
              <div className={styles.eventsGrid}>
                {upcomingEvents.map((event) => (
                  <article key={event.id} className={`card ${styles.eventCard}`}>
                    {event.cover_image_url && (
                      <div className={styles.eventImgWrap}>
                        <Image src={event.cover_image_url} alt={lang === 'es' ? event.title_es : event.title_en} width={480} height={240} className={styles.eventImg} />
                      </div>
                    )}
                    <div className={styles.eventBody}>
                      <span className={styles.eventDate}>{new Date(event.event_date).toLocaleDateString(lang === 'es' ? 'es-PR' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <h3 className={styles.eventTitle}>{lang === 'es' ? event.title_es : event.title_en}</h3>
                      <p className={styles.eventDesc}>{lang === 'es' ? event.description_es : event.description_en}</p>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
          <div className={styles.sectionCta}>
            <Link href="/events" className="btn-outline">{t.home.eventsCta}</Link>
          </div>
        </div>
      </section>

      {/* ── RESERVATION CTA ── */}
      <section className={styles.reserveCta}>
        <div className={styles.reserveCtaBg}>
          <Image
            src="/images/instagram/rebar_atmosphere_01.jpg"
            alt="Rebar dining room ambiance"
            fill
            className={styles.reserveCtaBgImg}
          />
          <div className={styles.reserveCtaOverlay} />
        </div>
        <div className={`container ${styles.reserveCtaContent}`}>
          <span className="label">{t.home.reserveLabel}</span>
          <h2 className={styles.reserveCtaHeading}>{t.home.reserveHeading}</h2>
          <p className={styles.reserveCtaText}>{t.home.reserveBody}</p>
          <div className={styles.reserveCtaActions}>
            <Link href="/reservations" className="btn-primary">{t.home.reserveCta}</Link>
            <a href="tel:+17876581669" className={styles.reservePhone}>
              {t.home.reserveOr} <strong>787-658-1669</strong>
            </a>
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM STRIP ── */}
      <section className={`section ${styles.instagram}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="label">{t.home.instaLabel}</span>
            <h2>{t.home.instaHeading}</h2>
          </div>
          <div className={styles.instaGrid}>
            {[
              '/images/instagram/rebar_cocktail_01.jpg',
              '/images/instagram/rebar_steak_01.jpg',
              '/images/instagram/rebar_food_01.jpg',
              '/images/instagram/rebar_atmosphere_01.jpg',
              '/images/instagram/rebar_cocktail_01.jpg',
              '/images/instagram/rebar_steak_01.jpg',
            ].map((src, i) => (
              <a
                key={i}
                href="https://instagram.com/rebarpr"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.instaItem}
                aria-label="View on Instagram"
              >
                <Image src={src} alt="Rebar Instagram" width={300} height={300} className={styles.instaImg} />
                <div className={styles.instaOverlay}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </div>
              </a>
            ))}
          </div>
          <div className={styles.sectionCta}>
            <a href="https://instagram.com/rebarpr" target="_blank" rel="noopener noreferrer" className="btn-outline">
              {t.home.instaFollow}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
