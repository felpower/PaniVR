import { NextRequest, NextResponse } from 'next/server';
import { ID } from 'node-appwrite';
import { databaseId, getTablesDB, reservationsTableId, sendMailgunEmail } from '@/lib/appwrite-server';
import { adminWriteGuard } from '@/lib/admin-auth';
import { confirmationEmail } from '@/lib/email-templates';
import { bookingReference } from '@/lib/booking-reference';

const allowedStatuses = ['pending', 'test', 'confirmed', 'completed', 'cancelled'] as const;
type ReservationRow = Record<string, unknown> & { $id: string };

function errorCode(error: unknown) {
  if (error && typeof error === 'object' && 'code' in error) return Number((error as { code: unknown }).code);
  return 0;
}

const slotRowId = (date: string, slot: string) => `slot-${date}-${slot.replace(':', '')}`;

function rowData(row: ReservationRow, status: string) {
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) if (!key.startsWith('$')) data[key] = value;
  return { ...data, status };
}

export async function PATCH(request: NextRequest, context: RouteContext<'/api/admin/reservations/[id]'>) {
  const { response } = await adminWriteGuard();
  if (response) return response;

  const { id } = await context.params;
  let status = ''; let notify = false;
  try {
    const body = await request.json();
    status = String(body.status || ''); notify = body.notify === true;
  } catch {
    return NextResponse.json({ message: 'Ungültige Anfrage.' }, { status: 400 });
  }
  if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) return NextResponse.json({ message: 'Ungültiger Status.' }, { status: 400 });
  const targetStatus = notify ? 'confirmed' : status;

  try {
    const db = getTablesDB();
    const current = await db.getRow({ databaseId, tableId: reservationsTableId, rowId: id }) as unknown as ReservationRow;
    const date = String(current.date || ''), slot = String(current.slot || ''), email = String(current.email || '');
    if (notify && !email) return NextResponse.json({ message: 'Für diese Reservierung ist keine E-Mail-Adresse hinterlegt.' }, { status: 400 });

    // Die Row-ID "slot-Datum-Uhrzeit" verhindert Doppelbuchungen. Eine
    // stornierte Reservierung wird deshalb unter einer eigenen ID archiviert,
    // damit der Termin wieder online buchbar ist.
    if (targetStatus === 'cancelled' && id.startsWith('slot-')) {
      const archived = await db.createRow({ databaseId, tableId: reservationsTableId, rowId: ID.unique(), permissions: [], data: rowData(current, 'cancelled') });
      await db.deleteRow({ databaseId, tableId: reservationsTableId, rowId: id });
      return NextResponse.json({ id: archived.$id, status: 'cancelled' });
    }

    let rowId = id;
    // Eine archivierte Stornierung wird wieder aktiv: Slot erneut belegen,
    // sofern er nicht inzwischen neu vergeben wurde.
    if (targetStatus !== 'cancelled' && !id.startsWith('slot-') && date && slot) {
      try {
        await db.createRow({ databaseId, tableId: reservationsTableId, rowId: slotRowId(date, slot), permissions: [], data: rowData(current, targetStatus) });
      } catch (error) {
        if (errorCode(error) === 409) return NextResponse.json({ message: 'Dieser Termin ist inzwischen neu vergeben.' }, { status: 409 });
        throw error;
      }
      await db.deleteRow({ databaseId, tableId: reservationsTableId, rowId: id });
      rowId = slotRowId(date, slot);
    }

    if (notify) {
      const emailContent = confirmationEmail({ name: String(current.name || ''), date, slot, players: Number(current.players || 0), occasion: String(current.occasion || ''), reference: bookingReference(date, slot) });
      await sendMailgunEmail({ to: email, ...emailContent });
    }
    const row = await db.updateRow({ databaseId, tableId: reservationsTableId, rowId, data: { status: targetStatus } });
    return NextResponse.json({ id: row.$id, status: row.status, notified: notify });
  } catch {
    return NextResponse.json({ message: 'Der Status konnte nicht gespeichert werden.' }, { status: 503 });
  }
}
