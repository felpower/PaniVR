import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/admin-auth';
import { confirmationEmail } from '@/lib/email-templates';
import { brand } from '@/lib/brand';

export const dynamic = 'force-dynamic';

export default async function EmailPreviewPage() {
  await requireAdmin();
  const preview = confirmationEmail({ name: 'Max Mustermann', date: '2026-09-12', slot: '18:30', players: 6, occasion: 'Freunde', reference: 'SLOT-20260912-1830' });
  return <main className="admin-page"><div className="admin-content"><div className="admin-title"><div><p className="admin-kicker">Vorlagen</p><h1>E-Mail-Vorschau</h1></div><Link href="/admin"><ArrowLeft size={16} /> Zur Übersicht</Link></div><p className="admin-hint">So sieht die Bestätigungsmail aus. Beim Öffnen dieser Vorschau wird keine E-Mail versendet.</p><div style={{ background: '#0b1020', borderRadius: 18, padding: 12 }}><iframe title={`Vorschau ${brand.name}`} srcDoc={preview.html} style={{ width: '100%', height: 760, border: 0, borderRadius: 12, background: '#0b1020' }} /></div></div></main>;
}
