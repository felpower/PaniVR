import { NextRequest, NextResponse } from 'next/server';
import { adminSessionCookie, getAdminApiAccount, isAdminEmail } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const normalized = String(email || '').trim().toLowerCase();
    if (!normalized || !password || !(await isAdminEmail(normalized))) return NextResponse.json({ message: 'E-Mail oder Passwort ist nicht korrekt.' }, { status: 401 });
    const session = await getAdminApiAccount().createEmailPasswordSession(normalized, String(password));
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminSessionCookie, session.secret, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', expires: new Date(session.expire) });
    return response;
  } catch { return NextResponse.json({ message: 'E-Mail oder Passwort ist nicht korrekt.' }, { status: 401 }); }
}
