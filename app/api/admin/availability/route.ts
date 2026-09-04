import { NextRequest, NextResponse } from 'next/server';
import { ID, Query } from 'node-appwrite';
import { getCurrentAdmin } from '@/lib/admin-auth';
import { availabilityTableId, databaseId, getTablesDB } from '@/lib/appwrite-server';

export const runtime = 'nodejs';

async function auth() { return getCurrentAdmin(); }
function validDate(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(value); }
function validSlot(value: string) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(value); }

export async function GET() {
  if (!(await auth())) return NextResponse.json({ message: 'Nicht angemeldet.' }, { status: 401 });
  try {
    const result = await getTablesDB().listRows({ databaseId, tableId: availabilityTableId, queries: [Query.orderAsc('date'), Query.orderAsc('slot'), Query.limit(500)], total: false, ttl: 0 });
    return NextResponse.json({ slots: result.rows.map((row) => ({ id: row.$id, date: String(row.date || ''), slot: String(row.slot || ''), status: String(row.status || 'open'), source: String(row.source || '') })) });
  } catch { return NextResponse.json({ message: 'Die Zeiten konnten nicht geladen werden.' }, { status: 503 }); }
}

export async function POST(request: NextRequest) {
  if (!(await auth())) return NextResponse.json({ message: 'Nicht angemeldet.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const date = String(body.date || ''); const slot = String(body.slot || '');
  if (!validDate(date) || !validSlot(slot)) return NextResponse.json({ message: 'Bitte gib ein gültiges Datum und eine Uhrzeit ein.' }, { status: 400 });
  try {
    const row = await getTablesDB().createRow({ databaseId, tableId: availabilityTableId, rowId: `avail-${date}-${slot.replace(':', '')}`, data: { date, slot, status: 'open', source: 'admin', createdAt: new Date().toISOString() } });
    return NextResponse.json({ slot: { id: row.$id, date, slot, status: 'open', source: 'admin' } }, { status: 201 });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && Number((error as { code: unknown }).code) === 409) return NextResponse.json({ message: 'Dieser Termin ist bereits vorhanden.' }, { status: 409 });
    return NextResponse.json({ message: 'Der Termin konnte nicht gespeichert werden.' }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await auth())) return NextResponse.json({ message: 'Nicht angemeldet.' }, { status: 401 });
  const body = await request.json().catch(() => ({})); const id = String(body.id || ''); const date = String(body.date || ''); const slot = String(body.slot || '');
  if (!id || !validDate(date) || !validSlot(slot)) return NextResponse.json({ message: 'Ungültige Termindaten.' }, { status: 400 });
  try { const row = await getTablesDB().updateRow({ databaseId, tableId: availabilityTableId, rowId: id, data: { date, slot, source: 'admin' } }); return NextResponse.json({ slot: { id: row.$id, date, slot, status: String(row.status || 'open'), source: 'admin' } }); }
  catch { return NextResponse.json({ message: 'Der Termin konnte nicht geändert werden.' }, { status: 503 }); }
}

export async function DELETE(request: NextRequest) {
  if (!(await auth())) return NextResponse.json({ message: 'Nicht angemeldet.' }, { status: 401 });
  const id = request.nextUrl.searchParams.get('id') || ''; if (!id) return NextResponse.json({ message: 'Ungültiger Termin.' }, { status: 400 });
  try { await getTablesDB().deleteRow({ databaseId, tableId: availabilityTableId, rowId: id }); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ message: 'Der Termin konnte nicht gelöscht werden.' }, { status: 503 }); }
}
