import Link from 'next/link';
import { Query } from 'node-appwrite';
import { ArrowLeft, LogOut } from 'lucide-react';
import { AdminReservations, type AdminReservation } from '@/components/admin-reservations';
import { requireAdmin } from '@/lib/admin-auth';
import { databaseId, getTablesDB, reservationsTableId } from '@/lib/appwrite-server';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const { user } = await requireAdmin();
  let reservations: AdminReservation[] = [];
  let loadError = '';
  try {
    const result = await getTablesDB().listRows({ databaseId, tableId: reservationsTableId, queries: [Query.orderDesc('date'), Query.orderDesc('slot'), Query.limit(250)], total: false, ttl: 0 });
    reservations = result.rows.map((row) => ({ id: row.$id, date: String(row.date || ''), slot: String(row.slot || ''), players: Number(row.players || 0), name: String(row.name || ''), email: String(row.email || ''), phone: String(row.phone || ''), occasion: String(row.occasion || ''), notes: String(row.notes || ''), status: String(row.status || 'confirmed'), createdAt: String(row.createdAt || row.$createdAt) }));
  } catch {
    loadError = 'Die Reservierungen konnten nicht geladen werden. Bitte prüfe die Appwrite-Berechtigungen.';
  }

  return (
    <main className="admin-page">
      <header className="admin-header"><div className="admin-logo"><span>P</span><div>Pani<strong>VR</strong><small>Administration</small></div></div><div className="admin-account"><div><strong>{user.name || 'Admin'}</strong><span>{user.email}</span></div><form action="/api/admin/logout" method="post"><button type="submit" aria-label="Abmelden"><LogOut size={18} /></button></form></div></header>
      <div className="admin-content"><div className="admin-title"><div><p className="admin-kicker">Übersicht</p><h1>Reservierungen</h1></div><Link href="/"><ArrowLeft size={16} /> Website ansehen</Link></div>{loadError && <p className="admin-error">{loadError}</p>}<AdminReservations initialReservations={reservations} /></div>
    </main>
  );
}
