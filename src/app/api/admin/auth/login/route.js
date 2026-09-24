import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';           // ✅ أضف
import crypto from 'crypto';                       // ✅ أضف
import { prisma } from '@/lib/prisma';
import {
  verifyAdminPassword,
  createAdminToken,
  setAdminCookie,
  logAdminAction,
} from '@/lib/admin-auth';

const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 15 * 60 * 1000;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البيانات مطلوبة' },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // ابحث عن الأدمن
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      await new Promise((r) => setTimeout(r, 1000));
      return NextResponse.json(
        { error: 'بيانات غير صحيحة' },
        { status: 401 }
      );
    }

    // تحقق من القفل
    if (admin.lockedUntil && new Date() < admin.lockedUntil) {
      const minutes = Math.ceil((admin.lockedUntil - new Date()) / 60000);
      return NextResponse.json(
        { error: `الحساب مقفل. حاول بعد ${minutes} دقيقة` },
        { status: 429 }
      );
    }

    // تحقق من الحالة
    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'الحساب معطّل' },
        { status: 403 }
      );
    }

    // تحقق من كلمة المرور
    const valid = await verifyAdminPassword(password, admin.password);

    if (!valid) {
      const attempts = admin.loginAttempts + 1;
      const updates = { loginAttempts: attempts };

      if (attempts >= MAX_ATTEMPTS) {
        updates.lockedUntil = new Date(Date.now() + LOCK_DURATION);
        updates.loginAttempts = 0;
      }

      await prisma.admin.update({
        where: { id: admin.id },
        data: updates,
      });

      return NextResponse.json(
        { error: 'بيانات غير صحيحة' },
        { status: 401 }
      );
    }

    // ✅ نجح — أعد تعيين محاولات الفشل
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIP: ip,
      },
    });

    // ============ ✅ توليد slug عشوائي قوي ============
    const adminSlug = crypto.randomBytes(24).toString('hex'); // 48 حرفاً

    // ============ إنشاء Token ============
    const token = await createAdminToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // ============ ✅ إنشاء جلسة في DB ============
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000);
    await prisma.adminSession.create({
      data: {
        adminId: admin.id,
        token,
        adminSlug,                                          // ✅ هنا
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || '',
        expiresAt,
      },
    });

    // ============ تعيين Cookie للتوكن ============
    await setAdminCookie(token);

    // ============ ✅ تعيين Cookie للـ slug ============
    const cookieStore = await cookies();
    cookieStore.set('aura_admin_slug', adminSlug, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 4 * 60 * 60,
      path: '/',
    });

    // ============ تسجيل العملية ============
    await logAdminAction({
      adminId: admin.id,
      action: 'admin_login',
      ipAddress: ip,
    });

    // ============ ✅ إرجاع redirectTo ============
    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        fullName: admin.fullName,
        role: admin.role,
      },
      redirectTo: `/admin/${adminSlug}`,     // ✅ هنا
    });
  } catch (error) {
    console.error('🔥 Admin login error:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ',
        debug: {
          name: error?.name,
          message: error?.message,
        },
      },
      { status: 500 }
    );
  }
}