import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { adminSessionCookie, getSessionAccount } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionSecret = cookieStore.get(adminSessionCookie)?.value;
  if (sessionSecret) await getSessionAccount(sessionSecret).deleteSession({ sessionId: 'current' }).catch(() => undefined);
  cookieStore.delete(adminSessionCookie);
  return NextResponse.redirect(new URL('/admin/login', request.url), 303);
}
