import { NextRequest, NextResponse } from 'next/server';
import { databaseId, getTablesDB, reservationsTableId, sendMailgunEmail } from '@/lib/appwrite-server';
import { getCurrentAdmin } from '@/lib/admin-auth';

const allowedStatuses = ['pending', 'test', 'confirmed', 'completed', 'cancelled'] as const;

export async function PATCH(request: NextRequest, context: RouteContext<'/api/admin/reservations/[id]'>) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: 'Nicht angemeldet.' }, { status: 401 });

  const { id } = await context.params;
  let status = ''; let notify = false;
  try {
    const body = await request.json();
    status = String(body.status || ''); notify = body.notify === true;
  } catch {
    return NextResponse.json({ message: 'Ungültige Anfrage.' }, { status: 400 });
  }
  if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) return NextResponse.json({ message: 'Ungültiger Status.' }, { status: 400 });

  try {
    if (notify) {
      const current = await getTablesDB().getRow({ databaseId, tableId: reservationsTableId, rowId: id });
      const date = String(current.date || ''), slot = String(current.slot || ''), name = String(current.name || ''), email = String(current.email || '');
      if (!email) return NextResponse.json({ message: 'Für diese Reservierung ist keine E-Mail-Adresse hinterlegt.' }, { status: 400 });
      const readableDate = new Intl.DateTimeFormat('de-AT', { dateStyle: 'full' }).format(new Date(`${date}T12:00:00`));
      await sendMailgunEmail({ to: email, subject: 'Eure VR-Reservierung ist bestätigt', text: `Hallo ${name},\n\nEure Reservierung bei VR Virtual Raiders ist bestätigt:\n${readableDate}, ${slot} Uhr\n\nAdresse: Ramingtalstraße 18, 4442 Kleinraming\n\nWir freuen uns auf euch!`, html: `<p>Hallo ${name},</p><p>eure Reservierung bei <strong>VR Virtual Raiders</strong> ist bestätigt:</p><p><strong>${readableDate}<br>${slot} Uhr</strong></p><p>Adresse: Ramingtalstraße 18, 4442 Kleinraming</p><p>Wir freuen uns auf euch!</p>` });
      const row = await getTablesDB().updateRow({ databaseId, tableId: reservationsTableId, rowId: id, data: { status: 'confirmed' } });
      return NextResponse.json({ id: row.$id, status: row.status, notified: true });
    }
    const row = await getTablesDB().updateRow({ databaseId, tableId: reservationsTableId, rowId: id, data: { status } });
    return NextResponse.json({ id: row.$id, status: row.status });
  } catch {
    return NextResponse.json({ message: 'Der Status konnte nicht gespeichert werden.' }, { status: 503 });
  }
}
