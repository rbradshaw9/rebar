'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Rebar Admin</h1>
          <p className={styles.subtitle}>Manage your menu, events, hours, and site text</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn} title="Sign out">
          Sign Out
        </button>
      </div>
      <div className={styles.grid}>
        <Link href="/admin/menu" className={styles.card}>
          <span className={styles.icon}>🍽</span>
          <h2>Menu Items</h2>
          <p>Add, edit, or remove dishes and cocktails. Toggle availability and feature items.</p>
        </Link>
        <Link href="/admin/events" className={styles.card}>
          <span className={styles.icon}>📅</span>
          <h2>Events</h2>
          <p>Create and manage upcoming special events. Add photos, dates, and ticket links.</p>
        </Link>
        <Link href="/admin/hours" className={styles.card}>
          <span className={styles.icon}>⏱</span>
          <h2>Hours</h2>
          <p>Update business hours. Changes will reflect on the website immediately.</p>
        </Link>
        <Link href="/admin/translations" className={styles.card}>
          <span className={styles.icon}>🌐</span>
          <h2>Site Text</h2>
          <p>Edit English and Spanish text across all pages. Changes apply immediately.</p>
        </Link>
      </div>
    </div>
  );
}
