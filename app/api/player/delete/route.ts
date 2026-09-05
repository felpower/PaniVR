import { NextRequest, NextResponse } from 'next/server';
import { deletePlayerData, getAccountWithJwt, getUsers } from '@/lib/appwrite-server';

export async function POST(request: NextRequest) {
  try {
    const { jwt } = await request.json();
    const current = await getAccountWithJwt(String(jwt || '')).get();
    await deletePlayerData(current.$id);
    await getUsers().delete(current.$id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Konto konnte nicht gelöscht werden.' }, { status: 400 });
  }
}
