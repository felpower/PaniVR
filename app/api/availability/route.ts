import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';
import { appwriteConfigured, databaseId, getTablesDB, reservationsTableId } from '@/lib/appwrite-server';
import { isBookableDate } from '@/lib/booking';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date') || '';
  if (!isBookableDate(date)) return NextResponse.json({ booked: [] });
  if (!appwriteConfigured) return NextResponse.json({ booked: [], configured: false });

  try {
    const result = await getTablesDB().listRows({
      databaseId,
      tableId: reservationsTableId,
      queries: [Query.equal('date', date), Query.notEqual('status', 'cancelled')],
      total: false,
      ttl: 0,
    });
    return NextResponse.json({ booked: result.rows.map((row) => String(row.slot)), configured: true });
  } catch {
    return NextResponse.json({ message: 'Verfügbarkeiten konnten nicht geladen werden.' }, { status: 503 });
  }
}
