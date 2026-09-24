'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAdmin();
  }, []);

  async function fetchAdmin() {
    try {
      const res = await fetch('/api/admin/auth/me');
      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }

  async function adminLogin(email, password) {
  const res = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'فشل تسجيل الدخول');
  setAdmin(data.admin);
  
  // ✅ استخدم redirectTo
  if (data.redirectTo) {
    window.location.href = data.redirectTo;
  } else {
    router.push('/admin/login');
  }
  
  return data.admin;
}

  async function adminLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    setAdmin(null);
    window.location.href = '/bilsr/alissrow';
  }

  return (
    <AdminContext.Provider
      value={{ admin, loading, adminLogin, adminLogout, refresh: fetchAdmin }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};