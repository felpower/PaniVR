'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Mail, Phone, Search, Users, XCircle } from 'lucide-react';

export type AdminReservation = {
  id: string;
  date: string;
  slot: string;
  players: number;
  name: string;
  email: string;
  phone: string;
  occasion: string;
  notes: string;
  status: string;
  createdAt: string;
};

function displayDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('de-AT', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

export function AdminReservations({ initialReservations }: { initialReservations: AdminReservation[] }) {
  const [reservations, setReservations] = useState(initialReservations);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return reservations.filter((reservation) => {
      const matchesStatus = filter === 'all' || reservation.status === filter;
      const haystack = `${reservation.name} ${reservation.email} ${reservation.phone} ${reservation.occasion} ${reservation.date}`.toLowerCase();
      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [reservations, query, filter]);

  const today = new Date().toISOString().slice(0, 10);
  const activeStatuses = ['test', 'confirmed'];
  const upcoming = reservations.filter((item) => item.date >= today && activeStatuses.includes(item.status)).length;
  const people = reservations.filter((item) => activeStatuses.includes(item.status)).reduce((sum, item) => sum + item.players, 0);

  async function updateStatus(id: string, status: string) {
    setSaving(id);
    setError('');
    const response = await fetch(`/api/admin/reservations/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    const data = await response.json().catch(() => ({}));
    setSaving('');
    if (!response.ok) {
      setError(data.message || 'Die Änderung konnte nicht gespeichert werden.');
      return;
    }
    setReservations((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }

  return (
    <>
      <section className="admin-stats">
        <article><span><CalendarDays /> Kommende Termine</span><strong>{upcoming}</strong></article>
        <article><span><Users /> Gebuchte Spieler</span><strong>{people}</strong></article>
        <article><span><CheckCircle2 /> Reservierungen gesamt</span><strong>{reservations.length}</strong></article>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-head"><div><p>Reservierungen</p><h2>Alle Buchungen</h2></div><div className="admin-tools"><label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, E-Mail, Datum …" /></label><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Nach Status filtern"><option value="all">Alle Status</option><option value="test">Test</option><option value="confirmed">Bestätigt</option><option value="completed">Erledigt</option><option value="cancelled">Storniert</option></select></div></div>
        {error && <p className="admin-error" role="alert">{error}</p>}
        {filtered.length ? (
          <div className="admin-table-wrap"><table><thead><tr><th>Termin</th><th>Kontakt</th><th>Gruppe</th><th>Notiz</th><th>Status</th></tr></thead><tbody>{filtered.map((reservation) => <tr key={reservation.id}><td><strong>{displayDate(reservation.date)}</strong><span><Clock3 size={13} /> {reservation.slot} Uhr</span></td><td><strong>{reservation.name}</strong><a href={`mailto:${reservation.email}`}><Mail size={12} />{reservation.email}</a><a href={`tel:${reservation.phone}`}><Phone size={12} />{reservation.phone}</a></td><td><strong>{reservation.players} Personen</strong><span>{reservation.occasion || '–'}</span></td><td className="admin-notes">{reservation.notes || '–'}</td><td><select className={`status-select status-${reservation.status}`} value={reservation.status} disabled={saving === reservation.id} onChange={(event) => updateStatus(reservation.id, event.target.value)}><option value="test">Test</option><option value="confirmed">Bestätigt</option><option value="completed">Erledigt</option><option value="cancelled">Storniert</option></select></td></tr>)}</tbody></table></div>
        ) : <div className="admin-empty"><XCircle /><h3>Keine Reservierungen gefunden</h3><p>Ändere den Filter oder den Suchbegriff.</p></div>}
      </section>
    </>
  );
}
