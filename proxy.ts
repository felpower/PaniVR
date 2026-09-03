import { NextRequest, NextResponse } from 'next/server';
import { developmentAccessCookie, validDevelopmentAccess } from '@/lib/development-access';

const publicPaths = ['/zugang', '/api/access'];

function previewResponse(response: NextResponse) {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  if (process.env.NODE_ENV === 'development' && !process.env.DEV_ACCESS_PASSWORD) {
    return previewResponse(NextResponse.next());
  }

  if (process.env.SITE_ACCESS_MODE === 'public') return NextResponse.next();

  if (publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return previewResponse(NextResponse.next());
  }

  const hasAccess = await validDevelopmentAccess(request.cookies.get(developmentAccessCookie)?.value);
  if (hasAccess) return previewResponse(NextResponse.next());

  if (pathname.startsWith('/api/')) {
    return previewResponse(NextResponse.json({ message: 'Development-Zugang erforderlich.' }, { status: 401 }));
  }

  const loginUrl = new URL('/zugang', request.url);
  if (request.method === 'GET' || request.method === 'HEAD') {
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
  }
  return previewResponse(NextResponse.redirect(loginUrl));
}
