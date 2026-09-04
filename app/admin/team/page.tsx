import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminTeam } from '@/components/admin-team';
import { requireAdmin } from '@/lib/admin-auth';
export const dynamic = 'force-dynamic';
export default async function TeamPage() { await requireAdmin(); return <main className="admin-page"><div className="admin-content"><div className="admin-title"><div><p className="admin-kicker">Einstellungen</p><h1>Team</h1></div><div><Link href="/admin/spieler">Spieler verwalten</Link> <Link href="/admin"><ArrowLeft size={16} /> Zur Übersicht</Link></div></div><AdminTeam /></div></main>; }
