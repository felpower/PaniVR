import { NextRequest, NextResponse } from 'next/server';
import { adminSessionCookie, getAdminApiAccount, getSessionAccount, isAdminEmail } from '@/lib/admin-auth';
import { rateLimited } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const denied = () => NextResponse.json({ message: 'E-Mail oder Passwort ist nicht korrekt.' }, { status: 401 });

export async function POST(request: NextRequest) {
  if (rateLimited(request, 'admin-password', 10, 15 * 60_000)) {
    return NextResponse.json({ message: 'Zu viele Anmeldeversuche. Bitte warte ein paar Minuten oder nutze den Anmeldelink.' }, { status: 429 });
  }
  try {
    const { email, password } = await request.json();
    const normalized = String(email || '').trim().toLowerCase();
    if (!normalized || !password || !(await isAdminEmail(normalized))) return denied();
    const session = await getAdminApiAccount().createEmailPasswordSession(normalized, String(password));
    const sessionAccount = getSessionAccount(session.secret);
    const user = await sessionAccount.get();
    // Spielerkonten kann jeder über die Website anlegen. Ohne diese Prüfung
    // könnte jemand ein Konto mit einer noch unbenutzten Admin-Adresse
    // registrieren und sich damit per Passwort im Adminbereich anmelden.
    // Das Label "admin" lässt sich nur in der Appwrite-Console setzen.
    if (!user.labels?.includes('admin')) {
      await sessionAccount.deleteSession({ sessionId: 'current' }).catch(() => undefined);
      return NextResponse.json({ message: 'Der Passwort-Login ist für dieses Konto nicht freigeschaltet. Bitte nutze den Anmeldelink.' }, { status: 403 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminSessionCookie, session.secret, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', expires: new Date(session.expire) });
    return response;
  } catch { return denied(); }
}
