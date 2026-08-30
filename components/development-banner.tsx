'use client';

import { useRouter } from 'next/navigation';

export function DevelopmentBanner() {
  const router = useRouter();

  async function lockPreview() {
    await fetch('/api/access', { method: 'DELETE' }).catch(() => undefined);
    router.push('/zugang');
    router.refresh();
  }

  return (
    <aside className="development-banner" aria-label="Hinweis zum Testbetrieb">
      <strong>Development-Vorschau</strong>
      <span>Keine echten Reservierungen · Alle Eingaben sind Testdaten</span>
      <button type="button" onClick={lockPreview}>Vorschau sperren</button>
    </aside>
  );
}
