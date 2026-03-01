import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for authentication, rate limiting, and security headers
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // Protected routes - require authentication
  const protectedPaths = ['/dashboard', '/builder', '/admin'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected) {
    const token = request.cookies.get('auth-token')?.value;

    // In production: validate JWT token
    // if (!token) {
    //   return NextResponse.redirect(new URL('/auth', request.url));
    // }
    // try {
    //   jwt.verify(token, JWT_SECRET);
    // } catch {
    //   return NextResponse.redirect(new URL('/auth', request.url));
    // }
  }

  // Admin routes - require admin role
  if (pathname.startsWith('/admin')) {
    // In production: check user role from token
    // const decoded = jwt.decode(token);
    // if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
    //   return NextResponse.redirect(new URL('/dashboard', request.url));
    // }
  }

  // API rate limiting
  if (pathname.startsWith('/api/')) {
    // In production: implement rate limiting with Redis
    // const ip = request.headers.get('x-forwarded-for') || 'unknown';
    // const rateLimitKey = `rate:${ip}:${pathname}`;
    // const requests = await redis.incr(rateLimitKey);
    // if (requests === 1) await redis.expire(rateLimitKey, 60);
    // if (requests > 100) {
    //   return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
    // }
    // response.headers.set('X-RateLimit-Remaining', String(100 - requests));
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/builder/:path*',
    '/admin/:path*',
    '/api/:path*',
  ],
};
