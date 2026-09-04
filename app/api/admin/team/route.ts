import { NextRequest, NextResponse } from 'next/server';
import { ID, Query } from 'node-appwrite';
import { getAdminRole, getCurrentAdmin } from '@/lib/admin-auth';
import { adminsTableId, databaseId, getTablesDB } from '@/lib/appwrite-server';

export const runtime = 'nodejs';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: 'Nicht angemeldet.' }, { status: 401 });
  try {
    const result = await getTablesDB().listRows({ databaseId, tableId: adminsTableId, queries: [Query.orderAsc('email'), Query.limit(100)], total: false, ttl: 0 });
    return NextResponse.json({ admins: result.rows.map((row) => ({ id: row.$id, email: String(row.email || ''), name: String(row.name || ''), role: String(row.role || 'admin'), status: String(row.status || 'active') })) });
  } catch { return NextResponse.json({ message: 'Die Admin-Tabelle ist noch nicht eingerichtet.' }, { status: 503 }); }
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin || (await getAdminRole(admin.user.email)) !== 'owner') return NextResponse.json({ message: 'Nur der Owner darf Admins verwalten.' }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const name = String(body.name || '').trim();
  const role = ['admin', 'readonly'].includes(String(body.role)) ? String(body.role) : 'admin';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ message: 'Bitte gib eine gültige E-Mail-Adresse ein.' }, { status: 400 });
  try {
    const db = getTablesDB();
    const existing = await db.listRows({ databaseId, tableId: adminsTableId, queries: [Query.equal('email', [email]), Query.limit(1)], total: false, ttl: 0 });
    if (existing.rows.length) return NextResponse.json({ message: 'Diese Adresse ist bereits eingetragen.' }, { status: 409 });
    const row = await db.createRow({ databaseId, tableId: adminsTableId, rowId: ID.unique(), data: { email, name: name || email.split('@')[0], role, status: 'active', createdAt: new Date().toISOString() } });
    return NextResponse.json({ admin: { id: row.$id, email, name: name || email.split('@')[0], role, status: 'active' } }, { status: 201 });
  } catch { return NextResponse.json({ message: 'Admin konnte nicht gespeichert werden. Ist die Tabelle eingerichtet?' }, { status: 503 }); }
}

export async function PATCH(request: NextRequest) {
  const current = await getCurrentAdmin();
  if (!current || (await getAdminRole(current.user.email)) !== 'owner') return NextResponse.json({ message: 'Nur der Owner darf Admins verwalten.' }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const id = String(body.id || '');
  const status = body.status === 'inactive' ? 'inactive' : 'active';
  if (!id) return NextResponse.json({ message: 'Ungültiger Admin.' }, { status: 400 });
  try { await getTablesDB().updateRow({ databaseId, tableId: adminsTableId, rowId: id, data: { status } }); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ message: 'Admin konnte nicht aktualisiert werden.' }, { status: 503 }); }
}
