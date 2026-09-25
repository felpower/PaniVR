import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import { Query } from 'node-appwrite';
import { requireAdmin } from '@/lib/admin-auth';
import { getUsers } from '@/lib/appwrite-server';
import { AdminPlayers } from '@/components/admin-players';
export const dynamic = 'force-dynamic';
export default async function PlayersPage() {
  await requireAdmin(); let players: Array<{ $id: string; $createdAt: string; name: string; email: string; accessedAt: string }> = [];
  try { players = (await getUsers().list({ queries: [Query.limit(5000)] })).users.map((player) => ({ $id: String(player.$id), $createdAt: String(player.$createdAt), name: String(player.name || ''), email: String(player.email || ''), accessedAt: String(player.accessedAt || '') })).sort((a, b) => b.accessedAt.localeCompare(a.accessedAt)); } catch {}
  const activeCount = players.filter((player) => Date.now() - new Date(player.accessedAt).getTime() < 15 * 60 * 1000).length;
  return <main className="admin-page"><div className="admin-content"><div className="admin-title"><div><p className="admin-kicker">Spieler</p><h1>Spielerkonten</h1></div><Link href="/admin"><ArrowLeft size={16} /> Zur Übersicht</Link></div><section className="admin-panel"><div className="admin-panel-head"><div><p><Users size={17} /> Konten</p><h2>Alle Spieler</h2></div><span className="admin-presence-summary"><i /> {activeCount} {activeCount === 1 ? 'Spieler aktiv' : 'Spieler aktiv'}</span></div>{players.length ? <AdminPlayers players={players} /> : <p className="admin-hint">Noch keine Spielerkonten vorhanden.</p>}</section></div></main>;
}
