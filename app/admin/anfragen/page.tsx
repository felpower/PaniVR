import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Query } from 'node-appwrite';
import { requireAdmin } from '@/lib/admin-auth';
import { contactTableId, databaseId, getTablesDB } from '@/lib/appwrite-server';
import { AdminContactRequests, type ContactRequest } from '@/components/admin-contact-requests';
export const dynamic = 'force-dynamic';
export default async function ContactRequestsPage() {
  await requireAdmin(); let requests: ContactRequest[] = [];
  try { const result = await getTablesDB().listRows({ databaseId, tableId: contactTableId, queries: [Query.orderDesc('$createdAt'), Query.limit(500)], total: false, ttl: 0 }); requests = result.rows.map((row) => ({ id: String(row.$id), name: String(row.name || ''), email: String(row.email || ''), phone: String(row.phone || ''), subject: String(row.subject || ''), message: String(row.message || ''), status: String(row.status || 'new'), createdAt: String(row.createdAt || row.$createdAt || '') })); } catch {}
  return <main className="admin-page"><div className="admin-content"><div className="admin-title"><div><p className="admin-kicker">Kontakt</p><h1>Anfragen</h1></div><Link href="/admin"><ArrowLeft size={16} /> Zur Übersicht</Link></div><AdminContactRequests initialRequests={requests} /></div></main>;
}
