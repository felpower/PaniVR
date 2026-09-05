'use client';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export function AdminPlayerActions({ playerId }: { playerId: string }) {
  const [busy, setBusy] = useState(false);
  async function remove() {
    if (!confirm('Spielerkonto und alle gespeicherten Matchdaten wirklich dauerhaft löschen?')) return;
    setBusy(true);
    const response = await fetch(`/api/admin/spieler/${encodeURIComponent(playerId)}`, { method: 'POST' });
    if (response.redirected) location.href = response.url;
    else { setBusy(false); alert('Das Konto konnte nicht gelöscht werden.'); }
  }
  return <button type="button" className="admin-danger-button" onClick={remove} disabled={busy}><Trash2 size={15} /> {busy ? 'Wird gelöscht …' : 'Spieler löschen'}</button>;
}
