import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const USER_JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-me'
);
const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'admin-super-secret-key-change-me-2026'
);

const SECRET_ADMIN_LOGIN = '/bilsr/alissrow';

const PUBLIC_ROUTES = ['/login', '/register', '/verify-identity'];

const USER_PROTECTED_ROUTES = [
  '/dashboard',
  '/deposit',
  '/withdraw',
  '/missions',
  '/referrals',
  '/security',
  '/settings',
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ============================================================
  //      1) تعطيل /admin/login تماماً وإرجاع 404
  // ============================================================
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  // ============================================================
  //      2) المسار السري لتسجيل دخول الأدمن
  // ============================================================
  if (pathname === SECRET_ADMIN_LOGIN) {
    const adminToken = request.cookies.get('aura_admin_token')?.value;
    const adminSlug = request.cookies.get('aura_admin_slug')?.value;

    if (adminToken && adminSlug) {
      try {
        await jwtVerify(adminToken, ADMIN_JWT_SECRET);
        return NextResponse.redirect(
          new URL(`/admin/${adminSlug}`, request.url)
        );
      } catch {}
    }
    return NextResponse.next();
  }

  // ============================================================
  //      3) حماية صفحات الأدمن
  // ============================================================
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('aura_admin_token')?.value;
    const adminSlug = request.cookies.get('aura_admin_slug')?.value;

    if (!adminToken) {
      return NextResponse.redirect(
        new URL(SECRET_ADMIN_LOGIN, request.url)
      );
    }

    try {
      await jwtVerify(adminToken, ADMIN_JWT_SECRET);
    } catch {
      const response = NextResponse.redirect(
        new URL(SECRET_ADMIN_LOGIN, request.url)
      );
      response.cookies.delete('aura_admin_token');
      response.cookies.delete('aura_admin_slug');
      return response;
    }

    if (pathname === '/admin' || pathname === '/admin/') {
      if (adminSlug) {
        return NextResponse.redirect(
          new URL(`/admin/${adminSlug}`, request.url)
        );
      }
      return NextResponse.redirect(
        new URL(SECRET_ADMIN_LOGIN, request.url)
      );
    }

    return NextResponse.next();
  }

  // ============================================================
  //      4) منطق المستخدم العادي
  // ============================================================
  const userToken = request.cookies.get('aura_token')?.value;
  let isUserAuthenticated = false;
  if (userToken) {
    try {
      await jwtVerify(userToken, USER_JWT_SECRET);
      isUserAuthenticated = true;
    } catch {}
  }

  if (
    (pathname === '/login' || pathname === '/register') &&
    isUserAuthenticated
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (
    USER_PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) &&
    !isUserAuthenticated
  ) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/bilsr/:path*',
    '/admin/:path*',      // ✅ يشمل كل مسارات /admin بما فيها /admin/login ليتم حظرها
    '/dashboard/:path*',
    '/deposit/:path*',
    '/withdraw/:path*',
    '/missions/:path*',
    '/referrals/:path*',
    '/security/:path*',
    '/settings/:path*',
    '/verify-identity/:path*',
    '/login',
    '/register',
  ],
};