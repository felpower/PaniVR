import Link from 'next/link';
import { ArrowLeft, CalendarClock } from 'lucide-react';
import { requireAdmin } from '@/lib/admin-auth';
import { AdminSchedule } from '@/components/admin-schedule';

export const dynamic = 'force-dynamic';

export default async function TimesPage() {
  await requireAdmin();
  return <main className="admin-page"><div className="admin-content"><div className="admin-title"><div><p className="admin-kicker">Buchung</p><h1>Verfügbare Zeiten</h1></div><Link href="/admin"><ArrowLeft size={16} /> Zur Übersicht</Link></div><section className="admin-panel"><div className="admin-panel-head"><div><p><CalendarClock size={17} /> Wochenplan</p><h2>Aktuelle Startzeiten</h2></div></div><p className="admin-hint">Hier kannst du einzelne Termine hinzufügen, bearbeiten oder löschen. Die Änderungen sind sofort im Reservierungsformular sichtbar.</p><AdminSchedule /></section></div></main>;
}
