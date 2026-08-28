import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { adminSessionCookie, getAdminApiAccount, getSessionAccount, isAllowedAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId') || '';
  const secret = request.nextUrl.searchParams.get('secret') || '';
  if (!userId || !secret) return NextResponse.redirect(new URL('/admin/login?error=invalid', request.url));

  try {
    const session = await getAdminApiAccount().createSession({ userId, secret });
    const user = await getSessionAccount(session.secret).get();
    if (!isAllowedAdmin(user.email)) {
      await getSessionAccount(session.secret).deleteSession({ sessionId: 'current' }).catch(() => undefined);
      return NextResponse.redirect(new URL('/admin/login?error=denied', request.url));
    }

    const cookieStore = await cookies();
    cookieStore.set(adminSessionCookie, session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(session.expire),
    });
    return NextResponse.redirect(new URL('/admin', request.url));
  } catch {
    return NextResponse.redirect(new URL('/admin/login?error=expired', request.url));
  }
}
