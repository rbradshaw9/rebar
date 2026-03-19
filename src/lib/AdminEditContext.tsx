'use client';
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

interface AdminEditContextType {
  isAdmin: boolean;
  editMode: boolean;
  toggleEditMode: () => void;
  overrides: Record<string, string>;
  saveOverride: (key: string, value: string) => Promise<void>;
}

const AdminEditContext = createContext<AdminEditContextType>({
  isAdmin: false,
  editMode: false,
  toggleEditMode: () => {},
  overrides: {},
  saveOverride: async () => {},
});

export function AdminEditProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check admin status
    fetch('/api/admin-status')
      .then(r => r.json())
      .then(({ isAdmin }) => {
        if (isAdmin) {
          setIsAdmin(true);
          // Load existing overrides
          fetch('/api/translations')
            .then(r => r.json())
            .then(data => setOverrides(data));
        }
      })
      .catch(() => {});
  }, []);

  const toggleEditMode = useCallback(() => setEditMode(m => !m), []);

  const saveOverride = useCallback(async (key: string, value: string) => {
    await fetch('/api/translations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    setOverrides(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <AdminEditContext.Provider value={{ isAdmin, editMode, toggleEditMode, overrides, saveOverride }}>
      {children}
    </AdminEditContext.Provider>
  );
}

export function useAdminEdit() {
  return useContext(AdminEditContext);
}
