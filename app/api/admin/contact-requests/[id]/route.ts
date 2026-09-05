import { NextRequest, NextResponse } from 'next/server';
import { contactTableId, databaseId, getTablesDB } from '@/lib/appwrite-server';
import { requireAdmin } from '@/lib/admin-auth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(); const { id } = await params; const { status } = await request.json();
    if (!['new', 'in_progress', 'done'].includes(String(status))) return NextResponse.json({ message: 'Ungültiger Status.' }, { status: 400 });
    await getTablesDB().updateRow({ databaseId, tableId: contactTableId, rowId: id, data: { status: String(status) } });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ message: 'Anfrage konnte nicht aktualisiert werden.' }, { status: 400 }); }
}
