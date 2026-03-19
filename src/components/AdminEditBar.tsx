'use client';
import { useAdminEdit } from '@/lib/AdminEditContext';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './AdminEditBar.module.css';

export default function AdminEditBar() {
  const { isAdmin, editMode, toggleEditMode } = useAdminEdit();
  const { lang, setLang } = useLanguage();
  if (!isAdmin) return null;

  return (
    <div className={`${styles.bar} ${editMode ? styles.active : ''}`}>
      <span className={styles.label}>Admin</span>

      <button className={styles.toggle} onClick={toggleEditMode}>
        {editMode ? '✓ Editing On — click any text or image to edit' : '✏ Edit Page'}
      </button>

      {editMode && (
        <div className={styles.langSwitch}>
          <button onClick={() => setLang('en')} className={lang === 'en' ? styles.langOn : styles.langOff}>EN</button>
          <span className={styles.langDiv}>|</span>
          <button onClick={() => setLang('es')} className={lang === 'es' ? styles.langOn : styles.langOff}>ES</button>
        </div>
      )}

      <a href="/admin" className={styles.dashLink}>Dashboard →</a>
    </div>
  );
}
