'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  // ============ جلب المستخدم الحالي ============
  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // ============ تحديث الرصيد ============
  const refreshBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/user/balance');
      if (res.ok) {
        const data = await res.json();
        setUser((prev) => (prev ? { ...prev, ...data.balances } : prev));
      }
    } catch (e) {
      console.error('Refresh balance error:', e);
    }
  }, []);

  // ============ ✅ جديدة: تحديث الإحالات ============
  const refreshReferrals = useCallback(async () => {
    try {
      const res = await fetch('/api/referral/stats');
      if (res.ok) {
        const data = await res.json();
        setUser((prev) =>
          prev
            ? {
                ...prev,
                referralCount: data.stats.referralCount,
                accountLevel: data.stats.accountLevel,
                referralEarnings: data.stats.referralEarnings,
                level1Referrals: data.stats.level1Referrals,
                level2Referrals: data.stats.level2Referrals,
                level3Referrals: data.stats.level3Referrals,
              }
            : prev
        );
        return data.stats;
      }
    } catch (e) {
      console.error('Refresh referrals error:', e);
    }
    return null;
  }, []);

  // ============ تسجيل دخول ============
  async function login(emailOrUsername, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'فشل تسجيل الدخول');
    setUser(data.user);
    router.push('/dashboard');
    return data.user;
  }

  // ============ تسجيل مباشر (بدون OTP) ============
  async function register(formData) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'فشل إنشاء الحساب');
    setUser(data.user);
    return data.user;
  }

  // ============ ✅ إنشاء الحساب من البيانات المؤقتة ============
  async function registerFromPending(extraData = {}) {
    // اقرأ البيانات المؤقتة
    const pendingRaw =
      sessionStorage.getItem('aura-pending-registration') ||
      localStorage.getItem('aura-pending-registration');

    if (!pendingRaw) {
      throw new Error(
        'لا توجد بيانات تسجيل مؤقتة. يرجى إعادة التسجيل من البداية.'
      );
    }

    let pending;
    try {
      pending = JSON.parse(pendingRaw);
    } catch {
      sessionStorage.removeItem('aura-pending-registration');
      localStorage.removeItem('aura-pending-registration');
      throw new Error('بيانات التسجيل تالفة. يرجى إعادة التسجيل.');
    }

    // تحقق من الصلاحية (30 دقيقة)
    const age = Date.now() - (pending.createdAt || 0);
    if (age > 30 * 60 * 1000) {
      sessionStorage.removeItem('aura-pending-registration');
      localStorage.removeItem('aura-pending-registration');
      throw new Error('انتهت صلاحية التسجيل (30 دقيقة). يرجى إعادة التسجيل.');
    }

    // أرسل الطلب للـ API
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: pending.fullName,
        email: pending.email,
        username: pending.username,
        password: pending.password,
        confirmPassword: pending.confirmPassword || pending.password,
        referralCode: pending.referralCode,
        ...extraData,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 409) {
        sessionStorage.removeItem('aura-pending-registration');
        localStorage.removeItem('aura-pending-registration');
      }
      throw new Error(data.error || 'فشل إنشاء الحساب');
    }

    // ✅ احذف البيانات المؤقتة بعد النجاح
    sessionStorage.removeItem('aura-pending-registration');
    localStorage.removeItem('aura-pending-registration');

    // ✅ احفظ المستخدم في الحالة
    setUser(data.user);

    return data.user;
  }

  // ============ تسجيل خروج ============
  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    setUser(null);
    sessionStorage.removeItem('aura-pending-registration');
    localStorage.removeItem('aura-pending-registration');
    router.push('/login');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        registerFromPending,
        logout,
        refresh: fetchUser,
        refreshBalance,
        refreshReferrals, // ✅ جديدة
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};