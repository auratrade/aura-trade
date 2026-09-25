'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AdminContext = createContext(null);

const SECRET_ADMIN_LOGIN = '/bilsr/alissrow';

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchAdmin();
  }, []);

  // ✅ نقطة القرار الوحيدة للتوجيه عند غياب الأدمن.
  //    ما في أي مكان تاني بالتطبيق (صفحات، هيدر...) لازم يعمل
  //    window.location.href لصفحة اللوجين عند 401 — هون بس.
  useEffect(() => {
    if (loading) return;
    if (!admin && pathname !== SECRET_ADMIN_LOGIN) {
      router.replace(SECRET_ADMIN_LOGIN);
    }
  }, [admin, loading, pathname, router]);

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

    if (data.redirectTo) {
      window.location.href = data.redirectTo;
    } else {
      router.push(SECRET_ADMIN_LOGIN);
    }

    return data.admin;
  }

  async function adminLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    setAdmin(null);
    window.location.href = SECRET_ADMIN_LOGIN;
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