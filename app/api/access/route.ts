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
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const data = body && typeof body === 'object' ? body as Record<string, unknown> : {};
  const password = String(data.password || '');
  if (!await validDevelopmentPassword(password)) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return NextResponse.json({ message: 'Das Passwort ist nicht korrekt.' }, { status: 401 });
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
