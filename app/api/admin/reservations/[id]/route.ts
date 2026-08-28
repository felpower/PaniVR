import { NextRequest, NextResponse } from 'next/server';
import { databaseId, getTablesDB, reservationsTableId } from '@/lib/appwrite-server';
import { getCurrentAdmin } from '@/lib/admin-auth';

const allowedStatuses = ['confirmed', 'completed', 'cancelled'] as const;

export async function PATCH(request: NextRequest, context: RouteContext<'/api/admin/reservations/[id]'>) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: 'Nicht angemeldet.' }, { status: 401 });

  const { id } = await context.params;
  let status = '';
  try {
    const body = await request.json();
    status = String(body.status || '');
  } catch {
    return NextResponse.json({ message: 'Ungültige Anfrage.' }, { status: 400 });
  }
  if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) return NextResponse.json({ message: 'Ungültiger Status.' }, { status: 400 });

  try {
    const row = await getTablesDB().updateRow({ databaseId, tableId: reservationsTableId, rowId: id, data: { status } });
    return NextResponse.json({ id: row.$id, status: row.status });
  } catch {
    return NextResponse.json({ message: 'Der Status konnte nicht gespeichert werden.' }, { status: 503 });
  }
}
