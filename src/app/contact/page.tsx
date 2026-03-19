'use client';
import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './page.module.css';

type FormErrors = { name?: string; email?: string; message?: string };

function validateForm(form: { name: string; email: string; message: string }): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim() || form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim() || !emailRe.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!form.message.trim() || form.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }
  return errors;
}

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject: t.contact.subjects[0], message:'' });
  const [status, setStatus] = useState<'idle'|'sending'|'done'|'error'>('idle');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);

  const change = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (touched) {
      setErrors(validateForm(updated));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const formErrors = validateForm(form);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setTouched(false);
    setErrors({});
    setForm({ name:'', email:'', phone:'', subject: t.contact.subjects[0], message:'' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.heroBar}>
        <span className="label">{t.contact.label}</span>
        <h1>{t.contact.heading}</h1>
      </div>
      <div className="container">
        <div className={styles.grid}>
          {/* Form */}
          <div>
            {status === 'done' ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>✓</div>
                <h2>{t.contact.successTitle}</h2>
                <p>{t.contact.successBody}</p>
                <button className="btn-outline" onClick={resetForm}>{t.contact.sendAnother}</button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={submit} noValidate>
                <div className={styles.row2}>
                  <Field label={t.contact.fields.name} required error={errors.name}>
                    <input
                      name="name"
                      value={form.name}
                      onChange={change}
                      placeholder={t.contact.fields.name}
                      className={`${styles.input}${errors.name ? ' ' + styles.inputError : ''}`}
                    />
                  </Field>
                  <Field label={t.contact.fields.email} required error={errors.email}>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={change}
                      placeholder="your@email.com"
                      className={`${styles.input}${errors.email ? ' ' + styles.inputError : ''}`}
                    />
                  </Field>
                </div>
                <div className={styles.row2}>
                  <Field label={t.contact.fields.phone}>
                    <input type="tel" name="phone" value={form.phone} onChange={change} placeholder="(787) 000-0000" className={styles.input} />
                  </Field>
                  <Field label={t.contact.fields.subject}>
                    <select name="subject" value={form.subject} onChange={change} className={styles.input}>
                      {t.contact.subjects.map((s: string) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label={t.contact.fields.message} required error={errors.message}>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={change}
                    rows={5}
                    placeholder={t.contact.fields.message}
                    className={`${styles.textarea}${errors.message ? ' ' + styles.inputError : ''}`}
                  />
                </Field>
                <button type="submit" className="btn-primary" disabled={status==='sending'} style={{width:'100%', justifyContent:'center'}}>
                  {status==='sending' ? t.contact.sending : t.contact.send}
                </button>
                {status==='error' && <p className={styles.errMsg}>{t.contact.errorMsg}</p>}
              </form>
            )}
          </div>

          {/* Info */}
          <div className={styles.infoCol}>
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>{t.contact.visitLabel}</h3>
              <p className={styles.infoText}>Carr. 110 Km 32.4<br/>Bo. Maleza Alta<br/>Aguadilla, PR 00603</p>
            </div>
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>{t.contact.reachLabel}</h3>
              <a href="tel:+17876581669" className={styles.phone}>787-658-1669</a>
              <a href="mailto:rebargastronomia@gmail.com" className={styles.emailLink}>rebargastronomia@gmail.com</a>
              <a href="https://wa.me/17876581669" target="_blank" rel="noopener noreferrer" className={styles.waLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {t.contact.waLink}
              </a>
            </div>
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>{t.contact.followLabel}</h3>
              <div className={styles.socials}>
                <a href="https://instagram.com/rebarpr" target="_blank" rel="noopener noreferrer">Instagram @rebarpr</a>
                <a href="https://www.facebook.com/p/Rebar-Gastronom%C3%ADa-100093088920480/" target="_blank" rel="noopener noreferrer">Facebook</a>
              </div>
            </div>
            <div className={styles.mapWrap}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.2186!2d-67.11725!3d18.503836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMwJzEzLjgiTiA2N8KwMDcnMDIuMSJX!5e0!3m2!1sen!2sus!4v1"
                width="100%" height="220" style={{border:0, filter:'grayscale(0.6) brightness(0.75) contrast(1.05)'}}
                allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Rebar location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, error, children }: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
      <label style={{fontFamily:'var(--font-label)',fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--text-muted)'}}>
        {label}{required && <span style={{color:'var(--ember-gold)',marginLeft:2}}>*</span>}
      </label>
      {children}
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}
