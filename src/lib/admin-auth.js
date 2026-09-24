import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'admin-super-secret-key-change-me-2026'
);

const ADMIN_COOKIE = 'aura_admin_token';
const SESSION_MAX_AGE = 60 * 60 * 4; // 4 ساعات فقط للأدمن

// ============ تشفير ============
export async function hashAdminPassword(password) {
  return bcrypt.hash(password, 12); // 12 rounds للأدمن
}

export async function verifyAdminPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// ============ توليد Token ============
export async function createAdminToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('4h')
    .sign(ADMIN_JWT_SECRET);
}

export async function verifyAdminToken(token) {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// ============ Cookie ============
export async function setAdminCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function removeAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

// ============ جلب الأدمن الحالي ============
export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyAdminToken(token);
  if (!payload?.adminId) return null;

  // تحقق من الجلسة في DB
  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: {
      admin: {
        select: {
          id: true,
          email: true,
          username: true,
          fullName: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  if (!session) return null;
  if (new Date() > session.expiresAt) {
    await prisma.adminSession.delete({ where: { id: session.id } });
    return null;
  }
  if (!session.admin.isActive) return null;

  return {
    sessionId: session.id,
    token,
    admin: session.admin,
  };
}

// ============ تسجيل عملية ============
export async function logAdminAction({
  adminId,
  action,
  targetType,
  targetId,
  details,
  ipAddress,
}) {
  try {
    await prisma.adminAction.create({
      data: {
        adminId,
        action,
        targetType,
        targetId,
        details: details ? JSON.stringify(details) : null,
        ipAddress,
      },
    });
  } catch (e) {
    console.error('Log admin action error:', e);
  }
}

// ============ إشعار للأدمن ============
export async function notifyAdmin({
  type,
  title,
  message,
  referenceId,
  priority = 'normal',
}) {
  try {
    return await prisma.adminNotification.create({
      data: { type, title, message, referenceId, priority },
    });
  } catch (e) {
    console.error('Notify admin error:', e);
  }
}