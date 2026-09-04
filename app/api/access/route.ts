import { NextRequest, NextResponse } from 'next/server';
import {
  createDevelopmentAccessToken,
  developmentAccessCookie,
  validDevelopmentPassword,
} from '@/lib/development-access';

export const runtime = 'nodejs';

function safeDestination(value: unknown) {
  const destination = String(value || '/');
  return destination.startsWith('/') && !destination.startsWith('//') ? destination : '/';
}

export async function POST(request: NextRequest) {
  let body: unknown;
  const contentType = request.headers.get('content-type') || '';
  try {
    body = contentType.includes('application/json') ? await request.json() : Object.fromEntries((await request.formData()).entries());
  } catch { return NextResponse.json({ message: 'Ungültige Anfrage.' }, { status: 400 }); }

  const data = body && typeof body === 'object' ? body as Record<string, unknown> : {};
  const password = String(data.password || '');
  if (!await validDevelopmentPassword(password)) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return NextResponse.json({ message: 'Das Passwort ist nicht korrekt.' }, { status: 401 });
  }

  if (!contentType.includes('application/json')) {
    // Relative redirect keeps the hostname entered by the device. This matters
    // for local testing where Next.js listens on 0.0.0.0 but the phone uses
    // the PC's LAN address (for example 192.168.88.131).
    const response = new NextResponse(null, { status: 303, headers: { Location: safeDestination(data.next) } });
    response.cookies.set(developmentAccessCookie, await createDevelopmentAccessToken(), { httpOnly: true, secure: request.nextUrl.protocol === 'https:', sameSite: 'strict', path: '/', maxAge: 60 * 60 * 24 * 7 });
    return response;
  }

  const response = NextResponse.json({ destination: safeDestination(data.next) });
  response.cookies.set(developmentAccessCookie, await createDevelopmentAccessToken(), {
    httpOnly: true,
    secure: request.nextUrl.protocol === 'https:',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(developmentAccessCookie, '', {
    httpOnly: true,
    secure: request.nextUrl.protocol === 'https:',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}
