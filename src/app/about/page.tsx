'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './page.module.css';

export default function AboutPage() {
  const { t, lang } = useLanguage();

  const PILLARS = [
    { icon: '✦', titleEn: 'Craft', titleEs: 'Artesanía', descEn: 'Handcrafted cocktails and chef-driven plates — every detail executed with intention.', descEs: 'Cócteles artesanales y platos de autor — cada detalle ejecutado con intención.' },
    { icon: '◌', titleEn: 'Intimacy', titleEs: 'Intimidad', descEn: 'An atmosphere built for connection — candlelit, warm, perfect for two or twenty.', descEs: 'Un ambiente construido para la conexión — a la luz de velas, cálido, perfecto para dos o veinte.' },
    { icon: '⊕', titleEn: 'Eclecticism', titleEs: 'Eclecticismo', descEn: 'Puerto Rican soul meets global technique. Asian-fusion, Mediterranean, and Caribbean in one kitchen.', descEs: 'El alma puertorriqueña se encuentra con la técnica global. Fusión asiática, mediterránea y caribeña en una cocina.' },
    { icon: '♦', titleEn: 'Community', titleEs: 'Comunidad', descEn: 'Proudly rooted in Aguadilla. A happy place for locals and a discovery for visitors.', descEs: 'Orgullosamente arraigados en Aguadilla. Un lugar feliz para locales y un descubrimiento para visitantes.' },
  ];

  const TEAM = [
    {
      name: 'Ivan',
      roleEn: 'Owner & Cocktail Architect',
      roleEs: 'Dueño y Arquitecto de Cócteles',
      bioEn: 'The creative force behind every cocktail on our menu. Ivan built Rebar from the ground up with a vision: authentic Puerto Rican hospitality, global ambition, and the best cocktails on the island.',
      bioEs: 'La fuerza creativa detrás de cada cóctel de nuestro menú. Iván construyó Rebar desde cero con una visión: hospitalidad puertorriqueña auténtica, ambición global y los mejores cócteles de la isla.',
    },
    {
      name: 'Keven',
      roleEn: 'Lead Bartender',
      roleEs: 'Bartender Principal',
      bioEn: 'Meticulous, creative, and warm. Keven crafts outstanding cocktails with the focus of a chef. If you have a spirit or flavor in mind, he\'ll build something perfect for you.',
      bioEs: 'Meticuloso, creativo y cálido. Keven elabora cócteles excepcionales con la precisión de un chef. Si tienes un licor o sabor en mente, creará algo perfecto para ti.',
    },
    {
      name: 'Karina & Team',
      roleEn: 'Front of House',
      roleEs: 'Servicio al Cliente',
      bioEn: 'The Rebar crew greets every guest with a genuine smile and deep knowledge of our menu. They\'re here to guide you through the experience — not just serve it.',
      bioEs: 'El equipo de Rebar recibe a cada huésped con una sonrisa sincera y un profundo conocimiento de nuestro menú. Están aquí para guiarte en la experiencia, no solo servirla.',
    },
  ];

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/images/instagram/rebar_interior_01.jpg" alt="Rebar bar and dining room interior" fill className={styles.heroBgImg} />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <span className="label">{t.about.label}</span>
          <h1>{t.about.heading}</h1>
        </div>
      </section>

      {/* Story */}
      <section className={styles.story}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyText}>
              <span className="label">{t.about.originLabel}</span>
              <h2 className={styles.storyH2}>{t.about.originHeading}</h2>
              <p>{t.about.originP1}</p>
              <p>{t.about.originP2}</p>
              <blockquote className="pull-quote">
                {t.about.originQuote}
                <cite>{t.about.originQuoteAttr}</cite>
              </blockquote>
            </div>
            <div className={styles.storyImages}>
              <Image src="/images/instagram/rebar_food_01.jpg" alt="Rebar food spread" width={500} height={650} className={styles.storyImg1} />
              <Image src="/images/instagram/rebar_cocktail_01.jpg" alt="Rebar cocktail" width={300} height={400} className={styles.storyImg2} />
            </div>
          </div>
        </div>
      </section>

      {/* Kitchen & Bar */}
      <section className={styles.kitchenBar}>
        <div className="container">
          <div className={styles.kbGrid}>
            <div className={styles.kbPanel}>
              <span className="label">{t.about.kitchenLabel}</span>
              <h3 className={styles.kbTitle}>{t.about.kitchenTitle}</h3>
              <p className={styles.kbText}>{t.about.kitchenText}</p>
            </div>
            <div className={styles.kbPanel}>
              <span className="label">{t.about.barLabel}</span>
              <h3 className={styles.kbTitle}>{t.about.barTitle}</h3>
              <p className={styles.kbText}>{t.about.barText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Atmosphere */}
      <section className={styles.atmosphere}>
        <div className={styles.atmosphereInner}>
          <Image src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&h=600&fit=crop" alt="Rebar atmosphere" fill className={styles.atmosphereBg} />
          <div className={styles.atmosphereOverlay} />
          <div className={`container ${styles.atmosphereContent}`}>
            <span className="label">{t.about.atmosphereLabel}</span>
            <h2 className={styles.atmosphereH2}>{t.about.atmosphereHeading}</h2>
            <p className={styles.atmosphereText}>{t.about.atmosphereText}</p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={styles.team}>
        <div className="container">
          <span className="label">{t.about.teamLabel}</span>
          <h2 className={styles.teamH2}>{t.about.teamHeading}</h2>
          <div className={styles.teamGrid}>
            {TEAM.map((m) => (
              <div key={m.name} className={styles.teamCard}>
                <div className={styles.teamAvatar}><span>{m.name[0]}</span></div>
                <h3 className={styles.teamName}>{m.name}</h3>
                <span className={styles.teamRole}>{lang === 'es' ? m.roleEs : m.roleEn}</span>
                <p className={styles.teamBio}>{lang === 'es' ? m.bioEs : m.bioEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Pillars */}
      <section className={styles.pillars}>
        <div className="container">
          <span className="label">{t.about.pillarsLabel}</span>
          <h2 className={styles.pillarsH2}>{t.about.pillarsHeading}</h2>
          <div className={styles.pillarsGrid}>
            {PILLARS.map((p) => (
              <div key={p.titleEn} className={styles.pillarCard}>
                <span className={styles.pillarIcon}>{p.icon}</span>
                <h3 className={styles.pillarTitle}>{lang === 'es' ? p.titleEs : p.titleEn}</h3>
                <p className={styles.pillarDesc}>{lang === 'es' ? p.descEs : p.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className={styles.closingCta}>
        <div className="container">
          <h2 className={styles.closingH2}>{t.about.closingHeading}</h2>
          <p className={styles.closingText}>{t.about.closingText}</p>
          <div className={styles.closingActions}>
            <Link href="/reservations" className="btn-primary">{t.about.reserveCta}</Link>
            <Link href="/menu" className="btn-outline">{t.about.menuCta}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}