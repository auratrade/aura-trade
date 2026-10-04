import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-me'
);
const COOKIE_NAME = 'aura_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ✅ صار يتحقق فعليًا من وجود المستخدم بالداتابيز، مش بس من صلاحية الـ JWT.
//    لو التوكن صالح لكن صاحبه محذوف (أو الداتابيز انعملها reset)، بيرجع null
//    بدل ما يرجّع userId "شبحي" يسبب Foreign Key violation عند أي إنشاء سجل.
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, username: true, email: true },
  });

  if (!user) return null;

  // نفس شكل الإرجاع القديم (userId) حفاظًا على توافق كل الأماكن
  // يلي بتستخدم session.userId بالمشروع، بالإضافة لبيانات المستخدم كاملة.
  return {
    ...payload,
    userId: user.id,
    user,
  };
}