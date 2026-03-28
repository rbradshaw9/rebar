'use client';
import { useState, useEffect } from 'react';


// ─── PLAN DATA ────────────────────────────────────────────────────────────────

const PLANS = [
  {
    key: 'presencia',
    en: {
      name: 'Cornerstone',
      tagline: 'Your restaurant online, done right.',
      features: [
        'Custom bilingual website',
        'Menu, hours & contact pages',
        'Google Maps integration',
        'Mobile optimized',
        'Hosting & maintenance included',
      ],
    },
    es: {
      name: 'Cornerstone',
      tagline: 'Tu restaurante en línea, como debe ser.',
      features: [
        'Sitio web bilingüe personalizado',
        'Páginas de menú, horarios y contacto',
        'Integración con Google Maps',
        'Optimizado para móviles',
        'Hospedaje y mantenimiento incluidos',
      ],
    },
    setup: '$597',
    monthly: '$97/mo',
    monthlyEs: '$97/mes',
    highlight: false,
  },
  {
    key: 'visibilidad',
    en: {
      name: 'Spotlight',
      tagline: 'Get found. Get chosen.',
      features: [
        'Everything in Cornerstone',
        'Local SEO setup & optimization',
        'Google Business Profile management',
        'Monthly performance report',
        'Priority support',
      ],
    },
    es: {
      name: 'Spotlight',
      tagline: 'Que te encuentren. Que te elijan.',
      features: [
        'Todo lo de Cornerstone',
        'SEO local y optimización',
        'Gestión del Perfil de Google Business',
        'Reporte mensual de rendimiento',
        'Soporte prioritario',
      ],
    },
    setup: '$897',
    monthly: '$247/mo',
    monthlyEs: '$247/mes',
    highlight: true,
  },
  {
    key: 'crecimiento',
    en: {
      name: 'Full House',
      tagline: 'Your full-service digital partner.',
      features: [
        'Everything in Spotlight',
        'Online reservations system',
        'Email marketing campaigns',
        'Social media content support',
        'Dedicated account manager',
      ],
    },
    es: {
      name: 'Full House',
      tagline: 'Tu socio digital de servicio completo.',
      features: [
        'Todo lo de Spotlight',
        'Sistema de reservaciones en línea',
        'Campañas de email marketing',
        'Apoyo con contenido en redes sociales',
        'Gerente de cuenta dedicado',
      ],
    },
    setup: '$1,247',
    monthly: '$597/mo',
    monthlyEs: '$597/mes',
    highlight: false,
  },
];

// ─── COPY ─────────────────────────────────────────────────────────────────────

