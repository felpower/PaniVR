import { NextRequest, NextResponse } from 'next/server';
import { ID } from 'node-appwrite';
import { contactTableId, databaseId, getTablesDB, sendMailgunEmail } from '@/lib/appwrite-server';
export const runtime = 'nodejs';
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] || character));

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ message: 'Ungültige Anfrage.' }, { status: 400 });
  const name = String(body.name || '').trim(), email = String(body.email || '').trim().toLowerCase(), phone = String(body.phone || '').trim(), subject = String(body.subject || 'Allgemeine Anfrage').trim(), message = String(body.message || '').trim();
  if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5 || message.length > 2000 || (body.consent !== true && body.consent !== 'on')) return NextResponse.json({ message: 'Bitte fülle alle Pflichtfelder korrekt aus.' }, { status: 400 });
  try {
    await getTablesDB().createRow({ databaseId, tableId: contactTableId, rowId: ID.unique(), data: { name, email, phone, subject, message, status: 'new', createdAt: new Date().toISOString() } });
    const recipient = process.env.PANIVR_CONTACT_NOTIFICATION_EMAIL?.trim();
    if (process.env.PANIVR_CONTACT_NOTIFICATIONS_ENABLED === 'true' && recipient) {
      await sendMailgunEmail({ to: recipient, subject: `Neue Anfrage: ${subject}`, text: `Neue Kontaktanfrage von ${name} (${email})${phone ? ` · ${phone}` : ''}\n\n${message}`, html: `<h2>Neue Kontaktanfrage</h2><p><strong>${escapeHtml(name)}</strong><br><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>${phone ? ` · ${escapeHtml(phone)}` : ''}</p><p><strong>${escapeHtml(subject)}</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>` }).catch((error) => console.error('Contact notification failed:', error));
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return NextResponse.json({ message: 'Kontaktanfragen sind noch nicht eingerichtet.' }, { status: 503 }); }
}
