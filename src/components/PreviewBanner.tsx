'use client';
import { useState } from 'react';

const PLANS = [
  {
    key: 'presencia',
    name: 'Presencia',
    tagline: 'Your restaurant online, done right.',
    setup: '$597',
    monthly: '$97/mo',
    features: [
      'Custom bilingual website',
      'Menu, hours & contact pages',
      'Google Maps integration',
      'Mobile optimized',
      'Hosting & maintenance included',
    ],
    highlight: false,
  },
  {
    key: 'visibilidad',
    name: 'Visibilidad',
    tagline: 'Get found. Get chosen.',
    setup: '$897',
    monthly: '$247/mo',
    features: [
      'Everything in Presencia',
      'Local SEO setup & optimization',
      'Google Business Profile management',
      'Monthly performance report',
      'Priority support',
    ],
    highlight: true,
  },
  {
    key: 'crecimiento',
    name: 'Crecimiento',
    tagline: 'Full-service digital partner.',
    setup: '$1,247',
    monthly: '$597/mo',
    features: [
      'Everything in Visibilidad',
      'Online reservations system',
      'Email marketing campaigns',
      'Social media content support',
      'Dedicated account manager',
    ],
    highlight: false,
  },
];

export default function PreviewBanner() {
  const [modalOpen, setModalOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <>
      {/* ── Banner ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        background: 'rgba(196,146,58,0.97)',
        padding: '10px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: '13px', fontWeight: 500,
        color: '#1C1208', letterSpacing: '0.03em',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: '#1C1208', color: '#C4923A',
            padding: '3px 9px', borderRadius: '30px',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>Preview</span>
          <span>This site was built by <strong>Sabor Web</strong> — Puerto Rico&apos;s restaurant web studio.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              background: '#1C1208', color: '#C4923A',
              padding: '7px 18px', borderRadius: '4px',
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            ✦ Claim This Site
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: '#1C1208', fontSize: '18px', opacity: 0.6,
              lineHeight: 1, padding: '2px 4px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
          >✕</button>
        </div>
      </div>

      {/* ── Modal Overlay ── */}
      {modalOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
            animation: 'fadeInModal 200ms ease',
          }}
        >
          <style>{`
            @keyframes fadeInModal { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
            .sw-plan-card { transition: transform 0.2s, box-shadow 0.2s; }
            .sw-plan-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.5); }
            .sw-plan-btn { transition: background 0.2s, transform 0.15s; }
            .sw-plan-btn:hover { transform: translateY(-1px); }
          `}</style>

          <div style={{
            background: '#181510',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            maxWidth: '900px', width: '100%',
            maxHeight: '90vh', overflowY: 'auto',
            padding: '48px 40px 40px',
            position: 'relative',
          }}>
            {/* Close */}
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#8A7E6E', fontSize: '16px', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.28em',
                textTransform: 'uppercase', color: '#C4923A',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                marginBottom: '12px',
              }}>Sabor Web · Puerto Rico</p>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300,
                color: '#F5F0E8', lineHeight: 1.1, marginBottom: '12px',
              }}>
                This site is yours — <em style={{ color: '#C4923A', fontStyle: 'italic' }}>if you want it.</em>
              </h2>
              <p style={{
                color: '#8A7E6E', fontSize: '15px', lineHeight: 1.6,
                maxWidth: '520px', margin: '0 auto',
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}>
                We built this for Rebar at no charge. Pay the setup fee, choose your plan, and it goes live under your ownership within 24 hours. No contracts. Cancel anytime.
              </p>
            </div>

            {/* Plans */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}>
              {PLANS.map(plan => (
                <div
                  key={plan.key}
                  className="sw-plan-card"
                  style={{
                    background: plan.highlight ? 'rgba(196,146,58,0.08)' : '#0D0C0A',
                    border: plan.highlight ? '1px solid rgba(196,146,58,0.5)' : '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '6px',
                    padding: '28px 24px',
                    position: 'relative',
                  }}
                >
                  {plan.highlight && (
                    <div style={{
                      position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)',
                      background: '#C4923A', color: '#0D0C0A',
                      fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                      padding: '3px 12px', borderRadius: '0 0 4px 4px',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      whiteSpace: 'nowrap',
                    }}>Most Popular</div>
                  )}

                  <p style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em',
                    textTransform: 'uppercase', color: '#C4923A',
                    marginBottom: '8px',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}>Plan</p>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '28px', fontWeight: 400, color: '#F5F0E8',
                    marginBottom: '6px',
                  }}>{plan.name}</div>
                  <p style={{
                    fontSize: '13px', color: '#8A7E6E', marginBottom: '20px',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}>{plan.tagline}</p>

                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '26px', fontWeight: 600, color: '#F5F0E8', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{plan.setup}</span>
                    <span style={{ fontSize: '13px', color: '#8A7E6E', marginLeft: '6px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>setup</span>
                    <div style={{ fontSize: '13px', color: '#C4923A', marginTop: '4px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>then {plan.monthly}</div>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {plan.features.map(f => (
                      <li key={f} style={{
                        display: 'flex', gap: '8px', alignItems: 'flex-start',
                        fontSize: '13px', color: '#8A7E6E', lineHeight: 1.4,
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                      }}>
                        <span style={{ color: '#C4923A', flexShrink: 0, marginTop: '1px' }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`https://saborweb.com/api/checkout?pkg=${plan.key}`}
                    className="sw-plan-btn"
                    style={{
                      display: 'block', textAlign: 'center',
                      padding: '12px 20px',
                      background: plan.highlight ? '#C4923A' : 'transparent',
                      border: plan.highlight ? 'none' : '1px solid rgba(196,146,58,0.5)',
                      color: plan.highlight ? '#0D0C0A' : '#C4923A',
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                      borderRadius: '3px', cursor: 'pointer',
                      textDecoration: 'none',
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                    }}
                  >
                    Choose {plan.name}
                  </a>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <p style={{
              textAlign: 'center', fontSize: '12px', color: '#8A7E6E',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              lineHeight: 1.6,
            }}>
              30-day free trial · No contracts · Cancel anytime · Questions?{' '}
              <a href="https://saborweb.com/contact" target="_blank" rel="noopener noreferrer"
                style={{ color: '#C4923A', textDecoration: 'none' }}>
                Talk to us first →
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