const COPY = {
  gate: {
    label: { en: 'Site Preview · Vista Previa', es: 'Vista Previa · Site Preview' },
    heading: {
      en: <>This is your <em style={{ fontStyle: 'italic', color: '#C4923A' }}>free preview.</em></>,
      es: <>Esta es tu <em style={{ fontStyle: 'italic', color: '#C4923A' }}>vista previa gratuita.</em></>,
    },
    body: {
      en: 'We built this site for Rebar at no charge. Everything you see — the design, the menu, the photography — was made specifically for you. If you decide to move forward, we\'ll make any changes you want before going live.',
      es: 'Construimos este sitio para Rebar sin costo alguno. Todo lo que ves — el diseño, el menú, la fotografía — fue hecho específicamente para ti. Si decides avanzar, haremos los cambios que quieras antes de publicarlo.',
    },
    enter: { en: 'Enter Preview →', es: 'Ver Vista Previa →' },
    cta: { en: 'or claim this site', es: 'o reclama este sitio' },
  },
  banner: {
    label: { en: 'Preview', es: 'Vista Previa' },
    text: {
      en: 'This site was built by Sabor Web — Puerto Rico\'s restaurant web studio.',
      es: 'Este sitio fue creado por Sabor Web — el estudio web de restaurantes de Puerto Rico.',
    },
    btn: { en: '✦ Claim This Site', es: '✦ Reclamar Sitio' },
  },
  modal: {
    label: { en: 'Sabor Web · Puerto Rico', es: 'Sabor Web · Puerto Rico' },
    heading: {
      en: <>This site is yours — <em style={{ fontStyle: 'italic' }}>if you want it.</em></>,
      es: <>Este sitio es tuyo — <em style={{ fontStyle: 'italic' }}>si lo deseas.</em></>,
    },
    body: {
      en: "We built this for Rebar at no charge. Pay the setup fee, choose your plan, and it goes live under your ownership within 24 hours. No contracts. Cancel anytime.",
      es: "Construimos esto para Rebar sin costo. Paga la tarifa de inicio, elige tu plan, y en menos de 24 horas está activo bajo tu nombre. Sin contratos. Cancela cuando quieras.",
    },
    popularBadge: { en: 'Most Popular', es: 'Más Popular' },
    setupLabel: { en: 'setup', es: 'inicio' },
    thenLabel: { en: 'then', es: 'luego' },
    chooseBtn: { en: 'Choose', es: 'Elegir' },
    footnote: {
      en: '30-day free trial · No contracts · Cancel anytime · Questions?',
      es: 'Prueba de 30 días · Sin contratos · Cancela cuando quieras · ¿Preguntas?',
    },
    talkLink: { en: 'Talk to us first →', es: 'Habla con nosotros primero →' },
    planLabel: { en: 'Plan', es: 'Plan' },
  },
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function PreviewWrapper() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [gateOpen, setGateOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Show gate on first visit per session
  useEffect(() => {
    const seen = sessionStorage.getItem('rebar-preview-seen');
    if (!seen) setGateOpen(true);
  }, []);

  const enterPreview = () => {
    sessionStorage.setItem('rebar-preview-seen', '1');
    setGateOpen(false);
  };

  const c = COPY;
  const lc = (obj: { en: string; es: string }) => obj[lang];

  // ── Shared styles ──────────────────────────────────────────────────────────
  const fontSans = "'DM Sans', system-ui, sans-serif";
  const fontSerif = "'Cormorant Garamond', Georgia, serif";
  const gold = '#C4923A';
  const dark = '#0D0C0A';
  const surface = '#181510';
  const cream = '#F5F0E8';
  const muted = '#8A7E6E';
  const border = 'rgba(255,255,255,0.07)';

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to   { opacity: 1; transform: scale(1)  translateY(0); }
        }
        .sw-lang-btn { transition: color 0.15s, border-color 0.15s; }
        .sw-lang-btn:hover { color: ${cream} !important; border-color: rgba(255,255,255,0.3) !important; }
        .sw-enter-btn { transition: background 0.2s, transform 0.15s, box-shadow 0.2s; }
        .sw-enter-btn:hover { background: #D4A84A !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(196,146,58,0.35) !important; }
        .sw-claim-link:hover { opacity: 1 !important; }
        .sw-banner-cta { transition: background 0.2s, transform 0.15s; }
        .sw-banner-cta:hover { background: #1a1005 !important; transform: translateY(-1px); }
        .sw-dismiss:hover { opacity: 1 !important; }
        .sw-plan-card { transition: transform 0.22s, box-shadow 0.22s; }
        .sw-plan-card:hover { transform: translateY(-5px); box-shadow: 0 20px 48px rgba(0,0,0,0.6) !important; }
        .sw-plan-btn { transition: background 0.18s, color 0.18s, transform 0.15s; }
        .sw-plan-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* ══ GATE POPUP ══════════════════════════════════════════════════════ */}
      {gateOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(4, 3, 2, 0.72)',
          backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}>
          <div style={{
            background: surface,
            border: `1px solid rgba(196,146,58,0.25)`,
            borderRadius: '8px',
            maxWidth: '560px', width: '100%',
            padding: 'clamp(36px, 6vw, 56px) clamp(28px, 5vw, 48px)',
            textAlign: 'center',
            animation: 'fadeInScale 300ms cubic-bezier(0.34,1.4,0.64,1)',
          }}>
            {/* Lang toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
              {(['en', 'es'] as const).map(l => (
                <button
                  key={l}
                  className="sw-lang-btn"
                  onClick={() => setLang(l)}
                  style={{
                    fontFamily: fontSans, fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    padding: '5px 14px', borderRadius: '30px',
                    border: `1px solid ${lang === l ? gold : 'rgba(255,255,255,0.12)'}`,
                    color: lang === l ? gold : muted,
                    background: 'transparent', cursor: 'pointer',
                  }}
                >{l === 'en' ? 'English' : 'Español'}</button>
              ))}
            </div>

            {/* Badge */}
            <div style={{
              display: 'inline-block',
              background: 'rgba(196,146,58,0.12)',
              border: `1px solid rgba(196,146,58,0.3)`,
              color: gold, padding: '5px 14px', borderRadius: '30px',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase', fontFamily: fontSans,
              marginBottom: '24px',
            }}>{lc(c.gate.label)}</div>

            {/* Heading */}
            <h2 style={{
              fontFamily: fontSerif, fontSize: 'clamp(30px, 5vw, 46px)',
              fontWeight: 300, color: cream, lineHeight: 1.1,
              marginBottom: '20px', letterSpacing: '-0.01em',
            }}>
              {lang === 'en' ? c.gate.heading.en : c.gate.heading.es}
            </h2>

            {/* Body */}
            <p style={{
              fontFamily: fontSans, fontSize: '15px', color: muted,
              lineHeight: 1.75, marginBottom: '36px', maxWidth: '440px', margin: '0 auto 36px',
            }}>{lc(c.gate.body)}</p>

            {/* Gold divider */}
            <div style={{ width: '40px', height: '1px', background: gold, margin: '0 auto 32px', opacity: 0.5 }} />

            {/* Enter button */}
            <button
              className="sw-enter-btn"
              onClick={enterPreview}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '15px 36px',
                background: gold, color: dark,
                fontFamily: fontSans, fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                border: 'none', borderRadius: '3px', cursor: 'pointer',
                marginBottom: '18px',
              }}
            >{lc(c.gate.enter)}</button>

            <br />

            {/* Secondary CTA */}
            <button
              className="sw-claim-link"
              onClick={() => { enterPreview(); setPlanModalOpen(true); }}
              style={{
                fontFamily: fontSans, fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: gold, background: 'transparent', border: 'none',
                cursor: 'pointer', opacity: 0.75,
                textDecoration: 'underline', textDecorationColor: 'rgba(196,146,58,0.4)',
                marginTop: '4px',
              }}
            >{lc(c.gate.cta)}</button>
          </div>
        </div>
      )}

      {/* ══ STICKY BANNER ═══════════════════════════════════════════════════ */}
      {!gateOpen && !bannerDismissed && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: 'rgba(196,146,58,0.97)',
          padding: '10px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
          fontFamily: fontSans, fontSize: '13px', fontWeight: 500,
          color: '#1C1208', letterSpacing: '0.03em',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: '#1C1208', color: gold, padding: '3px 9px',
              borderRadius: '30px', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>{lc(c.banner.label)}</span>
            <span>{lc(c.banner.text)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <button
              className="sw-banner-cta"
              onClick={() => setPlanModalOpen(true)}
              style={{
                background: '#1C1208', color: gold,
                padding: '7px 18px', borderRadius: '4px',
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >{lc(c.banner.btn)}</button>
            <button
              className="sw-dismiss"
              onClick={() => setBannerDismissed(true)}
              aria-label="Dismiss"
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#1C1208', fontSize: '18px', opacity: 0.6,
                lineHeight: 1, padding: '2px 4px',
              }}
            >✕</button>
          </div>
        </div>
      )}

      {/* ══ PLAN MODAL ══════════════════════════════════════════════════════ */}
      {planModalOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setPlanModalOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
            animation: 'fadeInScale 220ms cubic-bezier(0.34,1.2,0.64,1)',
          }}
        >
          <div style={{
            background: surface, border: `1px solid ${border}`,
            borderRadius: '8px', maxWidth: '960px', width: '100%',
            maxHeight: '92vh', overflowY: 'auto',
            padding: 'clamp(32px, 4vw, 48px) clamp(24px, 4vw, 40px)',
            position: 'relative',
          }}>
            {/* Close + Lang */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['en', 'es'] as const).map(l => (
                  <button
                    key={l}
                    className="sw-lang-btn"
                    onClick={() => setLang(l)}
                    style={{
                      fontFamily: fontSans, fontSize: '11px', fontWeight: 700,
                      letterSpacing: '0.16em', textTransform: 'uppercase',
                      padding: '4px 12px', borderRadius: '30px',
                      border: `1px solid ${lang === l ? gold : 'rgba(255,255,255,0.12)'}`,
                      color: lang === l ? gold : muted,
                      background: 'transparent', cursor: 'pointer',
                    }}
                  >{l === 'en' ? 'EN' : 'ES'}</button>
                ))}
              </div>
              <button
                onClick={() => setPlanModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.1)`,
                  color: muted, fontSize: '16px', borderRadius: '50%',
                  width: '32px', height: '32px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: fontSans,
                }}
              >✕</button>
            </div>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <p style={{
                fontFamily: fontSans, fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.28em', textTransform: 'uppercase', color: gold,
                marginBottom: '12px',
              }}>{lc(c.modal.label)}</p>
              <h2 style={{
                fontFamily: fontSerif, fontSize: 'clamp(26px, 4vw, 42px)',
                fontWeight: 300, color: cream, lineHeight: 1.1, marginBottom: '12px',
              }}>
                {lang === 'en' ? c.modal.heading.en : c.modal.heading.es}
              </h2>
              <p style={{
                fontFamily: fontSans, color: muted, fontSize: '15px',
                lineHeight: 1.6, maxWidth: '500px', margin: '0 auto',
              }}>{lc(c.modal.body)}</p>
            </div>

            {/* Plans grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px', marginBottom: '28px',
            }}>
              {PLANS.map(plan => {
                const p = plan[lang];
                return (
                  <div
                    key={plan.key}
                    className="sw-plan-card"
                    style={{
                      background: plan.highlight ? 'rgba(196,146,58,0.07)' : dark,
                      border: plan.highlight ? `1px solid rgba(196,146,58,0.45)` : `1px solid ${border}`,
                      borderRadius: '6px', padding: '28px 22px',
                      position: 'relative',
                    }}
                  >
                    {plan.highlight && (
                      <div style={{
                        position: 'absolute', top: '-1px', left: '50%',
                        transform: 'translateX(-50%)',
                        background: gold, color: dark,
                        fontSize: '10px', fontWeight: 700,
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        padding: '3px 12px', borderRadius: '0 0 4px 4px',
                        fontFamily: fontSans, whiteSpace: 'nowrap',
                      }}>{lc(c.modal.popularBadge)}</div>
                    )}

                    <p style={{
                      fontFamily: fontSans, fontSize: '10px', fontWeight: 700,
                      letterSpacing: '0.22em', textTransform: 'uppercase',
                      color: gold, marginBottom: '6px',
                    }}>{lc(c.modal.planLabel)}</p>

                    <div style={{
                      fontFamily: fontSerif, fontSize: '30px', fontWeight: 400,
                      color: cream, marginBottom: '6px', letterSpacing: '-0.01em',
                    }}>{p.name}</div>

                    <p style={{
                      fontFamily: fontSans, fontSize: '13px', color: muted,
                      marginBottom: '18px', lineHeight: 1.4,
                    }}>{p.tagline}</p>

                    <div style={{ marginBottom: '18px' }}>
                      <span style={{
                        fontFamily: fontSans, fontSize: '28px', fontWeight: 600, color: cream,
                      }}>{plan.setup}</span>
                      <span style={{
                        fontFamily: fontSans, fontSize: '13px', color: muted, marginLeft: '6px',
                      }}>{lc(c.modal.setupLabel)}</span>
                      <div style={{
                        fontFamily: fontSans, fontSize: '13px', color: gold, marginTop: '3px',
                      }}>{lc(c.modal.thenLabel)} {lang === 'en' ? plan.monthly : plan.monthlyEs}</div>
                    </div>

                    <ul style={{
                      listStyle: 'none', padding: 0, margin: '0 0 22px',
                      display: 'flex', flexDirection: 'column', gap: '8px',
                    }}>
                      {p.features.map(f => (
                        <li key={f} style={{
                          display: 'flex', gap: '8px', alignItems: 'flex-start',
                          fontFamily: fontSans, fontSize: '13px', color: muted, lineHeight: 1.4,
                        }}>
                          <span style={{ color: gold, flexShrink: 0, marginTop: '1px' }}>✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={`https://saborweb.com/api/checkout?pkg=${plan.key}&client=rebar`}
                      className="sw-plan-btn"
                      style={{
                        display: 'block', textAlign: 'center', padding: '12px 20px',
                        background: plan.highlight ? gold : 'transparent',
                        border: plan.highlight ? 'none' : `1px solid rgba(196,146,58,0.45)`,
                        color: plan.highlight ? dark : gold,
                        fontFamily: fontSans, fontSize: '11px', fontWeight: 700,
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        borderRadius: '3px', cursor: 'pointer', textDecoration: 'none',
                      }}
                    >{lc(c.modal.chooseBtn)} {p.name}</a>
                  </div>
                );
              })}
            </div>

            {/* Footnote */}
            <p style={{
              textAlign: 'center', fontFamily: fontSans,
              fontSize: '12px', color: muted, lineHeight: 1.6,
            }}>
              {lc(c.modal.footnote)}{' '}
              <a
                href="https://saborweb.com/contact" target="_blank" rel="noopener noreferrer"
                style={{ color: gold, textDecoration: 'none' }}
              >{lc(c.modal.talkLink)}</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
