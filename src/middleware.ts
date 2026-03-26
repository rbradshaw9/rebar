import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── COMING SOON MODE ────────────────────────────────────────────────────────
// Set to `true` to redirect all public traffic to /coming-soon.
// Set to `false` (or remove the block below) to restore the full site.
const COMING_SOON = false;
// ─────────────────────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass: admin, API routes, and the coming-soon page itself + its assets
  const isExempt =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/coming-soon') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.png' ||
    pathname === '/robots.txt';

  // ── Coming soon redirect ──────────────────────────────────────────────────
  if (COMING_SOON && !isExempt) {
    return NextResponse.redirect(new URL('/coming-soon', request.url));
  }

  // ── Admin protection ──────────────────────────────────────────────────────
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = request.cookies.get('admin_session');
    if (!session || session.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and static files.
     * This lets the coming-soon redirect apply to all public routes.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
