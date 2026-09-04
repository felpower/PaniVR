import Link from 'next/link';
import { Query } from 'node-appwrite';
import { ArrowLeft, LogOut } from 'lucide-react';
import { AdminReservations, type AdminReservation } from '@/components/admin-reservations';
import { BrandIdentity } from '@/components/brand-identity';
import { requireAdmin } from '@/lib/admin-auth';
import { databaseId, getTablesDB, reservationsTableId } from '@/lib/appwrite-server';
import { bookingReference } from '@/lib/booking-reference';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const { user } = await requireAdmin();
  let reservations: AdminReservation[] = [];
  let loadError = '';
  try {
    const result = await getTablesDB().listRows({ databaseId, tableId: reservationsTableId, queries: [Query.limit(250)], total: false, ttl: 0 });
    reservations = result.rows.map((row) => ({ id: row.$id, reference: bookingReference(String(row.date || ''), String(row.slot || '')), date: String(row.date || ''), slot: String(row.slot || ''), players: Number(row.players || 0), name: String(row.name || ''), email: String(row.email || ''), phone: String(row.phone || ''), occasion: String(row.occasion || ''), notes: String(row.notes || ''), status: String(row.status || 'confirmed'), createdAt: String(row.createdAt || row.$createdAt) })).sort((a, b) => `${b.date} ${b.slot}`.localeCompare(`${a.date} ${a.slot}`));
  } catch (error) {
    console.error('Admin reservations load failed:', error);
    loadError = process.env.NODE_ENV === 'development' && error instanceof Error
      ? `Appwrite-Fehler: ${error.message}`
      : 'Die Reservierungen konnten nicht geladen werden. Bitte prüfe die Appwrite-Berechtigungen.';
  }

  return (
    <main className="admin-page">
      <header className="admin-header"><div className="admin-logo"><BrandIdentity /><small>Administration</small></div><div className="admin-account"><div><strong>{user.name || 'Admin'}</strong><span>{user.email}</span></div><form action="/api/admin/logout" method="post"><button type="submit" aria-label="Abmelden"><LogOut size={18} /></button></form></div></header>
      <div className="admin-content"><div className="admin-title"><div><p className="admin-kicker">Übersicht</p><h1>Reservierungen</h1></div><div className="admin-title-links"><Link href="/admin/zeiten">Zeiten verwalten</Link><Link href="/admin/spieler">Spieler verwalten</Link><Link href="/admin/email-vorschau">E-Mail-Vorschau</Link><Link href="/admin/team">Team verwalten</Link><Link href="/"><ArrowLeft size={16} /> Website ansehen</Link></div></div>{loadError && <p className="admin-error">{loadError}</p>}<AdminReservations initialReservations={reservations} /></div>
    </main>
  );
}
