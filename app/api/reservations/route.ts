import { NextRequest, NextResponse } from 'next/server';
import { appwriteConfigured, databaseId, getTablesDB, reservationsTableId } from '@/lib/appwrite-server';
import { validateBooking } from '@/lib/booking';

export const runtime = 'nodejs';

function errorCode(error: unknown) {
  if (error && typeof error === 'object' && 'code' in error) return Number((error as { code: unknown }).code);
  return 0;
}

export async function POST(request: NextRequest) {
  const requestSize = Number(request.headers.get('content-length') || 0);
  if (requestSize > 20_000) return NextResponse.json({ message: 'Die Anfrage ist zu groß.' }, { status: 413 });
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite)) {
    return NextResponse.json({ message: 'Die Anfrage wurde blockiert.' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const result = validateBooking(body);
  if (!result.ok) return NextResponse.json({ message: result.message }, { status: 400 });

  const bookingMode = process.env.BOOKING_MODE || (process.env.BOOKING_ENABLED === 'true' ? 'live' : 'disabled');
  if (process.env.NODE_ENV === 'production' && !['test', 'live'].includes(bookingMode)) {
    return NextResponse.json({ message: 'Die Online-Reservierung befindet sich noch im Testbetrieb. Bitte kontaktiere uns derzeit direkt.' }, { status: 503 });
  }

  if (!appwriteConfigured) {
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        reference: `DEMO-${result.data.date.replaceAll('-', '')}-${result.data.slot.replace(':', '')}`,
        demo: true,
      });
    }
    return NextResponse.json({ message: 'Die Online-Reservierung wird gerade eingerichtet. Bitte versuche es später erneut.' }, { status: 503 });
  }

  const rowId = `slot-${result.data.date}-${result.data.slot.replace(':', '')}`;
  try {
    await getTablesDB().createRow({
      databaseId,
      tableId: reservationsTableId,
      rowId,
      permissions: [],
      data: {
        date: result.data.date,
        slot: result.data.slot,
        players: result.data.players,
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        occasion: result.data.occasion,
        notes: result.data.notes,
        status: bookingMode === 'live' ? 'confirmed' : 'test',
        source: bookingMode === 'live' ? 'website' : 'website-test',
        createdAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ reference: rowId.toUpperCase(), demo: bookingMode !== 'live' }, { status: 201 });
  } catch (error) {
    if (errorCode(error) === 409) return NextResponse.json({ message: 'Dieser Termin wurde soeben vergeben. Bitte wähle einen anderen Slot.' }, { status: 409 });
    return NextResponse.json({ message: 'Die Reservierung konnte nicht gespeichert werden. Bitte versuche es erneut.' }, { status: 503 });
  }
}
