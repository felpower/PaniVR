import { NextRequest, NextResponse } from 'next/server';
import { ID } from 'node-appwrite';
import { getAdminApiAccount, isAllowedAdmin, trustedCallbackOrigin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const requestSize = Number(request.headers.get('content-length') || 0);
  if (requestSize > 5_000) return NextResponse.json({ message: 'Die Anfrage ist zu groß.' }, { status: 413 });

  let email = '';
  try {
    const body = await request.json();
    email = String(body.email || '').trim().toLowerCase();
  } catch {
    return NextResponse.json({ message: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const genericMessage = 'Wenn diese Adresse als Admin freigeschaltet ist, wurde ein Anmeldelink versendet.';
  if (!isAllowedAdmin(email)) return NextResponse.json({ message: genericMessage });

  try {
    const origin = trustedCallbackOrigin(request.nextUrl.origin);
    await getAdminApiAccount().createMagicURLToken({
      userId: ID.unique(),
      email,
      url: `${origin}/admin/callback`,
      phrase: false,
    });
    return NextResponse.json({ message: genericMessage });
  } catch {
    return NextResponse.json({ message: 'Der Anmeldelink konnte derzeit nicht versendet werden. Bitte prüfe die Appwrite-Konfiguration.' }, { status: 503 });
  }
}
